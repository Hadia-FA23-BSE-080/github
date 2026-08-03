"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Star, Loader2, ArrowLeft } from "lucide-react";
import { TrackingMap } from "@/components/TrackingMap";
import { StatusBadge } from "@/components/StatusBadge";

interface Job {
  id: string;
  reference: string;
  title: string;
  status: string;
  estimatedArrival: string | null;
  engineer: { name: string; phone: string; rating: number } | null;
  business: { name: string; phone: string };
}

export default function TrackPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) setJob(data);
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        Job not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href={`/portal/${jobId}`}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Client Portal
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Live Tracking
              </p>
              <h1 className="text-xl font-bold">{job.title}</h1>
              <p className="text-sm text-slate-400 font-mono">{job.reference}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {job.engineer && (
          <div className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{job.engineer.name}</p>
              <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  {job.engineer.rating}
                </span>
                <a
                  href={`tel:${job.engineer.phone}`}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              </div>
            </div>
            {job.estimatedArrival && (
              <div className="text-right">
                <p className="text-xs text-slate-400">ETA</p>
                <p className="text-2xl font-bold text-blue-400">
                  {new Date(job.estimatedArrival).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <MapPin className="w-4 h-4" />
            Live map — updates every 5 seconds
          </div>
          <TrackingMap jobId={jobId} />
        </div>

        <p className="text-center text-sm text-slate-500">
          {job.business.name} · {job.business.phone}
        </p>
      </main>
    </div>
  );
}
