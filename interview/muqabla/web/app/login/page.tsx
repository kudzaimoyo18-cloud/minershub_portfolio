"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, Play, Shield, Globe, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/feed");
      router.refresh();
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
          src="/images/dubai-skyline.jpg"
          alt="Dubai skyline"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-gray-900/80" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-lg backdrop-blur-sm transition-transform group-hover:scale-105">
              M
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Muqabla</span>
          </Link>

          {/* Hero content */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white/80">500+ companies hiring now</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4 leading-tight animate-fade-in-up">
              Your next career move starts with a video
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10 animate-fade-in-up animation-delay-100">
              Join thousands of professionals across the GCC who are landing their dream jobs
              with video-first applications.
            </p>

            <div className="space-y-3">
              {[
                { icon: Play, text: "60-second video profiles", desc: "Stand out from the crowd" },
                { icon: Shield, text: "Verified GCC employers", desc: "Only trusted companies" },
                { icon: Globe, text: "6 countries, one platform", desc: "UAE, KSA, Qatar & more" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-4 rounded-xl bg-white/5 backdrop-blur-sm p-3 border border-white/10 transition-colors hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <item.icon className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white">{item.text}</span>
                    <span className="block text-xs text-white/50">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">
            &copy; 2025 Muqabla. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 lg:hidden mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl shadow-sm">
                M
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Muqabla</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-500">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-start gap-3 animate-fade-in">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                  <span className="text-red-500 text-xs font-bold">!</span>
                </div>
                <span>{error}</span>
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
                placeholder="Enter your password"
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

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 transition-all"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8">
            <Separator label="New to Muqabla?" />
            <Link href="/register" className="block mt-6">
              <Button variant="outline" className="w-full h-12 text-base font-medium hover:border-primary/30 hover:bg-primary/5 transition-all">
                Create an Account
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              SSL Secured
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              GCC Region
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
