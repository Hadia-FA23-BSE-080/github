"use client";

import Link from "next/link";
import {
  Wrench,
  MapPin,
  Calculator,
  CreditCard,
  Users,
  ArrowRight,
  Star,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Dispatch",
    description:
      "Automatically assigns jobs to the nearest available engineer based on GPS location, skills, and rating.",
  },
  {
    icon: MapPin,
    title: "Live Customer Tracking",
    description:
      "Real-time map tracking so clients see exactly when their engineer will arrive.",
  },
  {
    icon: Calculator,
    title: "Dynamic UK Pricing",
    description:
      "Instant quotes using local UK part prices, labour rates, callout fees, and VAT.",
  },
  {
    icon: CreditCard,
    title: "Stripe Invoicing",
    description:
      "Automatic PDF invoice generation with Pay Now or Pay Later options via Stripe.",
  },
  {
    icon: Users,
    title: "Client Portal",
    description:
      "Customers upload photos, chat with engineers, and rate completed jobs.",
  },
  {
    icon: Shield,
    title: "GMB Integration",
    description:
      "Embed a 'Book a Free Quote' widget in your Google Business Profile with location pre-fill.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">TradePro 360</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/book?source=gmb&business=apex-trades-london"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-sm px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4" />
            Built for UK Plumbers, Electricians & Cleaners
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Smart Booking &amp;
            <br />
            Dispatch Platform
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            From Google Business Profile click to completed invoice — manage
            every job with AI dispatch, live tracking, and instant UK pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book?source=gmb&business=apex-trades-london"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg"
            >
              Book a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard?business=apex-trades-london"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              Owner Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Everything a UK Trades Business Needs
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            White-label dashboard, GMB widget, and client portal — all in one platform.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Google Business Profile Integration
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Add a &ldquo;Book a Free Quote&rdquo; button to your GMB listing.
                When a UK customer clicks it, they land on your branded booking page
                with location data pre-filled from Google Maps.
              </p>
              <ul className="space-y-4">
                {[
                  "Get more bookings directly from Google Search",
                  "Customers' location pre-filled automatically",
                  "Instantly connects with your dashboard"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">G</div>
                  <div>
                    <div className="font-semibold text-slate-900">Your Trade Business</div>
                    <div className="flex text-yellow-400 text-xs">★★★★★ <span className="text-slate-500 ml-1">(120)</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href="/book?source=gmb&business=apex-trades-london" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                    Book a Free Quote
                  </Link>
                  <button className="w-full bg-slate-50 hover:bg-slate-100 text-blue-600 font-medium border border-slate-200 py-2.5 rounded-lg transition-colors">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 TradePro 360. Smart Booking &amp; Dispatch for UK Trades.</p>
        </div>
      </footer>
    </div>
  );
}
