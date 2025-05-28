import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthCookie } from '@/lib/cookies';

export async function GET(request: NextRequest) {
  const auth = await verifyAuthCookie(request);
  return auth
    ? NextResponse.json({ authenticated: true })
    : NextResponse.json({ authenticated: false }, { status: 401 });
}
