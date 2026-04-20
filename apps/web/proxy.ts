// proxy.ts
// Purpose: Redirects bare non-localized URLs to a locale-prefixed route based on the request language.
// Linked files: lib/lang/config.ts, app/[locale]/layout.tsx, app/[locale]/page.tsx.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LOCALES, detectPreferredLocale } from "@/lib/lang/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  const locale = detectPreferredLocale(
    request.headers.get("accept-language"),
  );

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};