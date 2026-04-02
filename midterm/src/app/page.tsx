"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Tag, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-40 mix-blend-screen animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-8 relative z-10">
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
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
              Sell Faster. Buy Smarter. <br /> Publish with Confidence.
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
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
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Trending Near You</h2>
            <p className="text-foreground/60">Explore the highest quality verified listings this week.</p>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* Pricing/Packages */}
      <section className="py-24 bg-card/30 border-t border-white/5 relative">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Choose Your Audience Reach</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto mb-16">
            AdFlow Pro uses algorithmic ranking to display ads based on relevance and selected packages. Pick a plan to amplify your visibility.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg, i) => (
              <motion.div 
                key={pkg.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-3xl p-8 border text-left relative flex flex-col",
                  pkg.featured 
                    ? "bg-gradient-to-b from-primary/10 to-card border-primary ring-1 ring-primary shadow-[0_0_40px_rgba(79,70,229,0.2)]" 
                    : "bg-card border-white/10 hover:border-white/20"
                )}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                    RECOMMENDED
                  </div>
                )}
                
                <div className="mb-6 h-full font-medium">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-extrabold text-white">{pkg.price}</span>
                    <span className="text-foreground/50 text-sm">/ {pkg.duration}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className={cn(
                  "w-full py-3 rounded-xl font-semibold transition-all mt-auto",
                  pkg.featured 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-white/5 hover:bg-white/10 text-white"
                )}>
                  Select Package
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
