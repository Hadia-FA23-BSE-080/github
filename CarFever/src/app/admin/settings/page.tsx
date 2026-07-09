"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Share2,
  Mail,
  Save,
  RotateCcw,
  Check,
  Upload,
  Phone,
  FileCode,
  Shield,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    logo: string | null;
    favicon: string | null;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalytics: string;
    googleTagManager: string;
    robotsTxt: string;
    sitemapUrl: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    whatsapp: string;
  };
  email: {
    enabled: boolean;
    newInquiry: boolean;
    newListing: boolean;
    newInspection: boolean;
    adminEmail: string;
    template: string;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Car Fever",
    tagline: "Premium Car Marketplace",
    contactEmail: "info@carfever.com",
    contactPhone: "+92 300 1234567",
    address: "Lahore, Pakistan",
    logo: null,
    favicon: null,
  },
  seo: {
    metaTitle: "Car Fever - Buy & Sell Cars in Pakistan",
    metaDescription: "Pakistan's premium car marketplace. Find inspected used cars, list your car for free, and enjoy hassle-free paperwork.",
    metaKeywords: "cars, buy car, sell car, Pakistan, Lahore, Karachi, Islamabad, inspections",
    googleAnalytics: "",
    googleTagManager: "",
    robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://carfever.com/sitemap.xml",
    sitemapUrl: "/sitemap.xml",
  },
  social: {
    facebook: "https://facebook.com/carfever",
    instagram: "https://instagram.com/carfever",
    twitter: "https://twitter.com/carfever",
    youtube: "https://youtube.com/carfever",
    linkedin: "https://linkedin.com/company/carfever",
    whatsapp: "+92 300 1234567",
  },
  email: {
    enabled: true,
    newInquiry: true,
    newListing: true,
    newInspection: true,
    adminEmail: "admin@carfever.com",
    template: "Hi Admin,\n\nYou have received a new contact inquiry form submission.\n\nName: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message}\n\nRegards,\nCar Fever Auto Mailer",
  },
};

type TabType = "general" | "seo" | "social" | "email";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  
  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toast / Alert UI
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset confirmation state
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cf_settings");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
          if (parsed.general.logo) setLogoPreview(parsed.general.logo);
          if (parsed.general.favicon) setFaviconPreview(parsed.general.favicon);
        } catch {
          // fallback to default
        }
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "favicon") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === "logo") {
        setLogoPreview(url);
        setSettings((prev) => ({
          ...prev,
          general: { ...prev.general, logo: url },
        }));
      } else {
        setFaviconPreview(url);
        setSettings((prev) => ({
          ...prev,
          general: { ...prev.general, favicon: url },
        }));
      }
    }
  };

  // Form Validations
  const validateForm = (tab: TabType): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    if (tab === "general") {
      if (!settings.general.siteName.trim()) {
        newErrors.siteName = "Site Name is required";
      }
      if (!settings.general.contactEmail.trim()) {
        newErrors.contactEmail = "Contact email is required";
      } else if (!emailRegex.test(settings.general.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    if (tab === "seo") {
      if (!settings.seo.metaTitle.trim()) {
        newErrors.metaTitle = "Meta Title is required for search engines";
      }
    }

    if (tab === "social") {
      const links = ["facebook", "instagram", "twitter", "youtube", "linkedin"];
      links.forEach((l) => {
        const val = settings.social[l as keyof typeof settings.social];
        if (val && !urlRegex.test(val)) {
          newErrors[l] = "Please enter a valid URL starting with http:// or https://";
        }
      });
    }

    if (tab === "email") {
      if (settings.email.enabled) {
        if (!settings.email.adminEmail.trim()) {
          newErrors.adminEmail = "Admin notifications email is required";
        } else if (!emailRegex.test(settings.email.adminEmail)) {
          newErrors.adminEmail = "Please enter a valid email address";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTab = (tab: TabType) => {
    if (!validateForm(tab)) {
      showToast("Please correct the errors in the form before saving.");
      return;
    }

    localStorage.setItem("cf_settings", JSON.stringify(settings));
    showToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} settings saved successfully!`);
  };

  const handleResetTab = () => {
    setSettings((prev) => ({
      ...prev,
      [activeTab]: DEFAULT_SETTINGS[activeTab],
    }));

    if (activeTab === "general") {
      setLogoPreview(null);
      setFaviconPreview(null);
    }

    setErrors({});
    setResetConfirmOpen(false);
    showToast(`Reset ${activeTab} settings to default values.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-8 bg-[#0f0f10] border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Website Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your website configuration</p>
      </div>

      {/* Tabs Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar-Tabs (Responsive: row on small screens, col on large) */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 border-white/10 lg:w-64 shrink-0 gap-1.5 pb-2 lg:pb-0">
          {[
            { id: "general", label: "General Settings", icon: Shield },
            { id: "seo", label: "SEO Config", icon: Globe },
            { id: "social", label: "Social Media Links", icon: Share2 },
            { id: "email", label: "Email Notifications", icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setErrors({});
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border-b-2 lg:border-b-0 lg:border-l-2 ${
                  isActive
                    ? "text-white bg-white/5 border-neon-red"
                    : "text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-neon-red" : "text-zinc-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        <div className="flex-1">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">General settings</h3>
                <p className="text-xs text-zinc-500 mt-1">Basic identification and contact endpoints of Car Fever</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Site Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Site Name *</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, siteName: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.siteName ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.siteName && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.siteName}</p>
                  )}
                </div>

                {/* Site Tagline */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Site Tagline</label>
                  <input
                    type="text"
                    value={settings.general.tagline}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, tagline: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Contact Email *</label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, contactEmail: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.contactEmail ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.contactEmail}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.general.contactPhone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, contactPhone: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Office Address</label>
                  <textarea
                    rows={3}
                    value={settings.general.address}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, address: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all resize-none"
                  />
                </div>
              </div>

              {/* Logo / Favicon Upload rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Logo Upload */}
                <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">Company Logo</span>
                    <span className="text-[10px] text-zinc-500 block mb-4">PNG, SVG formats recommended</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="w-16 h-16 rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-zinc-600">
                        Logo
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="py-2 px-3 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-semibold text-zinc-300 text-center flex items-center justify-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Choose Logo
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "logo")}
                      />
                    </label>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">Website Favicon</span>
                    <span className="text-[10px] text-zinc-500 block mb-4">ICO, PNG dimensions 32x32</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {faviconPreview ? (
                      <div className="w-16 h-16 rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
                        <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-zinc-600">
                        Icon
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="py-2 px-3 border border-white/10 hover:bg-white/5 rounded-lg text-xs font-semibold text-zinc-300 text-center flex items-center justify-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Choose Favicon
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "favicon")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5 pt-5">
                <Button
                  variant="outline"
                  onClick={() => setResetConfirmOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                </Button>
                <Button
                  onClick={() => handleSaveTab("general")}
                  className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" /> Save General Settings
                </Button>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">SEO Configuration</h3>
                <p className="text-xs text-zinc-500 mt-1">Configure search visibility and tracking analytics</p>
              </div>

              <div className="space-y-5">
                {/* Meta Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Meta Title *</label>
                  <input
                    type="text"
                    value={settings.seo.metaTitle}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.metaTitle ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.metaTitle && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.metaTitle}</p>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Meta Description</label>
                  <textarea
                    rows={3}
                    value={settings.seo.metaDescription}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all resize-none"
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.seo.metaKeywords}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaKeywords: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                  />
                </div>

                {/* Tracking IDs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Google Analytics ID</label>
                    <input
                      type="text"
                      placeholder="UA-XXXXXXXXX or G-XXXXXXXXXX"
                      value={settings.seo.googleAnalytics}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, googleAnalytics: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Google Tag Manager ID</label>
                    <input
                      type="text"
                      placeholder="GTM-XXXXXXX"
                      value={settings.seo.googleTagManager}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, googleTagManager: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                    />
                  </div>
                </div>

                {/* Robots.txt and Sitemap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Robots.txt Content</label>
                    <textarea
                      rows={4}
                      value={settings.seo.robotsTxt}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, robotsTxt: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-neon-red transition-all resize-none"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Sitemap URL</label>
                      <input
                        type="text"
                        value={settings.seo.sitemapUrl}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, sitemapUrl: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                      />
                    </div>
                    <div className="hidden sm:block p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5" /> Site map index auto regenerates at build.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5 pt-5">
                <Button
                  variant="outline"
                  onClick={() => setResetConfirmOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                </Button>
                <Button
                  onClick={() => handleSaveTab("seo")}
                  className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" /> Save SEO Settings
                </Button>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Social Media Links</h3>
                <p className="text-xs text-zinc-500 mt-1">Link your official accounts and WhatsApp customer care</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Facebook */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <FacebookIcon className="w-3.5 h-3.5 text-blue-500" /> Facebook URL
                  </label>
                  <input
                    type="text"
                    value={settings.social.facebook}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, facebook: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.facebook ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.facebook && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.facebook}</p>
                  )}
                </div>

                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500" /> Instagram URL
                  </label>
                  <input
                    type="text"
                    value={settings.social.instagram}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, instagram: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.instagram ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.instagram && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.instagram}</p>
                  )}
                </div>

                {/* Twitter / X */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <TwitterIcon className="w-3.5 h-3.5 text-zinc-300" /> Twitter/X URL
                  </label>
                  <input
                    type="text"
                    value={settings.social.twitter}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, twitter: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.twitter ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.twitter && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.twitter}</p>
                  )}
                </div>

                {/* YouTube */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <YoutubeIcon className="w-3.5 h-3.5 text-red-500" /> YouTube URL
                  </label>
                  <input
                    type="text"
                    value={settings.social.youtube}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, youtube: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.youtube ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.youtube && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.youtube}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={settings.social.linkedin}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, linkedin: e.target.value },
                      }))
                    }
                    className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                      errors.linkedin ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  {errors.linkedin && (
                    <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.linkedin}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Business
                  </label>
                  <input
                    type="text"
                    value={settings.social.whatsapp}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, whatsapp: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5 pt-5">
                <Button
                  variant="outline"
                  onClick={() => setResetConfirmOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                </Button>
                <Button
                  onClick={() => handleSaveTab("social")}
                  className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Social Links
                </Button>
              </div>
            </div>
          )}

          {/* Email notifications tab */}
          {activeTab === "email" && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Email Notifications</h3>
                <p className="text-xs text-zinc-500 mt-1">Control automated notification triggers and mail layout templates</p>
              </div>

              <div className="space-y-5">
                {/* Global Email Switch */}
                <div className="flex items-center justify-between py-2 border-b border-white/5 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Enable Email Notifications</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Toggle all email notification triggers site-wide</p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        email: { ...prev.email, enabled: !prev.email.enabled },
                      }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      settings.email.enabled ? "bg-neon-red" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.email.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {settings.email.enabled && (
                  <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    
                    {/* Admin notification address */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Admin Email for Notifications *</label>
                      <input
                        type="email"
                        value={settings.email.adminEmail}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            email: { ...prev.email, adminEmail: e.target.value },
                          }))
                        }
                        className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-red transition-all ${
                          errors.adminEmail ? "border-red-500/50" : "border-white/10"
                        }`}
                      />
                      {errors.adminEmail && (
                        <p className="text-red-400 text-[10px] font-semibold mt-1">{errors.adminEmail}</p>
                      )}
                    </div>

                    {/* Checkboxes/Switches list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Inquiry Booking */}
                      <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-white block">New Inquiry</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">Contact submissions</span>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              email: { ...prev.email, newInquiry: !prev.email.newInquiry },
                            }))
                          }
                          className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            settings.email.newInquiry
                              ? "bg-neon-red/10 border-neon-red/20 text-neon-red"
                              : "border-white/10 text-zinc-500"
                          }`}
                        >
                          {settings.email.newInquiry ? "Active" : "Inactive"}
                        </button>
                      </div>

                      {/* New Car Listing */}
                      <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-white block">New Listings</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">Car submissions</span>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              email: { ...prev.email, newListing: !prev.email.newListing },
                            }))
                          }
                          className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            settings.email.newListing
                              ? "bg-neon-red/10 border-neon-red/20 text-neon-red"
                              : "border-white/10 text-zinc-500"
                          }`}
                        >
                          {settings.email.newListing ? "Active" : "Inactive"}
                        </button>
                      </div>

                      {/* Inspection Booking */}
                      <div className="bg-white/5 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-white block">Inspections</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">Booking requests</span>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              email: { ...prev.email, newInspection: !prev.email.newInspection },
                            }))
                          }
                          className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            settings.email.newInspection
                              ? "bg-neon-red/10 border-neon-red/20 text-neon-red"
                              : "border-white/10 text-zinc-500"
                          }`}
                        >
                          {settings.email.newInspection ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>

                    {/* Email template */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Default Email Template</label>
                      <textarea
                        rows={6}
                        value={settings.email.template}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            email: { ...prev.email, template: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-neon-red transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5 pt-5">
                <Button
                  variant="outline"
                  onClick={() => setResetConfirmOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                </Button>
                <Button
                  onClick={() => handleSaveTab("email")}
                  className="bg-neon-red hover:bg-red-600 text-white font-semibold glow-red-subtle w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Email Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResetConfirmOpen(false)} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Reset Tab Config?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Are you sure you want to restore default parameters for{" "}
              <span className="text-white font-bold uppercase">{activeTab}</span>? Any unsaved edits will be discarded.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setResetConfirmOpen(false)}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetTab}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reset Tab
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
