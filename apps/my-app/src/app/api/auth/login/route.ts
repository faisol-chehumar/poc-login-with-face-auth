import { NextResponse } from 'next/server';
import { createAuthCookie } from '@/lib/cookies';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === 'admin' && password === 'password') {
    const response = new NextResponse();
    await createAuthCookie('admin', response);
    return response;
  }

  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
