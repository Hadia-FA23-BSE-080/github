"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

const brands = [
  { name: "Toyota", logo: "🚗", count: "12,500+" },
  { name: "Honda", logo: "🏎️", count: "8,200+" },
  { name: "Suzuki", logo: "🚙", count: "15,000+" },
  { name: "KIA", logo: "🚘", count: "3,800+" },
  { name: "Hyundai", logo: "🏁", count: "2,900+" },
  { name: "BMW", logo: "💎", count: "850+" },
  { name: "Mercedes", logo: "⭐", count: "650+" },
  { name: "Audi", logo: "🔷", count: "420+" },
  { name: "Changan", logo: "🚐", count: "2,100+" },
  { name: "MG", logo: "🔴", count: "1,800+" },
];

export function BrowseByBrand() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-[2px] bg-electric-blue rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-blue">
              Browse
            </span>
            <div className="w-8 h-[2px] bg-electric-blue rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Shop By <span className="text-electric-blue">Brand</span>
          </h2>
          <p className="text-zinc-400 mt-2 max-w-md mx-auto">
            Explore vehicles from the world&apos;s most trusted automotive manufacturers.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/buy-car?brand=${brand.name.toLowerCase()}`}
              className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-white/[0.06] hover:border-electric-blue/30 transition-all duration-500 hover:shadow-lg hover:shadow-electric-blue/5"
            >
              {/* Logo emoji placeholder */}
              <div className="text-4xl mb-1 transition-transform duration-500 group-hover:scale-110">
                {brand.logo}
              </div>

              <span className="text-sm font-semibold text-white group-hover:text-electric-blue transition-colors duration-300">
                {brand.name}
              </span>
              <span className="text-xs text-zinc-500">
                {brand.count} listings
              </span>

              {/* Hover arrow */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="w-4 h-4 text-electric-blue" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
