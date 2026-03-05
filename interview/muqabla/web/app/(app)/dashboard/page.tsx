"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { Application, Job } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STATUS_CONFIG, formatDate } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Eye,
  Plus,
  ArrowRight,
  Loader2,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user, employerProfile } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !employerProfile?.company) return;

    async function load() {
      const supabase = createClient();
      const companyId = employerProfile!.company!.id;

      // Fetch company jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      const jobsList = (jobsData || []) as Job[];
      setJobs(jobsList);

      // Calculate stats
      const activeJobs = jobsList.filter((j) => j.status === "active").length;
      const totalViews = jobsList.reduce((sum, j) => sum + j.views, 0);
      const totalApplications = jobsList.reduce(
        (sum, j) => sum + j.applications_count,
        0
      );

      setStats({
        totalJobs: jobsList.length,
        activeJobs,
        totalApplications,
        totalViews,
      });

      // Fetch recent applications for company's jobs
      if (jobsList.length > 0) {
        const jobIds = jobsList.map((j) => j.id);
        const { data: appsData } = await supabase
          .from("applications")
          .select("*, job:jobs(*)")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentApplications((appsData || []) as Application[]);
      }

      setIsLoading(false);
    }
    load();
  }, [user, employerProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.full_name || "there"}
          </p>
        </div>
        <Link href="/jobs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Jobs",
            value: stats.totalJobs,
            icon: Briefcase,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Active Jobs",
            value: stats.activeJobs,
            icon: TrendingUp,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Applications",
            value: stats.totalApplications,
            icon: FileText,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Total Views",
            value: stats.totalViews,
            icon: Eye,
            color: "text-accent-dark bg-accent/10",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Your Jobs</CardTitle>
            <Link
              href="/jobs/manage"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              View All
              <ArrowRight className="ml-1 inline-block h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No jobs posted yet
              </p>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}/applications`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {job.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
                        <span>{job.applications_count} applicants</span>
                        <span>{job.views} views</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        job.status === "active" ? "success" : "outline"
                      }
                    >
                      {job.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No applications received yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => {
                  const statusConfig =
                    APPLICATION_STATUS_CONFIG[app.status] || {
                      label: app.status,
                      color: "text-gray-600",
                      bg: "bg-gray-100",
                    };
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {app.job?.title || "Job"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(app.created_at)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
