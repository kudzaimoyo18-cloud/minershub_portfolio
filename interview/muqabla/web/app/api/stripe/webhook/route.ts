import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, getPlanByPriceId } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy-init Supabase admin client (service role for webhooks)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const planId = session.metadata?.plan_id;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!userId || !planId || !customerId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Update or create subscription record
  const { error } = await getSupabaseAdmin().from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: customerId,
      stripe_subscription_id:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || null,
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error updating subscription after checkout:", error);
  }

  // Create initial usage record for the period
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  await getSupabaseAdmin().from("usage_records").upsert(
    {
      user_id: userId,
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
    },
    { onConflict: "user_id,period_start" }
  );
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price.id;
  const planId = priceId ? getPlanByPriceId(priceId) : null;

  // In newer Stripe API, period dates are on subscription items
  const periodStart = firstItem?.current_period_start;
  const periodEnd = firstItem?.current_period_end;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      plan_id: planId || "free",
      status: subscription.status as string,
      stripe_subscription_id: subscription.id,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : new Date().toISOString(),
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      plan_id: "free",
      status: "canceled",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  // Log the payment
  console.log(`Payment succeeded for customer ${customerId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  // Find user by stripe customer ID and update subscription status
  const { data: sub } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (sub) {
    await getSupabaseAdmin()
      .from("subscriptions")
      .update({
        status: "past_due",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", sub.user_id);
  }

  console.log(`Payment failed for customer ${customerId}`);
}
