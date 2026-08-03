import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const { senderName, senderRole, content, customerId } = await request.json();

  const message = await prisma.message.create({
    data: {
      jobId,
      customerId,
      senderName,
      senderRole,
      content,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;

  const messages = await prisma.message.findMany({
    where: { jobId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
