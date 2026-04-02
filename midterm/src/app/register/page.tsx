'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    
    // Auto login
    localStorage.setItem('user', JSON.stringify(data));
    
    if (data.role === 'admin') router.push('/dashboard/admin');
    else if (data.role === 'moderator') router.push('/dashboard/moderator');
    else router.push('/dashboard/client');
  };

  return (
    <div className="container mx-auto px-4 py-20 flex-1 flex justify-center items-center">
      <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-card">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-foreground/60 text-center mb-8">Join AdFlow Pro today.</p>
        
        {error && <p className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm font-bold text-center">{error}</p>}
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full text-white px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 text-white py-2 rounded-lg bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Account Role (Demo Selection)</label>
             <select value={role} onChange={e => setRole(e.target.value)} className="w-full text-white px-4 py-2 rounded-lg bg-background border border-white/10 focus:border-primary focus:outline-none transition-colors appearance-none">
               <option className="bg-card text-white" value="client">Client (Post Ads)</option>
               <option className="bg-card text-white" value="moderator">Moderator (Review Ads)</option>
               <option className="bg-card text-white" value="admin">Admin (Manage All)</option>
             </select>
          </div>
          <button type="submit" className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] mt-4">
            Register
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-foreground/60">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
