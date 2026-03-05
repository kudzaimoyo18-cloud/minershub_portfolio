"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { APP_CONFIG } from "@/lib/config";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [jobType, setJobType] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async () => {
    setIsSearching(true);
    setHasSearched(true);

    const supabase = createClient();
    let q = supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("status", "active");

    if (query.trim()) {
      q = q.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`
      );
    }
    if (city) {
      q = q.eq("city", city);
    }
    if (jobType) {
      q = q.eq("job_type", jobType);
    }

    q = q.order("created_at", { ascending: false }).limit(20);

    const { data } = await q;
    setResults((data || []) as Job[]);
    setIsSearching(false);
  }, [query, city, jobType]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <Search className="h-6 w-6 text-primary" />
        Search Jobs
      </h1>

      {/* Search bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search job titles, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button type="submit" isLoading={isSearching}>
              Search
            </Button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={Object.values(APP_CONFIG.gcc.cities)
                .flat()
                .map((c) => ({ value: c, label: c }))}
              placeholder="All cities"
            />
            <Select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              options={APP_CONFIG.jobTypes.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
              placeholder="All job types"
            />
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="mt-6">
        {isSearching ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
              <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-500">
                No jobs match your search
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try different keywords or filters
              </p>
            </div>
          )
        ) : (
          <div className="py-16 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-200" />
            <p className="mt-4 text-gray-400">
              Search for your next opportunity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
