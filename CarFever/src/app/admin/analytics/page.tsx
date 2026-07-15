"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-sm text-zinc-400 mt-1">Detailed metrics, traffic, and performance analysis.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
            <button 
              onClick={() => setTimeRange("7days")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeRange === "7days" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setTimeRange("30days")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeRange === "30days" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setTimeRange("12months")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeRange === "12months" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              12 Months
            </button>
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Page Views</p>
              <h3 className="text-3xl font-bold text-white mt-2">142,504</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-electric-blue/10 text-electric-blue">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-bold">+24.5%</span>
            <span className="text-zinc-600">vs previous period</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Unique Visitors</p>
              <h3 className="text-3xl font-bold text-white mt-2">84,120</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-bold">+12.2%</span>
            <span className="text-zinc-600">vs previous period</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-white mt-2">3.8%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-bold">+1.2%</span>
            <span className="text-zinc-600">vs previous period</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Avg. Session Duration</p>
              <h3 className="text-3xl font-bold text-white mt-2">4m 12s</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-red-400">
            <span className="font-bold">-0.5%</span>
            <span className="text-zinc-600">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Last 6 Months (in Millions PKR)</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 border-white/10 text-zinc-400 hover:text-white">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filter
            </Button>
          </div>
          
          <div className="relative h-64 w-full bg-white/[0.02] rounded-xl border border-white/[0.05] p-4 flex flex-col justify-between mt-auto">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
              <div className="border-b border-dashed border-white/10 w-full flex items-center justify-between"><span className="-translate-x-6 text-[10px] text-zinc-500">5M</span></div>
              <div className="border-b border-dashed border-white/10 w-full flex items-center justify-between"><span className="-translate-x-6 text-[10px] text-zinc-500">4M</span></div>
              <div className="border-b border-dashed border-white/10 w-full flex items-center justify-between"><span className="-translate-x-6 text-[10px] text-zinc-500">2M</span></div>
              <div className="w-full flex items-center justify-between"><span className="-translate-x-6 text-[10px] text-zinc-500">0</span></div>
            </div>

            {/* SVG Area Chart */}
            <div className="relative w-full h-44 mt-4 ml-2">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <path
                  d="M0,120 Q50,90 100,100 T200,60 T300,80 T400,30 T500,20 L500,150 L0,150 Z"
                  fill="url(#emeraldGlow)"
                  opacity="0.2"
                />
                <path
                  d="M0,120 Q50,90 100,100 T200,60 T300,80 T400,30 T500,20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
                {/* Data points */}
                <circle cx="0" cy="120" r="4" fill="#10b981" />
                <circle cx="100" cy="100" r="4" fill="#10b981" />
                <circle cx="200" cy="60" r="4" fill="#10b981" />
                <circle cx="300" cy="80" r="4" fill="#10b981" />
                <circle cx="400" cy="30" r="4" fill="#10b981" />
                <circle cx="500" cy="20" r="4" fill="#10b981" />
                
                <defs>
                  <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-zinc-500 font-bold mt-2 pl-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Blog Views Bar Chart */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Blog Traffic</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Views per day (Last 7 Days)</p>
            </div>
          </div>
          
          <div className="relative h-64 w-full bg-white/[0.02] rounded-xl border border-white/[0.05] p-6 flex flex-col justify-end mt-auto">
             <div className="flex items-end justify-between h-44 w-full">
                {/* Simulated Bars */}
                {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{height * 100}</div>
                    <div 
                      className="w-8 sm:w-12 bg-gradient-to-t from-electric-blue/20 to-electric-blue rounded-t-sm group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
             </div>
             
             <div className="flex justify-between w-full text-[10px] text-zinc-500 font-bold mt-4 pt-4 border-t border-white/10">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
             </div>
          </div>
        </div>

        {/* Inspection Status Pie Chart */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Inspection Status</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Distribution of all inspection requests</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-full">
            <div className="relative w-48 h-48 shrink-0">
              {/* Simulated CSS Pie Chart using conic-gradient */}
              <div 
                className="w-full h-full rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                style={{
                  background: `conic-gradient(
                    #10b981 0% 45%, 
                    #3b82f6 45% 75%, 
                    #ef4444 75% 90%, 
                    #f59e0b 90% 100%
                  )`
                }}
              />
              <div className="absolute inset-0 m-auto w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">342</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Total</span>
              </div>
            </div>

            <div className="space-y-4 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm text-zinc-300">Completed</span>
                </div>
                <span className="font-bold text-white">45%</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-electric-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-sm text-zinc-300">Scheduled</span>
                </div>
                <span className="font-bold text-white">30%</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-neon-red shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-sm text-zinc-300">Cancelled</span>
                </div>
                <span className="font-bold text-white">15%</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-sm text-zinc-300">Pending</span>
                </div>
                <span className="font-bold text-white">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Cars */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Top Performing Cars</h3>
              <p className="text-xs text-zinc-500 mt-0.5">By views and inquiries</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Honda Civic Oriel 1.8", views: "12.5K", inquiries: 45, trend: "+12%" },
              { name: "Toyota Fortuner Legender", views: "9.2K", inquiries: 32, trend: "+8%" },
              { name: "KIA Sportage Alpha", views: "8.1K", inquiries: 28, trend: "+5%" },
              { name: "Suzuki Swift GLX CVT", views: "6.5K", inquiries: 15, trend: "-2%" },
            ].map((car, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{car.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-zinc-400" /> {car.views}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-zinc-400" /> {car.inquiries} leads</span>
                  </div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${car.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {car.trend}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 border-white/10 text-zinc-400 hover:text-white">
            View All Performance Data
          </Button>
        </div>

      </div>
    </div>
  );
}
