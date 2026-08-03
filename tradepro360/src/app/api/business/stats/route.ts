import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  const [total, pending, completed, revenue] = await Promise.all([
    prisma.job.count({ where: { businessId } }),
    prisma.job.count({
      where: {
        businessId,
        status: {
          in: [
            "PENDING",
            "QUOTED",
            "BOOKED",
            "DISPATCHED",
            "EN_ROUTE",
            "IN_PROGRESS",
          ],
        },
      },
    }),
    prisma.job.count({ where: { businessId, status: "COMPLETED" } }),
    prisma.job.aggregate({
      where: { businessId, paymentStatus: "PAID" },
      _sum: { totalCost: true },
    }),
  ]);

  return NextResponse.json({
    total,
    pending,
    completed,
    revenue: revenue._sum.totalCost ?? 0,
  });
}
