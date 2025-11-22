import { NextResponse } from 'next/server';
import { getUserFromCookie } from './utilities/getUserFromCookie';

export async function middleware(req) {
  const { user, isAdmin } = await getUserFromCookie();

  if (
    (!user && req.nextUrl.pathname === '/login') ||
    (!user && req.nextUrl.pathname === '/signup') ||
    (!user && req.nextUrl.pathname === '/reset') ||
    (!user && req.nextUrl.pathname === '/invitation') ||
    (!user && req.nextUrl.pathname === '/')
  ) {
    return NextResponse.next();
  }

  if (!user && req.nextUrl.pathname !== '/') {
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);
  }

  if (
    (user && req.nextUrl.pathname === '/signup') ||
    (user && req.nextUrl.pathname === '/reset') ||
    (user && req.nextUrl.pathname === '/invitation') ||
    (user && req.nextUrl.pathname === '/')
  ) {
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl);
  }

  if (user && !isAdmin && req.nextUrl.pathname === '/admin') {
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/invitation', '/room', '/'],
};
