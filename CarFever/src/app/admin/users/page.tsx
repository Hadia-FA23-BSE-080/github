"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Users as UsersIcon,
  Shield,
  ShieldAlert,
  Mail,
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserRole = "Buyer" | "Seller" | "Both";
type UserStatus = "Active" | "Suspended" | "Pending";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  listings: number;
  avatar: string;
}

const USERS: UserData[] = [
  { id: "U-001", name: "Ahmad Raza", email: "ahmad.raza@gmail.com", phone: "+92 300 1234567", role: "Seller", status: "Active", joinDate: "Jan 15, 2026", listings: 3, avatar: "A" },
  { id: "U-002", name: "Sara Malik", email: "sara.malik@yahoo.com", phone: "+92 321 9876543", role: "Both", status: "Active", joinDate: "Feb 02, 2026", listings: 5, avatar: "S" },
  { id: "U-003", name: "Bilal Khan", email: "bilal.k@hotmail.com", phone: "+92 333 4567890", role: "Buyer", status: "Active", joinDate: "Mar 10, 2026", listings: 0, avatar: "B" },
  { id: "U-004", name: "Fatima Noor", email: "fatima.noor@gmail.com", phone: "+92 345 6789012", role: "Seller", status: "Suspended", joinDate: "Apr 22, 2026", listings: 1, avatar: "F" },
  { id: "U-005", name: "Usman Ali", email: "usman@gmail.com", phone: "+92 312 3456789", role: "Buyer", status: "Active", joinDate: "May 08, 2026", listings: 0, avatar: "U" },
  { id: "U-006", name: "Zainab Iqbal", email: "zainab.i@gmail.com", phone: "+92 300 9876543", role: "Both", status: "Active", joinDate: "Jun 01, 2026", listings: 2, avatar: "Z" },
  { id: "U-007", name: "Hamza Tariq", email: "hamza.t@outlook.com", phone: "+92 311 1112233", role: "Seller", status: "Pending", joinDate: "Jul 05, 2026", listings: 0, avatar: "H" },
  { id: "U-008", name: "Nadia Shah", email: "nadia.s@yahoo.com", phone: "+92 322 4455667", role: "Buyer", status: "Active", joinDate: "Jul 08, 2026", listings: 0, avatar: "N" },
];

const statusColor: Record<UserStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const roleColor: Record<UserRole, string> = {
  Buyer: "bg-electric-blue/10 text-electric-blue border-electric-blue/20",
  Seller: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Both: "bg-neon-red/10 text-neon-red border-neon-red/20",
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    setActionMenu(null);
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
    sellers: users.filter((u) => u.role === "Seller" || u.role === "Both").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">User Management</h2>
        <p className="text-sm text-zinc-400 mt-1">Monitor and manage registered platform users</p>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-white" },
          { label: "Active", value: stats.active, color: "text-emerald-400" },
          { label: "Suspended", value: stats.suspended, color: "text-red-400" },
          { label: "Sellers", value: stats.sellers, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-white/10 rounded-xl px-5 py-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Listings</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-red to-electric-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-zinc-300">{user.email}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{user.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${roleColor[user.role]}`}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${statusColor[user.status]}`}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">{user.joinDate}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{user.listings}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-electric-blue hover:bg-white/5 transition-all" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          user.status === "Active"
                            ? "border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white"
                            : "border-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white"
                        }`}
                        title={user.status === "Active" ? "Suspend" : "Activate"}
                      >
                        {user.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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
