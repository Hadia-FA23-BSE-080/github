'use client';

import { useState, useEffect } from 'react';
import { Activity, Car, Users, Eye, TrendingUp, TrendingDown, DollarSign, FileText, ShieldCheck, MessageSquare, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const S = {
  card: { background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 24 } as React.CSSProperties,
  label: { fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 },
  value: { fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "8px 0 4px" },
  badge: (color: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color, fontWeight: 600 }),
};

const quickLinks = [
  { label: "Add New Car",    href: "/admin/cars/new",    icon: Car,          color: "#0055FE" },
  { label: "Write Post",     href: "/admin/blogs/new",   icon: FileText,     color: "#00B67A" },
  { label: "View Cars",      href: "/admin/cars",        icon: Car,          color: "#FF6B00" },
  { label: "View Inquiries", href: "/admin/inquiries",   icon: MessageSquare,color: "#8B5CF6" },
];

const recentActivity = [
  { title: "New Car Listed",    desc: "Mercedes-Benz S-Class 2024 — John D.",     time: "2m ago" },
  { title: "Inquiry Received",  desc: "New inquiry for Porsche 911 GT3 RS",        time: "1h ago" },
  { title: "User Registered",   desc: "Sarah M. joined the platform",              time: "3h ago" },
  { title: "Blog Published",    desc: "\"Top 10 Luxury Cars of 2024\" is live",    time: "5h ago" },
  { title: "Inspection Done",   desc: "Honda Civic — inspection completed",         time: "8h ago" },
];

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ cars: 0, blogs: 0, users: 0, views: 0, inspections: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const [
          { count: cars },
          { count: blogs },
          { count: users },
          { count: inspections },
          { count: inquiries },
          { data: carsViews },
        ] = await Promise.all([
          supabase.from('cars').select('*', { count: 'exact', head: true }),
          supabase.from('blogs').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('inspections').select('*', { count: 'exact', head: true }),
          supabase.from('inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('cars').select('views_count'),
        ]);
        const totalViews = (carsViews || []).reduce((sum: number, c: any) => sum + (c.views_count || 0), 0);
        setStats({
          cars: cars || 0,
          blogs: blogs || 0,
          users: users || 0,
          views: totalViews,
          inspections: inspections || 0,
          inquiries: inquiries || 0,
        });
      } catch { /* noop */ }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Views",    value: loading ? "…" : stats.views.toLocaleString(),       icon: Eye,          trend: "+12.5%", up: true,  color: "#0055FE" },
    { label: "Car Listings",   value: loading ? "…" : stats.cars.toLocaleString(),        icon: Car,          trend: "+4.1%",  up: true,  color: "#FF6B00" },
    { label: "Active Users",   value: loading ? "…" : stats.users.toLocaleString(),       icon: Users,        trend: "+8.2%",  up: true,  color: "#8B5CF6" },
    { label: "Blog Posts",     value: loading ? "…" : stats.blogs.toLocaleString(),       icon: FileText,     trend: "+8.7%",  up: true,  color: "#00B67A" },
    { label: "Inspections",    value: loading ? "…" : stats.inspections.toLocaleString(), icon: ShieldCheck,  trend: "+15%",   up: true,  color: "#F59E0B" },
    { label: "Inquiries",      value: loading ? "…" : stats.inquiries.toLocaleString(),   icon: MessageSquare,trend: "+6.3%",  up: true,  color: "#EF4444" },
  ];

  // Simple bar chart data (mock)
  const chartData = months.slice(0, 7).map((m, i) => ({ label: m, value: 1200 + Math.sin(i) * 800 + i * 200 }));
  const chartMax = Math.max(...chartData.map(d => d.value));

  return (
    <div style={{ maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ ...S.card, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={S.label}>{card.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon style={{ width: 17, height: 17, color: card.color }} />
                </div>
              </div>
              <div style={S.value}>{card.value}</div>
              <span style={S.badge(card.up ? "#00B67A" : "#ef4444")}>
                {card.up ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
                {card.trend} vs last month
              </span>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 24 }}>

        {/* Bar chart */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Monthly Traffic</h3>
              <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}>Page views over the last 7 months</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180 }}>
            {chartData.map(d => (
              <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: "100%",
                    height: (d.value / chartMax) * 150,
                    background: "linear-gradient(180deg, #0055FE, rgba(0,85,254,0.3))",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 12,
                    transition: "height 0.5s ease",
                  }}
                  title={d.value.toFixed(0)}
                />
                <span style={{ fontSize: 10, color: "#444" }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 16px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0055FE", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#ddd", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</p>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.desc}</p>
                </div>
                <span style={{ fontSize: 10, color: "#444", flexShrink: 0, paddingTop: 2 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={S.card}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 16px" }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {quickLinks.map(q => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderRadius: 12,
                  background: q.color + "12", border: `1px solid ${q.color}25`,
                  textDecoration: "none", transition: "all 0.15s",
                }}
              >
                <Icon style={{ width: 18, height: 18, color: q.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{q.label}</span>
                <ArrowUpRight style={{ width: 12, height: 12, color: "#444", marginLeft: "auto" }} />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
