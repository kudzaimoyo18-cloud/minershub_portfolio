"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Award,
  Edit3,
  Save,
  LogOut,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, candidateProfile, employerProfile, signOut, loadUserProfile } =
    useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [headline, setHeadline] = useState(candidateProfile?.headline || "");
  const [city, setCity] = useState(candidateProfile?.city || "");
  const [country, setCountry] = useState(candidateProfile?.country || "AE");

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);

    try {
      const supabase = createClient();

      // Update user
      await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", user.id);

      // Update candidate profile
      if (user.type === "candidate") {
        await supabase
          .from("candidates")
          .update({ headline, city, country })
          .eq("id", user.id);
      }

      // Reload profile
      await loadUserProfile(user.id);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  if (!user) return null;

  const cities = APP_CONFIG.gcc.cities[country] || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <User className="h-6 w-6 text-primary" />
        Profile
      </h1>

      {/* Avatar & Name */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {user.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {user.type === "candidate" && (
                    <>
                      <Input
                        label="Headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Senior Developer"
                      />
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
                        options={cities.map((c) => ({
                          value: c,
                          label: c,
                        }))}
                        placeholder="Select city"
                      />
                    </>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      isLoading={isSaving}
                      onClick={handleSave}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {user.full_name || "Set your name"}
                    </h2>
                    <Badge variant={user.type === "candidate" ? "default" : "info"}>
                      {user.type === "candidate" ? "Job Seeker" : "Employer"}
                    </Badge>
                  </div>
                  {candidateProfile?.headline && (
                    <p className="mt-1 text-gray-500">
                      {candidateProfile.headline}
                    </p>
                  )}
                  {employerProfile?.title && (
                    <p className="mt-1 text-gray-500">
                      {employerProfile.title}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                    {user.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </span>
                    )}
                    {candidateProfile?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {candidateProfile.city}, {candidateProfile.country}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="mr-1 h-4 w-4" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Stats */}
      {user.type === "candidate" && candidateProfile && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Profile Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {candidateProfile.profile_views}
                </div>
                <div className="text-xs text-gray-500">Profile Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {candidateProfile.applications_count}
                </div>
                <div className="text-xs text-gray-500">Applications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {candidateProfile.desired_industries.length}
                </div>
                <div className="text-xs text-gray-500">Industries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employer Company Info */}
      {user.type === "employer" && employerProfile?.company && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">
                {employerProfile.company.name}
              </p>
              {employerProfile.company.industry && (
                <p className="text-sm text-gray-500">
                  {employerProfile.company.industry}
                </p>
              )}
              {employerProfile.company.size && (
                <p className="text-sm text-gray-500">
                  {employerProfile.company.size} employees
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {employerProfile.company.jobs_posted}
                  </div>
                  <div className="text-xs text-gray-500">Jobs Posted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {employerProfile.company.total_hires}
                  </div>
                  <div className="text-xs text-gray-500">Total Hires</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industries */}
      {user.type === "candidate" &&
        candidateProfile?.desired_industries &&
        candidateProfile.desired_industries.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-4 w-4" />
                Industry Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidateProfile.desired_industries.map((ind) => (
                  <Badge key={ind} variant="outline">
                    {ind}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Sign Out */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
