import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function GET() {
  const users = getUsers();
  
  const safeUsers = users.map((u: any) => {
    const { password, ...rest } = u;
    return rest;
  });
  
  return NextResponse.json(safeUsers || []);
}
