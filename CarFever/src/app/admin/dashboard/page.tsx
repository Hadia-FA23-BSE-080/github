"use client";

import { useState } from "react";
import {
  Car,
  Users,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Check,
  X,
  Edit,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  glowColor: string;
}

function StatCard({ title, value, change, icon: Icon, accentColor, glowColor }: StatCardProps) {
  return (
    <div className={`bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:scale-102 hover:border-${accentColor}/30 transition-all duration-300 relative overflow-hidden group`}>
      <div className={`absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-${accentColor}/5 blur-2xl group-hover:bg-${accentColor}/10 transition-all`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-${accentColor} group-hover:glow-${glowColor} transition-all`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 text-xs">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-emerald-500 font-bold">{change}</span>
        <span className="text-zinc-600">vs last month</span>
      </div>
    </div>
  );
}

interface Submission {
  id: string;
  title: string;
  seller: string;
  email: string;
  date: string;
  price: string;
  status: "Pending" | "Approved" | "Rejected";
  image: string;
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    title: "Honda Civic Oriel 1.8",
    seller: "Kamran Shah",
    email: "kamran@gmail.com",
    date: "10 mins ago",
    price: "PKR 62.5 Lacs",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=150&h=100&q=80",
  },
  {
    id: "2",
    title: "Toyota Fortuner Legender",
    seller: "Zeeshan Ali",
    email: "zeeshan@hotmail.com",
    date: "2 hours ago",
    price: "PKR 185.0 Lacs",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=150&h=100&q=80",
  },
  {
    id: "3",
    title: "KIA Sportage Alpha",
    seller: "Ayesha Malik",
    email: "ayesha@yahoo.com",
    date: "1 day ago",
    price: "PKR 76.0 Lacs",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=150&h=100&q=80",
  },
  {
    id: "4",
    title: "Suzuki Swift GLX CVT",
    seller: "Muhammad Bilal",
    email: "bilal@gmail.com",
    date: "2 days ago",
    price: "PKR 44.5 Lacs",
    status: "Rejected",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=150&h=100&q=80",
  },
];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);

  const handleStatusChange = (id: string, newStatus: "Approved" | "Rejected") => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-zinc-400 mt-1">Real-time control panel & analytics metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" disabled>
            Export Report
          </Button>
          <Button className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle">
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* Grid: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Active Cars"
          value="1,248"
          change="+12.5%"
          icon={Car}
          accentColor="neon-red"
          glowColor="red"
        />
        <StatCard
          title="Total Registered Users"
          value="8,924"
          change="+8.2%"
          icon={Users}
          accentColor="electric-blue"
          glowColor="blue"
        />
        <StatCard
          title="Pending Inspections"
          value="42"
          change="+14.1%"
          icon={ShieldCheck}
          accentColor="amber-500"
          glowColor="amber"
        />
        <StatCard
          title="Revenue This Month"
          value="PKR 4.2M"
          change="+19.8%"
          icon={DollarSign}
          accentColor="emerald-500"
          glowColor="emerald"
        />
      </div>

      {/* Graph Area & Small list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Line Chart Placeholder */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Cars Listed vs Sold</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-red inline-block" />
                  <span className="text-zinc-400">Cars Listed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-electric-blue inline-block" />
                  <span className="text-zinc-400">Cars Sold</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mb-6">Visual overview for the past 30 days period</p>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="relative h-64 w-full bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 flex flex-col justify-between">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
              <div className="border-b border-dashed border-white/10 w-full" />
              <div className="border-b border-dashed border-white/10 w-full" />
              <div className="border-b border-dashed border-white/10 w-full" />
              <div className="w-full" />
            </div>

            {/* SVG Line / Area Graph */}
            <div className="relative w-full h-44 mt-4">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                {/* Red Glow Area (Listed) */}
                <path
                  d="M0,130 Q50,70 100,90 T200,40 T300,70 T400,20 T500,10 L500,150 L0,150 Z"
                  fill="url(#redGlow)"
                  opacity="0.15"
                />
                {/* Blue Glow Area (Sold) */}
                <path
                  d="M0,140 Q50,110 100,120 T200,90 T300,100 T400,60 T500,50 L500,150 L0,150 Z"
                  fill="url(#blueGlow)"
                  opacity="0.15"
                />

                {/* Red Line (Listed) */}
                <path
                  d="M0,130 Q50,70 100,90 T200,40 T300,70 T400,20 T500,10"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                />

                {/* Blue Line (Sold) */}
                <path
                  d="M0,140 Q50,110 100,120 T200,90 T300,100 T400,60 T500,50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />

                {/* Custom Gradient Definitions */}
                <defs>
                  <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold mt-2 px-1">
              <span>June 10</span>
              <span>June 17</span>
              <span>June 24</span>
              <span>July 01</span>
              <span>July 08</span>
            </div>
          </div>
        </div>

        {/* Action Panel / Shortcuts */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Quick Commands</h3>
            <p className="text-xs text-zinc-500 mb-6">Common administrative actions</p>
          </div>

          <div className="space-y-3.5">
            <button className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:border-neon-red/30 rounded-xl transition-all group text-left">
              <div>
                <p className="text-xs font-bold text-white group-hover:text-neon-red transition-colors">Add New Vehicle</p>
                <p className="text-[10px] text-zinc-500 mt-1">Create official marketplace listing</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-neon-red transition-all" />
            </button>

            <button className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:border-electric-blue/30 rounded-xl transition-all group text-left">
              <div>
                <p className="text-xs font-bold text-white group-hover:text-electric-blue transition-colors">Schedule Inspection</p>
                <p className="text-[10px] text-zinc-500 mt-1">Assign inspector & date slots</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-electric-blue transition-all" />
            </button>

            <button className="w-full flex items-center justify-between p-3.5 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition-all group text-left">
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">Verify User Accounts</p>
                <p className="text-[10px] text-zinc-500 mt-1">Review pending KYC requests</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-500 transition-all" />
            </button>
          </div>

          <div className="pt-6 border-t border-white/5 text-center mt-6">
            <a href="/" target="_blank" className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium">
              View Public Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Submissions Queue */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Car Submissions</h3>
            <p className="text-xs text-zinc-500 mt-1">Review & moderate seller listings</p>
          </div>
          <Badge className="bg-white/5 border border-white/10 text-zinc-400">
            {submissions.filter((s) => s.status === "Pending").length} Action Required
          </Badge>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                <th className="pb-4 font-semibold">Vehicle</th>
                <th className="pb-4 font-semibold">Seller</th>
                <th className="pb-4 font-semibold">Asking Price</th>
                <th className="pb-4 font-semibold">Date</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {submissions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 flex items-center gap-3.5">
                    <img
                      src={sub.image}
                      alt={sub.title}
                      className="w-16 h-11 rounded-lg object-cover bg-zinc-800 border border-white/5 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white">{sub.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">ID: CF-L-{sub.id}048</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-white">{sub.seller}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{sub.email}</p>
                  </td>
                  <td className="py-4 font-semibold text-white">{sub.price}</td>
                  <td className="py-4 text-xs text-zinc-400">{sub.date}</td>
                  <td className="py-4">
                    <Badge
                      className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                        sub.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : sub.status === "Rejected"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(sub.id, "Approved")}
                            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Approve Listing"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(sub.id, "Rejected")}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            title="Reject Listing"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setSubmissions((prev) =>
                              prev.map((s) => (s.id === sub.id ? { ...s, status: "Pending" } : s))
                            )
                          }
                          className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Edit Submission details"
                        disabled
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
