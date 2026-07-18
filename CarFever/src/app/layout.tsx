import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0055FE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Car Fever",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans overscroll-none">
        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_ID is set in .env.local */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
