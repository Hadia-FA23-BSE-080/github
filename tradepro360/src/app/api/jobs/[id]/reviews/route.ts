import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const { customerId, rating, comment } = await request.json();

  const review = await prisma.review.create({
    data: { jobId, customerId, rating, comment },
  });

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json(review, { status: 201 });
}
