import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/match"];

export const middleware = (request: NextRequest): NextResponse => {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const sessionCookieValue = request.cookies.get("session")?.value;

  if (isProtectedRoute && undefined === sessionCookieValue) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
