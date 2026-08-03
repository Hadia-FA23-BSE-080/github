import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateQuote } from "@/lib/pricing";
import { dispatchToNearestEngineer } from "@/lib/dispatch";
import {
  generateJobReference,
  generateInvoiceNumber,
} from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const status = searchParams.get("status");

  const jobs = await prisma.job.findMany({
    where: {
      ...(businessId ? { businessId } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: {
      customer: true,
      engineer: true,
      business: true,
      quoteItems: true,
      _count: { select: { messages: true, photos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    businessSlug,
    customerName,
    customerEmail,
    customerPhone,
    title,
    description,
    tradeType,
    address,
    city,
    postcode,
    lat,
    lng,
    source = "web",
    autoDispatch = true,
  } = body;

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    include: { engineers: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  let customer = await prisma.customer.findFirst({
    where: { businessId: business.id, email: customerEmail },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        businessId: business.id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address,
        city,
        postcode,
        lat,
        lng,
      },
    });
  }

  const quote = calculateQuote(
    description,
    tradeType,
    business.hourlyRate,
    business.calloutFee
  );

  const reference = generateJobReference();
  let engineerId: string | undefined;
  let estimatedArrival: Date | undefined;
  let status: "QUOTED" | "DISPATCHED" = "QUOTED";

  if (autoDispatch) {
    const dispatch = dispatchToNearestEngineer(
      lat,
      lng,
      tradeType,
      business.engineers.map((e) => ({
        id: e.id,
        name: e.name,
        lat: e.lat,
        lng: e.lng,
        isAvailable: e.isAvailable,
        rating: e.rating,
        skills: JSON.parse(e.skills) as string[],
      }))
    );

    if (dispatch) {
      engineerId = dispatch.engineerId;
      estimatedArrival = new Date(Date.now() + dispatch.estimatedMinutes * 60000);
      status = "DISPATCHED";
    }
  }

  const job = await prisma.job.create({
    data: {
      reference,
      businessId: business.id,
      customerId: customer.id,
      engineerId,
      title,
      description,
      tradeType,
      status,
      address,
      city,
      postcode,
      lat,
      lng,
      estimatedArrival,
      labourHours: quote.labourHours,
      labourCost: quote.labourCost,
      calloutFee: quote.calloutFee,
      partsCost: quote.partsCost,
      totalCost: quote.total,
      vatRate: quote.vatRate,
      invoiceNumber: generateInvoiceNumber(),
      source,
      quoteItems: {
        create: [
          ...quote.parts.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            totalPrice: p.totalPrice,
          })),
          {
            name: `Labour (${quote.labourHours}h @ £${quote.labourRate}/hr)`,
            quantity: quote.labourHours,
            unitPrice: quote.labourRate,
            totalPrice: quote.labourCost,
          },
          {
            name: "Callout Fee",
            quantity: 1,
            unitPrice: quote.calloutFee,
            totalPrice: quote.calloutFee,
          },
        ],
      },
    },
    include: {
      customer: true,
      engineer: true,
      business: true,
      quoteItems: true,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
