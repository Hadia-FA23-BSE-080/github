import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      customer: true,
      engineer: true,
      business: true,
      quoteItems: true,
      photos: true,
      messages: { orderBy: { createdAt: "asc" } },
      reviews: true,
      tracking: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const job = await prisma.job.update({
    where: { id },
    data: body,
    include: {
      customer: true,
      engineer: true,
      business: true,
    },
  });

  return NextResponse.json(job);
}
