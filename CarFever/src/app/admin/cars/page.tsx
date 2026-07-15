'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, MoreHorizontal, Car as CarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { deleteCar, approveCar, rejectCar } from '@/lib/admin-actions';
import { supabase } from '@/lib/supabase';

const S = {
  btn: (color: string, bg: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: bg, color, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "opacity 0.15s" }),
  input: { width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#ddd", fontSize: 13, padding: "9px 12px 9px 38px", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" as const, textAlign: "left" as const, borderBottom: "1px solid #222", background: "#141414" },
  td: { padding: "14px 16px", borderBottom: "1px solid #1e1e1e", verticalAlign: "middle" as const, fontSize: 13 },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    approved: { bg: "rgba(0,182,122,0.15)", color: "#00B67A" },
    rejected: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
    pending:  { bg: "rgba(255,107,0,0.12)",  color: "#FF6B00" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ ...s, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>
      {status || "pending"}
    </span>
  );
}

export default function AdminCarsPage() {
  const [cars,    setCars]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [debounced, setDebounced] = useState('');
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 450);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('cars').select('id, title, brand, year, price, status, images, created_at').order('created_at', { ascending: false });
    if (debounced) q = q.ilike('title', `%${debounced}%`);
    const { data, error } = await q;
    if (error) toast.error('Failed to load cars');
    else setCars(data || []);
    setLoading(false);
  }, [debounced]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this car listing permanently?')) return;
    try { await deleteCar(id); toast.success('Deleted'); setCars(c => c.filter(x => x.id !== id)); }
    catch { toast.error('Failed to delete'); }
  };

  const handleStatus = async (id: string, s: 'approved' | 'rejected') => {
    try {
      if (s === 'approved') await approveCar(id); else await rejectCar(id);
      toast.success(`Car ${s}`);
      setCars(c => c.map(x => x.id === id ? { ...x, status: s } : x));
    } catch { toast.error('Status update failed'); }
    setMenu(null);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Car Listings</h1>
          <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Manage, approve, or remove car listings.</p>
        </div>
        <Link href="/admin/cars/new" style={S.btn("#fff", "#0055FE")}>
          <Plus style={{ width: 15, height: 15 }} /> Add New Car
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 320, marginBottom: 20 }}>
        <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#444" }} />
        <input style={S.input} placeholder="Search by title…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Car", "Price", "Status", "Added", "Actions"].map((h, i) => (
                <th key={h} style={{ ...S.th, textAlign: i === 4 ? "right" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: "#444", padding: 40 }}>Loading cars…</td></tr>
            ) : cars.length === 0 ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: "#444", padding: 40 }}>No cars found.</td></tr>
            ) : cars.map(car => (
              <tr key={car.id} style={{ transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1e1e1e")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "#252525", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {car.images?.[0]
                        ? <img src={car.images[0]} alt={car.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <CarIcon style={{ width: 20, height: 20, color: "#444" }} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#ddd", margin: 0, fontSize: 13 }}>{car.title}</p>
                      <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0" }}>{car.brand} • {car.year}</p>
                    </div>
                  </div>
                </td>
                <td style={{ ...S.td, color: "#00B67A", fontWeight: 600 }}>PKR {car.price?.toLocaleString()}</td>
                <td style={S.td}><StatusBadge status={car.status} /></td>
                <td style={{ ...S.td, color: "#444" }}>{new Date(car.created_at).toLocaleDateString()}</td>
                <td style={{ ...S.td, textAlign: "right", position: "relative" }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <button onClick={() => setMenu(menu === car.id ? null : car.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 6, borderRadius: 6 }}>
                      <MoreHorizontal style={{ width: 17, height: 17 }} />
                    </button>
                    {menu === car.id && (
                      <>
                        <div onClick={() => setMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
                        <div style={{ position: "absolute", right: 0, top: "100%", width: 160, background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 12, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 30, overflow: "hidden", marginTop: 4 }}>
                          <Link href={`/admin/cars/new?id=${car.id}`} onClick={() => setMenu(null)}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 12, color: "#bbb", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#252525")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <Edit style={{ width: 13, height: 13 }} /> Edit
                          </Link>
                          {car.status !== 'approved' && (
                            <button onClick={() => handleStatus(car.id, 'approved')}
                              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 12, color: "#00B67A", background: "none", border: "none", cursor: "pointer" }}>
                              <CheckCircle style={{ width: 13, height: 13 }} /> Approve
                            </button>
                          )}
                          {car.status !== 'rejected' && (
                            <button onClick={() => handleStatus(car.id, 'rejected')}
                              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 12, color: "#FF6B00", background: "none", border: "none", cursor: "pointer" }}>
                              <XCircle style={{ width: 13, height: 13 }} /> Reject
                            </button>
                          )}
                          <button onClick={() => handleDelete(car.id)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                            <Trash2 style={{ width: 13, height: 13 }} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
