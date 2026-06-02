import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;
  const role = token?.role;
  const status = token?.status;

  // /auth/error is always allowed
  if (pathname.startsWith('/auth/error')) {
    return NextResponse.next();
  }

  // / -> Authenticated + ACTIVE -> Redirect to dashboard
  if (pathname === '/') {
    if (isAuthenticated) {
      if (status === 'ACTIVE' || token?.isAdmin) return NextResponse.redirect(new URL('/dashboard', req.url));
      if (status === 'DORMANT') return NextResponse.redirect(new URL('/auth/first-login', req.url));
    }
    return NextResponse.next();
  }

  // /dashboard/* logic
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/', req.url));
    if (status === 'DORMANT') return NextResponse.redirect(new URL('/auth/first-login', req.url));
    if (status === 'ACTIVE' || token?.isAdmin) return NextResponse.next();
  }

  // /admin/* logic
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/', req.url));
    if (!token?.isAdmin) return NextResponse.redirect(new URL('/dashboard', req.url));
    if (token?.isAdmin) return NextResponse.next();
  }

  // /auth/first-login logic
  if (pathname.startsWith('/auth/first-login')) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/', req.url));
    if (status === 'ACTIVE') return NextResponse.redirect(new URL('/dashboard', req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/.*).*)',
  ],
};
