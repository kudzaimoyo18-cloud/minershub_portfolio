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

    // Check subscription and usage
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", user.id)
      .single();

    const planId = (subscription?.plan_id || "free") as PlanId;
    const plan = PLANS[planId];

    if (plan.limits.ai_resume_tailors === 0) {
      return NextResponse.json(
        { error: "Resume tailoring requires a Pro or Enterprise plan", upgrade: true },
        { status: 403 }
      );
    }

    // Check usage
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const { data: usage } = await supabase
      .from("usage_records")
      .select("ai_resume_tailors_used")
      .eq("user_id", user.id)
      .gte("period_start", periodStart.toISOString())
      .single();

    if (
      plan.limits.ai_resume_tailors !== -1 &&
      (usage?.ai_resume_tailors_used || 0) >= plan.limits.ai_resume_tailors
    ) {
      return NextResponse.json(
        {
          error: "Monthly resume tailoring limit reached",
          current: usage?.ai_resume_tailors_used,
          limit: plan.limits.ai_resume_tailors,
        },
        { status: 429 }
      );
    }

    const { resumeData, jobDescription, jobTitle, companyName } =
      await request.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: "Resume data and job description are required" },
        { status: 400 }
      );
    }

    // Create AI task record
    const { data: task, error: taskError } = await supabase
      .from("ai_tasks")
      .insert({
        user_id: user.id,
        task_type: "resume_tailor",
        status: "processing",
        input_data: {
          job_title: jobTitle,
          company_name: companyName,
        },
        model: AI_MODELS.advanced,
      })
      .select()
      .single();

    if (taskError) {
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    // Call Claude API
    const message = await anthropic.messages.create({
      model: AI_MODELS.advanced,
      max_tokens: 4096,
      system: SYSTEM_PROMPTS.resume_tailor,
      messages: [
        {
          role: "user",
          content: `Here is the candidate's current resume data:
${JSON.stringify(resumeData, null, 2)}

Here is the job description for "${jobTitle}" at "${companyName}":
${jobDescription}

Please tailor this resume to match the job description. Return a JSON object with the following structure:
{
  "tailored_summary": "...",
  "tailored_experience": [{ "title": "...", "company": "...", "bullets": ["..."] }],
  "keywords_matched": ["..."],
  "keywords_to_add": ["..."],
  "improvements": ["..."],
  "match_score": 0-100,
  "ats_tips": ["..."]
}`,
        },
      ],
    });

    const duration = Date.now() - startTime;
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = estimateTaskCost(inputTokens, outputTokens);

    // Parse the response
    let outputData;
    const contentBlock = message.content[0];
    if (contentBlock.type === "text") {
      try {
        // Try to extract JSON from the response
        const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
        outputData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_text: contentBlock.text };
      } catch {
        outputData = { raw_text: contentBlock.text };
      }
    }

    // Update task record
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

    // Increment usage
    await fetch(new URL("/api/subscription/usage", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ feature: "ai_resume_tailors_used" }),
    });

    return NextResponse.json({
      taskId: task.id,
      result: outputData,
      tokens: { input: inputTokens, output: outputTokens },
      cost,
      duration,
    });
  } catch (error) {
    console.error("Resume tailor error:", error);
    return NextResponse.json(
      { error: "Failed to tailor resume" },
      { status: 500 }
    );
  }
}
