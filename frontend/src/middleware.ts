import { NextRequest, NextResponse } from "next/server";
import { SystemRole, ROUTE_SECURITY } from "./lib/constants/navigation";

// 💡 1. Public Boundary Array: Routes that require NO authentication tokens whatsoever
const publicRoutes = [
  '/login',
  '/register',
  '/forgot_password',
  '/reset_password'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;
  console.log('Starting the check!!', publicRoutes, "|| With :", pathname);


  // 💡 2. Fast-Path Public Bypass: Immediately pass traffic to public landing zones
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('Starting the check!!');
    // If an authenticated user tries to visit /login, redirect them straight to /dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  try {
    // 3. Authentication Barrier
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Decode incoming token string
    const tokenSections = token.split(".");
    const decodedPayload = JSON.parse(atob(tokenSections[1]));
    const userRole = decodedPayload.role as SystemRole;

    // 4. Dynamic Access Control Check
    const matchedRule = ROUTE_SECURITY.find((rule) => pathname.startsWith(rule.link) && rule.roles.includes(userRole));

    if (matchedRule) {
      const hasClearance = matchedRule.roles.includes(userRole);
      if (!hasClearance) {
        console.warn(`Security block triggered for role: [${userRole}] on path: [${pathname}]`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 💡 5. Centralized High-Performance Edge Matcher Configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, static (favicon and public static asset folders)
     */
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};


// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("access_token")?.value;
//   console.log('Middleware hitted here', { token });

//   try {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
    
//     const decoded = JSON.parse(atob(token.split(".")[1])); // JWT payload
//     const userRole = decoded.role;
//     const pathname = request.nextUrl.pathname;

//     // Role restriction for /admin/* routes
//     if (pathname.startsWith("/admin") && userRole !== "admin") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("Token decode failed:", err);
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// export const config = {
//   matcher: [
//     // Match all paths except login, register, public APIs etc.
//     "/((?!api|login|register|_next|static|favicon.ico).*)",
//   ],
// };