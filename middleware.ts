import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'adal_auth';
const coreAuthUrl =
  process.env.CORE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || 'http://core-auth:4205';

async function validateSession(token: string | undefined) {
  if (!token) return null;
  try {
    const res = await fetch(`${coreAuthUrl}/auth/verify`, {
      method: 'GET',
      headers: { cookie: `${AUTH_COOKIE}=${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.valid ? data : null;
  } catch (err) {
    console.error('middleware: core-auth verify failed', err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // No protección sobre las rutas de auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Solo proteger dashboard
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await validateSession(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    url.searchParams.set('reason', 'unauthorized');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*']
};
