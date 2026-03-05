"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { JOB_STATUS_CONFIG, formatDate } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  Eye,
  Users,
  Clock,
  MapPin,
  Loader2,
  MoreVertical,
} from "lucide-react";

export default function ManageJobsPage() {
  const { employerProfile } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!employerProfile?.company) return;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", employerProfile!.company!.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error:", error);
      } else {
        setJobs((data || []) as Job[]);
      }
      setIsLoading(false);
    }
    load();
  }, [employerProfile]);

  async function toggleJobStatus(jobId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    const supabase = createClient();

    const { error } = await supabase
      .from("jobs")
      .update({
        status: newStatus,
        ...(newStatus === "active" && !jobs.find((j) => j.id === jobId)?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );
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
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Briefcase className="h-6 w-6 text-primary" />
          Manage Jobs
        </h1>
        <Link href="/jobs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            No jobs posted yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Create your first job listing to start receiving applications
          </p>
          <Link href="/jobs/create">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Post Your First Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const statusConfig = JOB_STATUS_CONFIG[job.status] || {
              label: job.status,
              color: "text-gray-600",
              bg: "bg-gray-100",
            };

            return (
              <Card key={job.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.city}, {job.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {(job.status === "active" ||
                        job.status === "paused" ||
                        job.status === "draft") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleJobStatus(job.id, job.status)
                          }
                        >
                          {job.status === "active" ? "Pause" : "Activate"}
                        </Button>
                      )}
                      <Link href={`/jobs/${job.id}/applications`}>
                        <Button variant="secondary" size="sm">
                          View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {job.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applications_count} applications
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
