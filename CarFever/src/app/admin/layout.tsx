"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Car,
  LayoutDashboard,
  Users,
  ShieldCheck,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Cars", href: "/admin/cars", icon: Car },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Inspections", href: "/admin/inspections", icon: ShieldCheck },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cf_admin_user");
      if (!stored) {
        router.push("/admin/login");
      } else {
        setAdminUser(JSON.parse(stored));
        setIsAuthenticated(true);
      }
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("cf_admin_user");
    router.push("/admin/login");
  };

  // If on login page, render children directly without dashboard shell or authentication checks
  // This must be placed after all hooks have been declared to prevent Hook Mismatch error in React
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated yet, render a dark loading page to prevent content flash
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-neon-red border-t-transparent animate-spin" />
        <span className="text-zinc-500 text-xs mt-3 uppercase tracking-widest">Verifying Admin Session...</span>
      </div>
    );
  }

  // Get current breadcrumb
  const currentTab = pathname.split("/").pop() || "Admin";
  const formattedBreadcrumb = currentTab.charAt(0).toUpperCase() + currentTab.slice(1);

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-300">
      
      {/* ─── SIDEBAR ─── */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-white/10 flex flex-col justify-between z-30">
        <div>
          {/* Logo Area */}
          <div className="h-18 flex items-center gap-3 px-6 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-neon-red flex items-center justify-center shrink-0">
              <Car className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-none">
                Car<span className="text-neon-red">Fever</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase leading-none mt-1">
                Admin Console
              </span>
            </div>
            <span className="ml-auto text-[9px] font-bold bg-neon-red/10 text-neon-red px-1.5 py-0.5 rounded border border-neon-red/20 uppercase tracking-widest">
              Live
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "text-white bg-white/5 border-l-2 border-neon-red"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-neon-red" : "text-zinc-400 group-hover:text-white"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-neon-red hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4.5 h-4.5 text-zinc-400 group-hover:text-neon-red" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT WRAPPER ─── */}
      <div className="flex-1 pl-64 flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-18 border-b border-white/10 px-8 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            <span>Admin</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-bold">{formattedBreadcrumb}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            
            {/* Search Placeholder */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search database..."
                disabled
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-zinc-400 placeholder-zinc-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-red rounded-full animate-pulse" />
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-red to-electric-blue flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-white leading-none">Admin User</p>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-none">Super Administrator</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl py-1.5 z-40 animate-in slide-in-from-top-2 fade-in duration-150">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">admin@carfever.com</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Role: Super Admin</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-300 hover:text-neon-red hover:bg-white/5 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
