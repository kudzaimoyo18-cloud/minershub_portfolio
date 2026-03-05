"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config";
import { Check } from "lucide-react";

export default function CandidateOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [country, setCountry] = useState("AE");
  const [city, setCity] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const cities = APP_CONFIG.gcc.cities[country] || [];

  function toggleIndustry(industry: string) {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  }

  async function handleComplete() {
    if (!fullName.trim()) {
      setError("Please enter your full name");
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

      // Create candidate profile
      const { error: profileError } = await supabase
        .from("candidates")
        .insert({
          id: user.id,
          headline: headline || null,
          country,
          city: city || null,
          years_experience: yearsExperience
            ? parseInt(yearsExperience)
            : null,
          desired_industries: selectedIndustries,
          willing_relocate: false,
          desired_job_types: [],
          emirates_id_verified: false,
          linkedin_verified: false,
          profile_views: 0,
          applications_count: 0,
        });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      router.push("/feed");
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Step {step} of 3
          </p>
          {/* Progress bar */}
          <div className="mx-auto mt-4 flex max-w-xs gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "About You"}
              {step === 2 && "Location & Experience"}
              {step === 3 && "Industry Interests"}
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
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Headline"
                  placeholder="e.g. Senior Software Engineer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  hint="A brief professional title"
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
                  placeholder="Select a city"
                />
                <Select
                  label="Experience Level"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  options={APP_CONFIG.experienceLevels.map((l) => ({
                    value: l.years.replace("+", ""),
                    label: `${l.name} (${l.years} years)`,
                  }))}
                  placeholder="Select experience level"
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
                    onClick={() => setStep(3)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Select industries you&apos;re interested in
                </p>
                <div className="flex flex-wrap gap-2">
                  {APP_CONFIG.industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedIndustries.includes(industry)
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {selectedIndustries.includes(industry) && (
                        <Check className="mr-1 inline-block h-3.5 w-3.5" />
                      )}
                      {industry}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
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
