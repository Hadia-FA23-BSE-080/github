import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  // Real login checking BOTH email and password since we don't have built-in auth logic right now
  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  
  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
