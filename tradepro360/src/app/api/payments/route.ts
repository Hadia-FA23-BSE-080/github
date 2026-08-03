import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";
import { generateInvoicePDF } from "@/lib/invoice";
import { formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { jobId, payLater = false } = body;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: true,
      business: true,
      quoteItems: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const amountPence = Math.round(job.totalCost * 100);

  const session = await createCheckoutSession({
    amount: amountPence,
    jobReference: job.reference,
    customerEmail: job.customer.email,
    successUrl: `${appUrl}/portal/${job.id}?payment=success`,
    cancelUrl: `${appUrl}/portal/${job.id}?payment=cancelled`,
    payLater,
  });

  if (payLater) {
    await prisma.job.update({
      where: { id: jobId },
      data: { paymentStatus: "PAY_LATER" },
    });
  }

  return NextResponse.json(session);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: true,
      business: true,
      quoteItems: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const issueDate = new Date();
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const pdf = generateInvoicePDF({
    invoiceNumber: job.invoiceNumber ?? job.reference,
    jobReference: job.reference,
    businessName: job.business.name,
    businessAddress: `${job.business.address}, ${job.business.city} ${job.business.postcode}`,
    businessPhone: job.business.phone,
    businessEmail: job.business.email,
    customerName: job.customer.name,
    customerAddress: `${job.address}, ${job.city} ${job.postcode}`,
    customerEmail: job.customer.email,
    issueDate: formatDate(issueDate),
    dueDate: formatDate(dueDate),
    lineItems: job.quoteItems.map((item) => ({
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.totalPrice,
    })),
    subtotal: job.totalCost / (1 + job.vatRate),
    vatRate: job.vatRate,
    vatAmount: job.totalCost - job.totalCost / (1 + job.vatRate),
    total: job.totalCost,
    paymentStatus: job.paymentStatus,
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${job.reference}.pdf"`,
    },
  });
}
