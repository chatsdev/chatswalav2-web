import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "./constants";
import { getUrlWithBasePath } from "./utils";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;



  const isAuthPage = pathname.startsWith("/auth");
  const isImpersonate = pathname === "/auth/impersonate";

  if (isAuthPage && !isImpersonate && isAuthenticated) {
    return NextResponse.redirect(
      new URL(getUrlWithBasePath(ROUTES.Dashboard), req.url)
    );
  }

  const isGuestAllowed =
    pathname === "/" ||
    pathname.startsWith("/landing") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/page") ||
    pathname.startsWith("/product") ||
    pathname.startsWith("/channel");

  if (!isAuthenticated && !isGuestAllowed) {
    return NextResponse.redirect(
      new URL(getUrlWithBasePath(ROUTES.Login), req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)).*)",
  ],
};