"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("cf_admin_user");
    if (user) router.push("/admin/dashboard");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@carfever.com" && password === "admin123") {
        localStorage.setItem("cf_admin_user", JSON.stringify({
          name: "Admin User",
          email,
          role: "admin",
          loggedAt: new Date().toISOString(),
        }));
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or password. Use admin@carfever.com / admin123");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, position: "relative", overflow: "hidden" }}>
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,85,254,0.08)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,182,122,0.06)", filter: "blur(100px)", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420, background: "#141414", border: "1px solid #222", borderRadius: 24, padding: 36, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", position: "relative", zIndex: 10 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0055FE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Car style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
            Car<span style={{ color: "#0055FE" }}>Fever</span> Admin
          </h1>
          <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>Sign in to access your control panel</p>
        </div>

        {/* Demo credentials hint */}
        <div style={{ background: "rgba(0,85,254,0.08)", border: "1px solid rgba(0,85,254,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 11, color: "#6b9fff", lineHeight: 1.6 }}>
          <strong>Demo credentials:</strong><br />
          Email: admin@carfever.com<br />
          Password: admin123
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
            <AlertCircle style={{ width: 16, height: 16, color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#f87171" }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#444" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@carfever.com"
                required
                style={{ width: "100%", paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = "#0055FE")}
                onBlur={e => (e.target.style.borderColor = "#2a2a2a")}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#444" }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = "#0055FE")}
                onBlur={e => (e.target.style.borderColor = "#2a2a2a")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", height: 48, background: loading ? "#333" : "#0055FE", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
          >
            {loading ? "Authenticating…" : <>Access Dashboard <ArrowRight style={{ width: 16, height: 16 }} /></>}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Car Fever Admin Console v1.0
      </div>
    </div>
  );
}
