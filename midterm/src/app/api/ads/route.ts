import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
  return NextResponse.json(ads || []);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const newAd = {
    id: Date.now().toString(),
    user_id: body.userId || 'guest',
    title: body.title,
    price: body.price,
    description: body.description || '',
    category: body.category || 'General',
    image: body.image || '',
    status: body.status || 'draft'
  };
  
  const { data, error } = await supabase.from('ads').insert([newAd]).select().single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  // Transform back for frontend
  const resAd = { ...data, userId: data.user_id };
  return NextResponse.json(resAd, { status: 201 });
}
