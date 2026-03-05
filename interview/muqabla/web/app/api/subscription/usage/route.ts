import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/stripe";
import type { PlanId } from "@/lib/types-ai";

// Increment usage for a specific feature
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feature, amount = 1 } = (await request.json()) as {
      feature: string;
      amount?: number;
    };

    const validFeatures = [
      "applications_used",
      "ai_resume_tailors_used",
      "ai_cover_letters_used",
      "ai_interview_prep_used",
      "ats_score_checks_used",
      "recruiter_outreach_used",
      "auto_apply_used",
      "ai_tokens_used",
    ];

    if (!validFeatures.includes(feature)) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    // Get user's plan
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", user.id)
      .single();

    const planId = (subscription?.plan_id || "free") as PlanId;
    const plan = PLANS[planId];

    // Map usage field to limit field
    const usageToLimitMap: Record<string, string> = {
      applications_used: "applications_per_month",
      ai_resume_tailors_used: "ai_resume_tailors",
      ai_cover_letters_used: "ai_cover_letters",
      ai_interview_prep_used: "ai_interview_prep",
      ats_score_checks_used: "ats_score_checks",
      recruiter_outreach_used: "recruiter_outreach",
      auto_apply_used: "applications_per_month",
      ai_tokens_used: "ai_resume_tailors", // tokens are tracked but not limited directly
    };

    const limitKey = usageToLimitMap[feature];
    const limit = plan.limits[limitKey as keyof typeof plan.limits];

    // Get or create current usage record
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let { data: usage } = await supabase
      .from("usage_records")
      .select("*")
      .eq("user_id", user.id)
      .gte("period_start", periodStart.toISOString())
      .single();

    if (!usage) {
      // Create new usage record
      const { data: newUsage, error: insertError } = await supabase
        .from("usage_records")
        .insert({
          user_id: user.id,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          applications_used: 0,
          ai_resume_tailors_used: 0,
          ai_cover_letters_used: 0,
          ai_interview_prep_used: 0,
          ats_score_checks_used: 0,
          recruiter_outreach_used: 0,
          auto_apply_used: 0,
          ai_tokens_used: 0,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to create usage record" },
          { status: 500 }
        );
      }
      usage = newUsage;
    }

    // Check if over limit (skip for unlimited plans or token tracking)
    if (
      typeof limit === "number" &&
      limit !== -1 &&
      feature !== "ai_tokens_used"
    ) {
      const currentUsage = usage[feature as keyof typeof usage] as number;
      if (currentUsage + amount > limit) {
        return NextResponse.json(
          {
            error: "Usage limit reached",
            current: currentUsage,
            limit,
            plan: planId,
          },
          { status: 429 }
        );
      }
    }

    // Increment usage
    const { data: updatedUsage, error: updateError } = await supabase
      .from("usage_records")
      .update({
        [feature]: (usage[feature as keyof typeof usage] as number) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", usage.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update usage" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      usage: updatedUsage,
      remaining:
        typeof limit === "number" && limit !== -1
          ? limit -
            ((updatedUsage[feature as keyof typeof updatedUsage] as number) ||
              0)
          : -1,
    });
  } catch (error) {
    console.error("Usage update error:", error);
    return NextResponse.json(
      { error: "Failed to update usage" },
      { status: 500 }
    );
  }
}
