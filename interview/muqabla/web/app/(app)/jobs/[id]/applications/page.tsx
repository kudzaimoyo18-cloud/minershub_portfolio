"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Application, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APPLICATION_STATUS_CONFIG, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Loader2,
  MessageSquare,
  User,
} from "lucide-react";

export default function JobApplicationsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch job
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (jobData) {
        setJob(jobData as Job);
      }

      // Fetch applications
      const { data: appsData } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", id)
        .order("created_at", { ascending: false });

      if (appsData) {
        setApplications(appsData as Application[]);
      }

      setIsLoading(false);
    }
    load();
  }, [id]);

  async function updateStatus(
    applicationId: string,
    status: string
  ) {
    const supabase = createClient();
    const updates: Record<string, unknown> = { status };

    if (status === "viewed") updates.viewed_at = new Date().toISOString();
    if (status === "shortlisted")
      updates.shortlisted_at = new Date().toISOString();
    if (status === "rejected")
      updates.rejected_at = new Date().toISOString();

    const { error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", applicationId);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status, ...updates } : a
        )
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
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {job && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {applications.length} application
            {applications.length !== 1 ? "s" : ""} received
          </p>
        </div>
      )}

      {/* Status Summary */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(APPLICATION_STATUS_CONFIG).map(([status, config]) => {
          const count = applications.filter(
            (a) => a.status === status
          ).length;
          if (count === 0) return null;
          return (
            <span
              key={status}
              className={`rounded-full px-3 py-1 text-xs font-medium ${config.color} ${config.bg}`}
            >
              {config.label}: {count}
            </span>
          );
        })}
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            No applications yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Applications will appear here when candidates apply
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusConfig = APPLICATION_STATUS_CONFIG[app.status] || {
              label: app.status,
              color: "text-gray-600",
              bg: "bg-gray-100",
            };

            return (
              <Card key={app.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Candidate #{app.candidate_id.slice(0, 8)}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(app.created_at)}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium ${statusConfig.color} ${statusConfig.bg}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        {app.cover_message && (
                          <div className="mt-2 flex items-start gap-1.5 text-sm text-gray-600">
                            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <p className="line-clamp-2">{app.cover_message}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {app.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(app.id, "viewed")}
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Button>
                      )}
                      {(app.status === "pending" ||
                        app.status === "viewed") && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatus(app.id, "shortlisted")
                            }
                          >
                            <Star className="mr-1 h-3.5 w-3.5" />
                            Shortlist
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() =>
                              updateStatus(app.id, "rejected")
                            }
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
                      {app.status === "shortlisted" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(app.id, "interviewing")
                          }
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Interview
                        </Button>
                      )}
                    </div>
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
