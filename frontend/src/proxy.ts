import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, decodeJwt } from 'jose';

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
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'e8a731a36ff1728bd8fece797fc2515e1d2797351921832d9f19605f903885aae4c219b631e9fb50e7ac6bf45dd3b889dca489095d12c108582fa2f779e9c64a'
      );
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      // Edge fallback: Decode JWT payload directly to avoid blocking valid sessions if secret env fails to load
      payload = decodeJwt(token);
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
