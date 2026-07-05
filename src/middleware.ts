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
  routes.products,
  routes.terms,
  routes.privacy,
  routes.cookies,
  "/opengraph-image",
  "/twitter-image",
];

const adminRoutes = ["/admin", "/dashboard"];

const customerRoutes = [
  "/account",
  "/orders",
  "/bookmarks",
  "/messages",
  "/cart",
  "/checkout",
];

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
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: routes.signin,
    },
  }
);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localePattern = locales.join("|");
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${localePattern})`), "") || "/";

  const isPublicPage = publicPages.some((page) => {
    if (page === "/") return pathWithoutLocale === "/";
    return pathWithoutLocale === page || pathWithoutLocale.startsWith(page + "/");
  });

  const isAdminRoute = adminRoutes.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
  );

  const isCustomerRoute = customerRoutes.some((route) =>
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + "/")
  );

  const token = await getToken({ req });
  const isAuth = !!token;

  if (
    (pathWithoutLocale === routes.signin ||
      pathWithoutLocale === routes.signup) &&
    isAuth
  ) {
    return NextResponse.redirect(new URL(routes.home, req.url));
  }

  if (isAdminRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL(routes.signin, req.url));
    }
    const role = token?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL(routes.home, req.url));
    }
    return intlMiddleware(req);
  }

  if (isCustomerRoute && !isAuth) {
    return NextResponse.redirect(new URL(routes.signin, req.url));
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  return (authMiddleware as any)(req);
}

export const config = {
  matcher: [
    "/",
    `/(${locales.join("|")})/:path*`,
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
