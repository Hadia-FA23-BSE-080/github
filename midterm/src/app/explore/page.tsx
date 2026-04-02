'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExplorePage() {
  const [ads, setAds] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/ads')
      .then(r => r.json())
      .then(data => {
        setAds(data.filter((ad: any) => ad.status === 'approved'));
      });
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchCategory = category === 'All' || ad.category === category;
    const matchSearch = ad.title?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12 flex-1 relative">
      <h1 className="text-4xl font-bold mb-6">Explore the Marketplace</h1>
      
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-card border border-white/10 p-4 rounded-xl shadow-xl relative z-20">
        <input 
          type="text" 
          placeholder="🔎 Search for properties, vehicles, electronics..." 
          className="flex-1 bg-background border border-white/10 rounded-lg px-5 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="md:w-64 bg-background border border-white/10 rounded-lg px-5 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition appearance-none cursor-pointer"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option className="bg-card text-white" value="All">All Categories</option>
          <option className="bg-card text-white" value="Real Estate">Real Estate</option>
          <option className="bg-card text-white" value="Vehicles">Vehicles</option>
          <option className="bg-card text-white" value="Electronics">Electronics</option>
          <option className="bg-card text-white" value="Services">Services</option>
        </select>
      </div>
      
      {filteredAds.length === 0 ? (
        <div className="text-center p-16 bg-card border border-white/10 rounded-2xl shadow-lg mt-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-6 opacity-80">🕵️</div>
          <p className="text-2xl font-bold mb-2">No exact matches found</p>
          <p className="text-foreground/50">Try adjusting your search terms or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="border border-white/10 rounded-2xl p-6 bg-card flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1">
              {/* Image Container */}
              <div className="aspect-video bg-background/50 rounded-xl mb-5 overflow-hidden border border-white/5 relative flex items-center justify-center">
                {ad.image ? (
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out" />
                ) : (
                  <div className="text-5xl opacity-30">📸</div>
                )}
                
                {/* Category Badge over image */}
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                  {ad.category || 'General'}
                </span>
                
                {/* Simulated Premium badge */}
                {ad.price > 10000 && (
                  <span className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-bold shadow-[0_0_10px_rgba(79,70,229,0.8)]">
                    ★ TOP PICK
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{ad.title}</h3>
                <p className="text-foreground/60 text-sm mb-4 line-clamp-2 leading-relaxed">{ad.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-5">
                <p className="text-foreground font-black text-2xl tracking-tight">${ad.price.toLocaleString()}</p>
                <Link href={`/explore/${ad.id}`} className="text-sm font-bold bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2.5 border border-primary/20 rounded-lg transition shadow-sm">
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
