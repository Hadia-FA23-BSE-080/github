"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Eye,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase/server";
import { updateInquiryStatus, deleteInquiry, markAllInquiriesRead, clearAllInquiries } from "@/lib/admin-actions";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  status: 'pending' | 'read' | 'replied' | 'archived';
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unread" | "Read">("All");

  // Selected inquiry for detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);

  // Fetch from Supabase
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const supabase = createServerClient();
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setInquiries(data || []);
      } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        toast.error('Failed to load inquiries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInquiries();
  }, []);

  // Mark single as read
  const markAsRead = async (id: string, readState: boolean = true) => {
    try {
      const status = readState ? 'read' : 'pending';
      await updateInquiryStatus(id, status);
      setInquiries(c => c.map(i => i.id === id ? { ...i, is_read: readState, status } : i));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, is_read: readState, status });
      }
      toast.success(readState ? 'Marked as read' : 'Marked as unread');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Delete single
  const handleDelete = async (id: string) => {
    try {
      await deleteInquiry(id);
      setInquiries(c => c.filter(i => i.id !== id));
      setDeleteConfirm(null);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
      toast.success('Inquiry deleted');
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await markAllInquiriesRead();
      setInquiries(c => c.map(i => ({ ...i, is_read: true, status: 'read' as const })));
      toast.success('All inquiries marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  // Clear all
  const handleClearAll = async () => {
    try {
      await clearAllInquiries();
      setInquiries([]);
      setClearAllConfirm(false);
      setSelectedInquiry(null);
      toast.success('All inquiries cleared');
    } catch (error) {
      toast.error('Failed to clear inquiries');
    }
  };

  // Search and Filter calculations
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter =
        statusFilter === "All" ||
        (statusFilter === "Unread" && !inq.is_read) ||
        (statusFilter === "Read" && inq.is_read);

      return matchesSearch && matchesFilter;
    });
  }, [inquiries, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => !i.is_read).length;
    
    // Count inquiries from this week (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const thisWeek = inquiries.filter((i) => new Date(i.created_at).getTime() > sevenDaysAgo).length;

    return { total, unread, thisWeek };
  }, [inquiries]);

  // Date Formatting helper
  const formatDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Contact Inquiries</h2>
        <p className="text-sm text-zinc-400 mt-1">View and manage messages from users</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Inquiries */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 hover:scale-102 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Inquiries</p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">{stats.total}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-neon-red/10 border border-neon-red/20 text-neon-red">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Unread */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 hover:scale-102 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Unread Messages</p>
            <h3 className="text-3xl font-extrabold text-electric-blue mt-1.5">{stats.unread}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-electric-blue/10 border border-electric-blue/20 text-electric-blue">
            <Check className="w-5 h-5" />
          </div>
        </div>

        {/* This Week */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 hover:scale-102 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">This Week</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1.5">{stats.thisWeek}</h3>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 bg-[#0f0f10] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red cursor-pointer min-w-[150px]"
        >
          <option value="All">All Inquiries</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={stats.unread === 0}
            className="border-white/10 text-electric-blue hover:bg-electric-blue/10 gap-2 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={() => setClearAllConfirm(true)}
            disabled={stats.total === 0}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 gap-2 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-16 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-zinc-500">Loading inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        /* Empty State */
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-16 text-center">
          <MessageSquare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No inquiries yet</h3>
          <p className="text-sm text-zinc-500">Contact form submissions will appear here</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  <th className="w-10 pl-5 py-4"></th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Message</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      !inq.is_read ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* Status Dot */}
                    <td className="pl-5 py-4">
                      {!inq.is_read && (
                        <span className="block w-2.5 h-2.5 rounded-full bg-electric-blue animate-pulse" />
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${!inq.is_read ? "text-white" : "text-zinc-300"}`}>
                        {inq.name}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-zinc-400">{inq.email}</td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-zinc-400">{inq.phone || '-'}</td>

                    {/* Short Message */}
                    <td className="px-5 py-4 text-zinc-300 max-w-[280px] truncate">
                      {inq.message}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-zinc-500">{formatDate(inq.created_at)}</td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
                          title="View Full Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => markAsRead(inq.id, !inq.is_read)}
                          className={`p-2 rounded-lg border transition-all ${
                            !inq.is_read
                              ? "bg-electric-blue/10 border-electric-blue/20 text-electric-blue hover:bg-electric-blue hover:text-white"
                              : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                          }`}
                          title={!inq.is_read ? "Mark as Read" : "Mark as Unread"}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ id: inq.id, name: inq.name })}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className={`bg-zinc-900 border rounded-2xl p-4 space-y-3 ${
                  !inq.is_read ? "border-electric-blue/40" : "border-white/10"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      {!inq.is_read && <span className="w-2.5 h-2.5 rounded-full bg-electric-blue shrink-0" />}
                      <h4 className="font-bold text-white text-base">{inq.name}</h4>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{formatDate(inq.created_at)}</p>
                  </div>
                  <Badge className={`text-[8px] font-bold px-1.5 py-0.5 uppercase ${!inq.is_read ? "bg-electric-blue text-white" : "bg-zinc-700 text-zinc-400"}`}>
                    {!inq.is_read ? "Unread" : "Read"}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400">
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {inq.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {inq.phone || '-'}</p>
                </div>

                <p className="text-sm text-zinc-300 line-clamp-2 bg-white/5 border border-white/[0.06] rounded-xl p-3">
                  {inq.message}
                </p>

                <div className="flex gap-2 pt-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInquiry(inq)}
                    className="border-white/10 text-white flex-1"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(inq.id, !inq.is_read)}
                    className={`flex-1 ${!inq.is_read ? "border-electric-blue/30 text-electric-blue" : "border-white/10 text-zinc-400"}`}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" /> {!inq.is_read ? "Read" : "Unread"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm({ id: inq.id, name: inq.name })}
                    className="border-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── MODALS & DIALOGS ─── */}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          {/* Box */}
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">{selectedInquiry.subject || "Inquiry Details"}</h3>
            <p className="text-xs text-zinc-500 mb-6 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              Received on {formatDateTime(selectedInquiry.created_at)}
            </p>

            <div className="space-y-4">
              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 border border-white/[0.06] rounded-xl p-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">From</p>
                  <p className="text-sm font-bold text-white">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Email</p>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs text-electric-blue hover:underline break-all"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Phone Number</p>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-xs text-electric-blue hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Status</p>
                  <Badge className={`text-[8px] font-bold px-2 py-0.5 uppercase border ${selectedInquiry.is_read ? "bg-zinc-700 text-zinc-400" : "bg-electric-blue text-white"}`}>
                    {selectedInquiry.is_read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">Message</p>
                <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-6 justify-end border-t border-white/5 pt-4">
              {!selectedInquiry.is_read ? (
                <Button
                  onClick={() => markAsRead(selectedInquiry.id, true)}
                  className="bg-electric-blue hover:bg-blue-600 text-white font-semibold gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark as Read
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => markAsRead(selectedInquiry.id, false)}
                  className="border-white/10 text-zinc-400 hover:text-white"
                >
                  Mark as Unread
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedInquiry(null)}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Delete Inquiry?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to delete the inquiry from{" "}
              <span className="text-white font-semibold">&ldquo;{deleteConfirm.name}&rdquo;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {clearAllConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setClearAllConfirm(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-lg font-bold text-white">Clear All Inquiries?</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              Are you absolutely sure you want to permanently delete all messages? This will completely clear the inbox database.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setClearAllConfirm(false)}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
