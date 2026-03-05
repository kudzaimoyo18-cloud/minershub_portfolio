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

    if (plan.limits.ai_interview_prep === 0) {
      return NextResponse.json(
        { error: "Interview prep requires a Pro or Enterprise plan", upgrade: true },
        { status: 403 }
      );
    }

    const { candidateProfile, jobTitle, companyName, jobDescription, focusAreas } =
      await request.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const { data: task } = await supabase
      .from("ai_tasks")
      .insert({
        user_id: user.id,
        task_type: "interview_prep",
        status: "processing",
        input_data: { job_title: jobTitle, company_name: companyName },
        model: AI_MODELS.advanced,
      })
      .select()
      .single();

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: AI_MODELS.advanced,
      max_tokens: 4096,
      system: SYSTEM_PROMPTS.interview_prep,
      messages: [
        {
          role: "user",
          content: `Candidate Background:
${candidateProfile ? JSON.stringify(candidateProfile, null, 2) : "Not provided"}

Job: ${jobTitle} at ${companyName}

Job Description:
${jobDescription}

${focusAreas ? `Focus areas: ${focusAreas.join(", ")}` : ""}

Generate a comprehensive interview preparation guide. Return JSON:
{
  "questions": [
    {
      "question": "...",
      "category": "behavioral|technical|situational|cultural|general",
      "difficulty": "easy|medium|hard",
      "suggested_answer": "...",
      "star_framework": { "situation": "...", "task": "...", "action": "...", "result": "..." } or null,
      "tips": ["..."]
    }
  ],
  "overall_tips": ["..."],
  "company_research": "Key things to know about the company...",
  "questions_to_ask": ["Questions the candidate should ask the interviewer"]
}

Generate at least 8-10 questions across different categories.`,
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
        outputData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_text: contentBlock.text };
      } catch {
        outputData = { raw_text: contentBlock.text };
      }
    }

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
      body: JSON.stringify({ feature: "ai_interview_prep_used" }),
    });

    return NextResponse.json({
      taskId: task?.id,
      result: outputData,
      tokens: { input: inputTokens, output: outputTokens },
      cost,
      duration,
    });
  } catch (error) {
    console.error("Interview prep error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview prep" },
      { status: 500 }
    );
  }
}
