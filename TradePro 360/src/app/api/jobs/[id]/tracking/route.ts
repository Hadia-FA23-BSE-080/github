import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { interpolatePosition } from "@/lib/dispatch";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      engineer: true,
      tracking: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (!job.engineer) {
    return NextResponse.json({
      status: job.status,
      engineer: null,
      destination: { lat: job.lat, lng: job.lng },
      estimatedArrival: job.estimatedArrival,
    });
  }

  const latestTracking = job.tracking[0];
  let currentPosition: { lat: number; lng: number; heading: number };

  if (latestTracking) {
    currentPosition = {
      lat: latestTracking.lat,
      lng: latestTracking.lng,
      heading: latestTracking.heading ?? 0,
    };
  } else {
    const elapsed = job.estimatedArrival
      ? Math.min(
          1,
          (Date.now() - job.updatedAt.getTime()) / (15 * 60000)
        )
      : 0.3;
    currentPosition = interpolatePosition(
      job.engineer.lat,
      job.engineer.lng,
      job.lat,
      job.lng,
      elapsed
    );
  }

  return NextResponse.json({
    status: job.status,
    engineer: {
      id: job.engineer.id,
      name: job.engineer.name,
      phone: job.engineer.phone,
      rating: job.engineer.rating,
      position: currentPosition,
    },
    destination: {
      lat: job.lat,
      lng: job.lng,
      address: `${job.address}, ${job.city} ${job.postcode}`,
    },
    estimatedArrival: job.estimatedArrival,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { lat, lng, heading, speed } = await request.json();

  const point = await prisma.trackingPoint.create({
    data: { jobId: id, lat, lng, heading, speed },
  });

  await prisma.job.update({
    where: { id },
    data: { status: "EN_ROUTE" },
  });

  return NextResponse.json(point);
}
