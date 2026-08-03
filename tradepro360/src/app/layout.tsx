import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "TradePro 360 — Smart Booking & Dispatch",
  description:
    "Complete job management for UK plumbers, electricians, and cleaners. AI dispatch, live tracking, dynamic pricing, and Stripe payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
