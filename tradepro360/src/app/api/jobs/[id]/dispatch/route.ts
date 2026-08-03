import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispatchToNearestEngineer } from "@/lib/dispatch";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { business: { include: { engineers: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const dispatch = dispatchToNearestEngineer(
    job.lat,
    job.lng,
    job.tradeType,
    job.business.engineers.map((e) => ({
      id: e.id,
      name: e.name,
      lat: e.lat,
      lng: e.lng,
      isAvailable: e.isAvailable,
      rating: e.rating,
      skills: JSON.parse(e.skills) as string[],
    }))
  );

  if (!dispatch) {
    return NextResponse.json(
      { error: "No available engineers" },
      { status: 409 }
    );
  }

  const estimatedArrival = new Date(
    Date.now() + dispatch.estimatedMinutes * 60000
  );

  const updated = await prisma.job.update({
    where: { id },
    data: {
      engineerId: dispatch.engineerId,
      status: "DISPATCHED",
      estimatedArrival,
    },
    include: { engineer: true },
  });

  return NextResponse.json({ job: updated, dispatch });
}
