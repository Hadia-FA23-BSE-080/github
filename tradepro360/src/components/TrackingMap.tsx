"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface TrackingData {
  status: string;
  engineer: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    position: { lat: number; lng: number; heading: number };
  } | null;
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedArrival: string | null;
}

const MapInner = dynamic(() => import("./TrackingMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
      Loading map...
    </div>
  ),
});

export function TrackingMap({ jobId }: { jobId: string }) {
  const [data, setData] = useState<TrackingData | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      const res = await fetch(`/api/jobs/${jobId}/tracking`);
      if (res.ok) setData(await res.json());
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, [jobId]);

  if (!data) {
    return (
      <div className="w-full h-80 bg-slate-100 rounded-xl animate-pulse" />
    );
  }

  return (
    <div className="space-y-4">
      {data.engineer && (
        <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
          <div>
            <p className="font-semibold text-slate-900">{data.engineer.name}</p>
            <p className="text-sm text-slate-600">
              Rating: {data.engineer.rating}/5
            </p>
          </div>
          {data.estimatedArrival && (
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Estimated Arrival
              </p>
              <p className="font-semibold text-blue-700">
                {new Date(data.estimatedArrival).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="h-80 rounded-xl overflow-hidden border border-slate-200">
        <MapInner data={data} />
      </div>
      <p className="text-sm text-slate-500 text-center">
        {data.destination.address}
      </p>
    </div>
  );
}
