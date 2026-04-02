'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function AdDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/ads/${resolvedParams.id}`)
      .then(r => r.json())
      .then(setAd);
  }, [resolvedParams.id]);

  if (!ad) return (
     <div className="flex items-center justify-center flex-1 h-2/3 mt-20">
         <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 flex-1 relative">
      <Link href="/explore" className="text-primary hover:text-white transition hover:underline mb-8 inline-block font-bold">&larr; Back to Explore</Link>
      
      <div className="bg-card border border-white/10 rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 w-full left-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-t-3xl"></div>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Image & Main Info */}
          <div className="flex-[2]">
            <div className="aspect-video bg-background/50 rounded-2xl mb-6 overflow-hidden border border-white/5 relative flex items-center justify-center group shadow-xl">
              {ad.image ? (
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" />
              ) : (
                 <div className="py-20 text-center text-white/20">
                    <div className="text-7xl mb-4">📸</div>
                    <p className="font-bold">No Image Provided</p>
                 </div>
              )}
              {ad.category && (
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    {ad.category}
                  </span>
              )}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">{ad.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-primary/20 text-primary px-5 py-2 rounded-lg text-xl font-black shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    ${ad.price.toLocaleString()}
                  </span>
                  <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-foreground/70 font-medium">
                    Posted Recently
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-8">
              <h3 className="text-2xl font-bold mb-4">Description</h3>
              <div className="bg-background/50 border border-white/5 p-6 rounded-2xl">
                 <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
                   {ad.description || "No description provided."}
                 </p>
              </div>
            </div>
          </div>
          
          {/* Right Column: Seller Info */}
          <div className="flex-[1] w-full md:w-80 space-y-6">
            <div className="bg-background border border-white/5 p-6 rounded-3xl shadow-lg sticky top-24">
              <h3 className="font-bold text-xl mb-6 pb-4 border-b border-white/10">Seller Information</h3>
              
              <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xl font-bold">
                    {ad.userId ? ad.userId[0].toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate text-foreground/90">{ad.userId}</p>
                    <p className="text-xs text-green-400 font-bold uppercase tracking-widest">Active Vendor</p>
                  </div>
              </div>

              <div className="space-y-3 mb-8 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-foreground/60">Verification</span>
                   <span className="font-bold text-primary flex items-center gap-1">✓ Verified</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-foreground/60">Response Rate</span>
                   <span className="font-bold">98%</span>
                </div>
                <div className="flex justify-between pb-2">
                   <span className="text-foreground/60">Member Since</span>
                   <span className="font-bold">2026</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2">
                ✉️ Contact Seller
              </button>
              
              <p className="text-center text-[10px] text-foreground/40 mt-4 uppercase tracking-widest leading-relaxed">
                 Transaction protected by<br/>AdFlow Marketplace Security
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
