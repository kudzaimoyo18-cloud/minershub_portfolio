"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  formatSalary,
  formatDate,
  getJobTypeLabel,
  getWorkModeLabel,
  getSeniorityLabel,
} from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Briefcase,
  Monitor,
  Banknote,
  Clock,
  Users,
  Eye,
  Bookmark,
  Video,
  Send,
  CheckCircle2,
  Loader2,
  Globe,
  Award,
} from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(*)")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error:", error);
        setIsLoading(false);
        return;
      }

      setJob(data as Job);

      // Increment views
      await supabase.rpc("increment_job_views", { job_uuid: id });

      // Check if saved
      if (user?.type === "candidate") {
        const { data: saved } = await supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("candidate_id", user.id)
          .eq("job_id", id)
          .maybeSingle();
        setIsSaved(!!saved);

        // Check if already applied
        const { data: applied } = await supabase
          .from("applications")
          .select("id")
          .eq("candidate_id", user.id)
          .eq("job_id", id)
          .maybeSingle();
        setHasApplied(!!applied);
      }

      setIsLoading(false);
    }
    load();
  }, [id, user]);

  async function toggleSave() {
    if (!user || !job) return;
    const supabase = createClient();

    if (isSaved) {
      await supabase
        .from("saved_jobs")
        .delete()
        .eq("candidate_id", user.id)
        .eq("job_id", job.id);
      setIsSaved(false);
    } else {
      await supabase
        .from("saved_jobs")
        .insert({ candidate_id: user.id, job_id: job.id });
      setIsSaved(true);
    }
  }

  async function handleApply() {
    if (!user || !job) return;
    setIsApplying(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("applications").insert({
        job_id: job.id,
        candidate_id: user.id,
        cover_message: coverMessage || null,
        status: "pending",
      });

      if (error) {
        console.error("Apply error:", error);
        return;
      }

      setApplySuccess(true);
      setHasApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-500">Job not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Job Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold text-2xl">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              job.company?.name?.[0] || "C"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-gray-500">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company?.name}</span>
              {job.company?.is_verified && (
                <Badge variant="default" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tags row */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.city}, {job.country}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {getJobTypeLabel(job.job_type)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
            <Monitor className="h-4 w-4 text-gray-400" />
            {getWorkModeLabel(job.work_mode)}
          </span>
          {job.seniority && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
              <Award className="h-4 w-4 text-gray-400" />
              {getSeniorityLabel(job.seniority)}
            </span>
          )}
        </div>

        {/* Salary */}
        {job.show_salary && (job.salary_min || job.salary_max) && (
          <div className="mt-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <Banknote className="h-5 w-5" />
            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
            <span className="text-sm font-normal text-gray-400">/month</span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {job.views} views
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {job.applications_count} applicants
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDate(job.created_at)}
          </span>
        </div>

        {/* Action Buttons */}
        {user?.type === "candidate" && (
          <div className="mt-6 flex gap-3">
            {hasApplied || applySuccess ? (
              <Button disabled className="flex-1" size="lg">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Applied
              </Button>
            ) : showApplyForm ? null : (
              <Button
                className="flex-1"
                size="lg"
                onClick={() => setShowApplyForm(true)}
              >
                <Video className="mr-2 h-5 w-5" />
                Apply with Video
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={toggleSave}
            >
              <Bookmark
                className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`}
              />
            </Button>
          </div>
        )}

        {/* Apply Form */}
        {showApplyForm && !hasApplied && (
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              Apply for this position
            </h3>
            <Textarea
              label="Cover Message (optional)"
              placeholder="Tell the employer why you're a great fit..."
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <Button
                className="flex-1"
                isLoading={isApplying}
                onClick={handleApply}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Application
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowApplyForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Description
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Requirements
          </h2>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Benefits
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, i) => (
              <Badge key={i} variant="outline">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Company Info */}
      {job.company && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            About the Company
          </h2>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold text-lg">
              {job.company.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {job.company.name}
              </h3>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                {job.company.industry && (
                  <span>{job.company.industry}</span>
                )}
                {job.company.size && (
                  <span>{job.company.size} employees</span>
                )}
                {job.company.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {job.company.website}
                  </span>
                )}
              </div>
              {job.company.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {job.company.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
