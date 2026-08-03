"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Camera,
  Star,
  Download,
  CreditCard,
  Loader2,
  Send,
  CheckCircle,
} from "lucide-react";
import { TrackingMap } from "@/components/TrackingMap";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Job {
  id: string;
  reference: string;
  title: string;
  description: string;
  status: string;
  totalCost: number;
  paymentStatus: string;
  customer: { id: string; name: string };
  engineer: { name: string; phone: string; rating: number } | null;
  business: { name: string; phone: string };
  quoteItems: { name: string; totalPrice: number }[];
  photos: { id: string; url: string; caption: string | null }[];
  messages: {
    id: string;
    senderName: string;
    senderRole: string;
    content: string;
    createdAt: string;
  }[];
  reviews: { rating: number; comment: string | null }[];
}

function PortalContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.id as string;
  const paymentSuccess = searchParams.get("payment") === "success";

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [paying, setPaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`);
    if (res.ok) setJob(await res.json());
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [job?.messages]);

  const sendMessage = async () => {
    if (!message.trim() || !job) return;
    await fetch(`/api/jobs/${jobId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName: job.customer.name,
        senderRole: "customer",
        content: message,
        customerId: job.customer.id,
      }),
    });
    setMessage("");
    loadJob();
  };

  const uploadPhoto = async () => {
    if (!photoUrl.trim()) return;
    await fetch(`/api/jobs/${jobId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: photoUrl,
        caption: "Customer upload",
        uploadedBy: "customer",
      }),
    });
    setPhotoUrl("");
    loadJob();
  };

  const submitReview = async () => {
    if (!job) return;
    await fetch(`/api/jobs/${jobId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: job.customer.id,
        rating,
        comment: reviewComment,
      }),
    });
    loadJob();
  };

  const handlePayment = async (payLater = false) => {
    setPaying(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, payLater }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Job not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Client Portal
              </p>
              <h1 className="font-bold text-slate-900">{job.title}</h1>
              <p className="text-sm text-slate-500 font-mono">{job.reference}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {paymentSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            Payment successful! Thank you.
          </div>
        )}

        {/* Live Tracking */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold mb-4">Live Engineer Tracking</h2>
          <TrackingMap jobId={jobId} />
        </section>

        {/* Job Summary */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold">Job Summary</h2>
              <p className="text-sm text-slate-600 mt-1">{job.description}</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(job.totalCost)}
            </p>
          </div>
          {job.engineer && (
            <div className="bg-slate-50 rounded-xl p-4 text-sm">
              <p className="font-medium">{job.engineer.name}</p>
              <p className="text-slate-500">
                {job.engineer.phone} · Rating: {job.engineer.rating}/5
              </p>
            </div>
          )}
        </section>

        {/* Chat */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Chat
          </h2>
          <div className="h-64 overflow-y-auto space-y-3 mb-4 bg-slate-50 rounded-xl p-4">
            {job.messages.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No messages yet. Say hello to your engineer!
              </p>
            ) : (
              job.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderRole === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-xl px-4 py-2 text-sm ${
                      msg.senderRole === "customer"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800"
                    }`}
                  >
                    <p className="font-medium text-xs opacity-75 mb-1">
                      {msg.senderName}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Photos */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Photos
          </h2>
          {job.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {job.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-slate-100 rounded-xl overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Job photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL to upload..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={uploadPhoto}
              className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm hover:bg-slate-900"
            >
              Upload
            </button>
          </div>
        </section>

        {/* Payment & Invoice */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment &amp; Invoice
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Status: <strong>{job.paymentStatus.replace("_", " ")}</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`/api/payments?jobId=${jobId}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              Download PDF Invoice
            </a>
            <button
              onClick={() => handlePayment(false)}
              disabled={paying || job.paymentStatus === "PAID"}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {paying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Pay Now
            </button>
            <button
              onClick={() => handlePayment(true)}
              disabled={paying || job.paymentStatus === "PAID"}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 disabled:opacity-50"
            >
              Pay Later
            </button>
          </div>
        </section>

        {/* Review */}
        {job.reviews.length === 0 && job.status !== "CANCELLED" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Rate Your Service
            </h2>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star
                    className={`w-8 h-8 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={submitReview}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
            >
              Submit Review
            </button>
          </section>
        )}

        {job.reviews.length > 0 && (
          <section className="bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">
              Thank you for your {job.reviews[0].rating}-star review!
            </p>
          </section>
        )}

        <div className="text-center pb-8">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
            Powered by TradePro 360
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
