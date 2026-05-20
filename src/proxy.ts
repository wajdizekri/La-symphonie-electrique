import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error('JWT_SECRET is not set. Refusing to start without a JWT secret.');
}
const SECRET_KEY = new TextEncoder().encode(rawSecret);

const PUBLIC_ADMIN_PAGES = new Set([
  '/admin/login',
  '/admin/register',
  '/admin/forgot-password',
  '/admin/reset-password',
]);
const PUBLIC_ADMIN_API = new Set(['/api/auth/login', '/api/auth/register']);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage && PUBLIC_ADMIN_PAGES.has(pathname)) return NextResponse.next();
  if (isApi && PUBLIC_ADMIN_API.has(pathname)) return NextResponse.next();

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = request.cookies.get('admin_token')?.value;

  const unauthorized = () =>
    isApi
      ? NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', request.url));

  if (!token) return unauthorized();

  try {
    await jwtVerify(token, SECRET_KEY);
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
