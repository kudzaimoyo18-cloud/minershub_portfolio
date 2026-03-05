"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  Compass,
  Search,
  FileText,
  Bookmark,
  User,
  LayoutDashboard,
  Briefcase,
  LogOut,
  Loader2,
  Video,
  PlusCircle,
  ChevronRight,
  Bot,
  CreditCard,
  Sparkles,
} from "lucide-react";

interface NavItem {
  href: string;
  icon: typeof Compass;
  label: string;
  badge?: string;
}

const candidateNavItems: NavItem[] = [
  { href: "/feed", icon: Compass, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/ai-agent", icon: Bot, label: "AI Agent", badge: "PRO" },
  { href: "/applications", icon: FileText, label: "Applications" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/subscription", icon: CreditCard, label: "Subscription" },
  { href: "/profile", icon: User, label: "Profile" },
];

const employerNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jobs/manage", icon: Briefcase, label: "My Jobs" },
  { href: "/jobs/create", icon: PlusCircle, label: "Post Job" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isInitialized, initialize, signOut } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
            M
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const navItems =
    user.type === "employer" ? employerNavItems : candidateNavItems;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-gray-50/80">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-gray-200/80 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-sm">
            M
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Muqabla</span>
            <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded">
              {user.type === "employer" ? "Hire" : "Jobs"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 mt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-gradient-to-r from-primary/10 to-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50/80">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-sm shadow-sm">
              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.full_name || "User"}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200/80 bg-white px-4 lg:hidden shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-sm">
              M
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Muqabla</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-xs shadow-sm">
            {user.full_name?.[0]?.toUpperCase() || "U"}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile Bottom Tabs */}
        <nav className="flex border-t border-gray-200/80 bg-white lg:hidden shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                {item.label}
                {isActive && (
                  <div className="h-0.5 w-4 rounded-full bg-primary mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
