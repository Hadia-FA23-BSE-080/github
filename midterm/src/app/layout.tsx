import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdFlow Pro | Premium Sponsored Local Marketplace",
  description: "A production-level sponsored listing marketplace for managing, scheduling, and optimizing your ads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          "min-h-screen bg-background text-foreground antialiased font-sans flex flex-col"
        )}
      >
        <Navbar />
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        <footer className="border-t border-white/10 bg-card py-12 mt-auto">
          <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
            <p>&copy; {new Date().getFullYear()} AdFlow Pro. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
