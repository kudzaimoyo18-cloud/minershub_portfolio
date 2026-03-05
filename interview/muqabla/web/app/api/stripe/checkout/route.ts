import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = (await request.json()) as { planId: PlanId };

    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLANS[planId];

    if (planId === "free") {
      return NextResponse.json(
        { error: "Cannot checkout free plan" },
        { status: 400 }
      );
    }

    if (!("stripePriceId" in plan) || !plan.stripePriceId) {
      return NextResponse.json(
        { error: "Plan not configured for payments" },
        { status: 400 }
      );
    }

    // Check if user already has a Stripe customer
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    // Create Stripe customer if needed
    if (!customerId) {
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      const customer = await stripe.customers.create({
        email: userData?.email || user.email || undefined,
        name: userData?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_id: planId,
        },
        trial_period_days: 7,
      },
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
