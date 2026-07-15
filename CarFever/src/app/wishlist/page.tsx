"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Heart, Gauge, Calendar, Fuel, MapPin, X, Car } from "lucide-react";
import { getAllCars, CarListing } from "@/lib/car-data";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const [wishlistCars, setWishlistCars] = useState<CarListing[]>([]);

  const refresh = () => {
    const ids = getWishlist();
    setWishlistCars(getAllCars().filter((c) => ids.includes(c.id)));
  };

  useEffect(() => {
    refresh();
    window.addEventListener("wishlist-updated", refresh);
    return () => window.removeEventListener("wishlist-updated", refresh);
  }, []);

  const handleRemove = (carId: number) => {
    removeFromWishlist(carId);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 lg:pt-24 pb-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-[#0055FE] rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0055FE]">My Collection</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                  My <span className="text-[#0055FE]">Wishlist</span>
                  {wishlistCars.length > 0 && (
                    <span className="text-sm font-normal bg-[#0055FE]/10 text-[#0055FE] border border-[#0055FE]/20 px-3 py-1 rounded-full">
                      {wishlistCars.length} {wishlistCars.length === 1 ? "car" : "cars"}
                    </span>
                  )}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">Cars you&apos;ve saved for later.</p>
              </div>
              {wishlistCars.length > 0 && (
                <Link href="/buy-car">
                  <Button variant="outline" className="border-[#0055FE] text-[#0055FE] hover:bg-blue-50">
                    Browse More Cars
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Grid */}
          {wishlistCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative rounded-xl overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(car.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-gray-500 hover:text-red-500 hover:bg-red-50 border border-gray-200 transition-all duration-200 active:scale-90 shadow-sm"
                    title="Remove from wishlist"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Image */}
                  <div className="relative aspect-[16/11] overflow-hidden shrink-0">
                    <img
                      src={car.image}
                      alt={car.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      <span className="text-sm font-bold text-[#0055FE]">{car.priceDisplay}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0055FE] transition-colors mb-3 line-clamp-1">
                      {car.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-700">{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                        <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-700 truncate">{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                        <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-700">{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-700 truncate">{car.location.split(",")[0]}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href={`/buy-car/${car.id}`}>
                        <Button size="sm" className="w-full border border-[#0055FE] text-[#0055FE] hover:bg-blue-50 bg-white text-xs font-bold">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                  <Heart className="w-10 h-10 text-gray-300" />
                </div>
                <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-[#0055FE]/10 rounded-full flex items-center justify-center border border-[#0055FE]/20">
                  <Car className="w-4 h-4 text-[#0055FE]/50" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No cars in your wishlist yet</h2>
              <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">
                Browse our marketplace and click the{" "}
                <Heart className="w-3.5 h-3.5 inline text-[#0055FE] fill-[#0055FE]" />{" "}
                heart icon on any car to save it for later.
              </p>
              <Link href="/buy-car">
                <Button className="bg-[#0055FE] hover:bg-blue-700 text-white font-bold px-8 h-12 text-base">
                  Browse Cars Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
