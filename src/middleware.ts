import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { siteConfig } from "./global/config";
import { locales } from "./global/staticData";
import routes from "./global/routes";

const publicPages = [
  routes.home,
  routes.signin,
  routes.signup,
  routes.lab,
  routes.faq,
  routes.about,
  routes.blog,
  routes.contact,
  routes.listings,
  routes.termas,
  routes.privacy,
  routes.cookies,
  "/opengraph-image",
  "/twitter-image",
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
      signIn: routes.signin,
    },
  }
);

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i"
  );

  const dynamicPublicPathRegex = RegExp(
    `^(/(${locales.join("|")}))?[${routes.listing}|${
      routes.merchant
    }]+[A-Za-z0-9_-]*$`
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  const isDynamicPublicPage = dynamicPublicPathRegex.test(req.nextUrl.pathname);

  const token = await getToken({ req });
  const isAuth = !!token;

  if (
    (req.nextUrl.pathname === routes.signin ||
      req.nextUrl.pathname === routes.signup) &&
    isAuth
  ) {
    return NextResponse.redirect(new URL(routes.home, req.url));
  }

  if (isPublicPage || isDynamicPublicPage) {
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
    `/(en|af|am|ar|hy|as|az|bn)/:path*`,

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`),
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
