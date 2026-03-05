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

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", user.id)
      .single();

    const planId = (subscription?.plan_id || "free") as PlanId;
    const plan = PLANS[planId];

    if (plan.limits.ats_score_checks === 0) {
      return NextResponse.json(
        { error: "ATS scoring requires a Pro or Enterprise plan", upgrade: true },
        { status: 403 }
      );
    }

    const { resumeData, jobDescription, jobTitle } = await request.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: "Resume data and job description are required" },
        { status: 400 }
      );
    }

    const { data: task } = await supabase
      .from("ai_tasks")
      .insert({
        user_id: user.id,
        task_type: "ats_score",
        status: "processing",
        input_data: { job_title: jobTitle },
        model: AI_MODELS.standard,
      })
      .select()
      .single();

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: AI_MODELS.standard,
      max_tokens: 3072,
      system: SYSTEM_PROMPTS.ats_score,
      messages: [
        {
          role: "user",
          content: `Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description for "${jobTitle}":
${jobDescription}

Analyze this resume against the job description for ATS compatibility. Return JSON:
{
  "overall_score": 0-100,
  "keyword_score": 0-100,
  "formatting_score": 0-100,
  "content_score": 0-100,
  "keywords_found": ["matched keywords"],
  "keywords_missing": ["missing important keywords"],
  "formatting_issues": ["issues that could cause ATS problems"],
  "improvements": [
    {
      "priority": "high|medium|low",
      "section": "summary|experience|skills|education",
      "suggestion": "what to improve",
      "impact": "expected impact on ATS score"
    }
  ],
  "estimated_pass_rate": 0-100,
  "summary": "Brief overall assessment"
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

    await fetch(new URL("/api/subscription/usage", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ feature: "ats_score_checks_used" }),
    });

    return NextResponse.json({
      taskId: task?.id,
      result: outputData,
      tokens: { input: inputTokens, output: outputTokens },
      cost,
      duration,
    });
  } catch (error) {
    console.error("ATS score error:", error);
    return NextResponse.json(
      { error: "Failed to calculate ATS score" },
      { status: 500 }
    );
  }
}
