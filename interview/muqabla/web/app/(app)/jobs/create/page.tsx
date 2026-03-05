"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config";
import { Plus, X, Briefcase, ArrowLeft } from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, employerProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [seniority, setSeniority] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [workMode, setWorkMode] = useState("on_site");
  const [country, setCountry] = useState("AE");
  const [city, setCity] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [showSalary, setShowSalary] = useState(true);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const cities = APP_CONFIG.gcc.cities[country] || [];

  function addRequirement() {
    setRequirements((prev) => [...prev, ""]);
  }
  function removeRequirement(idx: number) {
    setRequirements((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateRequirement(idx: number, value: string) {
    setRequirements((prev) => prev.map((r, i) => (i === idx ? value : r)));
  }

  function addBenefit() {
    setBenefits((prev) => [...prev, ""]);
  }
  function removeBenefit(idx: number) {
    setBenefits((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateBenefit(idx: number, value: string) {
    setBenefits((prev) => prev.map((b, i) => (i === idx ? value : b)));
  }

  async function handleSubmit(asDraft: boolean) {
    if (!title.trim()) {
      setError("Job title is required");
      return;
    }
    if (!employerProfile?.company) {
      setError("Company profile not found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: jobError } = await supabase.from("jobs").insert({
        company_id: employerProfile.company.id,
        posted_by: user!.id,
        title,
        description: description || null,
        department: department || null,
        seniority: seniority || null,
        job_type: jobType,
        work_mode: workMode,
        city: city || null,
        country,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_currency:
          APP_CONFIG.gcc.countries.find((c) => c.code === country)
            ? country === "AE"
              ? "AED"
              : country === "SA"
                ? "SAR"
                : country === "QA"
                  ? "QAR"
                  : country === "KW"
                    ? "KWD"
                    : country === "BH"
                      ? "BHD"
                      : "OMR"
            : "AED",
        show_salary: showSalary,
        requirements: requirements.filter((r) => r.trim()),
        benefits: benefits.filter((b) => b.trim()),
        status: asDraft ? "draft" : "active",
        views: 0,
        applications_count: 0,
        ...(asDraft ? {} : { published_at: new Date().toISOString() }),
      });

      if (jobError) {
        setError(jobError.message);
        return;
      }

      router.push("/jobs/manage");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <Briefcase className="h-6 w-6 text-primary" />
        Post a New Job
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Job Title *"
            placeholder="e.g. Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            label="Department"
            placeholder="e.g. Engineering, Marketing"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Seniority"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              options={APP_CONFIG.experienceLevels.map((l) => ({
                value: l.id,
                label: l.name,
              }))}
              placeholder="Select level"
            />
            <Select
              label="Job Type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              options={APP_CONFIG.jobTypes.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
            />
            <Select
              label="Work Mode"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              options={APP_CONFIG.workModes.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("");
              }}
              options={APP_CONFIG.gcc.countries.map((c) => ({
                value: c.code,
                label: c.name,
              }))}
            />
            <Select
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={cities.map((c) => ({ value: c, label: c }))}
              placeholder="Select city"
            />
          </div>
        </CardContent>
      </Card>

      {/* Salary */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Salary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Minimum (monthly)"
              type="number"
              placeholder="e.g. 15000"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
            <Input
              label="Maximum (monthly)"
              type="number"
              placeholder="e.g. 25000"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showSalary}
              onChange={(e) => setShowSalary(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            Show salary to candidates
          </label>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder="e.g. 3+ years of React experience"
                value={req}
                onChange={(e) => updateRequirement(idx, e.target.value)}
                className="flex-1"
              />
              {requirements.length > 1 && (
                <button
                  onClick={() => removeRequirement(idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRequirement}>
            <Plus className="mr-1 h-4 w-4" />
            Add Requirement
          </Button>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {benefits.map((ben, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder="e.g. Health insurance, Flexible hours"
                value={ben}
                onChange={(e) => updateBenefit(idx, e.target.value)}
                className="flex-1"
              />
              {benefits.length > 1 && (
                <button
                  onClick={() => removeBenefit(idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addBenefit}>
            <Plus className="mr-1 h-4 w-4" />
            Add Benefit
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          isLoading={isLoading}
          onClick={() => handleSubmit(true)}
        >
          Save as Draft
        </Button>
        <Button
          className="flex-1"
          size="lg"
          isLoading={isLoading}
          onClick={() => handleSubmit(false)}
        >
          Publish Job
        </Button>
      </div>
    </div>
  );
}
