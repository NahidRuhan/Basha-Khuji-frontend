import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const path = request.nextUrl.pathname;

  // Paths that are publicly accessible
  const isPublicPath = path === "/" || path.startsWith("/properties");
  // Paths that are only for unauthenticated users
  const isAuthPath = path.startsWith("/auth");
  // Paths that require authentication
  const isDashboardPath = path.startsWith("/dashboard");

  // If user is trying to access auth paths (login/register) and is already logged in
  if (isAuthPath && token) {
    // We don't know their role securely here without decoding JWT, 
    // but the client-side AuthProvider will handle exact role redirection.
    // For now, push them to a generic dashboard or home.
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is trying to access protected paths and is NOT logged in
  if (isDashboardPath && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
