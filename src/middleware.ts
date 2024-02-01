import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { siteConfig } from "src/global/config";
import { locales } from "src/global/staticData";

const publicPages = [
  "/",
  "/signin",
  "/signup",
  "/lab",
  "/faq",
  "/opengraph-image",
  "/twitter-image",
  "/about",
  "/contact",
  "/s",
  "/l",
];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: siteConfig.locale,
  localePrefix: "as-needed",
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  const token = await getToken({ req });
  const isAuth = !!token;

  if (
    (req.nextUrl.pathname === "/signin" ||
      req.nextUrl.pathname === "/signup") &&
    isAuth
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  }
  return (authMiddleware as any)(req);
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    `/(${locales.join("|")})/:path*`,

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`),
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
