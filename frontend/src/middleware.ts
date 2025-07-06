// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const authToken = request.cookies.get("access_token")?.value;

//   if (!authToken) {
//     console.log('no token, redirecting to login');
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     const user = JSON.parse(atob(authToken.split(".")[1])); // Decode JWT
//     if (user.role !== "admin") {
//       console.log('not admin');
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     console.log('admin user, proceeding');
//     return NextResponse.next();
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }

// export const config = {
//   matcher: "/admin/:path*",
// };

// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // JWT payload
    const userRole = decoded.role;
    const pathname = request.nextUrl.pathname;

    // Role restriction for /admin/* routes
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Add other role restrictions here if needed
    // Example: if(pathname.startsWith("/worker") && userRole !== "worker") ...

    return NextResponse.next();
  } catch (err) {
    console.error("Token decode failed:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}


export const config = {
  matcher: [
    // Match all paths except login, register, public APIs etc.
    "/((?!api|login|register|_next|static|favicon.ico).*)",
  ],
};

