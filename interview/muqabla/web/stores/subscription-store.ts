"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type {
  Subscription,
  UsageRecord,
  PlanId,
} from "@/lib/types-ai";
import { PLANS, type PlanLimits } from "@/lib/stripe";

interface SubscriptionState {
  subscription: Subscription | null;
  usage: UsageRecord | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: (userId: string) => Promise<void>;
  refreshSubscription: (userId: string) => Promise<void>;
  refreshUsage: (userId: string) => Promise<void>;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  usage: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async (userId: string) => {
    if (get().isInitialized) return;
    try {
      set({ isLoading: true, error: null });
      await Promise.all([
        get().refreshSubscription(userId),
        get().refreshUsage(userId),
      ]);
    } catch (error) {
      console.error("Subscription init error:", error);
      set({ error: "Failed to load subscription" });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  refreshSubscription: async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error);
    }

    set({
      subscription: data
        ? (data as Subscription)
        : {
            id: "",
            user_id: userId,
            plan_id: "free" as PlanId,
            stripe_customer_id: null,
            stripe_subscription_id: null,
            status: "active" as const,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            cancel_at_period_end: false,
            trial_end: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    });
  },

  refreshUsage: async (userId: string) => {
    const supabase = createClient();
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data, error } = await supabase
      .from("usage_records")
      .select("*")
      .eq("user_id", userId)
      .gte("period_start", periodStart.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching usage:", error);
    }

    set({
      usage: data
        ? (data as UsageRecord)
        : {
            id: "",
            user_id: userId,
            period_start: periodStart.toISOString(),
            period_end: new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              0
            ).toISOString(),
            applications_used: 0,
            ai_resume_tailors_used: 0,
            ai_cover_letters_used: 0,
            ai_interview_prep_used: 0,
            ats_score_checks_used: 0,
            recruiter_outreach_used: 0,
            auto_apply_used: 0,
            ai_tokens_used: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    });
  },

  reset: () => {
    set({
      subscription: null,
      usage: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  },
}));

// Selector hooks
export const useCurrentPlan = () =>
  useSubscriptionStore((s) => s.subscription?.plan_id || "free");

export const usePlanLimits = (): PlanLimits => {
  const planId = useSubscriptionStore(
    (s) => s.subscription?.plan_id || "free"
  );
  return PLANS[planId as keyof typeof PLANS].limits;
};

export const useUsage = () => useSubscriptionStore((s) => s.usage);

export const useIsPro = () =>
  useSubscriptionStore(
    (s) =>
      s.subscription?.plan_id === "pro" ||
      s.subscription?.plan_id === "enterprise"
  );

export const useIsEnterprise = () =>
  useSubscriptionStore((s) => s.subscription?.plan_id === "enterprise");

export const useCanUseFeature = (
  feature: keyof PlanLimits,
  currentUsage?: number
): boolean => {
  const planId = useSubscriptionStore(
    (s) => s.subscription?.plan_id || "free"
  );
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) return false;

  const limit = plan.limits[feature];
  if (typeof limit === "boolean") return limit;
  if (typeof limit === "number") {
    if (limit === -1) return true;
    if (limit === 0) return false;
    if (currentUsage !== undefined) return currentUsage < limit;
    return true;
  }
  return false;
};
