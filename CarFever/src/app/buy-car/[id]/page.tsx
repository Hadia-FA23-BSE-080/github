"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Calendar, 
  Gauge, 
  Fuel, 
  MapPin, 
  Share2, 
  CircleDot, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Phone,
  MessageSquare,
  X,
  CheckCircle2,
  User,
  Mail,
  FileText,
  DollarSign
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCarById, getAllCars } from "@/lib/car-data";
import { saveInquiry } from "@/lib/storage";

export default function CarDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [contactOpen, setContactOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [offerForm, setOfferForm] = useState({ name: "", email: "", phone: "", offerPrice: "", note: "" });
  const [formError, setFormError] = useState("");

  const allCars = getAllCars();
  const car = getCarById(Number(id)) || allCars[0];
  
  let similarCars = allCars.filter(c => c.make === car.make && c.id !== car.id);
  if (similarCars.length < 4) {
    const additional = allCars.filter(c => c.id !== car.id && c.make !== car.make);
    similarCars = [...similarCars, ...additional].slice(0, 4);
  } else {
    similarCars = similarCars.slice(0, 4);
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setFormError("");
    saveInquiry({
      id: "INQ-" + Date.now(),
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      subject: `Inquiry about ${car.title} (${car.year})`,
      message: contactForm.message,
      read: false,
      date: new Date().toISOString(),
    });
    setFormSubmitted(true);
    setTimeout(() => { setContactOpen(false); setFormSubmitted(false); setContactForm({ name: "", email: "", phone: "", message: "" }); }, 2500);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.name.trim() || !offerForm.email.trim() || !offerForm.offerPrice.trim()) {
      setFormError("Please fill name, email and offer price.");
      return;
    }
    setFormError("");
    saveInquiry({
      id: "INQ-" + Date.now(),
      name: offerForm.name,
      email: offerForm.email,
      phone: offerForm.phone,
      subject: `Offer: ${offerForm.offerPrice} for ${car.title} (${car.year})`,
      message: offerForm.note || `I would like to offer ${offerForm.offerPrice} for your ${car.title}.`,
      read: false,
      date: new Date().toISOString(),
    });
    setFormSubmitted(true);
    setTimeout(() => { setOfferOpen(false); setFormSubmitted(false); setOfferForm({ name: "", email: "", phone: "", offerPrice: "", note: "" }); }, 2500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[#09090b]">
        
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/buy-car" className="hover:text-white transition-colors">Buy Car</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-300">{car.title} {car.year}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row gap-10 mb-16">
            
            {/* Left: Gallery (60%) */}
            <div className="w-full lg:w-[60%]">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-zinc-900 group">
                <img 
                  src={(car.images || [car.image])[activeImage % (car.images || [car.image]).length]} 
                  alt={car.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* 360 View Badge / Button */}
                <div className="absolute top-4 left-4">
                  <Button size="sm" className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 rounded-full">
                    <CircleDot className="w-4 h-4 mr-2 text-neon-red" />
                    360° View
                  </Button>
                </div>
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-neon-red hover:bg-black/70 border border-white/10 transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-electric-blue hover:bg-black/70 border border-white/10 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2">
                {(car.images || [car.image]).map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-16 sm:w-32 sm:h-20 shrink-0 rounded-lg overflow-hidden snap-center border-2 transition-all ${
                      activeImage === idx ? 'border-neon-red scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col">
              
              {/* Badges & Realtime */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-electric-blue/10 text-electric-blue text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certified
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-neon-red" />
                  12 people viewing this right now
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {car.title}
              </h1>
              
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6 pb-6 border-b border-white/10">
                <MapPin className="w-4 h-4 text-neon-red" />
                {car.location}
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-sm text-zinc-500 mb-1">Asking Price</div>
                <div className="text-4xl font-bold text-white drop-shadow-md">
                  {car.priceDisplay}
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-neon-red/50 transition-colors">
                  <Calendar className="w-5 h-5 text-neon-red mb-2" />
                  <span className="text-xs text-zinc-500">Year</span>
                  <span className="text-sm font-semibold text-white">{car.year}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-electric-blue/50 transition-colors">
                  <Gauge className="w-5 h-5 text-electric-blue mb-2" />
                  <span className="text-xs text-zinc-500">Mileage</span>
                  <span className="text-sm font-semibold text-white">{car.mileage}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-colors">
                  <Fuel className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-xs text-zinc-500">Fuel</span>
                  <span className="text-sm font-semibold text-white">{car.fuel}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-amber-500/50 transition-colors">
                  <Zap className="w-5 h-5 text-amber-500 mb-2" />
                  <span className="text-xs text-zinc-500">Engine</span>
                  <span className="text-sm font-semibold text-white">{car.engine}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-purple-500/50 transition-colors col-span-2">
                  <CircleDot className="w-5 h-5 text-purple-500 mb-2" />
                  <span className="text-xs text-zinc-500">Transmission</span>
                  <span className="text-sm font-semibold text-white">{car.transmission}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-auto flex flex-col gap-3">
                <Button onClick={() => { setContactOpen(true); setFormSubmitted(false); setFormError(""); }} size="lg" className="w-full bg-neon-red hover:bg-red-600 text-white font-bold h-14 text-base glow-red-subtle hover:glow-red transition-all">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Seller
                </Button>
                <Button onClick={() => { setOfferOpen(true); setFormSubmitted(false); setFormError(""); }} variant="outline" size="lg" className="w-full border-electric-blue text-electric-blue hover:bg-electric-blue/10 h-14 text-base transition-colors">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Make an Offer
                </Button>
              </div>

            </div>
          </div>

          {/* Details Tabs */}
          <div className="mb-20">
            <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
              {['description', 'features', 'inspection'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab 
                      ? 'border-neon-red text-white' 
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'features' ? 'Features & Options' : tab === 'inspection' ? 'Inspection Report' : 'Description'}
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 min-h-[300px]">
              {activeTab === 'description' && (
                <div className="text-zinc-300 leading-relaxed space-y-4">
                  <p>
                    Up for sale is a meticulously maintained {car.title} {car.year} model. 
                    This car has been strictly driven in {car.location.split(',').pop()} and is in total pristine condition.
                    It comes with a powerful {car.engine} engine that delivers excellent fuel economy without compromising on performance.
                  </p>
                  <p>
                    <strong>Key Highlights:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                    <li>1st Owner, registered in Lahore.</li>
                    <li>100% original paint, no touch-ups (Bumper to Bumper genuine).</li>
                    <li>Token tax paid up to date.</li>
                    <li>Original keys and manuals available.</li>
                    <li>Maintained strictly from authorized Toyota Dealership (Service history available).</li>
                  </ul>
                  <p>Price is slightly negotiable for serious buyers. Please contact during office hours.</p>
                </div>
              )}
              {activeTab === 'features' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 text-sm text-zinc-300">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> ABS Brakes</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Airbags</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Power Windows</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Power Steering</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Immobilizer Key</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Keyless Entry</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Alloy Rims</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-red" /> Rear Camera</div>
                </div>
              )}
              {activeTab === 'inspection' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShieldCheck className="w-16 h-16 text-electric-blue mb-4 opacity-80" />
                  <h3 className="text-xl font-bold text-white mb-2">Car Fever Certified</h3>
                  <p className="text-zinc-400 max-w-md mb-6">
                    This vehicle has passed our rigorous 200+ point inspection process. 
                    Engine, transmission, and suspension are in perfect working order.
                  </p>
                  <Button className="bg-electric-blue hover:bg-blue-600 text-white">
                    Download Full Report
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Similar Cars Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar <span className="text-neon-red">Cars</span></h2>
              <Button variant="link" className="text-electric-blue hover:text-white px-0">View All</Button>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide">
              {similarCars.map((car) => (
                <Link key={car.id} href={`/buy-car/${car.id}`} suppressHydrationWarning className="min-w-[300px] sm:min-w-[350px] snap-center shrink-0 group rounded-2xl overflow-hidden bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-2xl flex flex-col">
                  <div className="relative aspect-[16/11] overflow-hidden shrink-0">
                    <img
                      src={(car.images || [car.image])[0]}
                      alt={car.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white mb-3 line-clamp-1">{car.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-zinc-400">
                      <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1">
                        <Calendar className="w-3 h-3 text-neon-red" />
                        <span className="text-xs font-medium">{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1">
                        <Gauge className="w-3 h-3 text-electric-blue" />
                        <span className="text-xs font-medium">{car.mileage}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-lg font-bold text-white">{car.priceDisplay}</span>
                      <ChevronRight className="w-4 h-4 text-neon-red" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {/* ── CONTACT SELLER MODAL ── */}
      {contactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setContactOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setContactOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-zinc-400 text-sm">The seller will contact you shortly.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Contact Seller</h2>
                  <p className="text-zinc-400 text-sm">About: <span className="text-white font-medium">{car.title} {car.year}</span></p>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Your Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input value={contactForm.name} onChange={e => setContactForm(p => ({...p, name: e.target.value}))} placeholder="Ahmed Khan" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-neon-red text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} placeholder="you@email.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-neon-red text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input value={contactForm.phone} onChange={e => setContactForm(p => ({...p, phone: e.target.value}))} placeholder="+92 300 1234567" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-neon-red text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Message *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                      <textarea value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} rows={4} placeholder={`Hi, I'm interested in your ${car.title}. Is it still available?`} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-neon-red text-sm resize-none" />
                    </div>
                  </div>
                  {formError && <p className="text-xs text-neon-red bg-neon-red/10 border border-neon-red/20 rounded-lg px-3 py-2">{formError}</p>}
                  <Button type="submit" size="lg" className="w-full bg-neon-red hover:bg-red-600 text-white font-bold h-12 glow-red-subtle">
                    <Phone className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MAKE AN OFFER MODAL ── */}
      {offerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOfferOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOfferOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="w-16 h-16 text-electric-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Offer Submitted!</h3>
                <p className="text-zinc-400 text-sm">The seller will review your offer and respond soon.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Make an Offer</h2>
                  <p className="text-zinc-400 text-sm">Asking: <span className="text-neon-red font-bold">{car.priceDisplay}</span></p>
                </div>
                <form onSubmit={handleOfferSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Your Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input value={offerForm.name} onChange={e => setOfferForm(p => ({...p, name: e.target.value}))} placeholder="Ahmed Khan" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input type="email" value={offerForm.email} onChange={e => setOfferForm(p => ({...p, email: e.target.value}))} placeholder="you@email.com" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Phone (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input value={offerForm.phone} onChange={e => setOfferForm(p => ({...p, phone: e.target.value}))} placeholder="+92 300 1234567" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Your Offer (PKR) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input value={offerForm.offerPrice} onChange={e => setOfferForm(p => ({...p, offerPrice: e.target.value}))} placeholder="e.g. 43 Lacs" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Note (Optional)</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                      <textarea value={offerForm.note} onChange={e => setOfferForm(p => ({...p, note: e.target.value}))} rows={3} placeholder="Any additional details about your offer..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-electric-blue text-sm resize-none" />
                    </div>
                  </div>
                  {formError && <p className="text-xs text-neon-red bg-neon-red/10 border border-neon-red/20 rounded-lg px-3 py-2">{formError}</p>}
                  <Button type="submit" size="lg" className="w-full bg-electric-blue hover:bg-blue-600 text-white font-bold h-12">
                    <MessageSquare className="w-4 h-4 mr-2" /> Submit Offer
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
