"use client";

import { useState, useEffect } from "react";
import { updateDealerStatus, getAllDealers } from "@/lib/dealer-actions";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Search, Building2, MapPin, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  async function fetchDealers() {
    try {
      const data = await getAllDealers();
      setDealers(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch dealers: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, newStatus: 'approved' | 'suspended') {
    setProcessing(id);
    try {
      await updateDealerStatus(id, newStatus);
      toast.success(`Dealer marked as ${newStatus}`);
      setDealers(current => 
        current.map(d => d.id === id ? { ...d, status: newStatus } : d)
      );
    } catch (error: any) {
      toast.error("Failed to update status");
    } finally {
      setProcessing(null);
    }
  }

  const filteredDealers = dealers.filter(d => 
    d.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (d.city && d.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dealerships</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage dealer applications and accounts.</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or city..."
          className="pl-10 h-10 bg-[#1a1a1a] border-white/10 text-white rounded-xl focus-visible:ring-[#0055FE]"
        />
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-xs uppercase text-zinc-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Dealership</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading dealers...
                  </td>
                </tr>
              ) : filteredDealers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No dealers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredDealers.map((dealer) => (
                  <tr key={dealer.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          {dealer.logo_url ? (
                            <img src={dealer.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Building2 className="w-5 h-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{dealer.company_name}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {dealer.city || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{dealer.email}</p>
                      <p className="text-xs text-zinc-500 mt-1">{dealer.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                        ${dealer.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                          dealer.status === 'suspended' ? 'bg-red-500/10 text-red-400' : 
                          'bg-amber-500/10 text-amber-400'}`}>
                        {dealer.status.charAt(0).toUpperCase() + dealer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(dealer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dealer.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(dealer.id, 'approved')}
                            disabled={processing === dealer.id}
                            title="Approve"
                            className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {dealer.status !== 'suspended' && (
                          <button
                            onClick={() => handleStatusUpdate(dealer.id, 'suspended')}
                            disabled={processing === dealer.id}
                            title="Suspend"
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <a
                          href={`/dealers/${dealer.id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View Public Profile"
                          className="p-2 bg-white/5 text-zinc-400 rounded-lg hover:bg-white/10 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
