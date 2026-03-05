"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { APP_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/stores/auth-store";
import { Compass, Filter, Loader2, X } from "lucide-react";

export default function FeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  const [filterWorkMode, setFilterWorkMode] = useState("");
  const { user } = useAuthStore();

  const fetchJobs = useCallback(
    async (cursor?: string) => {
      const supabase = createClient();

      let query = supabase
        .from("jobs")
        .select("*, company:companies(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      if (cursor) {
        query = query.lt("created_at", cursor);
      }
      if (filterCity) {
        query = query.eq("city", filterCity);
      }
      if (filterJobType) {
        query = query.eq("job_type", filterJobType);
      }
      if (filterWorkMode) {
        query = query.eq("work_mode", filterWorkMode);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching jobs:", error);
        return [];
      }

      return (data || []) as Job[];
    },
    [filterCity, filterJobType, filterWorkMode]
  );

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchJobs();
    setJobs(data);
    setHasMore(data.length === 10);
    setIsLoading(false);
  }, [fetchJobs]);

  async function loadMore() {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    const lastJob = jobs[jobs.length - 1];
    const data = await fetchJobs(lastJob?.created_at);
    setJobs((prev) => [...prev, ...data]);
    setHasMore(data.length === 10);
    setIsLoadingMore(false);
  }

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Load saved jobs
  useEffect(() => {
    if (!user || user.type !== "candidate") return;

    async function loadSaved() {
      const supabase = createClient();
      const { data } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("candidate_id", user!.id);

      if (data) {
        setSavedJobIds(new Set(data.map((s) => s.job_id)));
      }
    }
    loadSaved();
  }, [user]);

  async function toggleSave(jobId: string) {
    if (!user) return;
    const supabase = createClient();

    if (savedJobIds.has(jobId)) {
      await supabase
        .from("saved_jobs")
        .delete()
        .eq("candidate_id", user.id)
        .eq("job_id", jobId);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    } else {
      await supabase
        .from("saved_jobs")
        .insert({ candidate_id: user.id, job_id: jobId });
      setSavedJobIds((prev) => new Set([...prev, jobId]));
    }
  }

  function clearFilters() {
    setFilterCity("");
    setFilterJobType("");
    setFilterWorkMode("");
  }

  const hasFilters = filterCity || filterJobType || filterWorkMode;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Compass className="h-6 w-6 text-primary" />
            Discover Jobs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse the latest opportunities across the GCC
          </p>
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Select
              label="City"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              options={Object.values(APP_CONFIG.gcc.cities)
                .flat()
                .map((c) => ({ value: c, label: c }))}
              placeholder="All cities"
            />
            <Select
              label="Job Type"
              value={filterJobType}
              onChange={(e) => setFilterJobType(e.target.value)}
              options={APP_CONFIG.jobTypes.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder="All types"
            />
            <Select
              label="Work Mode"
              value={filterWorkMode}
              onChange={(e) => setFilterWorkMode(e.target.value)}
              options={APP_CONFIG.workModes.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
              placeholder="All modes"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Compass className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            No jobs found
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {hasFilters
              ? "Try adjusting your filters"
              : "Check back later for new opportunities"}
          </p>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={user?.type === "candidate" ? toggleSave : undefined}
              isSaved={savedJobIds.has(job.id)}
            />
          ))}

          {hasMore && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                onClick={loadMore}
                isLoading={isLoadingMore}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
