"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
  Bell,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  LogOut,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Trash2,
  BellOff,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAllCars } from "@/lib/car-data";
import { getWishlist, removeFromWishlist, getWishlistCount } from "@/lib/wishlist";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; }[];
}

const navLinks: NavLink[] = [
  { label: "Buy Car", href: "/buy-car" },
  { label: "Sell Car", href: "/sell-car" },
  { label: "Inspections", href: "/inspections" },
];

const DEMO_NOTIFICATIONS = [
  { id: 1, type: "price", title: "Price Drop Alert!", body: "Toyota Corolla GLi price dropped to PKR 43 Lacs.", time: "2m ago", read: false },
  { id: 2, type: "new", title: "New Listing Match", body: "A new Honda Civic matching your search is available.", time: "1h ago", read: false },
  { id: 3, type: "insp", title: "Inspection Confirmed", body: "Your inspection for KIA Sportage is scheduled for tomorrow.", time: "3h ago", read: true },
  { id: 4, type: "info", title: "Verification Complete", body: "Your seller account has been successfully verified.", time: "1d ago", read: true },
];

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

export function Navbar() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Panel & modal states
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Logged-in user state
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  // Auth form state
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authErrors, setAuthErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  // Wishlist state — dynamic from localStorage
  const buildWishlistCars = () => {
    const ids = getWishlist();
    return getAllCars().filter(c => ids.includes(c.id));
  };
  const [wishlistCars, setWishlistCars] = useState(buildWishlistCars);
  const wishlistCount = wishlistCars.length;

  // Notifications state
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load current user from localStorage on mount + wishlist sync
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cf_current_user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}

    // Sync wishlist with localStorage
    setWishlistCars(buildWishlistCars());
    const handleWishlistUpdate = () => setWishlistCars(buildWishlistCars());
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    setAuthErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof authErrors = {};

    if (authModal === "signup" && !authData.name.trim()) {
      errors.name = "Please enter your full name.";
    }
    if (!authData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!validateEmail(authData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!authData.password) {
      errors.password = "Password is required.";
    } else if (authData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }

    if (authModal === "signup") {
      // Check if email already registered
      try {
        const users: StoredUser[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
        const exists = users.find(u => u.email.toLowerCase() === authData.email.toLowerCase());
        if (exists) {
          setAuthErrors({ email: "An account with this email already exists." });
          return;
        }
        const newUser: StoredUser = { name: authData.name.trim(), email: authData.email.toLowerCase(), password: authData.password };
        users.push(newUser);
        localStorage.setItem("cf_users", JSON.stringify(users));
        localStorage.setItem("cf_current_user", JSON.stringify(newUser));
        setCurrentUser(newUser);
      } catch {}
    } else {
      // Login: find matching account
      try {
        const users: StoredUser[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
        const match = users.find(
          u => u.email.toLowerCase() === authData.email.toLowerCase() && u.password === authData.password
        );
        if (!match) {
          setAuthErrors({ general: "Incorrect email or password. Please try again." });
          return;
        }
        localStorage.setItem("cf_current_user", JSON.stringify(match));
        setCurrentUser(match);
      } catch {}
    }

    setAuthSuccess(true);
    setTimeout(() => {
      setAuthModal(null);
      setAuthSuccess(false);
      setAuthData({ name: "", email: "", password: "" });
      setAuthErrors({});
    }, 1800);
  };

  const handleLogout = () => {
    localStorage.removeItem("cf_current_user");
    setCurrentUser(null);
    setProfileMenuOpen(false);
    closeAll();
  };

  const openAuth = (type: "login" | "signup") => {
    closeAll();
    setAuthData({ name: "", email: "", password: "" });
    setAuthErrors({});
    setAuthSuccess(false);
    setAuthModal(type);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const closeAll = () => {
    setSearchOpen(false);
    setWishlistOpen(false);
    setNotifOpen(false);
    setProfileMenuOpen(false);
  };

  const toggleSearch = () => { closeAll(); setSearchOpen(v => !v); };
  const toggleWishlist = () => { closeAll(); setWishlistOpen(v => !v); };
  const toggleNotif = () => { closeAll(); setNotifOpen(v => !v); };
  const toggleProfile = () => { closeAll(); setProfileMenuOpen(v => !v); };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-neon-red via-electric-blue to-neon-red" />

        {/* Main navbar */}
        <nav className="glass-heavy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-18">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-neon-red flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-white leading-none">
                    Car<span className="text-neon-red">Fever</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase leading-none mt-0.5">
                    Marketplace
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
                    >
                      {link.label}
                      {link.children && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                      )}
                    </Link>
                    {link.children && openDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="glass-heavy rounded-xl p-2 min-w-[200px] shadow-2xl shadow-black/50">
                          {link.children.map((child) => (
                            <Link key={child.label} href={child.href} className="block px-3.5 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-1">
                {/* Search button */}
                <button
                  onClick={toggleSearch}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${searchOpen ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                {/* Wishlist button */}
                <button
                  onClick={toggleWishlist}
                  className={`p-2.5 rounded-lg transition-all duration-200 relative ${wishlistOpen ? "text-neon-red bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Heart className={`w-4.5 h-4.5 ${wishlistCount > 0 ? "fill-neon-red text-neon-red" : ""}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-neon-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Bell button */}
                <button
                  onClick={toggleNotif}
                  className={`p-2.5 rounded-lg transition-all duration-200 relative ${notifOpen ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-red rounded-full" />
                  )}
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                {currentUser ? (
                  <div className="relative">
                    <button
                      onClick={toggleProfile}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${profileMenuOpen ? "bg-white/10" : "hover:bg-white/5"}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-red to-electric-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white max-w-[100px] truncate">{currentUser.name.split(" ")[0]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 py-2 animate-in slide-in-from-top-2 fade-in duration-150">
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{currentUser.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:text-neon-red hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openAuth("login")}
                      className="text-zinc-300 hover:text-white hover:bg-white/5"
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openAuth("signup")}
                      className="bg-neon-red hover:bg-red-600 text-white font-semibold transition-all duration-300"
                    >
                      Signup
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu */}
              <div className="lg:hidden flex items-center gap-2">
                <button onClick={toggleSearch} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger className="p-2 text-zinc-400 hover:text-white transition-colors">
                    <Menu className="w-5 h-5" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-[#09090b] border-white/10 p-0">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                          <div className="w-8 h-8 rounded-lg bg-neon-red flex items-center justify-center">
                            <Car className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-lg font-bold text-white">Car<span className="text-neon-red">Fever</span></span>
                        </Link>
                      </div>
                      <div className="flex-1 overflow-y-auto py-4">
                        {navLinks.map((link) => (
                          <div key={link.label}>
                            <Link href={link.href} className="flex items-center justify-between px-6 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-all" onClick={() => !link.children && setMobileOpen(false)}>
                              <span className="font-medium">{link.label}</span>
                              {link.children && <ChevronDown className="w-4 h-4" />}
                            </Link>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-white/10 space-y-3">
                        {currentUser ? (
                          <>
                            <div className="flex items-center gap-2.5 px-1 py-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-red to-electric-blue flex items-center justify-center text-white text-xs font-bold">
                                {currentUser.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full border-white/10 text-neon-red hover:bg-neon-red/10 gap-2" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                              <LogOut className="w-4 h-4" /> Log Out
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5" onClick={() => { setMobileOpen(false); openAuth("login"); }}>
                              Login
                            </Button>
                            <Button className="w-full bg-neon-red hover:bg-red-600 text-white font-semibold" onClick={() => { setMobileOpen(false); openAuth("signup"); }}>
                              Signup
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

            </div>
          </div>
        </nav>

        {/* ─── SEARCH BAR ─── */}
        {searchOpen && (
          <div className="glass-heavy border-t border-white/[0.06] px-4 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Search cars by brand, model, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/buy-car?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                  }
                }}
                className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm"
              />
              {searchQuery ? (
                <Link
                  href={`/buy-car?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-electric-blue rounded-lg text-white hover:bg-blue-600 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="max-w-2xl mx-auto mt-2 text-xs text-zinc-500 px-1">
                Press Enter or click <span className="text-electric-blue">→</span> to search in marketplace
              </div>
            )}
          </div>
        )}
      </header>

      {/* ─── WISHLIST PANEL ─── */}
      {wishlistOpen && (
        <div className="fixed right-4 top-20 z-[60] w-80 bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-neon-red fill-neon-red" />
              <span className="text-sm font-bold text-white">Saved Cars</span>
              <span className="text-xs text-zinc-500">({wishlistCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/wishlist" onClick={() => setWishlistOpen(false)} className="text-xs text-electric-blue hover:text-blue-400 transition-colors font-medium">
                View All
              </Link>
              <button onClick={() => setWishlistOpen(false)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {wishlistCars.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium text-zinc-300 mb-1">Your wishlist is empty</p>
              <p className="text-xs text-zinc-500 mb-4">Click the heart icon on any car to save it</p>
              <Link href="/buy-car" onClick={() => setWishlistOpen(false)}>
                <Button size="sm" className="bg-neon-red hover:bg-red-600 text-white text-xs">
                  Browse Cars
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-2 space-y-2 max-h-[340px] overflow-y-auto">
              {wishlistCars.map((car) => (
                <div key={car.id} className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <img src={car.image} className="w-20 h-14 rounded-lg object-cover shrink-0" alt={car.title} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{car.title}</p>
                    <p className="text-xs text-neon-red font-bold mt-0.5">{car.priceDisplay}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{car.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Link href={`/buy-car/${car.id}`} onClick={() => setWishlistOpen(false)} className="p-1.5 text-zinc-500 hover:text-electric-blue transition-colors" title="View Details">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button 
                      onClick={() => removeFromWishlist(car.id)} 
                      className="p-1.5 text-zinc-500 hover:text-neon-red transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-white/[0.06]">
            <Link href="/buy-car" onClick={() => setWishlistOpen(false)} className="block text-center text-xs text-electric-blue hover:text-blue-400 transition-colors font-medium">
              Browse More Cars →
            </Link>
          </div>
        </div>
      )}

      {/* ─── NOTIFICATIONS PANEL ─── */}
      {notifOpen && (
        <div className="fixed right-4 top-20 z-[60] w-80 bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-neon-red text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="p-1 text-zinc-500 hover:text-electric-blue transition-colors" title="Mark all read">
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setNotifOpen(false)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                className={`p-3 cursor-pointer hover:bg-white/5 transition-colors ${n.read ? "opacity-60" : ""}`}
              >
                <div className="flex gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-electric-blue" : "bg-transparent"}`} />
                  <div>
                    <p className={`text-xs font-semibold ${n.read ? "text-zinc-400" : "text-white"}`}>{n.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/[0.06]">
            <button onClick={() => setNotifications([])} className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5">
              <BellOff className="w-3.5 h-3.5" />
              Clear all notifications
            </button>
          </div>
        </div>
      )}

      {/* ─── AUTH MODAL ─── */}
      {authModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setAuthModal(null); setAuthSuccess(false); setAuthErrors({}); }} />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-[#0f0f10] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button onClick={() => { setAuthModal(null); setAuthSuccess(false); setAuthErrors({}); }} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>

            {authSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {authModal === "login" ? `Welcome back, ${currentUser?.name.split(" ")[0]}!` : `Welcome, ${currentUser?.name.split(" ")[0]}!`}
                </h2>
                <p className="text-zinc-400 text-sm">
                  {authModal === "login" ? "You are now signed in to CarFever." : "Your account has been created successfully!"}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-red flex items-center justify-center mx-auto mb-4">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {authModal === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    {authModal === "login" ? "Sign in to your CarFever account" : "Join Pakistan's premium car marketplace"}
                  </p>
                </div>

                {/* General error */}
                {authErrors.general && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">{authErrors.general}</p>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authModal === "signup" && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          name="name"
                          placeholder="e.g. Ali Ahmed"
                          value={authData.name}
                          onChange={handleAuthChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                            authErrors.name ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-neon-red"
                          }`}
                        />
                      </div>
                      {authErrors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{authErrors.name}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        name="email"
                        placeholder="you@example.com"
                        value={authData.email}
                        onChange={handleAuthChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                          authErrors.email ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-neon-red"
                        }`}
                      />
                    </div>
                    {authErrors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{authErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Min. 6 characters"
                        value={authData.password}
                        onChange={handleAuthChange}
                        className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                          authErrors.password ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-neon-red"
                        }`}
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {authErrors.password && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{authErrors.password}</p>}
                    {authModal === "login" && !authErrors.password && (
                      <div className="text-right mt-1.5">
                        <button type="button" className="text-xs text-electric-blue hover:text-blue-400 transition-colors">Forgot password?</button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-red hover:bg-red-600 text-white font-bold h-12 mt-2 transition-colors"
                  >
                    {authModal === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <div className="mt-5 text-center text-sm text-zinc-500">
                  {authModal === "login" ? (
                    <>Don&apos;t have an account?{" "}
                      <button onClick={() => openAuth("signup")} className="text-neon-red hover:text-red-400 font-semibold transition-colors">Sign up free</button>
                    </>
                  ) : (
                    <>Already have an account?{" "}
                      <button onClick={() => openAuth("login")} className="text-neon-red hover:text-red-400 font-semibold transition-colors">Sign in</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for panels */}
      {(wishlistOpen || notifOpen || profileMenuOpen) && (
        <div className="fixed inset-0 z-[55]" onClick={closeAll} />
      )}
    </>
  );
}

