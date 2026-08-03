import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const { url, caption, uploadedBy } = await request.json();

  const photo = await prisma.photo.create({
    data: { jobId, url, caption, uploadedBy },
  });

  return NextResponse.json(photo, { status: 201 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;

  const photos = await prisma.photo.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(photos);
}
