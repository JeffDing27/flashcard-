import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // all non-static routes
    '/(api|trpc)(.*)',                                // API routes
  ],
};
