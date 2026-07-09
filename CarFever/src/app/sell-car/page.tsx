"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Info,
  X,
  AlertTriangle,
  Check
} from "lucide-react";
import { saveCarListing } from "@/lib/storage";

export default function SellCarPage() {
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "petrol",
    transmission: "automatic",
    engineCapacity: "",
    city: "",
    price: "",
    sellerName: "",
    sellerPhone: "",
    description: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const newImages = filesArray
        .filter(file => file.type.startsWith("image/"))
        .map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmitListing = () => {
    if (typeof window !== "undefined") {
      const currentUserStr = localStorage.getItem("cf_current_user");
      if (!currentUserStr) {
        showToast("Please login to sell your car", "error");
        return;
      }

      let email = "seller@carfever.com";
      try {
        const user = JSON.parse(currentUserStr);
        email = user.email || email;
      } catch {
        // ignore
      }

      const listingId = "CAR-" + Date.now();
      const newListing = {
        id: listingId,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year) || 2024,
        mileage: parseInt(formData.mileage) ? parseInt(formData.mileage).toLocaleString() + " km" : formData.mileage + " km",
        transmission: formData.transmission.charAt(0).toUpperCase() + formData.transmission.slice(1),
        fuel: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1),
        color: "Silver",
        price: "PKR " + formData.price + " Lacs",
        condition: "Excellent",
        city: formData.city,
        description: formData.description || `Pristine ${formData.make} ${formData.model} up for sale.`,
        images: uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=300&q=80"],
        status: "pending" as const,
        sellerName: formData.sellerName,
        sellerEmail: email,
        dateAdded: new Date().toISOString(),
      };

      try {
        saveCarListing(newListing);
        showToast("Submission successful! Admin will review it shortly.", "success");
        nextStep();
      } catch (err) {
        showToast("Storage full or error saving data.", "error");
      }
    }
  };

  const isStep1Valid = formData.make && formData.model && formData.year && formData.mileage && formData.engineCapacity;
  const isStep2Valid = formData.city && formData.price && formData.sellerName && formData.sellerPhone;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-10 mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Sell Your Car <span className="text-neon-red">Instantly</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
              Follow these simple steps to post your listing on Pakistan's premium car marketplace.
            </p>
          </div>

          {/* Progress Bar */}
          {step <= 3 && (
            <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-4 sm:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= 1 ? "bg-neon-red text-white" : "bg-white/10 text-zinc-400"
                }`}>1</div>
                <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                  step === 1 ? "text-white" : "text-zinc-400"
                }`}>Details</span>
              </div>
              <div className="h-px bg-white/10 flex-1 mx-4" />
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= 2 ? "bg-neon-red text-white" : "bg-white/10 text-zinc-400"
                }`}>2</div>
                <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                  step === 2 ? "text-white" : "text-zinc-400"
                }`}>Pricing</span>
              </div>
              <div className="h-px bg-white/10 flex-1 mx-4" />
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= 3 ? "bg-neon-red text-white" : "bg-white/10 text-zinc-400"
                }`}>3</div>
                <span className={`text-xs sm:text-sm font-semibold hidden xs:inline ${
                  step === 3 ? "text-white" : "text-zinc-400"
                }`}>Photos</span>
              </div>
            </div>
          )}

          {/* Form Content Cards */}
          <div className="bg-card border border-white/[0.06] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon-red/[0.02] blur-[100px] rounded-full pointer-events-none" />

            {/* STEP 1: Vehicle Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Car className="w-5 h-5 text-neon-red" /> Vehicle Details
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Make / Brand</label>
                    <select 
                      name="make" 
                      value={formData.make} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-zinc-955">Select Make</option>
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
                      placeholder="e.g. Corolla GLi, Civic Turbo" 
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Registration Year</label>
                    <select 
                      name="year" 
                      value={formData.year} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-zinc-955">Select Year</option>
                      {Array.from({ length: 15 }).map((_, i) => {
                        const yr = 2025 - i;
                        return <option key={yr} value={yr} className="bg-zinc-950">{yr}</option>;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Mileage (km)</label>
                    <input 
                      type="number" 
                      name="mileage" 
                      placeholder="e.g. 25000" 
                      value={formData.mileage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fuel Type</label>
                    <select 
                      name="fuelType" 
                      value={formData.fuelType} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all cursor-pointer"
                    >
                      <option value="petrol" className="bg-zinc-955">Petrol</option>
                      <option value="diesel" className="bg-zinc-955">Diesel</option>
                      <option value="hybrid" className="bg-zinc-955">Hybrid</option>
                      <option value="electric" className="bg-zinc-955">Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Transmission</label>
                    <select 
                      name="transmission" 
                      value={formData.transmission} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all cursor-pointer"
                    >
                      <option value="automatic" className="bg-zinc-955">Automatic</option>
                      <option value="manual" className="bg-zinc-955">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Engine Capacity (cc)</label>
                    <input 
                      type="number" 
                      name="engineCapacity" 
                      placeholder="e.g. 1300 or 1500" 
                      value={formData.engineCapacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/5">
                  <Button 
                    disabled={!isStep1Valid}
                    onClick={nextStep}
                    className="bg-neon-red hover:bg-red-600 text-white font-bold h-12 px-8 transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Pricing & Location */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-neon-red" /> Pricing & Location
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">City</label>
                    <select 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-zinc-955">Select City</option>
                      <option value="Lahore" className="bg-zinc-950">Lahore</option>
                      <option value="Karachi" className="bg-zinc-950">Karachi</option>
                      <option value="Islamabad" className="bg-zinc-950">Islamabad</option>
                      <option value="Rawalpindi" className="bg-zinc-950">Rawalpindi</option>
                      <option value="Faisalabad" className="bg-zinc-950">Faisalabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Asking Price (PKR Lacs)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-bold">
                        PKR
                      </div>
                      <input 
                        type="number" 
                        name="price" 
                        placeholder="e.g. 45.5" 
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-14 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Seller's Name</label>
                    <input 
                      type="text" 
                      name="sellerName" 
                      placeholder="e.g. Ali Ahmed" 
                      value={formData.sellerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Seller's Phone</label>
                    <input 
                      type="tel" 
                      name="sellerPhone" 
                      placeholder="e.g. 03001234567" 
                      value={formData.sellerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      name="description" 
                      rows={4}
                      placeholder="Describe your car's condition, features, history, etc..." 
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all resize-none"
                    />
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
                    disabled={!isStep2Valid}
                    onClick={nextStep}
                    className="bg-neon-red hover:bg-red-600 text-white font-bold h-12 px-8 transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Photos Upload */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-neon-red" /> Upload Photos
                </h2>

                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-white/10 hover:border-neon-red/30 rounded-2xl p-8 flex flex-col items-center justify-center transition-all bg-white/[0.01] cursor-pointer group"
                >
                  <UploadCloud className="w-12 h-12 text-zinc-500 group-hover:text-neon-red transition-colors mb-4" />
                  <p className="text-sm text-zinc-300 font-semibold mb-1">Drag and drop images here</p>
                  <p className="text-xs text-zinc-500 mb-5">Supported formats: JPG, PNG (Max 5MB per file)</p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                  />

                  <Button 
                    type="button"
                    className="bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all font-semibold"
                  >
                    Upload from Device
                  </Button>
                </div>

                {uploadedImages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Uploaded Images</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 group">
                          <img src={img} className="w-full h-full object-cover" alt="Upload preview" />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImages(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-650 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 text-zinc-400 text-xs sm:text-sm">
                  <Info className="w-5 h-5 text-neon-red shrink-0" />
                  <span>High quality photos taken in broad daylight improve your chances of getting competitive offers by up to 80%.</span>
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
                    disabled={uploadedImages.length === 0}
                    onClick={nextStep}
                    className="bg-neon-red hover:bg-red-600 text-white font-bold h-12 px-8 transition-colors"
                  >
                    Submit Listing <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Success Screen */}
            {step === 4 && (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Car Listing Submitted!</h2>
                
                <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Congratulations <span className="text-white font-bold">{formData.sellerName}</span>, your {formData.year} {formData.make} {formData.model} has been submitted to our listing review board.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto text-left space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">What happens next?</h3>
                  <div className="flex gap-3 text-sm text-zinc-400">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white font-bold shrink-0">1</span>
                    <span>Our team will contact you at <strong className="text-white">{formData.sellerPhone}</strong> to schedule a physical verification inspection.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-zinc-400">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white font-bold shrink-0">2</span>
                    <span>Upon successful inspection, your car will receive a <strong>Car Fever Certified</strong> badge.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-zinc-400">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white font-bold shrink-0">3</span>
                    <span>Your listing will go live, and you will begin receiving buy requests instantly.</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/buy-car">
                    <Button className="bg-electric-blue hover:bg-blue-600 text-white font-bold px-8 h-12">
                      Go to Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
