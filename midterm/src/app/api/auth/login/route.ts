import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const users = getUsers();
  
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  
  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
