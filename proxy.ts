import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from '@/auth';

const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // Check if the user is accessing a dashboard route
  const isDashboard = pathname.includes('/dashboard');

  if (isDashboard && !req.auth) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return Response.redirect(signInUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
