"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Check,
  X,
  Eye,
  Car,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type InspectionStatus = "Scheduled" | "Completed" | "Cancelled";
type InspectionPlan = "Basic" | "Standard" | "Premium";

interface Inspection {
  id: string;
  carTitle: string;
  carYear: number;
  regNumber: string;
  customerName: string;
  customerPhone: string;
  plan: InspectionPlan;
  planPrice: string;
  address: string;
  date: string;
  timeSlot: string;
  status: InspectionStatus;
}

const INSPECTIONS: Inspection[] = [
  { id: "INS-2401", carTitle: "Honda Civic Turbo", carYear: 2024, regNumber: "LEH-5643", customerName: "Kamran Shah", customerPhone: "+92 300 1112233", plan: "Premium", planPrice: "PKR 8,500", address: "DHA Phase 5, Lahore", date: "Jul 12, 2026", timeSlot: "10:00 AM – 12:00 PM", status: "Scheduled" },
  { id: "INS-2402", carTitle: "Toyota Corolla GLi", carYear: 2023, regNumber: "ISB-8812", customerName: "Ali Hassan", customerPhone: "+92 321 4455667", plan: "Standard", planPrice: "PKR 5,500", address: "F-10 Markaz, Islamabad", date: "Jul 11, 2026", timeSlot: "2:00 PM – 4:00 PM", status: "Scheduled" },
  { id: "INS-2403", carTitle: "KIA Sportage AWD", carYear: 2024, regNumber: "KHI-1290", customerName: "Nadia Farooq", customerPhone: "+92 333 7788990", plan: "Premium", planPrice: "PKR 8,500", address: "Clifton Block 5, Karachi", date: "Jul 10, 2026", timeSlot: "10:00 AM – 12:00 PM", status: "Completed" },
  { id: "INS-2404", carTitle: "Suzuki Alto VXR", carYear: 2023, regNumber: "LHR-4421", customerName: "Bilal Ahmed", customerPhone: "+92 345 1122334", plan: "Basic", planPrice: "PKR 3,500", address: "Gulberg III, Lahore", date: "Jul 09, 2026", timeSlot: "4:00 PM – 6:00 PM", status: "Completed" },
  { id: "INS-2405", carTitle: "Hyundai Tucson GLS", carYear: 2023, regNumber: "RWP-6678", customerName: "Zeeshan Malik", customerPhone: "+92 312 9988776", plan: "Standard", planPrice: "PKR 5,500", address: "Bahria Town Phase 4, Rawalpindi", date: "Jul 08, 2026", timeSlot: "10:00 AM – 12:00 PM", status: "Cancelled" },
  { id: "INS-2406", carTitle: "MG HS Essence", carYear: 2024, regNumber: "ISB-3345", customerName: "Sara Qureshi", customerPhone: "+92 300 5566778", plan: "Premium", planPrice: "PKR 8,500", address: "G-11 Markaz, Islamabad", date: "Jul 13, 2026", timeSlot: "2:00 PM – 4:00 PM", status: "Scheduled" },
];

const statusColor: Record<InspectionStatus, string> = {
  Scheduled: "bg-electric-blue/10 text-electric-blue border-electric-blue/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const planColor: Record<InspectionPlan, string> = {
  Basic: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Standard: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function InspectionsAdminPage() {
  const [inspections, setInspections] = useState<Inspection[]>(INSPECTIONS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = {
    scheduled: inspections.filter((i) => i.status === "Scheduled").length,
    completed: inspections.filter((i) => i.status === "Completed").length,
    cancelled: inspections.filter((i) => i.status === "Cancelled").length,
  };

  const handleMarkComplete = (id: string) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Completed" as InspectionStatus } : i))
    );
  };

  const handleCancel = (id: string) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Cancelled" as InspectionStatus } : i))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Inspection Bookings</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage and track all vehicle inspection appointments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-electric-blue/10 border border-electric-blue/20">
            <Clock className="w-5 h-5 text-electric-blue" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Scheduled</p>
            <p className="text-2xl font-extrabold text-electric-blue">{stats.scheduled}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Completed</p>
            <p className="text-2xl font-extrabold text-emerald-400">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <X className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Cancelled</p>
            <p className="text-2xl font-extrabold text-red-400">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Inspection Cards */}
      <div className="space-y-4">
        {inspections.map((ins) => (
          <div
            key={ins.id}
            className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
          >
            {/* Main Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-electric-blue" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white">{ins.carTitle} ({ins.carYear})</p>
                    <Badge className={`text-[9px] font-bold px-2 py-0.5 uppercase border ${planColor[ins.plan]}`}>
                      {ins.plan}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1"><Car className="w-3 h-3" />{ins.regNumber}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ins.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ins.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge className={`text-[10px] font-bold px-2.5 py-1 uppercase border ${statusColor[ins.status]}`}>
                  {ins.status}
                </Badge>
                <span className="text-sm font-bold text-white">{ins.planPrice}</span>
                <button
                  onClick={() => setExpandedId(expandedId === ins.id ? null : ins.id)}
                  className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {ins.status === "Scheduled" && (
                  <>
                    <button
                      onClick={() => handleMarkComplete(ins.id)}
                      className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                      title="Mark Complete"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(ins.id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === ins.id && (
              <div className="px-5 pb-5 pt-0 border-t border-white/[0.06] mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Customer</p>
                    <p className="text-sm font-semibold text-white">{ins.customerName}</p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{ins.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                    <p className="text-sm text-zinc-300 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neon-red" />{ins.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Booking ID</p>
                    <p className="text-sm font-mono text-electric-blue">{ins.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
