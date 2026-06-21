import { NextRequest, NextResponse } from "next/server";
import { SystemRole, NAVBAR_LIST } from "./components/Layout/nav_list";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  try {
    // 1. Session Boundary Guard: Redirect immediately if token is missing
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // 2. Decode the incoming JWT Payload safely at the Edge layer
    const tokenSections = token.split(".");
    console.log('tokenSections', tokenSections);
    if (tokenSections.length !== 3) {
      throw new Error("Malformed JWT string pattern.");
    }
    const decodedPayload = JSON.parse(atob(tokenSections[1]));
    console.log('decodedPayload', decodedPayload);
    const userRole = decodedPayload.role as SystemRole;

    // 💡 3. Dynamic ABAC Engine: Evaluate path access using your centralized security matrix
    const matchedRule = NAVBAR_LIST.find((rule) => pathname.startsWith(rule.link));

    if (matchedRule) {
      const hasClearance = matchedRule.roles.includes(userRole);
      
      if (!hasClearance) {
        console.warn(`[MIDDLEWARE SECURITY BLOCK] User with role [${userRole}] intercepted attempting to access [${pathname}]`);
        
        // Bounce unauthorized traffic back down to the root dashboard lane safely
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Access authorization verified successfully
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware processing runtime validation failure:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Core Matcher: Block all internal execution subpaths except public assets and authentication gateways
    "/((?!api|login|register|_next|static|favicon.ico).*)",
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