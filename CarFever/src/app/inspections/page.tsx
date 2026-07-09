"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Wrench,
  Award,
  DollarSign
} from "lucide-react";

export default function InspectionsPage() {
  const [bookingStarted, setBookingStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    regNumber: "",
    address: "",
    plan: "standard",
    date: "",
    timeSlot: "morning",
    name: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectPlan = (planKey: string) => {
    setFormData(prev => ({ ...prev, plan: planKey }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isStep1Valid = formData.make && formData.model && formData.year && formData.regNumber && formData.address;
  const isStep3Valid = formData.date && formData.timeSlot && formData.name && formData.phone;

  const plans = [
    {
      key: "basic",
      title: "Basic Inspection",
      price: "PKR 3,500",
      points: "75+ Points Check",
      features: [
        "Engine oil & fluid levels check",
        "Basic paint & body panel check",
        "Suspension & tire wear check",
        "Road test check"
      ],
      color: "zinc-500"
    },
    {
      key: "standard",
      title: "Standard Inspection",
      price: "PKR 5,500",
      points: "150+ Points Check",
      features: [
        "Complete engine & transmission diagnostics",
        "Paint thickness testing (accident check)",
        "Interior electrical & climate control check",
        "Detailed undercarriage inspection",
        "Comprehensive digital report"
      ],
      color: "electric-blue"
    },
    {
      key: "premium",
      title: "Premium Inspection",
      price: "PKR 8,500",
      points: "220+ Points Check",
      features: [
        "Everything in Standard Plan",
        "Computer OBD-II fault scan report",
        "Hybrid battery health diagnostic",
        "Engine compression check",
        "Official road-worthiness certificate",
        "Priority 4-hour report delivery"
      ],
      color: "neon-red"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!bookingStarted ? (
            /* INSPECTIONS LANDING PAGE */
            <div className="flex flex-col items-center justify-center text-center mt-12 mb-16">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-electric-blue/20 blur-xl rounded-full scale-125" />
                <ShieldCheck className="relative w-20 h-20 text-electric-blue opacity-90" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Car Fever <span className="text-electric-blue">Inspections</span>
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                Book Pakistan&apos;s most reliable 200+ point doorstep vehicle check. Our certified mechanics inspect body paint, engine, chassis, and electronics to ensure you never buy a lemon.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto text-left mb-16">
                {[
                  { title: "Engine & Gearbox Check", desc: "Compression, mountings, leakage, oil condition and transmission shifts checks." },
                  { title: "Paint & Chassis History", desc: "Digital magnetic paint gauge check to identify hidden accidents and repainted panels." },
                  { title: "Suspension & Steering", desc: "Shock absorbers, bushings, tie rods, and steering rack play test." },
                  { title: "Electrical Systems", desc: "Starter motor, alternator health, sensors, dashboard lights, and battery test." },
                  { title: "Computer OBD Scanner", desc: "Advanced OBD-II scan to detect hidden ECU trouble codes and mileage tampering." },
                  { title: "Comprehensive Road Test", desc: "Real-world test drive checking braking response, wheel alignment, and engine power." }
                ].map((item) => (
                  <div key={item.title} className="flex flex-col gap-2 text-zinc-300 bg-white/5 p-5 rounded-2xl border border-white/[0.06] hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-electric-blue shrink-0" />
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-7.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                onClick={() => setBookingStarted(true)}
                className="bg-electric-blue hover:bg-blue-600 text-white px-12 h-14 text-lg rounded-full glow-blue-subtle hover:glow-blue transition-all duration-300"
              >
                Book an Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            /* BOOKING FLOW CONTENT */
            <div className="max-w-4xl mx-auto">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Book Vehicle Inspection</h1>
                <p className="text-zinc-400 text-sm">Schedule a professional check at your doorstep.</p>
              </div>

              {/* Progress Steps */}
              {step <= 3 && (
                <div className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:px-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= 1 ? "bg-electric-blue text-white" : "bg-white/10 text-zinc-400"
                    }`}>1</div>
                    <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                      step === 1 ? "text-white" : "text-zinc-400"
                    }`}>Vehicle</span>
                  </div>
                  <div className="h-px bg-white/10 flex-1 mx-4" />
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= 2 ? "bg-electric-blue text-white" : "bg-white/10 text-zinc-400"
                    }`}>2</div>
                    <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                      step === 2 ? "text-white" : "text-zinc-400"
                    }`}>Plan</span>
                  </div>
                  <div className="h-px bg-white/10 flex-1 mx-4" />
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= 3 ? "bg-electric-blue text-white" : "bg-white/10 text-zinc-400"
                    }`}>3</div>
                    <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                      step === 3 ? "text-white" : "text-zinc-400"
                    }`}>Schedule</span>
                  </div>
                </div>
              )}

              {/* Form Panel */}
              <div className="bg-card border border-white/[0.06] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-electric-blue/[0.02] blur-[100px] rounded-full pointer-events-none" />

                {/* STEP 1: Vehicle & Address details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Car className="w-5 h-5 text-electric-blue" /> Vehicle & Inspection Location
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Car Brand / Make</label>
                        <select 
                          name="make" 
                          value={formData.make} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-zinc-950">Select Make</option>
                          <option value="Toyota" className="bg-zinc-950">Toyota</option>
                          <option value="Honda" className="bg-zinc-950">Honda</option>
                          <option value="Suzuki" className="bg-zinc-950">Suzuki</option>
                          <option value="KIA" className="bg-zinc-950">KIA</option>
                          <option value="Hyundai" className="bg-zinc-950">Hyundai</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model</label>
                        <input 
                          type="text" 
                          name="model" 
                          placeholder="e.g. Corolla, Civic" 
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model Year</label>
                        <select 
                          name="year" 
                          value={formData.year} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-zinc-950">Select Year</option>
                          {Array.from({ length: 15 }).map((_, i) => {
                            const yr = 2025 - i;
                            return <option key={yr} value={yr} className="bg-zinc-950">{yr}</option>;
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Registration Number</label>
                        <input 
                          type="text" 
                          name="regNumber" 
                          placeholder="e.g. LE-1234 or Karachi-987" 
                          value={formData.regNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Inspection Address</label>
                        <textarea 
                          name="address" 
                          rows={3}
                          placeholder="Provide the exact address where the car is parked for inspection..." 
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-white/5">
                      <Button 
                        variant="outline"
                        onClick={() => setBookingStarted(false)}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        disabled={!isStep1Valid}
                        onClick={nextStep}
                        className="bg-electric-blue hover:bg-blue-600 text-white font-bold h-12 px-8 transition-colors"
                      >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Select plan */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-electric-blue" /> Select Inspection Plan
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {plans.map((p) => {
                        const isSelected = formData.plan === p.key;
                        const isRed = p.key === "premium";
                        const isBlue = p.key === "standard";
                        
                        return (
                          <div 
                            key={p.key}
                            onClick={() => selectPlan(p.key)}
                            className={`rounded-2xl p-6 border cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                              isSelected 
                                ? isRed 
                                  ? "border-neon-red bg-neon-red/[0.03] shadow-lg shadow-neon-red/10 scale-[1.02]" 
                                  : isBlue
                                  ? "border-electric-blue bg-electric-blue/[0.03] shadow-lg shadow-electric-blue/10 scale-[1.02]"
                                  : "border-zinc-400 bg-white/[0.02]"
                                : "border-white/10 hover:border-white/20 bg-white/[0.01]"
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-white text-base">{p.title}</h3>
                                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                                  isSelected 
                                    ? isRed 
                                      ? "bg-neon-red border-neon-red text-white" 
                                      : isBlue
                                      ? "bg-electric-blue border-electric-blue text-white"
                                      : "bg-white border-white text-black"
                                    : "border-white/25"
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                                </div>
                              </div>
                              <p className="text-xl font-extrabold text-white mb-1">{p.price}</p>
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-4">{p.points}</span>
                              
                              <ul className="space-y-2 mb-6">
                                {p.features.map((feat, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 leading-normal">
                                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                      isRed ? "text-neon-red" : isBlue ? "text-electric-blue" : "text-zinc-500"
                                    }`} />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between pt-6 border-t border-white/5">
                      <Button 
                        variant="outline"
                        onClick={prevStep}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button 
                        onClick={nextStep}
                        className="bg-electric-blue hover:bg-blue-600 text-white font-bold h-12 px-8 transition-colors"
                      >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Schedule & Contact details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-electric-blue" /> Inspection Schedule
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Select Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            name="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all cursor-pointer appearance-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Preferred Time Slot</label>
                        <select 
                          name="timeSlot" 
                          value={formData.timeSlot} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all cursor-pointer"
                        >
                          <option value="morning" className="bg-zinc-950">Morning (10:00 AM - 01:00 PM)</option>
                          <option value="afternoon" className="bg-zinc-950">Afternoon (01:00 PM - 04:00 PM)</option>
                          <option value="evening" className="bg-zinc-950">Evening (04:00 PM - 07:00 PM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Your Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                          <input 
                            type="text" 
                            name="name" 
                            placeholder="e.g. Muhammad Bilal" 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                          <input 
                            type="tel" 
                            name="phone" 
                            placeholder="e.g. 03211234567" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-white/5">
                      <Button 
                        variant="outline"
                        onClick={prevStep}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button 
                        disabled={!isStep3Valid}
                        onClick={nextStep}
                        className="bg-electric-blue hover:bg-blue-600 text-white font-bold h-12 px-8 transition-colors"
                      >
                        Confirm Booking <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Success Confirmed screen */}
                {step === 4 && (
                  <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <ShieldCheck className="w-12 h-12" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Inspection Booked!</h2>
                    
                    <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                      Thank you <span className="text-white font-bold">{formData.name}</span>! Your inspection booking for <span className="text-white font-bold">{formData.year} {formData.make} {formData.model}</span> is confirmed.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3.5">
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Booking ID</span>
                        <span className="text-electric-blue font-bold text-sm">CF-INSP-39048</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Selected Plan</span>
                        <span className="text-white font-semibold text-sm capitalize">{formData.plan} Plan</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Date & Time</span>
                        <span className="text-white font-semibold text-sm">{formData.date} ({formData.timeSlot})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Location</span>
                        <span className="text-white text-xs font-semibold max-w-[200px] text-right truncate">{formData.address}</span>
                      </div>
                    </div>

                    <div className="pt-4 text-xs text-zinc-500 max-w-md mx-auto">
                      Our inspector will call you at <strong className="text-zinc-300">{formData.phone}</strong> before arriving at the location.
                    </div>

                    <div className="pt-6">
                      <Button 
                        onClick={() => {
                          setBookingStarted(false);
                          setStep(1);
                          setFormData({
                            make: "",
                            model: "",
                            year: "",
                            regNumber: "",
                            address: "",
                            plan: "standard",
                            date: "",
                            timeSlot: "morning",
                            name: "",
                            phone: "",
                          });
                        }}
                        className="bg-electric-blue hover:bg-blue-600 text-white font-bold px-8 h-12"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
