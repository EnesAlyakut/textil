import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: optimistic cookie check; every page/action re-validates on the server.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Spanish, Russian and French are served from their prefix as-is.
  if (/^\/(es|ru|fr)(\/|$)/.test(pathname)) return NextResponse.next();

  // English is the default and canonical at the root: /en/... → /...
  // The Turkish site is retired; old /tr links land on the same page in English.
  if (/^\/(en|tr)(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except API, Next internals, media/uploads and files with an extension.
    "/((?!api|_next|media|uploads|favicon.ico|sitemap.xml|robots.txt|.*\\.[\\w]+$).*)",
  ],
};
