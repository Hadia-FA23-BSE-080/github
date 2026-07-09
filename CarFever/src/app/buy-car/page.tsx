"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  SlidersHorizontal, 
  ChevronDown, 
  Heart, 
  Fuel, 
  Gauge, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Search,
  Car
} from "lucide-react";
import Link from "next/link";
import { getAllCars, CarListing } from "@/lib/car-data";
import { isInWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlist";

function CarCard({ car }: { car: CarListing }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(car.id));
    const handleUpdate = () => setIsWishlisted(isInWishlist(car.id));
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
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
    <div className="group rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-2xl hover:shadow-neon-red/5 flex flex-col">
      <div className="relative aspect-[16/11] overflow-hidden shrink-0">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm transition-all duration-200 active:scale-90 ${
            isWishlisted ? "text-neon-red scale-105" : "text-white/70 hover:text-neon-red hover:bg-black/60"
          }`}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${isWishlisted ? "fill-neon-red text-neon-red" : ""}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-white group-hover:text-neon-red transition-colors duration-300 mb-4 line-clamp-1">
          {car.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-5 text-zinc-400">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-neon-red shrink-0" />
            <span className="text-xs font-medium">{car.year}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Gauge className="w-4 h-4 text-electric-blue shrink-0" />
            <span className="text-xs font-medium truncate">{car.mileage}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 col-span-2">
            <Fuel className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-medium">{car.fuel}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-lg font-bold text-white drop-shadow-lg">
            {car.priceDisplay}
          </span>
          <Link href={`/buy-car/${car.id}`} suppressHydrationWarning>
            <Button size="sm" className="bg-neon-red hover:bg-red-600 text-white glow-red-subtle">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  selectedMake: string | null;
  setSelectedMake: (make: string | null) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedFuel: string[];
  setSelectedFuel: (fuel: string[]) => void;
  onReset: () => void;
}

function FilterSidebar({
  selectedMake,
  setSelectedMake,
  maxPrice,
  setMaxPrice,
  selectedYear,
  setSelectedYear,
  selectedFuel,
  setSelectedFuel,
  onReset,
}: FilterSidebarProps) {
  const makes = ["Toyota", "Honda", "Suzuki", "KIA", "Hyundai", "Tesla"];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

  const handleFuelToggle = (fuel: string, checked: boolean) => {
    if (checked) {
      setSelectedFuel([...selectedFuel, fuel]);
    } else {
      setSelectedFuel(selectedFuel.filter((f) => f !== fuel));
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Make */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Make / Brand</h3>
        <select 
          value={selectedMake || ""} 
          onChange={(e) => setSelectedMake(e.target.value || null)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors focus:ring-1 focus:ring-neon-red focus:outline-none appearance-none cursor-pointer"
        >
          <option value="" className="bg-zinc-950">All Makes</option>
          {makes.map(m => (
            <option key={m} value={m} className="bg-zinc-950">{m}</option>
          ))}
        </select>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Max Price</h3>
          <span className="text-xs font-bold text-neon-red bg-neon-red/10 px-2 py-0.5 rounded">
            {(maxPrice / 100000).toFixed(1)} Lacs
          </span>
        </div>
        <input 
          type="range" 
          min="1000000" 
          max="20000000" 
          step="500000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-red"
        />
        <div className="flex justify-between items-center mt-3 text-xs text-zinc-400">
          <span>10 Lacs</span>
          <span>2 Crore+</span>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Year */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Model Year</h3>
        <select 
          value={selectedYear || ""} 
          onChange={(e) => setSelectedYear(e.target.value || null)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/8 transition-colors focus:ring-1 focus:ring-neon-red focus:outline-none appearance-none cursor-pointer"
        >
          <option value="" className="bg-zinc-950">Any Year</option>
          <option value="2024" className="bg-zinc-950">2024</option>
          <option value="2023" className="bg-zinc-950">2023</option>
          <option value="2022" className="bg-zinc-950">2022</option>
          <option value="2021" className="bg-zinc-950">2021</option>
          <option value="2020" className="bg-zinc-950">2020</option>
        </select>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Fuel Type */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Fuel Type</h3>
        <div className="space-y-3">
          {fuelTypes.map((fuel) => {
            const isChecked = selectedFuel.includes(fuel);
            return (
              <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleFuelToggle(fuel, e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-neon-red focus:ring-neon-red focus:ring-offset-background" 
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{fuel}</span>
              </label>
            );
          })}
        </div>
      </div>

      <Button 
        onClick={onReset}
        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 mt-4 transition-colors"
      >
        Reset Filters
      </Button>
    </div>
  );
}

function BuyCarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Sync URL search param
  const urlSearch = searchParams?.get("search") || "";
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const handleResetFilters = () => {
    setSelectedMake(null);
    setMaxPrice(20000000);
    setSelectedYear(null);
    setSelectedFuel([]);
    setSearchQuery("");
    setCurrentPage(1);
    // clear query param
    router.push("/buy-car");
  };

  const handleRemoveFuel = (fuel: string) => {
    setSelectedFuel(selectedFuel.filter(f => f !== fuel));
  };

  const hasActiveFilters = selectedMake || maxPrice < 20000000 || selectedYear || selectedFuel.length > 0 || searchQuery;

  // Filter listings
  const allCars = getAllCars();
  const filteredCars = allCars.filter((car) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchMake = car.make.toLowerCase().includes(q);
      const matchModel = car.model.toLowerCase().includes(q);
      if (!matchTitle && !matchMake && !matchModel) return false;
    }
    if (selectedMake && car.make !== selectedMake) return false;
    if (car.price > maxPrice) return false;
    if (selectedYear && car.year.toString() !== selectedYear) return false;
    if (selectedFuel.length > 0 && !selectedFuel.includes(car.fuel)) return false;
    return true;
  });

  // Sort listings
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "year-desc") return b.year - a.year;
    return b.year - a.year; // newest first
  });

  // Pagination
  const totalPages = Math.ceil(sortedCars.length / ITEMS_PER_PAGE);
  const displayedCars = sortedCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMake, maxPrice, selectedYear, selectedFuel, searchQuery, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Browse Cars</h1>
              <p className="text-zinc-400 text-sm">Find the perfect vehicle that fits your lifestyle.</p>
            </div>

            {/* Mobile Filter Trigger */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger 
                  render={<Button variant="outline" className="flex lg:hidden border-white/10 text-white bg-white/5 hover:bg-white/10" />}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-[#09090b] border-r-white/10 p-6 overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-white text-left">Filter Inventory</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar 
                    selectedMake={selectedMake}
                    setSelectedMake={setSelectedMake}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedFuel={selectedFuel}
                    setSelectedFuel={setSelectedFuel}
                    onReset={handleResetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-1/4 shrink-0">
              <div className="sticky top-24 bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <FilterSidebar 
                  selectedMake={selectedMake}
                  setSelectedMake={setSelectedMake}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  selectedFuel={selectedFuel}
                  setSelectedFuel={setSelectedFuel}
                  onReset={handleResetFilters}
                />
              </div>
            </aside>

            {/* Main Area */}
            <div className="w-full lg:w-3/4">
              
              {/* Active Badges Panel */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-zinc-400 mr-2">Active Filters:</span>
                  {searchQuery && (
                    <Badge variant="outline" className="flex items-center gap-1.5 border-white/20 text-zinc-300 pl-2 pr-1.5 py-1">
                      Query: &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </Badge>
                  )}
                  {selectedMake && (
                    <Badge variant="outline" className="flex items-center gap-1.5 border-white/20 text-zinc-300 pl-2 pr-1.5 py-1">
                      Make: {selectedMake}
                      <button onClick={() => setSelectedMake(null)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </Badge>
                  )}
                  {maxPrice < 20000000 && (
                    <Badge variant="outline" className="flex items-center gap-1.5 border-white/20 text-zinc-300 pl-2 pr-1.5 py-1">
                      Under {(maxPrice / 100000).toFixed(1)} Lacs
                      <button onClick={() => setMaxPrice(20000000)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </Badge>
                  )}
                  {selectedYear && (
                    <Badge variant="outline" className="flex items-center gap-1.5 border-white/20 text-zinc-300 pl-2 pr-1.5 py-1">
                      Year: {selectedYear}
                      <button onClick={() => setSelectedYear(null)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </Badge>
                  )}
                  {selectedFuel.map(f => (
                    <Badge key={f} variant="outline" className="flex items-center gap-1.5 border-white/20 text-zinc-300 pl-2 pr-1.5 py-1">
                      Fuel: {f}
                      <button onClick={() => handleRemoveFuel(f)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </Badge>
                  ))}
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-neon-red hover:underline ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-zinc-300 text-sm font-medium mb-4 sm:mb-0">
                  {sortedCars.length} {sortedCars.length === 1 ? "Car" : "Cars"} Found
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs text-zinc-500 shrink-0">Sort By:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:w-48 px-4 py-2 bg-[#09090b] border border-white/10 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-neon-red appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-desc">Year: Newest</option>
                  </select>
                </div>
              </div>

              {/* Car Grid */}
              {sortedCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  {displayedCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 text-zinc-400">
                    <Car className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Cars Found</h3>
                  <p className="text-zinc-400 text-sm max-w-sm mb-6">
                    We couldn&apos;t find any vehicles matching your filter criteria. Try relaxing your filters.
                  </p>
                  <Button onClick={handleResetFilters} className="bg-neon-red hover:bg-red-600 text-white font-bold px-6">
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 text-zinc-400 hover:text-white bg-white/5"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <Button 
                        key={page} 
                        variant={page === currentPage ? "default" : "outline"} 
                        className={`w-10 h-10 ${page === currentPage ? 'bg-neon-red text-white hover:bg-red-600 border-none' : 'border-white/10 text-zinc-400 hover:text-white bg-white/5'}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 text-zinc-400 hover:text-white bg-white/5"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BuyCarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">Loading...</div>}>
      <BuyCarContent />
    </Suspense>
  );
}
