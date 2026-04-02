'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [ads, setAds] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/ads').then(r => r.json()).then(setAds);
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  const deleteAd = async (id: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to PERMANENTLY delete "${title}"?`)) return;
    
    await fetch(`/api/ads/${id}`, { method: 'DELETE' });
    setAds(ads.filter(a => a.id !== id));
    alert("Ad permanently removed from local database.");
  }

  // Calculate real revenue from user purchases
  const totalRevenue = users.reduce((total, user) => {
    if (!user.purchases) return total;
    return total + user.purchases.reduce((sum: number, p: any) => sum + p.price, 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12 flex-1 relative">
      <div className="flex items-center gap-4 mb-2">
        <div className="size-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
        <h1 className="text-3xl font-bold">Admin Headquarters</h1>
      </div>
      <p className="text-foreground/60 mb-8 ml-7">System overview, real payments tracking, and global ad management.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-foreground/60 font-medium mb-2 uppercase text-xs tracking-widest">Total Ads in System</h3>
            <p className="text-4xl font-bold">{ads.length}</p>
          </div>
          <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">📦</div>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-blue-400 font-medium mb-2 uppercase text-xs tracking-widest">Total Registered Users</h3>
            <p className="text-4xl font-bold text-blue-400">{users.length}</p>
          </div>
          <div className="size-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center text-3xl">👥</div>
        </div>
        <div className="bg-card border border-green-500/30 p-6 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div>
            <h3 className="text-green-500/80 font-bold mb-2 uppercase text-xs tracking-widest">Actual Plan Revenue</h3>
            <p className="text-4xl font-black text-green-500">${totalRevenue}</p>
          </div>
          <div className="size-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center text-3xl z-10">💰</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Global Site Directory (All Ads)</h2>
      {ads.length === 0 ? <p className="text-foreground/50">No ads in system.</p> : (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase text-foreground/50 tracking-wider">
                <th className="p-5 font-bold">Ad Information</th>
                <th className="p-5 font-bold">Owner ID</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                  <td className="p-5">
                    <p className="font-bold text-lg">{ad.title}</p>
                    <p className="text-xs text-foreground/50 mt-1">ID: <span className="font-mono bg-background px-1 rounded">{ad.id}</span></p>
                  </td>
                  <td className="p-5 text-sm font-medium text-blue-400">{ad.userId}</td>
                  <td className="p-5 text-center">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full inline-block min-w-[100px]
                      ${ad.status === 'draft' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 
                        ad.status === 'review' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        ad.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => deleteAd(ad.id, ad.title)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg transition text-xs font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 border border-red-500/20">
                      Force Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
