"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { PLANS } from "@/lib/stripe";
import {
  Check,
  Crown,
  Rocket,
  Sparkles,
  Zap,
  Loader2,
  ArrowRight,
  Shield,
} from "lucide-react";

const planIcons = {
  free: Zap,
  pro: Sparkles,
  enterprise: Crown,
};

const planColors = {
  free: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
    button: "bg-gray-900 text-white hover:bg-gray-800",
  },
  pro: {
    bg: "bg-primary/5",
    border: "border-primary/30",
    badge: "bg-primary/10 text-primary",
    button: "bg-primary text-white hover:bg-primary-dark",
  },
  enterprise: {
    bg: "bg-accent/5",
    border: "border-accent/30",
    badge: "bg-accent/10 text-accent-dark",
    button: "bg-accent text-white hover:bg-accent-dark",
  },
};

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlan = subscription?.plan_id || "free";

  async function handleSubscribe(planId: string) {
    if (planId === "free" || planId === currentPlan) return;

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Rocket className="h-4 w-4" />
          AI-Powered Job Search
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Supercharge Your Job Search
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Let our AI agent find, prepare, and apply to jobs for you.
          Save hours every week and land your dream role faster.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
          ([id, plan]) => {
            const colors = planColors[id as keyof typeof planColors];
            const Icon = planIcons[id as keyof typeof planIcons];
            const isCurrent = currentPlan === id;
            const isPopular = id === "pro";

            return (
              <div
                key={id}
                className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 sm:p-8 transition-all hover:shadow-lg ${
                  isPopular ? "ring-2 ring-primary shadow-lg md:-mt-4 md:mb-0" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-md">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.badge}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price === 0 ? "0" : (plan.price / 100).toFixed(0)}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  {id !== "free" && (
                    <p className="mt-1 text-xs text-gray-400">
                      7-day free trial included
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(id)}
                  disabled={isCurrent || loading !== null}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-gray-100 text-gray-500 cursor-default"
                      : colors.button
                  } ${loading === id ? "opacity-80" : ""} disabled:opacity-60`}
                >
                  {loading === id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : id === "free" ? (
                    "Get Started"
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Trust Bar */}
      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Secure payment via Stripe. Cancel anytime.</span>
        </div>
        {currentPlan !== "free" && (
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/portal", { method: "POST" });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="text-sm text-primary hover:underline"
          >
            Manage billing &rarr;
          </button>
        )}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What happens after my free trial?",
              a: "After 7 days, you'll be charged automatically. You can cancel anytime before the trial ends to avoid charges.",
            },
            {
              q: "Can I switch plans anytime?",
              a: "Yes! Upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing cycle.",
            },
            {
              q: "What does the AI actually do?",
              a: "Our AI reads job descriptions, tailors your resume to match keywords, writes cover letters, prepares you for interviews, and even auto-applies to matching jobs. It's like having a personal career assistant.",
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. We use Stripe for payments (PCI-compliant), and your resume data is encrypted and never shared with third parties.",
            },
            {
              q: "Do I get a refund if I'm not satisfied?",
              a: "Yes, we offer a 14-day money-back guarantee. If you're not happy, contact us for a full refund.",
            },
          ].map(({ q, a }, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-xl">
                {q}
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
                  &#9662;
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-500">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
