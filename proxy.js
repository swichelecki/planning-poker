import { NextResponse } from 'next/server';

export async function proxy(req) {
  const { searchParams } = req.nextUrl;

  if (!searchParams.has('room') && req.nextUrl.pathname === '/room') {
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/room'],
};
