import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/db';

export async function POST(req: Request) {
  // Wait for the JSON parsing
  const { email, planName, planPrice } = await req.json();
  
  const users = getUsers();
  const index = users.findIndex((u: any) => u.email === email);
  
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Update user's current plan
  users[index].plan = planName;
  
  if (!users[index].purchases) {
    users[index].purchases = [];
  }
  
  users[index].purchases.push({
    plan: planName,
    price: planPrice,
    date: new Date().toISOString()
  });
  
  saveUsers(users);
  
  return NextResponse.json({ success: true, plan: planName });
}
