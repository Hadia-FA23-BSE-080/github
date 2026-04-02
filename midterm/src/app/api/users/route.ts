import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data: users, error } = await supabase.from('users').select('*, purchases(*)');
  
  if (error) return NextResponse.json([], { status: 500 });
  
  const safeUsers = users.map((u: any) => {
    const { password, ...rest } = u;
    return rest;
  });
  
  return NextResponse.json(safeUsers || []);
}
