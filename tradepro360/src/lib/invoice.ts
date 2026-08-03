import { jsPDF } from "jspdf";
import { formatCurrency } from "./utils";

export interface InvoiceData {
  invoiceNumber: string;
  jobReference: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  paymentStatus: string;
}

export function generateInvoicePDF(data: InvoiceData): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("TradePro 360", 14, 18);
  doc.setFontSize(10);
  doc.text("INVOICE", pageWidth - 14, 18, { align: "right" });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Business details
  let y = 45;
  doc.setFont("helvetica", "bold");
  doc.text(data.businessName, 14, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text(data.businessAddress, 14, y);
  y += 5;
  doc.text(`Tel: ${data.businessPhone}`, 14, y);
  y += 5;
  doc.text(`Email: ${data.businessEmail}`, 14, y);

  // Invoice meta
  y = 45;
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice: ${data.invoiceNumber}`, pageWidth - 14, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text(`Job Ref: ${data.jobReference}`, pageWidth - 14, y, { align: "right" });
  y += 5;
  doc.text(`Issue Date: ${data.issueDate}`, pageWidth - 14, y, { align: "right" });
  y += 5;
  doc.text(`Due Date: ${data.dueDate}`, pageWidth - 14, y, { align: "right" });

  // Bill to
  y = 75;
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text(data.customerName, 14, y);
  y += 5;
  doc.text(data.customerAddress, 14, y);
  y += 5;
  doc.text(data.customerEmail, 14, y);

  // Line items table
  y = 100;
  doc.setFillColor(243, 244, 246);
  doc.rect(14, y - 5, pageWidth - 28, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Description", 16, y);
  doc.text("Qty", 110, y);
  doc.text("Unit Price", 130, y);
  doc.text("Total", pageWidth - 16, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  y += 8;

  for (const item of data.lineItems) {
    doc.text(item.description.substring(0, 50), 16, y);
    doc.text(String(item.quantity), 110, y);
    doc.text(formatCurrency(item.unitPrice), 130, y);
    doc.text(formatCurrency(item.total), pageWidth - 16, y, { align: "right" });
    y += 6;
  }

  // Totals
  y += 10;
  doc.line(110, y, pageWidth - 14, y);
  y += 8;
  doc.text("Subtotal:", 130, y);
  doc.text(formatCurrency(data.subtotal), pageWidth - 16, y, { align: "right" });
  y += 6;
  doc.text(`VAT (${(data.vatRate * 100).toFixed(0)}%):`, 130, y);
  doc.text(formatCurrency(data.vatAmount), pageWidth - 16, y, { align: "right" });
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", 130, y);
  doc.text(formatCurrency(data.total), pageWidth - 16, y, { align: "right" });

  // Payment status
  y += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Status: ${data.paymentStatus}`, 14, y);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "TradePro 360 — Smart Booking & Dispatch Platform | VAT Registered",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  return Buffer.from(doc.output("arraybuffer"));
}
