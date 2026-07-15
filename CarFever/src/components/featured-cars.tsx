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
    <div className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay gradient - slightly lighter for light theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge */}
        {car.badge && (
          <div className="absolute top-3 left-3">
            <Badge
              className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 ${
                car.badge === "Featured"
                  ? "bg-[#0055FE] text-white border-none"
                  : car.badge === "Certified"
                  ? "bg-[#00B67A] text-white border-none"
                  : car.badge === "Hot Deal"
                  ? "bg-[#FF6B00] text-white border-none"
                  : "bg-gray-800 text-white border-none"
              }`}
            >
              {car.badge}
            </Badge>
          </div>
        )}

        {/* Wishlist */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 active:scale-75 ${
            isWishlisted ? "text-[#0055FE] scale-105" : "text-gray-500 hover:text-[#0055FE] hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? "fill-[#0055FE] text-[#0055FE]" : ""}`} />
        </button>

        {/* Price on image (or could be moved below, but keeping layout same as requested) */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md">
          <span className="text-lg font-bold text-[#0055FE]">
            {car.priceDisplay}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#0055FE] transition-colors duration-300">
            {car.title}
          </h3>
          {car.rating && (
            <div className="flex items-center gap-1 text-amber-500 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium text-gray-700">{car.rating}</span>
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
          <div className="flex flex-col items-center justify-center text-gray-500 text-center">
            <Calendar className="w-3.5 h-3.5 text-gray-400 mb-1 shrink-0" />
            <span className="text-[10px] text-gray-400 font-medium uppercase">Year</span>
            <span className="text-xs font-semibold text-gray-900 truncate max-w-full">{car.year}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500 text-center border-x border-gray-200">
            <Gauge className="w-3.5 h-3.5 text-gray-400 mb-1 shrink-0" />
            <span className="text-[10px] text-gray-400 font-medium uppercase">Mileage</span>
            <span className="text-xs font-semibold text-gray-900 truncate max-w-full">{car.mileage}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500 text-center">
            <Fuel className="w-3.5 h-3.5 text-gray-400 mb-1 shrink-0" />
            <span className="text-[10px] text-gray-400 font-medium uppercase">Fuel</span>
            <span className="text-xs font-semibold text-gray-900 truncate max-w-full">{car.fuel}</span>
          </div>
        </div>

        {/* Location & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">{car.location}</span>
          </div>
          <Link href={`/buy-car/${car.id}`} suppressHydrationWarning className="text-xs border border-[#0055FE] text-[#0055FE] hover:bg-blue-50 font-bold transition-colors flex items-center gap-1 shrink-0 min-h-[36px] px-3 rounded-md">
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
    <section className="relative py-12 sm:py-20 md:py-28 bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-[2px] bg-[#0055FE] rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0055FE]">
                Featured
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Trending <span className="text-[#0055FE]">Cars</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-md">
              Curated selection of the finest vehicles currently available on our
              marketplace.
            </p>
          </div>
          <Link href="/buy-car" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="mt-4 sm:mt-0 w-full sm:w-auto border-[#0055FE] text-[#0055FE] hover:bg-blue-50 hover:text-blue-700 h-11 transition-colors"
            >
              View All Listings
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllCars().slice(0, 6).map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
