"use client";

import { useState } from "react";
import { Search, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const popularSearches = [
  "Toyota Corolla",
  "Honda Civic",
  "Suzuki Alto",
  "Toyota Yaris",
  "KIA Sportage",
  "Hyundai Tucson",
];

const cities = [
  "All Pakistan",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Faisalabad",
];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Pakistan");
  const [showCities, setShowCities] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-[#09090b]/80 z-0" />
        
        {/* Sports Car Background (Subtle) */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-luminosity bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1920&q=80')" }}
        />
        
        {/* Red glow - top right */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-neon-red/8 blur-[150px]" />
        
        {/* Blue glow - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-electric-blue/8 blur-[150px]" />
        
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-white/[0.02] blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-neon-red" />
          <span className="text-xs font-medium text-zinc-300 tracking-wide">
            Pakistan&apos;s #1 Premium Car Marketplace
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          <span className="text-white">Find Your</span>
          <br />
          <span className="bg-gradient-to-r from-neon-red via-red-400 to-electric-blue bg-clip-text text-transparent">
            Dream Car
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Browse through thousands of verified listings. Buy, sell, or exchange
          with confidence on the most trusted automotive platform.
        </p>

        {/* Search Bar */}
        <div
          className="max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="glass-heavy rounded-2xl p-2 shadow-2xl shadow-black/40">
            <div className="flex flex-col sm:flex-row gap-2">
              <select className="px-4 py-3 sm:py-3.5 bg-white/5 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors border-none focus:ring-0 focus:outline-none w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                <option value="">Select Make</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="suzuki">Suzuki</option>
              </select>

              <select className="px-4 py-3 sm:py-3.5 bg-white/5 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors border-none focus:ring-0 focus:outline-none w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                <option value="">Select Model</option>
                <option value="corolla">Corolla</option>
                <option value="civic">Civic</option>
                <option value="alto">Alto</option>
              </select>
              
              <select className="px-4 py-3 sm:py-3.5 bg-white/5 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors border-none focus:ring-0 focus:outline-none w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                <option value="">Select City</option>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
              </select>

              <select className="px-4 py-3 sm:py-3.5 bg-white/5 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors border-none focus:ring-0 focus:outline-none w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                <option value="">Budget Range</option>
                <option value="under-1m">Under 1 Million</option>
                <option value="1m-3m">1M - 3M</option>
                <option value="over-3m">Over 3 Million</option>
              </select>

              {/* Search Button */}
              <Button
                size="lg"
                onClick={() => router.push('/buy-car')}
                className="bg-neon-red hover:bg-red-600 text-white font-semibold px-8 rounded-xl glow-red-subtle hover:glow-red transition-all duration-300 h-auto py-3 sm:py-3.5 flex-1"
              >
                <Search className="w-4.5 h-4.5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
            <span className="text-xs text-zinc-500 font-medium">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto mt-14 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            { value: "50K+", label: "Active Listings" },
            { value: "120K+", label: "Happy Users" },
            { value: "25+", label: "Cities" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent" />
    </section>
  );
}
