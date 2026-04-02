const fs = require('fs');
const path = require('path');

const writeFiles = {
  "src/lib/supabaseClient.ts": `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
`,
  "src/app/api/ads/route.ts": `import { NextResponse } from 'next/server';
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
`,
  "src/app/api/ads/[id]/route.ts": `import { NextResponse } from 'next/server';
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
`,
  "src/app/api/auth/register/route.ts": `import { NextResponse } from 'next/server';
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
`,
  "src/app/api/auth/login/route.ts": `import { NextResponse } from 'next/server';
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
`,
  "src/app/api/purchase/route.ts": `import { NextResponse } from 'next/server';
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
`,
  "src/app/api/users/route.ts": `import { NextResponse } from 'next/server';
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
`
};

for (const [filePath, content] of Object.entries(writeFiles)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Migration complete.");
