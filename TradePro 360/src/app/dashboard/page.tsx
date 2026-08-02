"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Wrench,
  LayoutDashboard,
  Users,
  PoundSterling,
  Briefcase,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, TRADE_LABELS } from "@/lib/utils";

interface Job {
  id: string;
  reference: string;
  title: string;
  status: string;
  tradeType: string;
  totalCost: number;
  paymentStatus: string;
  source: string;
  createdAt: string;
  customer: { name: string; email: string };
  engineer: { name: string } | null;
}

interface Stats {
  total: number;
  pending: number;
  completed: number;
  revenue: number;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  tradeType: string;
  primaryColor: string;
  phone: string;
  email: string;
  city: string;
  _count: { jobs: number; engineers: number };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const businessSlug = searchParams.get("business") ?? "apex-trades-london";

  const [business, setBusiness] = useState<Business | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const bizRes = await fetch(`/api/business?slug=${businessSlug}`);
    const biz = await bizRes.json();
    if (!biz.id) return;
    setBusiness(biz);

    const [jobsRes, statsRes] = await Promise.all([
      fetch(`/api/jobs?businessId=${biz.id}`),
      fetch(`/api/business/stats?businessId=${biz.id}`),
    ]);
    setJobs(await jobsRes.json());
    setStats(await statsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [businessSlug]);

  const primaryColor = business?.primaryColor ?? "#2563eb";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{business?.name}</p>
              <p className="text-xs text-slate-500">White-Label Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href={`/book?business=${businessSlug}&source=gmb`}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              GMB Widget <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Jobs",
              value: stats?.total ?? 0,
              icon: Briefcase,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Active Jobs",
              value: stats?.pending ?? 0,
              icon: LayoutDashboard,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Completed",
              value: stats?.completed ?? 0,
              icon: Users,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Revenue",
              value: formatCurrency(stats?.revenue ?? 0),
              icon: PoundSterling,
              color: "text-purple-600 bg-purple-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">All Bookings</h2>
            <span className="text-sm text-slate-500">{jobs.length} jobs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Job</th>
                  <th className="px-6 py-3 font-medium">Engineer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No bookings yet. Share your GMB widget link to get started.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs">{job.reference}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{job.customer.name}</p>
                        <p className="text-xs text-slate-400">{job.customer.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p>{job.title}</p>
                        <p className="text-xs text-slate-400">
                          {TRADE_LABELS[job.tradeType]}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {job.engineer?.name ?? (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(job.totalCost)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="uppercase text-xs font-medium text-slate-500">
                          {job.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/track/${job.id}`}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Track
                          </Link>
                          <Link
                            href={`/portal/${job.id}`}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Portal
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Google Business Profile Widget URL</h3>
          </div>
          <p className="text-blue-700/80 text-sm mb-4">
            Copy and paste this link as your &ldquo;Book a Free Quote&rdquo; button on your Google Business Profile to get direct bookings.
          </p>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              readOnly 
              value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book?source=gmb&business=${businessSlug}`}
              className="flex-1 bg-white border border-blue-200 text-slate-700 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book?source=gmb&business=${businessSlug}`);
                alert("Link copied to clipboard!");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
