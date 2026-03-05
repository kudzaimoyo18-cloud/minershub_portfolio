"use client";

import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Zap } from "lucide-react";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  compact?: boolean;
}

export function UpgradePrompt({
  feature,
  description,
  compact = false,
}: UpgradePromptProps) {
  const router = useRouter();

  if (compact) {
    return (
      <button
        onClick={() => router.push("/pricing")}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
      >
        <Lock className="h-3 w-3" />
        Upgrade to unlock {feature}
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Unlock {feature}
      </h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
        {description ||
          `Upgrade to Pro to access ${feature} and other AI-powered features.`}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => router.push("/pricing")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          <Zap className="h-4 w-4" />
          Upgrade to Pro
          <ArrowRight className="h-4 w-4" />
        </button>
        <span className="text-xs text-gray-400">7-day free trial</span>
      </div>
    </div>
  );
}

// Usage limit reached component
interface UsageLimitProps {
  feature: string;
  used: number;
  limit: number;
  resetDate?: string;
}

export function UsageLimitReached({
  feature,
  used,
  limit,
  resetDate,
}: UsageLimitProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mx-auto mb-4">
        <Zap className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {feature} Limit Reached
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        You've used {used} of {limit} {feature.toLowerCase()} this month.
      </p>
      {resetDate && (
        <p className="text-xs text-gray-400 mb-4">
          Resets on {new Date(resetDate).toLocaleDateString()}
        </p>
      )}
      <button
        onClick={() => router.push("/pricing")}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
      >
        Upgrade for More
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
