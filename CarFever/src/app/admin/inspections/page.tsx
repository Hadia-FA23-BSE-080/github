"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Calendar, Clock, Phone, Check, X, Eye, Car, MapPin, Trash2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { updateInspectionStatus, deleteInspection } from "@/lib/admin-actions";
import { toast } from "sonner";

type InspStatus = "pending" | "scheduled" | "completed" | "cancelled";
type InspPlan = "basic" | "standard" | "premium";

interface Inspection {
  id: string;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  customer_name: string;
  customer_phone: string;
  plan: InspPlan;
  plan_price: number;
  address: string;
  scheduled_date: string;
  time_slot: string;
  status: InspStatus;
  created_at: string;
}

export default function InspectionsAdminPage() {
  const [items, setItems] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fetch from Supabase
  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const { data, error } = await supabase
          .from('inspections')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Failed to fetch inspections:', error);
        toast.error('Failed to load inspections');
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  const stats = {
    scheduled: items.filter(i => i.status === "scheduled").length,
    completed: items.filter(i => i.status === "completed").length,
    cancelled: items.filter(i => i.status === "cancelled").length,
    pending: items.filter(i => i.status === "pending").length,
  };

  const mark = async (id: string, s: InspStatus) => {
    try {
      await updateInspectionStatus(id, s);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: s } : i));
      toast.success(`Inspection ${s}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInspection(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Inspection deleted');
    } catch (error) {
      toast.error('Failed to delete inspection');
    }
  };

  const statCards = [
    { label: "Pending", value: stats.pending, color: "#FF6B00" },
    { label: "Scheduled", value: stats.scheduled, color: "#0055FE" },
    { label: "Completed", value: stats.completed, color: "#00B67A" },
    { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
  ];

  const statusStyle: Record<InspStatus, { bg: string; color: string }> = {
    pending: { bg: "rgba(255,107,0,0.12)", color: "#FF6B00" },
    scheduled: { bg: "rgba(0,85,254,0.12)", color: "#0055FE" },
    completed: { bg: "rgba(0,182,122,0.12)", color: "#00B67A" },
    cancelled: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
  };

  const planStyle: Record<InspPlan, { bg: string; color: string }> = {
    basic: { bg: "rgba(100,100,100,0.15)", color: "#888" },
    standard: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
    premium: { bg: "rgba(139,92,246,0.12)", color: "#8B5CF6" },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;

  function Chip({ label, style }: { label: string; style: { bg: string; color: string } }) {
    return (
      <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", background: style.bg, color: style.color }}>
        {label}
      </span>
    );
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Inspection Bookings</h1>
        <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Manage all vehicle inspection appointments.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {s.label === "Pending" && <Clock style={{ width: 18, height: 18, color: s.color }} />}
              {s.label === "Scheduled" && <Clock style={{ width: 18, height: 18, color: s.color }} />}
              {s.label === "Completed" && <Check style={{ width: 18, height: 18, color: s.color }} />}
              {s.label === "Cancelled" && <X style={{ width: 18, height: 18, color: s.color }} />}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: "2px 0 0" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#444" }}>
          <div style={{ display: "inline-block", width: 40, height: 40, border: "3px solid #2a2a2a", borderTopColor: "#0055FE", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: 16, fontSize: 14 }}>Loading inspections...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#444" }}>
          <ShieldCheck style={{ width: 48, height: 48, color: "#333", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14 }}>No inspection bookings yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(ins => (
            <div key={ins.id} style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,85,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck style={{ width: 18, height: 18, color: "#0055FE" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#ddd" }}>{ins.make} {ins.model} ({ins.year})</span>
                    <Chip label={ins.plan} style={planStyle[ins.plan]} />
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
                    {[
                      { icon: Car, text: ins.registration_number },
                      { icon: Calendar, text: formatDate(ins.scheduled_date) },
                      { icon: Clock, text: ins.time_slot },
                    ].map(({ icon: Icon, text }) => (
                      <span key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#555" }}>
                        <Icon style={{ width: 11, height: 11 }} />{text}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <Chip label={ins.status} style={statusStyle[ins.status]} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#00B67A" }}>{formatPrice(ins.plan_price)}</span>
                  <button onClick={() => setExpanded(expanded === ins.id ? null : ins.id)}
                    style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a", color: "#666", cursor: "pointer" }}>
                    <Eye style={{ width: 14, height: 14 }} />
                  </button>
                  {(ins.status === "pending" || ins.status === "scheduled") && <>
                    <button onClick={() => mark(ins.id, "completed")} title="Mark Complete"
                      style={{ padding: 8, borderRadius: 8, background: "rgba(0,182,122,0.1)", border: "1px solid rgba(0,182,122,0.2)", color: "#00B67A", cursor: "pointer" }}>
                      <Check style={{ width: 14, height: 14 }} />
                    </button>
                    <button onClick={() => mark(ins.id, "cancelled")} title="Cancel"
                      style={{ padding: 8, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </>}
                  <button onClick={() => handleDelete(ins.id)} title="Delete"
                    style={{ padding: 8, borderRadius: 8, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
              {expanded === ins.id && (
                <div style={{ borderTop: "1px solid #222", padding: "14px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Customer</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#ddd", margin: 0 }}>{ins.customer_name}</p>
                    <p style={{ fontSize: 12, color: "#555", margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone style={{ width: 11, height: 11 }} />{ins.customer_phone}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Location</p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin style={{ width: 11, height: 11, color: "#ef4444" }} />{ins.address}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Booking ID</p>
                    <p style={{ fontSize: 12, fontFamily: "monospace", color: "#0055FE", margin: 0 }}>{ins.id}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
