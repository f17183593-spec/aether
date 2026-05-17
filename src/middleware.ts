import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "ar"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  const acceptLanguage = request.headers.get("accept-language") || ""
  const preferredLocale = locales.find((l) => acceptLanguage.startsWith(l)) || defaultLocale

  const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|locales).*)"],
}
