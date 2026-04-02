'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check local storage on mount to see if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    
    // Listen for storage events (if they login in another tab) or custom event
    const handleStorage = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    // Force reload to clear all states
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            A
          </div>
          <span className="font-bold text-xl tracking-tight">AdFlow Pro</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/explore" className="text-foreground/80 hover:text-primary transition-colors">Explore</Link>
          <Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</Link>

          {/* Role Based Conditional Links */}
          {user?.role === 'client' && (
            <Link href="/dashboard/client" className="text-foreground/80 hover:text-primary transition-colors font-bold text-blue-400">My Dashboard</Link>
          )}
          {user?.role === 'moderator' && (
            <Link href="/dashboard/moderator" className="text-foreground/80 hover:text-primary transition-colors font-bold text-yellow-500">Mod Panel</Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/dashboard/admin" className="text-foreground/80 hover:text-primary transition-colors font-bold text-red-500">Admin Panel</Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="hidden sm:block text-foreground/80 hover:text-foreground">Log In</Link>
              <Link href="/register" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-foreground/50 text-xs hidden lg:block border border-white/10 px-2 py-1 rounded bg-white/5">
                {user.email} ({user.role})
              </span>
              <button onClick={logout} className="text-red-400 hover:text-red-500 hover:underline transition-colors font-bold">
                Logout
              </button>
              
              {user.role === 'client' && (
                <Link href="/dashboard/client/publish" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  Post an Ad
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
