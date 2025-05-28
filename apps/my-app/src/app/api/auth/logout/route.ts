import { NextResponse } from 'next/server';
import { deleteAuthCookie } from '@/lib/cookies';

export async function POST() {
  const response = new NextResponse();
  deleteAuthCookie(response);
  return response;
}
