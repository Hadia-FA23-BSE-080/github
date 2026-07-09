"use client";

import { useState, useEffect } from "react";
import { Heart, Fuel, Gauge, Calendar, MapPin, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllCars, CarListing } from "@/lib/car-data";
import { isInWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlist";

function CarCard({ car }: { car: CarListing }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(car.id));
    const handleUpdate = () => {
      setIsWishlisted(isInWishlist(car.id));
    };
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
    };
  }, [car.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(car.id);
    } else {
      addToWishlist(car.id);
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-2xl hover:shadow-neon-red/5">
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge */}
        {car.badge && (
          <div className="absolute top-3 left-3">
            <Badge
              className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 ${
                car.badge === "Featured"
                  ? "bg-neon-red/90 text-white border-none"
                  : car.badge === "Certified"
                  ? "bg-electric-blue/90 text-white border-none"
                  : car.badge === "Hot Deal"
                  ? "bg-amber-500/90 text-white border-none"
                  : "bg-emerald-500/90 text-white border-none"
              }`}
            >
              {car.badge}
            </Badge>
          </div>
        )}

        {/* Wishlist */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all duration-200 active:scale-90 ${
            isWishlisted ? "text-neon-red scale-105" : "text-white/70 hover:text-neon-red hover:bg-black/60"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? "fill-neon-red text-neon-red" : ""}`} />
        </button>

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-bold text-white drop-shadow-lg">
            {car.priceDisplay}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-white group-hover:text-neon-red transition-colors duration-300">
            {car.title}
          </h3>
          {car.rating && (
            <div className="flex items-center gap-1 text-amber-400 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium">{car.rating}</span>
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Gauge className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{car.mileage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Fuel className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{car.fuel}</span>
          </div>
        </div>

        {/* Location & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{car.location}</span>
          </div>
          <Link href={`/buy-car/${car.id}`} suppressHydrationWarning className="text-xs text-neon-red hover:text-red-400 font-medium transition-colors flex items-center gap-1">
            View Details
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeaturedCars() {
  return (
    <section className="relative py-20 sm:py-28">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-red/[0.03] blur-[150px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[2px] bg-neon-red rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-red">
                Featured
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Trending <span className="text-neon-red">Cars</span>
            </h2>
            <p className="text-zinc-400 mt-2 max-w-md">
              Curated selection of the finest vehicles currently available on our
              marketplace.
            </p>
          </div>
          <Link href="/buy-car">
            <Button
              variant="outline"
              className="mt-4 sm:mt-0 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20"
            >
              View All Listings
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide">
          {getAllCars().slice(0, 6).map((car) => (
            <div key={car.id} className="min-w-[300px] sm:min-w-[350px] snap-center shrink-0">
               <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
