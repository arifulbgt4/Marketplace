export type RouteAccess = "public" | "customer" | "catalog" | "admin";

const EXACT_PUBLIC = new Set([
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/about",
  "/blog",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/cookies",
  "/cart",
  "/opengraph-image",
  "/twitter-image",
]);

const isWithin = (pathname: string, root: string) =>
  pathname === root || pathname.startsWith(`${root}/`);

export function classifyRoute(pathname: string): RouteAccess {
  if (
    isWithin(pathname, "/admin/products") ||
    isWithin(pathname, "/admin/categories") ||
    isWithin(pathname, "/admin/inventory")
  ) {
    return "catalog";
  }
  if (isWithin(pathname, "/admin") || isWithin(pathname, "/dashboard"))
    return "admin";
  if (
    isWithin(pathname, "/u") ||
    isWithin(pathname, "/message") ||
    isWithin(pathname, "/checkout")
  ) {
    return "customer";
  }
  if (EXACT_PUBLIC.has(pathname) || isWithin(pathname, "/products"))
    return "public";
  if (
    pathname === "/l" ||
    (isWithin(pathname, "/l") &&
      !isWithin(pathname, "/l/create") &&
      !isWithin(pathname, "/l/edit"))
  ) {
    return "public";
  }
  return "customer";
}
