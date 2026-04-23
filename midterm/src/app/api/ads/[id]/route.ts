import { NextResponse } from 'next/server';
import { getAds, saveAds } from '@/lib/db';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const ads = getAds();
  const ad = ads.find((a: any) => a.id === params.id || a.id.toString() === params.id);
  
  if (!ad) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...ad, userId: ad.userId || ad.user_id });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const body = await req.json();
  const ads = getAds();
  
  const index = ads.findIndex((a: any) => a.id === params.id || a.id.toString() === params.id);
  if (index !== -1) {
    ads[index] = { ...ads[index], ...body };
    saveAds(ads);
  }
  
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  let ads = getAds();
  
  ads = ads.filter((a: any) => a.id !== params.id && a.id.toString() !== params.id);
  saveAds(ads);
  
  return NextResponse.json({ success: true });
}
