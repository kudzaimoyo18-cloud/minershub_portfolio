import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, AI_MODELS, SYSTEM_PROMPTS, estimateTaskCost } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { candidateProfile, jobData } = await request.json();

    if (!candidateProfile || !jobData) {
      return NextResponse.json(
        { error: "Candidate profile and job data are required" },
        { status: 400 }
      );
    }

    const { data: task } = await supabase
      .from("ai_tasks")
      .insert({
        user_id: user.id,
        task_type: "job_match",
        status: "processing",
        input_data: { job_id: jobData.id, job_title: jobData.title },
        model: AI_MODELS.fast,
      })
      .select()
      .single();

    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: AI_MODELS.fast,
      max_tokens: 2048,
      system: SYSTEM_PROMPTS.job_match,
      messages: [
        {
          role: "user",
          content: `Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job Listing:
${JSON.stringify(jobData, null, 2)}

Analyze the match between this candidate and job. Return JSON:
{
  "overall_score": 0-100,
  "skills_score": 0-100,
  "experience_score": 0-100,
  "location_score": 0-100,
  "salary_score": 0-100,
  "match_reasons": ["why this is a good match"],
  "red_flags": ["potential concerns or gaps"],
  "talking_points": ["key points to highlight in application"],
  "fit_summary": "2-3 sentence summary"
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

    return NextResponse.json({
      taskId: task?.id,
      result: outputData,
      tokens: { input: inputTokens, output: outputTokens },
    });
  } catch (error) {
    console.error("Job match error:", error);
    return NextResponse.json(
      { error: "Failed to calculate job match" },
      { status: 500 }
    );
  }
}
