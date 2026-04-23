import { NextResponse } from 'next/server';
import { getAds, saveAds } from '@/lib/db';

export async function GET() {
  const ads = getAds();
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const body = await req.json();
  const ads = getAds();
  
  const newAd = {
    id: Date.now().toString(),
    userId: body.userId || 'guest',
    title: body.title,
    price: body.price,
    description: body.description || '',
    category: body.category || 'General',
    image: body.image || '',
    status: body.status || 'draft'
  };
  
  ads.push(newAd);
  saveAds(ads);
  
  return NextResponse.json(newAd, { status: 201 });
}
