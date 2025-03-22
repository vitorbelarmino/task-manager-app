import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("TaskManager.token")?.value;

  const currentRoute = request.nextUrl.pathname;
  const loginRoute = "/login";
  const registerRoute = "/register";
  const freeRoutes = [loginRoute, registerRoute];

  if (!token && !freeRoutes.includes(currentRoute)) {
    const LoginURLRedirect = new URL("/login", request.url);
    return NextResponse.redirect(LoginURLRedirect);
  }

  if (token && freeRoutes.includes(currentRoute)) {
    const HomeURLRedirect = new URL("/", request.url);
    return NextResponse.redirect(HomeURLRedirect);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)", // all routes except /api, /_next/static, /_next/image, /favicon.ico, /images
  ],
};
