"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Video,
  Building2,
} from "lucide-react";

type Role = "candidate" | "employer";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { type: role },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          type: role,
          email,
          full_name: "",
          language: "en",
          is_verified: false,
          is_active: true,
        });

        if (role === "candidate") {
          router.push("/onboarding/candidate");
        } else {
          router.push("/onboarding/employer");
        }
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/businessman-tablet.jpg"
          alt="Professional using Muqabla"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-primary/60 to-gray-900/80" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-lg backdrop-blur-sm">
              M
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Muqabla</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Stand out from thousands of applicants
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Create your video profile and let employers see the real you.
              Your personality is your biggest asset.
            </p>
            <div className="space-y-3">
              {[
                "Free to create your profile",
                "10,000+ active job seekers",
                "500+ verified companies",
                "Covering all 6 GCC countries",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs">
            &copy; 2025 Muqabla. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl shadow-sm">
                M
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Muqabla</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 lg:mt-0 lg:text-3xl">
              {step === "role" ? "Join Muqabla" : role === "candidate" ? "Create Job Seeker Account" : "Create Employer Account"}
            </h1>
            <p className="mt-2 text-gray-500">
              {step === "role" ? "Choose how you want to use Muqabla" : "Fill in your details to get started"}
            </p>
          </div>

          {step === "role" ? (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setRole("candidate");
                  setStep("form");
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-105">
                  <Video className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-lg">Find a Job</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Create your video profile and apply to jobs across the GCC
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => {
                  setRole("employer");
                  setStep("form");
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent-dark transition-all group-hover:bg-accent group-hover:text-white group-hover:scale-105">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-lg">
                    Hire Talent
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Post jobs and review video applications from top candidates
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-accent transition-colors" />
              </button>

              <div className="mt-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 tracking-wider">Already have an account?</span>
                  </div>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-12 text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStep("role")}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Change account type
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs font-bold">!</span>
                    </div>
                    {error}
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                  />
                  <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
                </div>

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                  />
                  <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                  <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base shadow-sm"
                  size="lg"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>

                <p className="text-xs text-center text-gray-400 leading-relaxed">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
