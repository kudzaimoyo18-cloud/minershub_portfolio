"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Application } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STATUS_CONFIG, formatDate } from "@/lib/utils";
import {
  FileText,
  Building2,
  MapPin,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("applications")
        .select("*, job:jobs(*, company:companies(*))")
        .eq("candidate_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error:", error);
      } else {
        setApplications((data || []) as Application[]);
      }
      setIsLoading(false);
    }
    load();
  }, [user]);

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
        <FileText className="h-6 w-6 text-primary" />
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            No applications yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Start by browsing jobs and applying with your video
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
          >
            Browse Jobs
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
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
              <Link key={app.id} href={`/jobs/${app.job_id}`}>
                <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold text-lg">
                        {app.job?.company?.name?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {app.job?.title || "Job"}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                          <Building2 className="h-3.5 w-3.5" />
                          {app.job?.company?.name}
                        </div>
                        {app.job && (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {app.job.city}, {app.job.country}
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Applied {formatDate(app.created_at)}
                    </span>
                    {app.cover_message && (
                      <span className="truncate text-gray-500 max-w-[200px]">
                        &quot;{app.cover_message}&quot;
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
