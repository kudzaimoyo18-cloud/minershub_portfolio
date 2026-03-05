import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODELS, SYSTEM_PROMPTS, estimateTaskCost } from "@/lib/anthropic";
import { PLANS } from "@/lib/stripe";
import type { PlanId } from "@/lib/types-ai";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", user.id)
      .single();

    const planId = (subscription?.plan_id || "free") as PlanId;
    const plan = PLANS[planId];

    if (plan.limits.ai_cover_letters === 0) {
      return NextResponse.json(
        { error: "Cover letter generation requires a Pro or Enterprise plan", upgrade: true },
        { status: 403 }
      );
    }

    // Check usage
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const { data: usage } = await supabase
      .from("usage_records")
      .select("ai_cover_letters_used")
      .eq("user_id", user.id)
      .gte("period_start", periodStart.toISOString())
      .single();

    if (
      plan.limits.ai_cover_letters !== -1 &&
      (usage?.ai_cover_letters_used || 0) >= plan.limits.ai_cover_letters
    ) {
      return NextResponse.json(
        { error: "Monthly cover letter limit reached", upgrade: true },
        { status: 429 }
      );
    }

    const {
      candidateProfile,
      jobTitle,
      companyName,
      jobDescription,
      tone = "professional",
    } = await request.json();

    if (!candidateProfile || !jobDescription) {
      return NextResponse.json(
        { error: "Candidate profile and job description are required" },
        { status: 400 }
      );
    }

    // Create AI task record
    const { data: task } = await supabase
      .from("ai_tasks")
      .insert({
        user_id: user.id,
        task_type: "cover_letter",
        status: "processing",
        input_data: { job_title: jobTitle, company_name: companyName, tone },
        model: AI_MODELS.standard,
      })
      .select()
      .single();

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: AI_MODELS.standard,
      max_tokens: 2048,
      system: SYSTEM_PROMPTS.cover_letter,
      messages: [
        {
          role: "user",
          content: `Candidate Profile:
- Name: ${candidateProfile.full_name}
- Current Title: ${candidateProfile.current_title || "N/A"}
- Current Company: ${candidateProfile.current_company || "N/A"}
- Years of Experience: ${candidateProfile.years_experience || "N/A"}
- Location: ${candidateProfile.city}, ${candidateProfile.country}
- Key Skills: ${candidateProfile.skills?.join(", ") || "N/A"}

Job: ${jobTitle} at ${companyName}

Job Description:
${jobDescription}

Tone: ${tone}

Write a compelling cover letter for this position. Return a JSON with:
{
  "cover_letter": "Full cover letter text...",
  "key_highlights": ["3-4 bullet points of key selling points"],
  "word_count": number
}`,
        },
      ],
    });

    const duration = Date.now() - startTime;
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = estimateTaskCost(inputTokens, outputTokens);

    let outputData;
    const contentBlock = message.content[0];
    if (contentBlock.type === "text") {
      try {
        const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
        outputData = jsonMatch ? JSON.parse(jsonMatch[0]) : { cover_letter: contentBlock.text };
      } catch {
        outputData = { cover_letter: contentBlock.text };
      }
    }

    // Update task
    if (task) {
      await supabase
        .from("ai_tasks")
        .update({
          status: "completed",
          output_data: outputData,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cost_usd: cost,
          duration_ms: duration,
          completed_at: new Date().toISOString(),
        })
        .eq("id", task.id);
    }

    // Increment usage
    await fetch(new URL("/api/subscription/usage", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ feature: "ai_cover_letters_used" }),
    });

    return NextResponse.json({
      taskId: task?.id,
      result: outputData,
      tokens: { input: inputTokens, output: outputTokens },
      cost,
      duration,
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
