import Image from "next/image";
import Link from "next/link";
import {
  Video,
  Briefcase,
  Users,
  ArrowRight,
  Play,
  Star,
  Shield,
  CheckCircle,
  Globe,
  TrendingUp,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-sm">
              M
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Muqabla</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#for-candidates" className="hover:text-primary transition-colors">For Job Seekers</a>
            <a href="#for-employers" className="hover:text-primary transition-colors">For Employers</a>
            <a href="#gcc" className="hover:text-primary transition-colors">GCC Region</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm shadow-sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/dubai-skyline.jpg"
            alt="Dubai skyline at sunset - the heart of the GCC"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/70 to-gray-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32 w-full">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm border border-white/10">
              <Play className="h-4 w-4 text-accent" />
              <span>Video-first hiring platform for the GCC</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl leading-[1.1]">
              Your Video is
              <span className="block text-accent mt-1" style={{ color: '#C9A227' }}>Your Resume</span>
            </h1>
            <p className="mb-10 text-lg text-white/75 sm:text-xl max-w-lg leading-relaxed">
              Stand out from the crowd. Record a 60-second video profile and connect
              with top employers across UAE, Saudi Arabia, Qatar, and the GCC.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto text-base px-8 shadow-lg shadow-accent/20"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto text-base px-8 backdrop-blur-sm"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Hire Top Talent
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Verified employers</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-400" />
                <span>6 GCC countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof Bar */}
      <section className="border-b border-gray-100 bg-gray-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Trusted by leading companies across the Gulf
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Active Job Seekers", icon: Users },
              { value: "500+", label: "Verified Companies", icon: Building2 },
              { value: "6", label: "GCC Countries", icon: MapPin },
              { value: "95%", label: "Employer Response Rate", icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 justify-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How Muqabla Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500">
              Three simple steps to land your dream job in the GCC
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Video,
                title: "Record Your Story",
                description:
                  "Create a compelling 60-second video profile that showcases your personality, skills, and what makes you unique.",
                color: "bg-primary/10 text-primary",
              },
              {
                step: "02",
                icon: Briefcase,
                title: "Discover Opportunities",
                description:
                  "Browse curated job listings from verified employers across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman.",
                color: "bg-accent/10 text-accent-dark",
              },
              {
                step: "03",
                icon: Users,
                title: "Get Hired",
                description:
                  "Apply with your video resume and connect directly with hiring managers who want to see the real you.",
                color: "bg-green-50 text-green-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1"
              >
                <div className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  {feature.step}
                </div>
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Candidates */}
      <section id="for-candidates" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
                <Image
                  src="/images/businessman-tablet.jpg"
                  alt="Professional using Muqabla platform on tablet"
                  width={600}
                  height={450}
                  className="object-cover w-full h-auto"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Application Sent!</p>
                    <p className="text-xs text-gray-500">Video resume included</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                For Job Seekers
              </div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                Let employers see
                <span className="text-primary"> the real you</span>
              </h2>
              <p className="mb-8 text-lg text-gray-500 leading-relaxed">
                Your qualifications tell part of the story. Your video tells the rest.
                Show confidence, communication skills, and personality that a paper CV
                can never capture.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Record a 60-second video profile in minutes",
                  "Browse thousands of jobs across 6 GCC countries",
                  "Apply instantly with your video resume",
                  "Track all your applications in one place",
                  "Get notified when employers view your profile",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="shadow-sm">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section id="for-employers" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-dark mb-4">
                For Employers
              </div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl leading-tight">
                Hire with
                <span className="text-primary"> confidence</span>
              </h2>
              <p className="mb-8 text-lg text-gray-500 leading-relaxed">
                Go beyond the CV. Watch video profiles to assess communication skills,
                cultural fit, and professionalism before the first interview.
                Make smarter hiring decisions, faster.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Watch candidate video profiles before scheduling interviews",
                  "Post jobs and reach thousands of qualified professionals",
                  "Manage applications with a streamlined dashboard",
                  "Shortlist, schedule, and hire all in one platform",
                  "Verified company badge builds candidate trust",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent-dark shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" variant="accent" className="shadow-sm shadow-accent/20">
                  Start Hiring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
                <Image
                  src="/images/gcc-boardroom.jpg"
                  alt="GCC business team reviewing candidates in modern boardroom"
                  width={600}
                  height={450}
                  className="object-cover w-full h-auto"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">12 New Applicants</p>
                    <p className="text-xs text-gray-500">3 with video profiles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GCC Region */}
      <section id="gcc" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/oman-coast.jpg"
            alt="Oman Muscat coastal cityscape - spanning the GCC region"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm border border-white/10 mb-6">
            <Globe className="h-4 w-4" />
            Gulf Cooperation Council
          </div>
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Covering the Entire GCC Region
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/70 leading-relaxed">
            From Dubai&apos;s skyscrapers to Muscat&apos;s harbors, Muqabla connects talent
            with opportunity across all six Gulf states.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { country: "UAE", cities: "Dubai, Abu Dhabi" },
              { country: "Saudi Arabia", cities: "Riyadh, Jeddah" },
              { country: "Qatar", cities: "Doha" },
              { country: "Kuwait", cities: "Kuwait City" },
              { country: "Bahrain", cities: "Manama" },
              { country: "Oman", cities: "Muscat" },
            ].map((item) => (
              <div
                key={item.country}
                className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all hover:bg-white/15"
              >
                <div className="text-sm font-semibold text-white">{item.country}</div>
                <div className="mt-1 text-xs text-white/60">{item.cities}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Professionals Trust Muqabla
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500">
              Built for the Gulf region with security, verification, and opportunity at its core
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified Companies",
                desc: "All employers are verified with trade licenses. No spam, no scams - only real opportunities from legitimate businesses.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: Star,
                title: "Built for the GCC",
                desc: "Designed specifically for the Gulf job market with support for local industries, visa sponsorship indicators, and regional salary benchmarks.",
                color: "bg-accent/10 text-accent-dark",
              },
              {
                icon: Video,
                title: "Video-First Approach",
                desc: "Show your personality, communication skills, and professionalism. Let employers see who you really are before the interview.",
                color: "bg-green-50 text-green-600",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 p-8 transition-all hover:shadow-lg hover:shadow-gray-100/50">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Career?
          </h2>
          <p className="mb-10 text-lg text-white/70 max-w-2xl mx-auto">
            Join thousands of professionals and employers already using Muqabla
            to connect, hire, and grow across the GCC region.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="accent"
                className="w-full sm:w-auto text-base px-8 shadow-lg shadow-accent/30"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto text-base px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl bg-primary text-center text-sm font-bold leading-9 text-white shadow-sm">
                  M
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">Muqabla</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Video-first job matching platform built for the Gulf Cooperation Council region.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm">For Job Seekers</h5>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/register" className="hover:text-primary transition-colors">Create Profile</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Record Video</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm">For Employers</h5>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/register" className="hover:text-primary transition-colors">Post a Job</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Browse Candidates</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 text-sm">Regions</h5>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>UAE</li>
                <li>Saudi Arabia</li>
                <li>Qatar, Kuwait, Bahrain, Oman</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>&copy; 2025 Muqabla. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
