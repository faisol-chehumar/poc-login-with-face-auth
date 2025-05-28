import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthCookie } from '@/lib/cookies';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication
  const auth = await verifyAuthCookie(request); // Make sure this returns null if no cookie

  if (!auth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);

    // Optional: Add a debug header for troubleshooting, safe to remove in production
    const res = NextResponse.redirect(loginUrl);
    res.headers.set('X-Debug', 'Blocked by middleware');
    return res;
  }

  return NextResponse.next();
}

// Run middleware **only** for these routes
export const config = {
  matcher: ['/:path*', '/profile/:path*'],
};
