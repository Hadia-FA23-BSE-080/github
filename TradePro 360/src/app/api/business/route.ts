import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        engineers: { where: { isAvailable: true } },
        _count: { select: { jobs: true } },
      },
    });
    if (!business) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(business);
  }

  const businesses = await prisma.business.findMany({
    include: { _count: { select: { jobs: true, engineers: true } } },
  });

  return NextResponse.json(businesses);
}
