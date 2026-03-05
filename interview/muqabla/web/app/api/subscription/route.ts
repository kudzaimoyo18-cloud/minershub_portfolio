import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Get current usage
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: usage } = await supabase
      .from("usage_records")
      .select("*")
      .eq("user_id", user.id)
      .gte("period_start", periodStart.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      subscription: subscription || {
        plan_id: "free",
        status: "active",
      },
      usage: usage || {
        applications_used: 0,
        ai_resume_tailors_used: 0,
        ai_cover_letters_used: 0,
        ai_interview_prep_used: 0,
        ats_score_checks_used: 0,
        recruiter_outreach_used: 0,
        auto_apply_used: 0,
        ai_tokens_used: 0,
      },
    });
  } catch (error) {
    console.error("Subscription GET error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}
