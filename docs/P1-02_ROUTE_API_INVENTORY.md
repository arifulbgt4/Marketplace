# P1-02 Route/API Inventory

## Status: Complete

## Verification baseline

- Source baseline: `dev` at `b5fe836`
- Verified: 2026-07-05
- Sources: `src/app/**`, `src/server/**`, `src/middleware.ts`, `src/global/routes/index.ts`
- Path notation: `[locale]` এবং route groups normalized করে user-facing path দেখানো হয়েছে। Default locale `en`-এ prefix optional।

## Middleware behavior

`src/middleware.ts:10-25`-এর exact public list:

```text
/, /signin, /signup, /lab, /faq, /about, /blog, /contact,
/l, /terms, /privacy, /cookies, /opengraph-image, /twitter-image
```

`/lab` config-এ আছে, কিন্তু corresponding page file নেই; routeটি 404 হয়।

`src/middleware.ts:56-60`-এর dynamic-public regex alternation-এর বদলে character class ব্যবহার করে। Source-equivalent test-এর verified result:

| Path | Regex result | Effective access | Intended access |
|---|---|---|---|
| `/l/example` | Match | Public | Public |
| `/merchant/example` | Match | Public | Public |
| `/l/create` | Match | **Public leak** | Protected |
| `/en/l/create` | Match | **Public leak** | Protected |
| `/message` | Match | **Public leak** | Protected |
| `/l/edit/example` | No match | Protected | Protected |
| `/eeee` | Match | Public 404 | No route/protected fallback |
| `/u/dashboard` | No match | Protected | Protected |

`src/middleware.ts:85-96` API, Next internal assets, Vercel internal paths এবং dot-containing paths middleware থেকে বাদ দেয়। API authentication route handler-এর নিজস্ব check-এর উপর নির্ভরশীল। Authenticated-user redirect শুধু unprefixed `/signin` এবং `/signup` সরাসরি compare করে; locale-prefixed variant আলাদা test/fix প্রয়োজন।

## Page routes

### Public or effectively public

| Route | Current behavior/data | Effective access | Source |
|---|---|---|---|
| `/` | Locale-aware home; featured listings query | Public | `src/app/[locale]/(WrappedPages)/page.tsx` |
| `/signin` | Credentials sign-in UI | Public | `src/app/[locale]/(UnwrappedPages)/(AuthPages)/signin/page.tsx` |
| `/signup` | Registration UI | Public | `src/app/[locale]/(UnwrappedPages)/(AuthPages)/signup/page.tsx` |
| `/l` | Listing search/filter UI | Public | `src/app/[locale]/(WrappedPages)/l/page.tsx` |
| `/l/[slug]` | Listing details; query currently does not enforce published status | Public | `src/app/[locale]/(WrappedPages)/l/[slug]/page.tsx` |
| `/merchant/[userID]` | Legacy merchant profile | Public | `src/app/[locale]/(WrappedPages)/merchant/[userID]/page.tsx` |
| `/about` | Static information | Public | `src/app/[locale]/(WrappedPages)/about/page.tsx` |
| `/blog` | Static shell | Public | `src/app/[locale]/(WrappedPages)/blog/page.tsx` |
| `/contact` | Contact form with no-op submit handler | Public | `src/app/[locale]/(WrappedPages)/contact/page.tsx` |
| `/cookies` | Static information | Public | `src/app/[locale]/(WrappedPages)/cookies/page.tsx` |
| `/faq` | Static information | Public | `src/app/[locale]/(WrappedPages)/faq/page.tsx` |
| `/privacy` | Static information | Public | `src/app/[locale]/(WrappedPages)/privacy/page.tsx` |
| `/terms` | Static information | Public | `src/app/[locale]/(WrappedPages)/terms/page.tsx` |
| `/l/create` | Listing form; layout performs no auth check | **Public because of regex defect** | `src/app/[locale]/(UnwrappedPages)/l/create/page.tsx` |
| `/message` | Mock messaging UI; layout reads session but does not reject anonymous access | **Public because of regex defect** | `src/app/[locale]/(UnwrappedPages)/message/page.tsx` |

### Middleware-protected

| Route | Current behavior | Source |
|---|---|---|
| `/l/edit/[slug]` | Placeholder edit page; protected by middleware fallback | `src/app/[locale]/(WrappedPages)/l/edit/[slug]/page.tsx` |
| `/u/dashboard` | Mock/hardcoded dashboard | `src/app/[locale]/(WrappedPages)/u/dashboard/page.tsx` |
| `/u/account` | Account UI | `src/app/[locale]/(WrappedPages)/u/account/page.tsx` |
| `/u/listing` | Current-user listings | `src/app/[locale]/(WrappedPages)/u/listing/page.tsx` |
| `/u/bookmark` | Current-user bookmarks | `src/app/[locale]/(WrappedPages)/u/bookmark/page.tsx` |
| `/u/order` | Current-user booking orders | `src/app/[locale]/(WrappedPages)/u/order/page.tsx` |
| `/u/setting` | General settings shell | `src/app/[locale]/(WrappedPages)/u/setting/page.tsx` |
| `/u/setting/media` | Media settings shell | `src/app/[locale]/(WrappedPages)/u/setting/media/page.tsx` |
| `/u/setting/security` | Password settings shell | `src/app/[locale]/(WrappedPages)/u/setting/security/page.tsx` |
| `/u/setting/social` | Social settings shell | `src/app/[locale]/(WrappedPages)/u/setting/social/page.tsx` |

User route-group layout নিজে session enforce করে না; current protection middleware-dependent।

## Framework/system routes

| Route | Purpose | Source |
|---|---|---|
| `/` pre-locale entry | Redirects to `/en` when reached directly | `src/app/page.tsx` |
| `/manifest.webmanifest` | PWA manifest | `src/app/manifest.ts` |
| `/robots.txt` | Robots metadata | `src/app/robots.ts` |
| `/sitemap.xml` | Static sitemap generation | `src/app/sitemap.ts` |
| `/icon` | Generated application icon | `src/app/icon.tsx` |
| `/apple-icon` | Generated Apple icon | `src/app/apple-icon.tsx` |
| `/[locale]/opengraph-image` | Locale OG image | `src/app/[locale]/opengraph-image.tsx` |
| `/[locale]/twitter-image` | Locale social image | `src/app/[locale]/twitter-image.tsx` |

## API routes

| Route | Method | Effective auth | Validation/rate | Source |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | Public provider endpoint | NextAuth internal | `src/app/api/auth/[...nextauth]/route.ts` |
| `/api/register` | POST | Public | Zod; in-memory 5/15m limiter | `src/app/api/register/route.ts` |
| `/api/session` | GET | Session required; 401 otherwise | None | `src/app/api/session/route.ts` |
| `/api/listings` | GET | Public | Search schema | `src/app/api/listings/route.ts` |
| `/api/listings` | POST | Session required | Listing schema | `src/app/api/listings/route.ts` |
| `/api/orders` | GET, POST | Session required | Order schema on POST | `src/app/api/orders/route.ts` |
| `/api/reviews` | GET | Public | `listingId` required | `src/app/api/reviews/route.ts` |
| `/api/reviews` | POST | Session required | Review schema; one per user/listing | `src/app/api/reviews/route.ts` |

## Server actions/functions

| Function | Effective auth/authorization | Important baseline behavior | Source |
|---|---|---|---|
| `getUser` | Session; self query | Returns account and counts | `src/server/user.ts` |
| `updateUser` | **None** | Caller-provided user ID can be updated | `src/server/user.ts` |
| `getUserListings` | Session; self query | Returns own listings | `src/server/user.ts` |
| `getFeaturedListings` | Public | Published-only, latest 12 | `src/server/listing.ts` |
| `getListingBySlug` | Public | **No published-status filter** | `src/server/listing.ts` |
| `getSearchListings` | Public | Published-only search | `src/server/listing.ts` |
| `getListingCategories` | Public | All categories | `src/server/listing.ts` |
| `createListing`, `updateListing`, `deleteListing` | **None** | Direct Prisma mutations without ownership policy | `src/server/listing.ts` |
| `createOrder`, `getUserOrders` | Session; self | Booking-style order | `src/server/order.ts` |
| `updateOrderStatus` | **None** | Arbitrary status string | `src/server/order.ts` |
| `getListingReviews`, `getListingRatingSummary` | Public | Listing review reads | `src/server/review.ts` |
| `createReview` | Session; self author | Purchase eligibility not checked | `src/server/review.ts` |
| `toggleBookmark`, `getUserBookmarks`, `isBookmarked` | Session; self | Bookmark persistence | `src/server/bookmark.ts` |

## Phase 2 handoff defects

1. P2-09 must replace the dynamic route regex with explicit segment-safe matching and add a table-driven test using the cases above.
2. P2-08 must add server-side policy checks to unguarded actions; page middleware is not an authorization boundary for server actions.
3. P2-09 must test locale-prefixed auth-page redirect behavior.
4. P3-09 must enforce published visibility in listing/product detail queries.
5. P2-01/P2-04 should eliminate duplicated route-handler/server-action business logic and standardize errors.
