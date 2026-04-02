'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Basic Client-Side Route Protection Guard
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("🔒 Restricted Restricted Area. Please login to access your dashboard settings.");
      router.replace('/login'); // forcefully redirect back
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-screen relative">
         <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
         <p className="mt-6 text-foreground/60 font-bold uppercase tracking-widest text-sm animate-pulse">Verifying Access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
