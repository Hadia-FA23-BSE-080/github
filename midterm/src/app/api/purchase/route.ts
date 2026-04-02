import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  // Wait for the JSON parsing
  const { email, planName, planPrice } = await req.json();
  
  const { data: user } = await supabase.from('users').select('id, email, plan').eq('email', email).single();
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Update user's current plan
  await supabase.from('users').update({ plan: planName }).eq('email', email);
  
  // Insert into purchases table separately
  const purchase = {
    id: Date.now().toString(),
    user_id: user.id,
    plan_name: planName,
    price: planPrice
  };
  await supabase.from('purchases').insert([purchase]);
  
  return NextResponse.json({ success: true, plan: planName });
}
