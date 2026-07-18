'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  Loader2,
  Users as UsersIcon,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  Clock,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateUserStatus, fetchAllUsers } from '@/lib/admin-actions';
import type { DbUser, UserStatus, UserRole } from '@/lib/supabase/types';

// ─── Styling maps (DB values are lowercase) ───────────────────────────────────

const STATUS_STYLE: Record<UserStatus, string> = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const ROLE_STYLE: Record<UserRole, string> = {
  buyer:               'bg-blue-500/10 text-blue-400 border-blue-500/20',
  seller:              'bg-purple-500/10 text-purple-400 border-purple-500/20',
  admin:               'bg-rose-500/10 text-rose-400 border-rose-500/20',
  content_manager:     'bg-teal-500/10 text-teal-400 border-teal-500/20',
  inspection_manager:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const ROLE_LABEL: Record<UserRole, string> = {
  buyer:               'Buyer',
  seller:              'Seller',
  admin:               'Admin',
  content_manager:     'Content Mgr',
  inspection_manager:  'Inspection Mgr',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitial(name: string): string {
  return (name?.trim()?.[0] ?? '?').toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Profile Modal ────────────────────────────────────────────────────────────

function ProfileModal({
  user,
  onClose,
}: {
  user: DbUser;
  onClose: () => void;
}) {
  // Close on backdrop click or Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const rows: { label: string; value: React.ReactNode; icon: React.ReactNode }[] = [
    { label: 'Email',          icon: <Mail className="w-3.5 h-3.5" />,      value: user.email },
    { label: 'Phone',          icon: <Phone className="w-3.5 h-3.5" />,     value: user.phone ?? '—' },
    { label: 'Role',           icon: <ShieldCheck className="w-3.5 h-3.5"/>,value: (
        <Badge className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${ROLE_STYLE[user.role]}`}>
          {ROLE_LABEL[user.role]}
        </Badge>
      )},
    { label: 'Status',         icon: <Clock className="w-3.5 h-3.5" />,     value: (
        <Badge className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${STATUS_STYLE[user.status]}`}>
          {user.status}
        </Badge>
      )},
    { label: 'Listings',       icon: <FileText className="w-3.5 h-3.5" />,  value: user.listings_count },
    { label: 'Last Login',     icon: <Clock className="w-3.5 h-3.5" />,     value: formatDateTime(user.last_login) },
    { label: 'Member Since',   icon: <Calendar className="w-3.5 h-3.5" />,  value: formatDate(user.created_at) },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.07]">
          <h3 className="text-lg font-bold text-white">User Profile</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0055FE] to-[#00B67A] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitial(user.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">{user.id}</p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mx-6 mb-4 px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl">
            <p className="text-xs text-zinc-400 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Detail rows */}
        <div className="px-6 pb-6 space-y-3">
          {rows.map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-zinc-500 shrink-0">
                {row.icon}
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {row.label}
                </span>
              </div>
              <div className="text-xs text-zinc-200 text-right truncate max-w-[55%]">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users,       setUsers]       = useState<DbUser[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId,  setTogglingId]  = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<DbUser | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data as DbUser[]);
    } catch (err: any) {
      toast.error(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Stats — computed from real fetched data ────────────────────────────────
  const stats = useMemo(() => ({
    total:     users.length,
    active:    users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    sellers:   users.filter(u => u.role === 'seller').length,
  }), [users]);

  // ── Search filter ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  // ── Toggle suspend / activate ──────────────────────────────────────────────
  const handleToggleStatus = async (user: DbUser) => {
    const nextStatus: UserStatus =
      user.status === 'active' ? 'suspended' : 'active';

    // Optimistic update
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: nextStatus } : u)),
    );
    setTogglingId(user.id);

    try {
      await updateUserStatus(user.id, nextStatus);
      toast.success(
        nextStatus === 'suspended'
          ? `${user.name} has been suspended.`
          : `${user.name} is now active.`,
      );
    } catch (err: any) {
      // Roll back on failure
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: user.status } : u)),
      );
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          User Management
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor and manage registered platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: stats.total,     color: 'text-white' },
          { label: 'Active',       value: stats.active,    color: 'text-emerald-400' },
          { label: 'Suspended',    value: stats.suspended, color: 'text-red-400' },
          { label: 'Sellers',      value: stats.sellers,   color: 'text-purple-400' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-zinc-900 border border-white/10 rounded-xl px-5 py-4"
          >
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              {s.label}
            </p>
            <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>
              {loading ? (
                <span className="inline-block w-8 h-6 bg-zinc-700 rounded animate-pulse" />
              ) : (
                s.value
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#0055FE] transition-all"
        />
      </div>

      {/* Table */}
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

              {/* Loading skeleton */}
              {loading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-zinc-700 rounded" />
                          <div className="h-2.5 w-20 bg-zinc-800 rounded" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 w-20 bg-zinc-800 rounded" />
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                        <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {/* Empty state */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <UsersIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">
                      {searchQuery ? 'No users match your search.' : 'No users registered yet.'}
                    </p>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading && filtered.map(user => {
                const isToggling = togglingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Avatar + name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0055FE] to-[#00B67A] flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                          {user.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitial(user.name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate max-w-[140px]">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-0.5 font-mono truncate max-w-[140px]">
                            {user.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-zinc-300 truncate max-w-[180px]">
                        {user.email}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {user.phone ?? '—'}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <Badge
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${ROLE_STYLE[user.role]}`}
                      >
                        {ROLE_LABEL[user.role]}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <Badge
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${STATUS_STYLE[user.status]}`}
                      >
                        {user.status}
                      </Badge>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>

                    {/* Listings */}
                    <td className="px-5 py-4 text-sm font-semibold text-white">
                      {user.listings_count}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">

                        {/* View Profile */}
                        <button
                          onClick={() => setProfileUser(user)}
                          className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-[#0055FE] hover:border-[#0055FE]/30 hover:bg-[#0055FE]/5 transition-all"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Suspend / Activate */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={isToggling}
                          className={`p-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.status === 'active'
                              ? 'border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white hover:border-red-500'
                              : 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                          }`}
                          title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          {isToggling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : user.status === 'active' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              Showing{' '}
              <span className="text-zinc-400 font-medium">{filtered.length}</span>
              {' '}of{' '}
              <span className="text-zinc-400 font-medium">{users.length}</span>
              {' '}users
            </p>
            <button
              onClick={fetchUsers}
              className="text-xs text-zinc-600 hover:text-[#0055FE] transition-colors flex items-center gap-1"
            >
              <Loader2 className="w-3 h-3" /> Refresh
            </button>
          </div>
        )}
      </div>

      {/* Profile modal — rendered outside table to avoid z-index issues */}
      {profileUser && (
        <ProfileModal
          user={profileUser}
          onClose={() => setProfileUser(null)}
        />
      )}

    </div>
  );
}
