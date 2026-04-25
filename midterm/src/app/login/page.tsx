'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('registeredEmail');
    const savedPassword = sessionStorage.getItem('registeredPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      sessionStorage.removeItem('registeredEmail');
      sessionStorage.removeItem('registeredPassword');
    }
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(data));
    
    // Redirect based on role
    if (data.role === 'admin') router.push('/dashboard/admin');
    else if (data.role === 'moderator') router.push('/dashboard/moderator');
    else router.push('/dashboard/client');
  };

  return (
    <div className="container mx-auto px-4 py-20 flex-1 flex justify-center items-center">
      <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-card">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-foreground/60 text-center mb-8">Sign in to your AdFlow Pro account.</p>
        
        {error && <p className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-bold text-center">{error}</p>}
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 relative">Email or Username</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com or username" className="w-full text-white px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 text-white py-2 rounded-lg bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors" />
          </div>
          <button type="submit" className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] mt-4">
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-foreground/60">
          Don't have an account? <Link href="/register" className="text-primary hover:underline font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}
