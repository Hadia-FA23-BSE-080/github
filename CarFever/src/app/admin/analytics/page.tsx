"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Car,
  MessageSquare,
  ShieldCheck,
  FileText,
  ExternalLink,
  Settings,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllUsers } from "@/lib/admin-actions";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface RealStats {
  totalUsers: number;
  totalCars: number;
  approvedCars: number;
  pendingCars: number;
  totalInquiries: number;
  totalInspections: number;
  totalBlogs: number;
  publishedBlogs: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<RealStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();

        // Fetch all counts in parallel
        const [users, allCars, approvedCars, pendingCars, inquiries, inspections, allBlogs, publishedBlogs] =
          await Promise.all([
            fetchAllUsers(),
            supabase.from("cars").select("id", { count: "exact", head: true }),
            supabase.from("cars").select("id", { count: "exact", head: true }).eq("status", "approved"),
            supabase.from("cars").select("id", { count: "exact", head: true }).eq("status", "pending"),
            supabase.from("inquiries").select("id", { count: "exact", head: true }),
            supabase.from("inspections").select("id", { count: "exact", head: true }),
            supabase.from("blogs").select("id", { count: "exact", head: true }),
            supabase.from("blogs").select("id", { count: "exact", head: true }).eq("status", "published"),
          ]);

        setStats({
          totalUsers: users.length,
          totalCars: allCars.count ?? 0,
          approvedCars: approvedCars.count ?? 0,
          pendingCars: pendingCars.count ?? 0,
          totalInquiries: inquiries.count ?? 0,
          totalInspections: inspections.count ?? 0,
          totalBlogs: allBlogs.count ?? 0,
          publishedBlogs: publishedBlogs.count ?? 0,
        });

        // Check if GA ID is in env
        const ga = process.env.NEXT_PUBLIC_GA_ID;
        setGaId(ga ?? null);
      } catch (err) {
        console.error("Analytics load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const StatCard = ({
    label,
    value,
    sub,
    icon: Icon,
    color,
    bgColor,
  }: {
    label: string;
    value: number | string;
    sub?: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-2">
            {loading ? (
              <span className="inline-block w-12 h-8 bg-zinc-700 rounded animate-pulse" />
            ) : (
              value
            )}
          </h3>
          {sub && !loading && (
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-sm text-zinc-400 mt-1">Real-time platform statistics from your database.</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Google Analytics Status Card */}
      <div className={`border rounded-2xl p-5 flex items-start gap-4 ${
        gaId
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-amber-500/5 border-amber-500/20"
      }`}>
        <div className={`p-2 rounded-xl shrink-0 ${gaId ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
          {gaId
            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            : <AlertCircle className="w-5 h-5 text-amber-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${gaId ? "text-emerald-400" : "text-amber-400"}`}>
            {gaId ? `Google Analytics Connected: ${gaId}` : "Google Analytics Not Connected"}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {gaId
              ? "Your website is tracking visitors. View detailed traffic reports in your Google Analytics dashboard."
              : "To track real website traffic, add your GA4 Measurement ID (e.g. G-XXXXXXXXXX) to your .env.local file as NEXT_PUBLIC_GA_ID=G-XXXXXXXX, then restart the server."
            }
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {gaId ? (
            <a
              href={`https://analytics.google.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open GA Dashboard
            </a>
          ) : (
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Setup
            </Link>
          )}
        </div>
      </div>

      {/* Real Stats Grid */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Platform Statistics — Live from Database</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Registered Users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            label="Total Listings"
            value={stats?.totalCars ?? 0}
            sub={`${stats?.approvedCars ?? 0} approved · ${stats?.pendingCars ?? 0} pending`}
            icon={Car}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
          />
          <StatCard
            label="Inquiries"
            value={stats?.totalInquiries ?? 0}
            icon={MessageSquare}
            color="text-orange-400"
            bgColor="bg-orange-500/10"
          />
          <StatCard
            label="Inspections"
            value={stats?.totalInspections ?? 0}
            icon={ShieldCheck}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
          />
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-teal-500/10">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Blog Content</h3>
              <p className="text-xs text-zinc-500">Published vs Draft</p>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="h-16 bg-zinc-800 rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Published Posts</span>
                  <span className="text-sm font-bold text-emerald-400">{stats?.publishedBlogs ?? 0}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: stats?.totalBlogs ? `${((stats.publishedBlogs / stats.totalBlogs) * 100).toFixed(0)}%` : "0%" }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Draft Posts</span>
                  <span className="text-sm font-bold text-amber-400">{(stats?.totalBlogs ?? 0) - (stats?.publishedBlogs ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-sm font-semibold text-zinc-300">Total Posts</span>
                  <span className="text-sm font-bold text-white">{stats?.totalBlogs ?? 0}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Car Listings breakdown */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Car Listings Breakdown</h3>
              <p className="text-xs text-zinc-500">Approval status overview</p>
            </div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="h-16 bg-zinc-800 rounded-xl animate-pulse" />
            ) : (
              <>
                {[
                  { label: "Approved", value: stats?.approvedCars ?? 0, color: "bg-emerald-500", textColor: "text-emerald-400" },
                  { label: "Pending Review", value: stats?.pendingCars ?? 0, color: "bg-amber-500", textColor: "text-amber-400" },
                  { label: "Total Listings", value: stats?.totalCars ?? 0, color: "bg-blue-500", textColor: "text-blue-400" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-zinc-400">{item.label}</span>
                      <span className={`text-sm font-bold ${item.textColor}`}>{item.value}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: stats?.totalCars ? `${Math.min(100, (item.value / stats.totalCars) * 100).toFixed(0)}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* GA Traffic Info Box */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Website Traffic</h3>
            <p className="text-xs text-zinc-500">Page views, sessions & visitors — powered by Google Analytics</p>
          </div>
        </div>
        {gaId ? (
          <div className="text-center py-8">
            <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">GA4 is active and collecting data!</p>
            <p className="text-xs text-zinc-500 mt-1 mb-4">View page views, sessions, bounce rate and more in your Google Analytics dashboard.</p>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0055FE] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Google Analytics
            </a>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Google Analytics not configured</p>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Add <code className="bg-white/5 px-1.5 py-0.5 rounded text-amber-300">NEXT_PUBLIC_GA_ID=G-XXXXXXXX</code> to your <strong>.env.local</strong> file
            </p>
            <ol className="text-xs text-zinc-500 text-left max-w-sm mx-auto space-y-1 mb-4">
              <li>1. Go to <a href="https://analytics.google.com/" target="_blank" className="text-blue-400 underline">analytics.google.com</a> and create a GA4 property</li>
              <li>2. Copy your Measurement ID (format: G-XXXXXXXXXX)</li>
              <li>3. Open <code className="text-amber-300">.env.local</code> in your project and add: <code className="text-amber-300">NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX</code></li>
              <li>4. Restart the dev server (<code className="text-amber-300">npm run dev</code>)</li>
            </ol>
          </div>
        )}
      </div>

    </div>
  );
}
