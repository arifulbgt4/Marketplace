import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { siteConfig } from "./global/config";
import { locales } from "./global/staticData";
import routes from "./global/routes";
import { classifyRoute } from "./lib/route-access";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: siteConfig.locale,
  localePrefix: "as-needed",
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) =>
        token != null &&
        token.status === "active" &&
        token.invalidated !== true,
    },
    pages: {
      signIn: routes.signin,
    },
  },
);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localePattern = locales.join("|");
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${localePattern})`), "") || "/";

  const token = await getToken({ req });
  const isAuth =
    !!token && token.status === "active" && token.invalidated !== true;
  const access = classifyRoute(pathWithoutLocale);

  if (
    (pathWithoutLocale === routes.signin ||
      pathWithoutLocale === routes.signup) &&
    isAuth
  ) {
    return NextResponse.redirect(new URL(routes.home, req.url));
  }

  if (
    access === "admin" ||
    access === "catalog" ||
    access === "operations"
  ) {
    if (!isAuth) {
      return NextResponse.redirect(new URL(routes.signin, req.url));
    }
    const role = token?.role;
    const allowed =
      role === "admin" ||
      (access === "catalog" && role === "catalog_manager") ||
      (access === "operations" && role === "support");
    if (!allowed) {
      return NextResponse.redirect(new URL(routes.home, req.url));
    }
    return intlMiddleware(req);
  }

  if (access === "customer" && !isAuth) {
    return NextResponse.redirect(new URL(routes.signin, req.url));
  }

  if (access === "public") {
    return intlMiddleware(req);
  }

  return (authMiddleware as any)(req);
}

export const config = {
  matcher: [
    "/",
    "/(en|af|am|ar|hy|as|az|bn)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
