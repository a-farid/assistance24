import { NextRequest, NextResponse } from "next/server";
import { SystemRole, ROUTE_SECURITY } from "./lib/constants/navigation";

// 💡 1. Declare explicit public routing gateways that do not require valid access tokens
const PUBLIC_ROUTES = ["/login", "/register", "/forgot_password", "/reset_password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;
  console.log('pathname', pathname, {token});

  // 💡 2. Dynamic Public Boundary Guard Block
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    console.log('The route is public');
    // If a token is found but the user is intentionally navigating to a public onboarding page,
    // it means a logout or session expiration occurred. Clear the cookies to avoid stale states.
    if (token) {
      console.log("Middleware: Public gate hit with active token. Purging browser cookies...");
      const response = NextResponse.next();
      
      // Force immediate deletion by setting maxAge to 0 on the response object
      response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
      response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
      return response;
    }
    return NextResponse.next();
  }

  try {
    // 3. Protected Route Security Barrier
    if (!token) {
      console.log("Middleware: Protected route requested without token. Blocking ingress.");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // 4. Decode the incoming JWT Payload safely at the Edge layer
    const tokenSections = token.split(".");
    if (tokenSections.length !== 3) {
      throw new Error("Malformed JWT string pattern.");
    }
    const decodedPayload = JSON.parse(atob(tokenSections[1]));
    const userRole = decodedPayload.role as SystemRole;

    // 5. Dynamic ABAC Engine: Evaluate path access using your centralized security matrix
    const matchedRule = ROUTE_SECURITY.find((rule) => pathname.startsWith(rule.link));

    if (matchedRule) {
      const hasClearance = matchedRule.roles.includes(userRole);
      
      if (!hasClearance) {
        console.warn(`[MIDDLEWARE SECURITY BLOCK] User with role [${userRole}] intercepted attempting to access [${pathname}]`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Access authorization verified successfully
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware processing runtime validation failure, purging token:", err);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: [
    // Core Matcher: Block all internal execution subpaths except public assets and authentication gateways
    "/((?!api|_next|static|favicon.ico).*)",
  ],
};