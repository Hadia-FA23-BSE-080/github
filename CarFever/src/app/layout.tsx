import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Fever — Premium Car Marketplace",
  description:
    "Discover, buy, and sell premium vehicles on Pakistan's most luxurious car marketplace. New & used cars, inspections, and price comparisons.",
  keywords: [
    "car marketplace",
    "buy cars",
    "sell cars",
    "used cars",
    "new cars",
    "Pakistan",
    "Car Fever",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
