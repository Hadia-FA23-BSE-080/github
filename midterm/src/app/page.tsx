"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Tag, ArrowRight, ShieldCheck, Clock, Award, Sparkles, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
};

const FEATURED_ADS = [
  {
    id: 1,
    title: "2024 Tesla Model 3 Long Range",
    price: "$34,990",
    category: "Vehicles",
    city: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Modern Villa with Pool",
    price: "$1,250,000",
    category: "Real Estate",
    city: "Miami, FL",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 3,
    title: "MacBook Pro M3 Max 1TB",
    price: "$2,899",
    category: "Electronics",
    city: "New York, NY",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    featured: false,
  },
];

const PACKAGES = [
  {
    name: "Basic",
    price: "$10",
    duration: "7 Days",
    features: ["Standard visibility", "Up to 5 custom media links", "Email support"],
    featured: false,
  },
  {
    name: "Standard",
    price: "$25",
    duration: "15 Days",
    features: ["Boosted search ranking (+30)", "Priority review by moderators", "Featured badge optional"],
    featured: true,
  },
  {
    name: "Premium",
    price: "$50",
    duration: "30 Days",
    features: ["Top-tier search ranking (+50)", "Dashboard analytics", "Guaranteed homepage spot", "Custom SEO tags"],
    featured: false,
  },
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isClientAction, setIsClientAction] = useState(false);

  useEffect(() => {
    setIsClientAction(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <>
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-60 mix-blend-screen animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse delay-700 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                <span className="flex size-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                The new standard for verified listings
              </span>
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-sm leading-tight">
              Sell Faster. <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Buy Smarter.</span> <br /> Publish with Confidence.
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto mb-12 font-medium">
              AdFlow Pro is a curated marketplace requiring rigorous moderator approval. Every ad you see is active, legitimate, and ranked for the best experience.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-3xl mx-auto bg-card/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center bg-background/50 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-foreground/50 mr-3" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="bg-transparent border-none outline-none w-full placeholder:text-foreground/50 text-foreground"
                />
              </div>
              <div className="md:w-1/3 flex items-center bg-background/50 rounded-xl px-4 py-3">
                <MapPin className="w-5 h-5 text-foreground/50 mr-3" />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="bg-transparent border-none outline-none w-full placeholder:text-foreground/50 text-foreground"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 font-semibold transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center">
                Search
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Trust Markers */}
      <section className="border-y border-white/5 bg-white/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-foreground/60 text-sm font-medium">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><ShieldCheck className="w-5 h-5 text-accent"/> Moderator Approved</div>
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Clock className="w-5 h-5 text-primary"/> Automated Expiry</div>
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Award className="w-5 h-5 text-yellow-500"/> Ranked by Quality</div>
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-32 container mx-auto px-4 relative z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex justify-between items-end mb-16 relative">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Trending Near You <Sparkles className="inline-block w-8 h-8 text-yellow-400 -mt-2 animate-pulse" /></h2>
            <p className="text-foreground/60 text-lg">Explore the highest quality verified listings this week.</p>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 group bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/50 text-sm shadow-[0_0_15px_rgba(79,70,229,0.2)]">
            Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_ADS.map((ad, i) => (
            <motion.div 
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-white/5 overflow-hidden group hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                {/* Image Placeholder Since urls might fail if Unsplash acts up, it's just a demo visual */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${ad.image}')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                
                {ad.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3"/> Featured
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="bg-primary/90 backdrop-blur text-white text-xs font-medium px-2 py-0.5 rounded flex items-center w-fit">
                      <Tag className="w-3 h-3 mr-1"/> {ad.category}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">{ad.price}</div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer line-clamp-1">{ad.title}</h3>
                  <div className="flex items-center text-foreground/50 text-sm mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {ad.city}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing/Packages - Only show if client */}
      {isClientAction && (!user || user.role === 'client') && (
        <section className="py-32 bg-card/40 backdrop-blur-sm relative z-10 border-t border-white/5 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl text-center relative">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Choose Your Audience Reach <Zap className="inline-block w-8 h-8 text-primary -mt-2 animate-bounce" /></h2>
            <p className="text-foreground/60 max-w-2xl mx-auto mb-20 text-lg">
              AdFlow Pro uses algorithmic ranking to display ads based on relevance and selected packages. Pick a plan to amplify your visibility.
            </p>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {PACKAGES.map((pkg, i) => (
                <motion.div 
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                  className={cn(
                    "rounded-[2rem] p-10 text-left relative flex flex-col group transition-all duration-300",
                    pkg.featured 
                      ? "bg-gradient-to-b from-primary/20 via-card to-card border border-primary/50 shadow-[0_0_50px_rgba(79,70,229,0.3)] scale-105 z-10 hover:shadow-[0_0_80px_rgba(79,70,229,0.4)]" 
                      : "bg-card/50 border border-white/10 hover:border-white/30 backdrop-blur-md hover:bg-card/80"
                  )}
                >
                  {pkg.featured && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-violet-500 text-white text-xs font-black px-6 py-2 rounded-full tracking-wider shadow-lg shadow-primary/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> HIGHEST ROI
                    </div>
                  )}
                  
                  <div className="mb-8 h-full font-medium">
                    <h3 className={cn("text-2xl font-bold mb-4", pkg.featured ? "text-primary" : "text-white")}>{pkg.name}</h3>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-black text-white">{pkg.price}</span>
                      <span className="text-foreground/50 text-base font-medium">/ {pkg.duration}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {pkg.features.map(f => (
                         <li key={f} className="flex items-start gap-3 text-base text-foreground/80 group-hover:text-white transition-colors">
                          <div className={cn("mt-1 rounded-full p-0.5", pkg.featured ? "bg-primary/20 text-primary" : "bg-white/10 text-foreground/50 group-hover:text-primary group-hover:bg-primary/20 transition-all")}>
                             <ShieldCheck className="w-4 h-4" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all mt-auto text-base flex items-center justify-center gap-2",
                    pkg.featured 
                      ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1" 
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 hover:-translate-y-1"
                  )}>
                    Select {pkg.name} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
