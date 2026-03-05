"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config";

export default function EmployerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");

  async function handleComplete() {
    if (!fullName.trim() || !companyName.trim()) {
      setError("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        return;
      }

      // Update user profile
      await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", user.id);

      // Create company
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: companyName,
          slug,
          industry: industry || null,
          size: size || null,
          website: website || null,
          is_verified: false,
          locations: [],
          jobs_posted: 0,
          total_hires: 0,
        })
        .select()
        .single();

      if (companyError) {
        setError(companyError.message);
        return;
      }

      // Create employer profile
      const { error: employerError } = await supabase
        .from("employers")
        .insert({
          id: user.id,
          company_id: company.id,
          role: "admin",
          title: title || null,
          can_post_jobs: true,
          can_manage_team: true,
        });

      if (employerError) {
        setError(employerError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white font-bold text-xl">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Set Up Your Company
          </h1>
          <p className="mt-1 text-sm text-gray-500">Step {step} of 2</p>
          <div className="mx-auto mt-4 flex max-w-xs gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-accent" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Your Details" : "Company Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Full Name *"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Job Title"
                  placeholder="e.g. HR Manager"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!fullName.trim()) {
                      setError("Full name is required");
                      return;
                    }
                    setError("");
                    setStep(2);
                  }}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Input
                  label="Company Name *"
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Select
                  label="Industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  options={APP_CONFIG.industries.map((i) => ({
                    value: i,
                    label: i,
                  }))}
                  placeholder="Select industry"
                />
                <Select
                  label="Company Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  options={APP_CONFIG.companySizes.map((s) => ({
                    value: s,
                    label: `${s} employees`,
                  }))}
                  placeholder="Select company size"
                />
                <Input
                  label="Website"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    isLoading={isLoading}
                    onClick={handleComplete}
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
