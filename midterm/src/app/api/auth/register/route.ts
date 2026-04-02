import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { email, password, role = 'client' } = await req.json();
  
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  
  const newUser = { id: Date.now().toString(), email, password, role, plan: 'None' };
  
  const { data, error } = await supabase.from('users').insert([newUser]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  const { password: _, ...safeUser } = data;
  return NextResponse.json(safeUser);
}
