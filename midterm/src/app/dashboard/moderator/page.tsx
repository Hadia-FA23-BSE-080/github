'use client';
import { useEffect, useState } from 'react';

export default function ModeratorDashboard() {
  const [ads, setAds] = useState<any[]>([]);

  const fetchAds = () => {
    fetch('/api/ads')
      .then(r => r.json())
      .then(data => {
        setAds(data.filter((ad: any) => ad.status === 'review'));
      });
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const updateStatus = async (id: string, status: string, title: string) => {
    const isApproved = status === 'approved';
    const msg = isApproved ? `Approve "${title}"?` : `Reject "${title}"?`;
    
    if (!confirm(msg)) return; // Ask for confirmation first!

    const res = await fetch(`/api/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (res.ok) {
        alert(isApproved ? "✅ Ad successfully approved and published to explore!" : "❌ Ad has been rejected.");
        fetchAds();
    } else {
        alert("Action failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex-1 relative">
      <div className="flex items-center gap-4 mb-2">
        <div className="size-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#eab308]"></div>
        <h1 className="text-3xl font-bold">Moderator Queue</h1>
      </div>
      <p className="text-foreground/60 mb-8 ml-7">Review submitted ads before they appear in the marketplace.</p>
      
      {ads.length === 0 ? (
        <div className="p-12 text-center bg-card border border-white/10 rounded-2xl max-w-2xl mx-auto mt-12">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Inbox Zero!</h2>
          <p className="text-foreground/50">You have no ads pending review. Great job keeping the queue clean!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ads.map(ad => (
            <div key={ad.id} className="border border-white/10 bg-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 shadow-xl relative overflow-hidden">
               {/* Left Sidebar Accent */}
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
               
               <div className="flex-1 pl-4">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <span className="text-xs text-foreground/50 uppercase tracking-wider font-bold mb-1 block">USER ID: {ad.userId}</span>
                     <h3 className="font-bold text-2xl">{ad.title}</h3>
                     <p className="text-primary font-bold text-lg mt-1">${ad.price}</p>
                   </div>
                   <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs uppercase font-bold tracking-widest block text-center min-w-[120px]">
                     Pending Review
                   </span>
                 </div>
                 <div className="bg-background border border-white/5 rounded-xl p-4 mb-2">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm">{ad.description}</p>
                 </div>
               </div>
               
               <div className="w-full md:w-48 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                 <button onClick={() => updateStatus(ad.id, 'approved', ad.title)} className="bg-green-600 hover:bg-green-500 text-white w-full py-3 rounded-xl font-bold transition shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:scale-[1.02]">
                   Approve
                 </button>
                 <button onClick={() => updateStatus(ad.id, 'rejected', ad.title)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 w-full py-3 rounded-xl font-bold transition hover:scale-[1.02]">
                   Reject
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
