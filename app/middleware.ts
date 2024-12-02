import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { account } from '@/lib/appwrite'; // Import your Appwrite client

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // List of paths that do not require authentication
  const publicPaths = ['/auth/login', '/auth/signup'];

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle redirection for the root path and /admin routes
  if (pathname === '/' || pathname.startsWith('/admin')) {
    try {
      // Check if the user is authenticated
      await account.getSession('current');
      return NextResponse.next();
    } catch (error) {
      // Redirect to login page if not authenticated
      url.pathname = '/auth/login'; // Redirect to login page
      return NextResponse.redirect(url);
    }
  }

  // For other paths, allow access if authenticated
  try {
    await account.getSession('current');
    return NextResponse.next();
  } catch (error) {
    // Redirect to login page if not authenticated
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // Apply middleware to all routes except specific static files and images
    '/((?!_next/static|_next/image|bglogo.png).*)',
    '/', // Protect the root route
    '/admin/:path*', // Protect all routes under /admin
  ],
};
