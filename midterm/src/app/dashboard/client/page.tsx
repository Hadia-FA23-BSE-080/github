'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ClientDashboard() {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { email: 'client@test.com' };

    fetch('/api/ads')
      .then(r => r.json())
      .then(data => {
        // Show ads belonging to the logged in user
        setAds(data.filter((ad: any) => ad.userId === user.email || ad.userId === 'client1'));
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Ads Dashboard</h1>
          <p className="text-foreground/60">Manage your active listings and drafts.</p>
        </div>
        <Link href="/dashboard/client/publish" className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition">
          Post New Ad
        </Link>
      </div>
      
      {ads.length === 0 ? <p className="text-center text-foreground/50 py-10">You haven't posted any ads yet.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {ads.map(ad => (
            <div key={ad.id} className="border border-white/10 bg-card p-6 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-white/20 transition">
               <div>
                 <h3 className="font-bold text-xl mb-1">{ad.title}</h3>
                 <p className="text-primary font-bold">${ad.price}</p>
               </div>
               <div className="flex items-center gap-6">
                 <span className={`px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider
                   ${ad.status === 'draft' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : 
                     ad.status === 'review' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                     ad.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                     'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                   {ad.status === 'review' ? 'UNDER REVIEW' : ad.status}
                 </span>
                 <Link href={`/explore/${ad.id}`} className="text-sm font-medium hover:underline text-foreground/60">View</Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
