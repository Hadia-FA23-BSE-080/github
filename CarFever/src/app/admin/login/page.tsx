"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("cf_admin_user");
      if (user) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate small latency for premium feel
    setTimeout(() => {
      if (email === "admin@carfever.com" && password === "admin123") {
        localStorage.setItem("cf_admin_user", JSON.stringify({ email, role: "admin", loggedAt: new Date().toISOString() }));
        router.push("/admin/dashboard");
      } else {
        setError("Invalid admin email or password. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-red/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-electric-blue/10 blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-heavy border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neon-red flex items-center justify-center mx-auto mb-4 glow-red-subtle">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Car<span className="text-neon-red">Fever</span> Control Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5">
            Sign in to access admin console
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="email"
                placeholder="admin@carfever.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-red transition-all text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neon-red hover:bg-red-600 text-white font-bold h-12 mt-3 glow-red-subtle hover:glow-red transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Access Dashboard"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-zinc-500 tracking-wider uppercase">
        Car Fever Admin v1.0
      </div>
    </div>
  );
}
