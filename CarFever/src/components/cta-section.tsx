"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-red/20 via-[#18181b] to-electric-blue/20" />
          <div className="absolute inset-0 bg-[#09090b]/80" />

          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-neon-red/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-electric-blue/20 blur-[120px] rounded-full" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative px-6 sm:px-12 py-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
              <Sparkles className="w-3.5 h-3.5 text-neon-red" />
              <span className="text-xs font-medium text-zinc-300">
                Ready to sell? Get the best price
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Sell Your Car at the{" "}
              <span className="bg-gradient-to-r from-neon-red to-electric-blue bg-clip-text text-transparent">
                Best Price
              </span>
            </h2>

            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
              List your car for free and reach thousands of potential buyers.
              Our platform ensures you get the value your car deserves.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-neon-red/20 group-hover:border-neon-red/50 transition-all duration-300">
                  <span className="text-2xl font-bold text-white group-hover:text-neon-red">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Enter Details</h3>
                <p className="text-sm text-zinc-400">Share your car's make, model, and condition.</p>
              </div>

              <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-electric-blue/20 group-hover:border-electric-blue/50 transition-all duration-300">
                  <span className="text-2xl font-bold text-white group-hover:text-electric-blue">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Get Offers</h3>
                <p className="text-sm text-zinc-400">Receive competitive offers from our network.</p>
              </div>

              <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-300">
                  <span className="text-2xl font-bold text-white group-hover:text-emerald-500">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sell Instantly</h3>
                <p className="text-sm text-zinc-400">Get paid instantly and securely.</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Link href="/sell-car">
                <Button
                  size="lg"
                  className="bg-neon-red hover:bg-red-600 text-white font-semibold px-12 glow-red-subtle hover:glow-red transition-all duration-300 h-14 text-lg rounded-full"
                >
                  Sell Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
