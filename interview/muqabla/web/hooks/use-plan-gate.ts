"use client";

import { useSubscriptionStore } from "@/stores/subscription-store";
import { PLANS, type PlanLimits } from "@/lib/stripe";

interface PlanGateResult {
  canAccess: boolean;
  planId: string;
  planName: string;
  limit: number | boolean;
  used: number;
  remaining: number;
  isUnlimited: boolean;
  isDisabled: boolean;
  percentUsed: number;
  requiresUpgrade: boolean;
}

export function usePlanGate(
  feature: keyof PlanLimits,
  usageField?: string
): PlanGateResult {
  const subscription = useSubscriptionStore((s) => s.subscription);
  const usage = useSubscriptionStore((s) => s.usage);

  const planId = subscription?.plan_id || "free";
  const plan = PLANS[planId as keyof typeof PLANS];
  const limit = plan.limits[feature];

  // Feature is a boolean (like auto_apply, follow_up_coach)
  if (typeof limit === "boolean") {
    return {
      canAccess: limit,
      planId,
      planName: plan.name,
      limit,
      used: 0,
      remaining: limit ? Infinity : 0,
      isUnlimited: limit,
      isDisabled: !limit,
      percentUsed: 0,
      requiresUpgrade: !limit,
    };
  }

  // Feature is a number (like ai_resume_tailors, applications_per_month)
  const used = usageField && usage
    ? (usage as Record<string, any>)[usageField] || 0
    : 0;
  const isUnlimited = limit === -1;
  const isDisabled = limit === 0;
  const remaining = isUnlimited ? Infinity : isDisabled ? 0 : Math.max(0, limit - used);
  const canAccess = isUnlimited || (!isDisabled && remaining > 0);
  const percentUsed = isUnlimited || isDisabled ? 0 : (used / limit) * 100;

  return {
    canAccess,
    planId,
    planName: plan.name,
    limit,
    used,
    remaining: isUnlimited ? -1 : remaining,
    isUnlimited,
    isDisabled,
    percentUsed,
    requiresUpgrade: isDisabled,
  };
}

// Simple check: is user on paid plan?
export function useIsPaidPlan(): boolean {
  const planId = useSubscriptionStore(
    (s) => s.subscription?.plan_id || "free"
  );
  return planId !== "free";
}

// Simple check: can user use a specific AI feature?
export function useCanUseAI(
  feature: keyof PlanLimits,
  usageField?: string
): boolean {
  const { canAccess } = usePlanGate(feature, usageField);
  return canAccess;
}
