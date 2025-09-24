/**
 * Enhanced Next.js Middleware for Authentication
 * Provides server-side route protection with improved security
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot_password',
  '/reset_password',
  '/api/auth/public',
  '/_next',
  '/favicon.ico',
  '/static',
];

// Role-based route access control
const roleBasedRoutes = {
  '/admin': ['admin'],
  '/worker': ['worker', 'admin'],
  '/client': ['client', 'admin'],
  '/contracts': ['admin', 'worker', 'client'],
};

interface TokenPayload {
  username: string;
  role: 'admin' | 'worker' | 'client';
  user_id: string;
  exp: number;
  iat: number;
}

/**
 * Verify JWT token securely
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if user has required role for route
 */
function hasRequiredRole(userRole: string, pathname: string): boolean {
  for (const [routePath, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(routePath)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true; // Allow access to general routes
}

/**
 * Create redirect response with security headers
 */
function createRedirectResponse(request: NextRequest, redirectUrl: string): NextResponse {
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

/**
 * Create success response with security headers
 */
function createSuccessResponse(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return createSuccessResponse(request);
  }

  // Get token from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    console.log(`No token found for ${pathname}, redirecting to login`);
    return createRedirectResponse(request, '/login');
  }

  // Extract token from Bearer format
  const token = accessToken.replace('Bearer ', '');
  
  // Verify token
  const payload = await verifyToken(token);
  
  if (!payload) {
    console.log(`Invalid token for ${pathname}, redirecting to login`);
    // Clear invalid token
    const response = createRedirectResponse(request, '/login');
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // Check token expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    console.log(`Expired token for ${pathname}, redirecting to login`);
    // Clear expired token
    const response = createRedirectResponse(request, '/login');
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // Check role-based access
  if (!hasRequiredRole(payload.role, pathname)) {
    console.log(`Insufficient permissions for ${pathname} (role: ${payload.role}), redirecting to dashboard`);
    return createRedirectResponse(request, '/');
  }

  // Add user info to headers for client-side access
  const response = createSuccessResponse(request);
  response.headers.set('X-User-Role', payload.role);
  response.headers.set('X-User-ID', payload.user_id);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/public (public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth/public|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)',
  ],
};
