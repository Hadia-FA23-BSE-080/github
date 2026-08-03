import { NextRequest, NextResponse } from "next/server";
import { calculateQuote, searchParts } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { description, tradeType, businessSlug } = body;

  let hourlyRate = 45;
  let calloutFee = 25;

  if (businessSlug) {
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
    });
    if (business) {
      hourlyRate = business.hourlyRate;
      calloutFee = business.calloutFee;
    }
  }

  const quote = calculateQuote(description, tradeType, hourlyRate, calloutFee);
  return NextResponse.json(quote);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const tradeType = searchParams.get("tradeType") as
    | "PLUMBER"
    | "ELECTRICIAN"
    | "CLEANER"
    | undefined;

  const parts = searchParts(query, tradeType);
  return NextResponse.json(parts);
}
