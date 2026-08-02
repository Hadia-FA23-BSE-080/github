"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Wrench,
  MapPin,
  Calculator,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency, TRADE_LABELS } from "@/lib/utils";

interface QuoteResult {
  labourHours: number;
  labourRate: number;
  labourCost: number;
  calloutFee: number;
  parts: { name: string; unitPrice: number; totalPrice: number }[];
  partsCost: number;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  tradeType: string;
  primaryColor: string;
  city: string;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const businessSlug =
    searchParams.get("business") ?? "apex-trades-london";
  const source = searchParams.get("source") ?? "web";
  const prefilledLat = searchParams.get("lat");
  const prefilledLng = searchParams.get("lng");
  const prefilledCity = searchParams.get("city");
  const prefilledPostcode = searchParams.get("postcode");

  const [business, setBusiness] = useState<Business | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    title: "",
    description: "",
    tradeType: "PLUMBER" as "PLUMBER" | "ELECTRICIAN" | "CLEANER",
    address: "",
    city: prefilledCity ?? "",
    postcode: prefilledPostcode ?? "",
    lat: prefilledLat ? parseFloat(prefilledLat) : 51.5074,
    lng: prefilledLng ? parseFloat(prefilledLng) : -0.1278,
  });

  useEffect(() => {
    fetch(`/api/business?slug=${businessSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setBusiness(data);
          setForm((f) => ({
            ...f,
            tradeType: data.tradeType,
            city: prefilledCity ?? data.city,
          }));
        }
      })
      .catch(() => setError("Business not found"));
  }, [businessSlug, prefilledCity]);

  useEffect(() => {
    if (source === "gmb" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        () => {}
      );
    }
  }, [source]);

  const fetchQuote = async () => {
    setLoading(true);
    const res = await fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: form.description,
        tradeType: form.tradeType,
        businessSlug,
      }),
    });
    const data = await res.json();
    setQuote(data);
    setLoading(false);
    setStep(2);
  };

  const submitBooking = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessSlug,
        ...form,
        source,
        autoDispatch: true,
      }),
    });

    if (!res.ok) {
      setError("Failed to create booking");
      setLoading(false);
      return;
    }

    const job = await res.json();
    setJobId(job.id);
    setStep(3);
    setLoading(false);
  };

  const primaryColor = business?.primaryColor ?? "#2563eb";

  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className="text-white py-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            TradePro 360
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {business?.name ?? "Book a Free Quote"}
              </h1>
              {source === "gmb" && (
                <p className="text-sm text-white/80">
                  Opened from Google Business Profile
                  {prefilledCity && ` · ${prefilledCity}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 rounded ${step > s ? "bg-blue-600" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold">Tell us about your job</h2>

            <div className="grid grid-cols-3 gap-2">
              {(["PLUMBER", "ELECTRICIAN", "CLEANER"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, tradeType: t })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                    form.tradeType === t
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {TRADE_LABELS[t]}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Job title (e.g. Leaking kitchen tap)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="border-t border-slate-100 pt-5">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Your Details &amp; Location
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Postcode"
                    value={form.postcode}
                    onChange={(e) =>
                      setForm({ ...form, postcode: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={fetchQuote}
              disabled={
                loading ||
                !form.title ||
                !form.description ||
                !form.customerName ||
                !form.customerEmail
              }
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 transition"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Get Instant Quote
                </>
              )}
            </button>
          </div>
        )}

        {step === 2 && quote && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Your Instant Quote</h2>
              <div className="space-y-2 text-sm">
                {quote.parts.map((p, i) => (
                  <div key={i} className="flex justify-between text-slate-600">
                    <span>{p.name}</span>
                    <span>{formatCurrency(p.totalPrice)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-600">
                  <span>
                    Labour ({quote.labourHours}h @ {formatCurrency(quote.labourRate)}/hr)
                  </span>
                  <span>{formatCurrency(quote.labourCost)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Callout Fee</span>
                  <span>{formatCurrency(quote.calloutFee)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT ({(quote.vatRate * 100).toFixed(0)}%)</span>
                  <span>{formatCurrency(quote.vatAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={submitBooking}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && jobId && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-slate-600 mb-6">
              An engineer has been dispatched. Track their arrival in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(`/track/${jobId}`)}
                className="px-6 py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                Track Engineer Live
              </button>
              <button
                onClick={() => router.push(`/portal/${jobId}`)}
                className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open Client Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
