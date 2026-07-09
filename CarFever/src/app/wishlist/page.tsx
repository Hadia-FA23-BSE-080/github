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
      <main className="min-h-screen pt-24 pb-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[2px] bg-neon-red rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-red">My Collection</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                  My <span className="text-neon-red">Wishlist</span>
                  {wishlistCars.length > 0 && (
                    <span className="text-sm font-normal bg-neon-red/10 text-neon-red border border-neon-red/20 px-3 py-1 rounded-full">
                      {wishlistCars.length} {wishlistCars.length === 1 ? "car" : "cars"}
                    </span>
                  )}
                </h1>
                <p className="text-zinc-400 mt-2 text-sm">Cars you&apos;ve saved for later.</p>
              </div>
              {wishlistCars.length > 0 && (
                <Link href="/buy-car">
                  <Button variant="outline" className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/5">
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
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 hover:shadow-2xl hover:shadow-neon-red/5 flex flex-col"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(car.id)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-neon-red/80 transition-all duration-200 active:scale-90"
                    title="Remove from wishlist"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Image */}
                  <div className="relative aspect-[16/11] overflow-hidden shrink-0">
                    <img
                      src={car.image}
                      alt={car.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-sm font-bold text-white drop-shadow">{car.priceDisplay}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-neon-red transition-colors mb-3 line-clamp-1">
                      {car.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-zinc-400">
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neon-red shrink-0" />
                        <span className="text-xs">{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                        <Gauge className="w-3.5 h-3.5 text-electric-blue shrink-0" />
                        <span className="text-xs truncate">{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                        <Fuel className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-xs">{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-xs truncate">{car.location.split(",")[0]}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href={`/buy-car/${car.id}`}>
                        <Button size="sm" className="w-full bg-neon-red hover:bg-red-600 text-white text-xs font-bold glow-red-subtle">
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
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Heart className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-neon-red/10 rounded-full flex items-center justify-center border border-neon-red/20">
                  <Car className="w-4 h-4 text-neon-red/50" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No cars in your wishlist yet</h2>
              <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
                Browse our marketplace and click the{" "}
                <Heart className="w-3.5 h-3.5 inline text-neon-red fill-neon-red" />{" "}
                heart icon on any car to save it for later.
              </p>
              <Link href="/buy-car">
                <Button className="bg-neon-red hover:bg-red-600 text-white font-bold px-8 h-12 text-base glow-red">
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
