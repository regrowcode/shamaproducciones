import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // If host starts with "admin." (e.g. admin.shamaproducciones.com or admin.localhost:3000)
  if (host.startsWith("admin.")) {
    // If requesting root on the admin subdomain, rewrite to /admin
    if (url.pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // If requesting a path that doesn't start with /admin, prefix it
    if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
