import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password, role = 'client' } = await req.json();
  const users = getUsers();
  
  const existingUser = users.find((u: any) => u.email === email);
  
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  
  const newUser = { id: Date.now().toString(), email, password, role, plan: 'None' };
  
  users.push(newUser);
  saveUsers(users);
  
  const { password: _, ...safeUser } = newUser;
  return NextResponse.json(safeUser);
}
