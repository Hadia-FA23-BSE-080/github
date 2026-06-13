import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Clock, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-blue-300 font-medium text-sm mb-8 animate-float">
            <Activity size={16} /> Welcome to the Future of Healthcare
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 drop-shadow-lg">
            Your Health,<br/>Perfectly Managed
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Experience next-generation consultations across Allopathic, Homeopathic, and Herbal treatments. Secured by immutable Electronic Health Records.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="glow-btn text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 group">
              Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="glass-card text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
              Doctor Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-blue-500/20 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Match</h3>
              <p className="text-slate-400 leading-relaxed">Filter world-class specialists by disease, specific expertise, or your preferred treatment paradigm seamlessly.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-purple-500/20 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 border border-purple-500/30 group-hover:scale-110 transition-transform relative z-10">
                <ShieldCheck className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white relative z-10">Immutable EHR</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">Your entire medical history permanently secured via non-deletable records ensuring zero clinical tampering.</p>
            </div>
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-emerald-500/20 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Verified Workflow</h3>
              <p className="text-slate-400 leading-relaxed">Experience a secure booking pipeline where assistant verifications guarantee reliable clinic scheduling.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
