import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // 1. Unauthenticated protection for /dashboard and /admin
  if (!token) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Role-based routing boundary
  try {
    let payload: any;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret && process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET missing');
      }
      const secret = new TextEncoder().encode(
        jwtSecret || 'devascent_dev_fallback_secret_never_use_in_production_min_64_chars'
      );
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check expiration if present
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAdmin = payload.role === 'ADMIN' || payload.email === 'shivrom.2020@gmail.com';

    // Admin trying to access student dashboard -> bounce to Admin Portal
    if (isAdmin && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Student trying to access admin panel -> bounce to Student Workspace
    if (!isAdmin && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
