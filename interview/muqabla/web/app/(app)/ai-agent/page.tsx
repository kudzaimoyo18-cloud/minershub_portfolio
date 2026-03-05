"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore, useCurrentPlan, useIsPro } from "@/stores/subscription-store";
import { PLANS } from "@/lib/stripe";
import {
  Brain,
  FileText,
  Mail,
  Target,
  Sparkles,
  MessageSquare,
  BarChart3,
  Zap,
  Lock,
  ArrowRight,
  Loader2,
  Clock,
  TrendingUp,
  Shield,
  Briefcase,
  Send,
  CalendarClock,
  Bot,
} from "lucide-react";

const aiFeatures = [
  {
    id: "resume-tailor",
    name: "Resume Tailoring",
    description: "AI-tailored resume for each job application",
    icon: FileText,
    href: "/ai-agent/resume",
    color: "text-blue-600 bg-blue-50",
    planRequired: "pro" as const,
    usageKey: "ai_resume_tailors",
  },
  {
    id: "cover-letter",
    name: "Cover Letters",
    description: "Generate compelling cover letters",
    icon: Mail,
    href: "/ai-agent/cover-letter",
    color: "text-purple-600 bg-purple-50",
    planRequired: "pro" as const,
    usageKey: "ai_cover_letters",
  },
  {
    id: "ats-score",
    name: "ATS Score",
    description: "Check your resume's ATS compatibility",
    icon: Target,
    href: "/ai-agent/ats-score",
    color: "text-green-600 bg-green-50",
    planRequired: "pro" as const,
    usageKey: "ats_score_checks",
  },
  {
    id: "interview-prep",
    name: "Interview Prep",
    description: "Practice with AI-generated questions",
    icon: MessageSquare,
    href: "/ai-agent/interview",
    color: "text-amber-600 bg-amber-50",
    planRequired: "pro" as const,
    usageKey: "ai_interview_prep",
  },
  {
    id: "job-matching",
    name: "Smart Matching",
    description: "AI-scored job recommendations",
    icon: Sparkles,
    href: "/ai-agent/matches",
    color: "text-primary bg-teal-50",
    planRequired: "pro" as const,
    usageKey: null,
  },
  {
    id: "auto-apply",
    name: "Auto Apply",
    description: "Bulk apply to matching jobs",
    icon: Send,
    href: "/ai-agent/auto-apply",
    color: "text-red-600 bg-red-50",
    planRequired: "pro" as const,
    usageKey: null,
  },
  {
    id: "follow-ups",
    name: "Follow-up Coach",
    description: "Smart reminders and draft messages",
    icon: CalendarClock,
    href: "/ai-agent/follow-ups",
    color: "text-indigo-600 bg-indigo-50",
    planRequired: "pro" as const,
    usageKey: null,
  },
  {
    id: "recruiter-outreach",
    name: "Recruiter Outreach",
    description: "AI-crafted messages for recruiters",
    icon: Briefcase,
    href: "/ai-agent/outreach",
    color: "text-orange-600 bg-orange-50",
    planRequired: "pro" as const,
    usageKey: "recruiter_outreach",
  },
];

export default function AIAgentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { subscription, usage, isLoading, initialize } = useSubscriptionStore();
  const isPro = useIsPro();

  useEffect(() => {
    if (user?.id) {
      initialize(user.id);
    }
  }, [user?.id, initialize]);

  const planId = subscription?.plan_id || "free";
  const plan = PLANS[planId as keyof typeof PLANS];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">AI Job Agent</h1>
          </div>
          <p className="text-sm text-gray-500">
            Your personal AI-powered career assistant
          </p>
        </div>
        {!isPro && (
          <button
            onClick={() => router.push("/pricing")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Unlock AI Features
          </button>
        )}
      </div>

      {/* Quick Stats (for Pro users) */}
      {isPro && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Jobs Matched",
              value: "24",
              icon: Target,
              trend: "+5 today",
            },
            {
              label: "Applied",
              value: String(usage?.applications_used || 0),
              icon: Send,
              trend: "this month",
            },
            {
              label: "AI Tasks",
              value: String(
                (usage?.ai_resume_tailors_used || 0) +
                (usage?.ai_cover_letters_used || 0) +
                (usage?.ai_interview_prep_used || 0)
              ),
              icon: Brain,
              trend: "completed",
            },
            {
              label: "Time Saved",
              value: `${Math.round(
                ((usage?.ai_resume_tailors_used || 0) * 25 +
                  (usage?.ai_cover_letters_used || 0) * 15 +
                  (usage?.applications_used || 0) * 10) / 60
              )}h`,
              icon: Clock,
              trend: "estimated",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{stat.trend}</p>
            </div>
          ))}
        </div>
      )}

      {/* Free Plan CTA Banner */}
      {!isPro && (
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                AI Job Agent
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Stop applying manually. Let AI do it for you.
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg">
              Our AI analyzes job descriptions, tailors your resume, writes cover letters,
              and auto-applies to matching jobs. Save 10+ hours every week.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/pricing")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  7-day free trial
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature) => {
          const isLocked = !isPro;
          const usageCount = feature.usageKey && usage
            ? (usage as any)[`${feature.usageKey}_used`] || 0
            : null;
          const limit = feature.usageKey && plan
            ? (plan.limits as any)[feature.usageKey] || 0
            : null;

          return (
            <button
              key={feature.id}
              onClick={() => {
                if (isLocked) {
                  router.push("/pricing");
                } else {
                  router.push(feature.href);
                }
              }}
              className={`group relative text-left rounded-xl border p-5 transition-all hover:shadow-md ${
                isLocked
                  ? "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                  : "border-gray-200 bg-white hover:border-primary/30"
              }`}
            >
              {isLocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="h-3.5 w-3.5 text-gray-300" />
                </div>
              )}

              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
              </div>

              <h3
                className={`text-sm font-semibold mb-1 ${
                  isLocked ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {feature.name}
              </h3>
              <p
                className={`text-xs ${
                  isLocked ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {feature.description}
              </p>

              {!isLocked && usageCount !== null && limit !== null && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {usageCount} / {limit === -1 ? "\u221e" : limit} used
                    </span>
                    {limit !== -1 && (
                      <span
                        className={`font-medium ${
                          usageCount / limit > 0.8
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}
                      >
                        {limit - usageCount} left
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!isLocked && (
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent AI Activity (for Pro users) */}
      {isPro && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent AI Activity</h2>
            <button className="text-xs text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="text-center py-8 text-gray-400">
            <Brain className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No AI tasks yet</p>
            <p className="text-xs mt-1">
              Start by tailoring a resume or generating a cover letter
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
