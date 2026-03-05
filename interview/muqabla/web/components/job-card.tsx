"use client";

import Link from "next/link";
import type { Job } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  formatSalary,
  formatDate,
  getJobTypeLabel,
  getWorkModeLabel,
} from "@/lib/utils";
import {
  MapPin,
  Building2,
  Clock,
  Banknote,
  Briefcase,
  Monitor,
  Bookmark,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onSave, isSaved }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Company Logo */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-bold text-lg">
              {job.company?.logo_url ? (
                <img
                  src={job.company.logo_url}
                  alt={job.company.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                job.company?.name?.[0] || "C"
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                <Building2 className="h-3.5 w-3.5" />
                <span>{job.company?.name || "Company"}</span>
                {job.company?.is_verified && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave(job.id);
              }}
              className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
            >
              <Bookmark
                className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            {job.city}, {job.country}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
            <Briefcase className="h-3 w-3" />
            {getJobTypeLabel(job.job_type)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
            <Monitor className="h-3 w-3" />
            {getWorkModeLabel(job.work_mode)}
          </span>
        </div>

        {/* Salary & Date */}
        <div className="mt-3 flex items-center justify-between text-sm">
          {job.show_salary && (job.salary_min || job.salary_max) ? (
            <span className="flex items-center gap-1 font-medium text-primary">
              <Banknote className="h-4 w-4" />
              {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
            </span>
          ) : (
            <span className="text-gray-400">Salary not disclosed</span>
          )}
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(job.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
