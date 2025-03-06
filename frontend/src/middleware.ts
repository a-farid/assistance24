import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("access_token")?.value;

  if (!authToken) {
    console.log('no token');
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const user = JSON.parse(atob(authToken.split(".")[1])); // Decode JWT

    if (user.role !== "admin") {
        console.log('not admin');
      return NextResponse.redirect(new URL("/", request.url));
    }
console.log('admin');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};
