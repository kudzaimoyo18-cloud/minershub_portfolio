"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { PLANS } from "@/lib/stripe";
import {
  Crown,
  Sparkles,
  Zap,
  CreditCard,
  Calendar,
  BarChart3,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { subscription, usage, isLoading, initialize, refreshSubscription, refreshUsage } =
    useSubscriptionStore();
  const [portalLoading, setPortalLoading] = useState(false);
  const showSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (user?.id) {
      initialize(user.id);
    }
  }, [user?.id, initialize]);

  // Refresh on success
  useEffect(() => {
    if (showSuccess && user?.id) {
      refreshSubscription(user.id);
      refreshUsage(user.id);
    }
  }, [showSuccess, user?.id, refreshSubscription, refreshUsage]);

  const planId = subscription?.plan_id || "free";
  const plan = PLANS[planId as keyof typeof PLANS];

  const planIcon = {
    free: Zap,
    pro: Sparkles,
    enterprise: Crown,
  }[planId] || Zap;

  const PlanIcon = planIcon;

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Build usage items
  const usageItems = [
    {
      label: "Applications",
      used: usage?.applications_used || 0,
      limit: plan.limits.applications_per_month,
      key: "applications_per_month",
    },
    {
      label: "Resume Tailoring",
      used: usage?.ai_resume_tailors_used || 0,
      limit: plan.limits.ai_resume_tailors,
      key: "ai_resume_tailors",
    },
    {
      label: "Cover Letters",
      used: usage?.ai_cover_letters_used || 0,
      limit: plan.limits.ai_cover_letters,
      key: "ai_cover_letters",
    },
    {
      label: "Interview Prep",
      used: usage?.ai_interview_prep_used || 0,
      limit: plan.limits.ai_interview_prep,
      key: "ai_interview_prep",
    },
    {
      label: "ATS Scores",
      used: usage?.ats_score_checks_used || 0,
      limit: plan.limits.ats_score_checks,
      key: "ats_score_checks",
    },
    {
      label: "Recruiter Outreach",
      used: usage?.recruiter_outreach_used || 0,
      limit: plan.limits.recruiter_outreach,
      key: "recruiter_outreach",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Success Banner */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Subscription activated!
            </p>
            <p className="text-xs text-green-600">
              Your {plan.name} plan is now active. Enjoy all the AI features!
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscription</h1>
      <p className="text-sm text-gray-500 mb-8">
        Manage your plan, billing, and usage
      </p>

      {/* Current Plan Card */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PlanIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{plan.name} Plan</h2>
              <p className="text-sm text-gray-500">{plan.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${plan.price === 0 ? "0" : (plan.price / 100).toFixed(0)}
              <span className="text-sm font-normal text-gray-400">/mo</span>
            </div>
            {subscription?.status && subscription.status !== "active" && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${
                  subscription.status === "trialing"
                    ? "text-blue-600"
                    : subscription.status === "past_due"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                {subscription.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-wrap gap-3">
          {planId === "free" ? (
            <button
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
              Upgrade Plan
            </button>
          ) : (
            <>
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Manage Billing
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Change Plan
              </button>
            </>
          )}
        </div>

        {/* Billing Period */}
        {subscription?.current_period_end && planId !== "free" && (
          <div className="px-6 pb-4 flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {subscription.cancel_at_period_end
              ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
              : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
          </div>
        )}
      </div>

      {/* Usage Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">This Month's Usage</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usageItems.map((item) => {
            const isUnlimited = item.limit === -1;
            const isDisabled = item.limit === 0;
            const percentage = isUnlimited
              ? 0
              : isDisabled
              ? 0
              : Math.min((item.used / item.limit) * 100, 100);
            const isNearLimit = percentage >= 80;

            return (
              <div
                key={item.key}
                className={`rounded-xl border p-4 ${
                  isDisabled
                    ? "border-gray-100 bg-gray-50/50 opacity-60"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isDisabled
                        ? "text-gray-400"
                        : isNearLimit
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`}
                  >
                    {isDisabled
                      ? "Not available"
                      : isUnlimited
                      ? `${item.used} used`
                      : `${item.used} / ${item.limit}`}
                  </span>
                </div>
                {!isDisabled && !isUnlimited && (
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isNearLimit ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
                {isUnlimited && (
                  <div className="h-2 rounded-full bg-primary/20">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-primary/40 to-primary/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {planId === "free" && (
          <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-4">
            <Sparkles className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Want more AI features?
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Upgrade to Pro for AI resume tailoring, cover letters, auto-apply, and more.
              </p>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
