"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Job } from "@/lib/types";
import JobCard from "@/components/job-card";
import { Bookmark, Loader2 } from "lucide-react";

export default function SavedPage() {
  const { user } = useAuthStore();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job:jobs(*, company:companies(*))")
        .eq("candidate_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error:", error);
      } else {
        const jobs = (data || [])
          .map((s: { job: Job }) => s.job)
          .filter(Boolean);
        setSavedJobs(jobs);
        setSavedIds(new Set(jobs.map((j: Job) => j.id)));
      }
      setIsLoading(false);
    }
    load();
  }, [user]);

  async function toggleSave(jobId: string) {
    if (!user) return;
    const supabase = createClient();

    if (savedIds.has(jobId)) {
      await supabase
        .from("saved_jobs")
        .delete()
        .eq("candidate_id", user.id)
        .eq("job_id", jobId);
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <Bookmark className="h-6 w-6 text-primary" />
        Saved Jobs
      </h1>

      {savedJobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            No saved jobs
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Save jobs you&apos;re interested in to review later
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={toggleSave}
              isSaved={savedIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
