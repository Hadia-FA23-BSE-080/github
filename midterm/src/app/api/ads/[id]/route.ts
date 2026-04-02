import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { data: ad, error } = await supabase.from('ads').select('*').eq('id', params.id).single();
  
  if (error || !ad) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...ad, userId: ad.user_id });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const body = await req.json();
  
  const { error } = await supabase.from('ads').update(body).eq('id', params.id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { error } = await supabase.from('ads').delete().eq('id', params.id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
