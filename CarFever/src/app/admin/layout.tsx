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
  FileText,
  BarChart3,
  Search as SearchIcon,
  ChevronDown,
  X,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard",         href: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "Manage Cars",       href: "/admin/cars",         icon: Car },
  { label: "Manage Blogs",      href: "/admin/blogs",        icon: FileText },
  { label: "Inspections",       href: "/admin/inspections",  icon: ShieldCheck },
  { label: "Inquiries",         href: "/admin/inquiries",    icon: MessageSquare },
  { label: "Manage Users",      href: "/admin/users",        icon: Users },
  { label: "SEO Settings",      href: "/admin/seo",          icon: SearchIcon },
  { label: "Site Settings",     href: "/admin/settings",     icon: Settings },
  { label: "Analytics",         href: "/admin/analytics",    icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [isAuthenticated,    setIsAuthenticated]    = useState(false);
  const [adminUser,          setAdminUser]          = useState<any>(null);
  const [profileOpen,        setProfileOpen]        = useState(false);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const stored = localStorage.getItem("cf_admin_user");
    if (!stored) {
      router.push("/admin/login");
    } else {
      setAdminUser(JSON.parse(stored));
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("cf_admin_user");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #0055FE", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: "#666", fontSize: 11, marginTop: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Verifying Session…</span>
      </div>
    );
  }

  const breadcrumb = pathname.split("/").filter(Boolean).slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ") || "Admin";

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", color: "#d1d5db" }}>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 240,
        background: "#141414", borderRight: "1px solid #222",
        display: "flex", flexDirection: "column", zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }}
        className="hidden lg:flex"
      >
        {/* Logo */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#0055FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Car style={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              Car<span style={{ color: "#0055FE" }}>Fever</span>
            </div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>Admin Console</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, background: "rgba(0,85,254,0.15)", color: "#0055FE", padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(0,85,254,0.3)", letterSpacing: "0.1em" }}>LIVE</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 2,
                  fontSize: 13, fontWeight: 500, textDecoration: "none",
                  transition: "all 0.15s",
                  background: active ? "rgba(0,85,254,0.12)" : "transparent",
                  color: active ? "#fff" : "#888",
                  borderLeft: active ? "3px solid #0055FE" : "3px solid transparent",
                }}
              >
                <Icon style={{ width: 16, height: 16, color: active ? "#0055FE" : "#555", flexShrink: 0 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px", borderTop: "1px solid #222" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, background: "transparent",
              border: "none", cursor: "pointer", color: "#666", fontSize: 13, fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#666"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <LogOut style={{ width: 16, height: 16 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <aside style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: 240,
          background: "#141414", borderRight: "1px solid #222",
          display: "flex", flexDirection: "column", zIndex: 50,
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Car<span style={{ color: "#0055FE" }}>Fever</span> Admin</div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
          <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10, marginBottom: 2,
                    fontSize: 13, fontWeight: 500, textDecoration: "none",
                    background: active ? "rgba(0,85,254,0.12)" : "transparent",
                    color: active ? "#fff" : "#888",
                    borderLeft: active ? "3px solid #0055FE" : "3px solid transparent",
                  }}>
                  <Icon style={{ width: 16, height: 16, color: active ? "#0055FE" : "#555" }} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: "12px", borderTop: "1px solid #222" }}>
            <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", color: "#666", fontSize: 13 }}>
              <LogOut style={{ width: 16, height: 16 }} /> Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN ── */}
      <div style={{ flex: 1, paddingLeft: 240, display: "flex", flexDirection: "column" }} className="lg:pl-[240px] pl-0">

        {/* Top bar */}
        <header style={{ height: 64, borderBottom: "1px solid #222", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(20,20,20,0.95)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 20 }}>
          
          {/* Mobile menu + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: 4 }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Admin / <span style={{ color: "#fff" }}>{breadcrumb}</span>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Bell */}
            <button style={{ position: "relative", background: "none", border: "none", padding: 8, borderRadius: 8, color: "#666", cursor: "pointer" }}>
              <Bell style={{ width: 17, height: 17 }} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "#ef4444", borderRadius: "50%" }} />
            </button>

            <div style={{ width: 1, height: 24, background: "#222" }} />

            {/* Profile */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer" }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0055FE, #00B67A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {adminUser?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="hidden md:block" style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{adminUser?.name || "Admin"}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Super Administrator</div>
                </div>
                <ChevronDown style={{ width: 14, height: 14, color: "#555" }} />
              </button>

              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 40, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #222" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{adminUser?.email || "admin@carfever.pk"}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Super Admin</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", color: "#888", fontSize: 12 }}
                    >
                      <LogOut style={{ width: 14, height: 14 }} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
