"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Check,
  X,
  Car,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CarStatus = "Pending" | "Approved" | "Rejected";

interface CarListing {
  id: string;
  title: string;
  year: number;
  location: string;
  price: string;
  sellerName: string;
  sellerEmail: string;
  status: CarStatus;
  date: string;
  image: string;
}

const INITIAL_CARS: CarListing[] = [
  {
    id: "CF-001",
    title: "Toyota Corolla Altis Grande",
    year: 2024,
    location: "Lahore",
    price: "PKR 62.5 Lacs",
    sellerName: "Ahmad Raza",
    sellerEmail: "ahmad.raza@gmail.com",
    status: "Pending",
    date: "Jul 09, 2026",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-002",
    title: "Honda Civic RS Turbo",
    year: 2024,
    location: "Islamabad",
    price: "PKR 89.0 Lacs",
    sellerName: "Bilal Khan",
    sellerEmail: "bilal.k@hotmail.com",
    status: "Pending",
    date: "Jul 08, 2026",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-003",
    title: "KIA Sportage Alpha AWD",
    year: 2023,
    location: "Karachi",
    price: "PKR 95.0 Lacs",
    sellerName: "Sara Malik",
    sellerEmail: "sara.malik@yahoo.com",
    status: "Approved",
    date: "Jul 07, 2026",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-004",
    title: "Hyundai Tucson GLS Sport",
    year: 2023,
    location: "Rawalpindi",
    price: "PKR 88.0 Lacs",
    sellerName: "Usman Ali",
    sellerEmail: "usman@gmail.com",
    status: "Pending",
    date: "Jul 06, 2026",
    image: "https://images.unsplash.com/photo-1503378462226-94918fad2511?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-005",
    title: "Suzuki Swift DLX Nav",
    year: 2024,
    location: "Faisalabad",
    price: "PKR 38.5 Lacs",
    sellerName: "Fatima Noor",
    sellerEmail: "fatima.noor@gmail.com",
    status: "Approved",
    date: "Jul 05, 2026",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-006",
    title: "Toyota Fortuner Sigma 4",
    year: 2024,
    location: "Lahore",
    price: "PKR 152.0 Lacs",
    sellerName: "Hamza Tariq",
    sellerEmail: "hamza.t@outlook.com",
    status: "Rejected",
    date: "Jul 04, 2026",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-007",
    title: "Honda City Aspire 1.5",
    year: 2023,
    location: "Multan",
    price: "PKR 48.0 Lacs",
    sellerName: "Zainab Iqbal",
    sellerEmail: "zainab.i@gmail.com",
    status: "Pending",
    date: "Jul 03, 2026",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-008",
    title: "MG HS Essence Trophy",
    year: 2024,
    location: "Islamabad",
    price: "PKR 78.0 Lacs",
    sellerName: "Ali Hassan",
    sellerEmail: "ali.h@gmail.com",
    status: "Approved",
    date: "Jul 02, 2026",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494ceb8?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-009",
    title: "Toyota Yaris ATIV X CVT",
    year: 2023,
    location: "Peshawar",
    price: "PKR 42.0 Lacs",
    sellerName: "Nadia Shah",
    sellerEmail: "nadia.s@yahoo.com",
    status: "Rejected",
    date: "Jul 01, 2026",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "CF-010",
    title: "Changan Alsvin Lumiere",
    year: 2024,
    location: "Sialkot",
    price: "PKR 36.0 Lacs",
    sellerName: "Kamran Javed",
    sellerEmail: "kamran.j@gmail.com",
    status: "Pending",
    date: "Jun 30, 2026",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=80",
  },
];

const ITEMS_PER_PAGE = 6;

const statusColor: Record<CarStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ManageCarsPage() {
  const [cars, setCars] = useState<CarListing[]>(INITIAL_CARS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CarStatus>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    carId: string;
    action: "Approved" | "Rejected";
    carTitle: string;
  } | null>(null);

  // Filter + Search
  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || car.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cars, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = (id: string, newStatus: "Approved" | "Rejected") => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setConfirmDialog(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Manage Car Listings
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Approve, reject, or edit car submissions from sellers
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by car name or seller..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "All" | CarStatus);
              setCurrentPage(1);
            }}
            className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-neon-red cursor-pointer min-w-[160px]"
          >
            <option value="All" className="bg-zinc-900">All Status</option>
            <option value="Pending" className="bg-zinc-900">Pending</option>
            <option value="Approved" className="bg-zinc-900">Approved</option>
            <option value="Rejected" className="bg-zinc-900">Rejected</option>
          </select>
        </div>

        {/* Add New Car */}
        <Button className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle gap-2">
          <Plus className="w-4 h-4" />
          Add New Car
        </Button>
      </div>

      {/* Table / Card View */}
      {paginated.length === 0 ? (
        /* Empty State */
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-16 text-center">
          <Car className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No cars found</h3>
          <p className="text-sm text-zinc-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Seller</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {paginated.map((car) => (
                    <tr
                      key={car.id}
                      className="hover:bg-white/[0.02] transition-colors animate-in fade-in duration-200"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={car.image}
                            alt={car.title}
                            className="w-[60px] h-[60px] rounded-lg object-cover bg-zinc-800 border border-white/5 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-bold text-white">
                              {car.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {car.year}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {car.location}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-0.5">
                              {car.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">
                          {car.sellerName}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {car.sellerEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-neon-red">
                          {car.price}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          className={`text-[10px] font-bold px-2.5 py-1 uppercase border ${statusColor[car.status]}`}
                        >
                          {car.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-500">
                        {car.date}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {car.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    carId: car.id,
                                    action: "Approved",
                                    carTitle: car.title,
                                  })
                                }
                                className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    carId: car.id,
                                    action: "Rejected",
                                    carTitle: car.title,
                                  })
                                }
                                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/20 text-electric-blue hover:bg-electric-blue hover:text-white transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginated.map((car) => (
              <div
                key={car.id}
                className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in duration-200"
              >
                <div className="flex gap-3 p-4">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {car.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.location}</span>
                    </div>
                    <p className="text-sm font-bold text-neon-red mt-1.5">
                      {car.price}
                    </p>
                  </div>
                  <Badge
                    className={`text-[9px] font-bold px-2 py-0.5 uppercase border h-fit ${statusColor[car.status]}`}
                  >
                    {car.status}
                  </Badge>
                </div>

                <div className="px-4 pb-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <div className="text-xs text-zinc-500">
                    <span className="text-zinc-400 font-medium">{car.sellerName}</span> • {car.date}
                  </div>
                  <div className="flex gap-2">
                    {car.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              carId: car.id,
                              action: "Approved",
                              carTitle: car.title,
                            })
                          }
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              carId: car.id,
                              action: "Rejected",
                              carTitle: car.title,
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 rounded-lg bg-electric-blue/10 border border-electric-blue/20 text-electric-blue">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            Showing{" "}
            <span className="text-white font-semibold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="text-white font-semibold">{filtered.length}</span>{" "}
            cars
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-neon-red text-white"
                    : "border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDialog(null)}
          />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-bold text-white mb-2">
              {confirmDialog.action === "Approved"
                ? "Approve Listing?"
                : "Reject Listing?"}
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to{" "}
              <span
                className={
                  confirmDialog.action === "Approved"
                    ? "text-emerald-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {confirmDialog.action === "Approved" ? "approve" : "reject"}
              </span>{" "}
              <span className="text-white font-semibold">
                &ldquo;{confirmDialog.carTitle}&rdquo;
              </span>
              ? This action can be reversed later.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog(null)}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleStatusChange(confirmDialog.carId, confirmDialog.action)
                }
                className={
                  confirmDialog.action === "Approved"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                {confirmDialog.action === "Approved" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
