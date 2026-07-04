# P1-03 Feature Gap Matrix

## Status: Rework required

## Verification baseline

- Source baseline: `dev` at `b5fe836`
- Verified: 2026-07-05
- Evidence sources: Prisma schema, App Router files, API handlers, server functions, forms/widgets and package scripts

## Status taxonomy

| Status | Meaning |
|---|---|
| Complete | Current scope works end-to-end, is authorized and has relevant tests |
| Partial | Persisted or functional foundation exists, but the workflow is incomplete |
| Wrong domain | Implementation exists for rental/property semantics, not target retail commerce |
| Minimal | Only basic configuration or infrastructure exists |
| Mock | Screen exists but behavior/data is hardcoded or no-op |
| Hardcoded | Content exists only in source and is not configurable |
| Missing | No meaningful implementation exists |

## Source-traceable capability matrix

| Capability | Status | Verified current behavior | Evidence |
|---|---|---|---|
| Authentication | Partial | Credentials registration/login and JWT session; no verification, recovery, account status or role claim | `src/lib/auth.ts`, `src/app/api/register/route.ts` |
| Authorization | Partial | Middleware/session checks exist for some routes/functions; reusable RBAC/ownership policy is absent and several mutations are unguarded | `src/middleware.ts`, `src/server/*.ts` |
| Customer profile | Partial | User/Account models and account UI exist; update boundary is unsafe and settings are mostly shells | `prisma/schema.prisma`, `src/server/user.ts`, `src/forms/UserSettingForm` |
| Product/catalog | Wrong domain | `Listing` uses property fields and rental/sale type | `prisma/schema.prisma` model `Listing` |
| Category | Partial | Hierarchy and read query exist; lifecycle, ordering, visibility and admin CRUD are absent | `prisma/schema.prisma` model `Category`, `src/server/listing.ts` |
| Inventory | Missing | No stock, reservation or adjustment model/service | `prisma/schema.prisma` |
| Search/filter | Partial | Published listing query supports text/category/price/bedroom; UI controls and URL contract are incomplete | `src/server/listing.ts`, `src/forms/ListSearchFiltersForm` |
| Wishlist | Partial | Bookmark model/actions persist; target Product relationship does not exist | `prisma/schema.prisma` model `Bookmark`, `src/server/bookmark.ts` |
| Cart | Missing | No cart identity, model, service or UI | Schema/source search |
| Checkout | Missing | Booking form is not a commerce checkout and its submit handler is no-op | `src/forms/BookingForm/index.tsx` |
| COD | Missing | No eligibility, configuration, payment record or collection workflow | Schema/source search |
| Online payment | Missing | No provider contract, intent, webhook, reconciliation or refund | Schema/source search |
| Order | Wrong domain | Single-listing date/guest booking with `Float` total and free-form status | `prisma/schema.prisma` model `Order`, `src/server/order.ts` |
| Delivery/shipping | Missing | Listing coordinates exist; no zone, method, rate, shipment or tracking | `prisma/schema.prisma` |
| Coupon | Missing | Listing discount is not a coupon lifecycle | `prisma/schema.prisma` field `Listing.discount` |
| Review | Partial | Persisted rating/review exists; purchase eligibility and moderation are absent | `src/app/api/reviews/route.ts`, `src/server/review.ts` |
| Notification | Missing | `nodemailer` dependency exists but no notification workflow | `package.json`, source search |
| Business settings | Minimal | Name/domain/default locale are source/env configuration | `src/global/config/index.ts` |
| Branding/theme | Partial | Custom light/dark MUI palettes, typography and breakpoints exist; no admin configuration | `src/theme/**` |
| Homepage content | Hardcoded | Sections and copy are JSX/static-data driven | `src/widgets/SearchBanner`, `src/widgets/FeaturedListings` |
| Analytics | Mock | Dashboard UI uses hardcoded values | `src/app/[locale]/(WrappedPages)/u/dashboard/page.tsx` |
| Admin | Missing | Seed can create an admin string role; no admin route/policy/audit surface | `prisma/seed.ts`, absence of admin route group |
| Messaging/support | Mock | Message table and mock UI exist, but no persisted messaging action/API; ADR selects support flow replacement | `prisma/schema.prisma` model `Message`, `src/widgets/MyMessage`, `ARCHITECTURE.md` ADR-001 |
| Error handling | Partial | Root/locale error and not-found boundaries exist; API/action result contracts are inconsistent | `src/app/[locale]/error.tsx`, `src/components/ErrorBoundary`, API handlers |
| Localization | Partial | Eight message files and locale routing exist; visual baseline shows English body copy in Arabic locale | `messages/*.json`, `i18n.ts`, `docs/visual-baseline/` |

## Critical/high gaps

| Gap | Risk | Priority | Evidence/handoff |
|---|---|---|---|
| Unguarded mutations and route regex leak | Unauthorized changes/access | Critical | P1-02; P2-08/P2-09 |
| Money uses `Float` | Rounding/accounting error | Critical | `Listing.price`, `Order.totalPrice`; P2-05 |
| Free-form role/status | Invalid authorization/state | High | `User.role`, listing/order status; P2-06 |
| No immutable commerce order snapshot | Historical data mutation/loss | Critical | Current Order→Listing relation; P4-14 |
| Cascade deletion reaches booking history | Financial/history loss | Critical | Prisma `onDelete: Cascade`; P1-08/P3/P4 |
| No migration history | Schema drift and unsafe deployment | High | `prisma/migrations/` absent; P2-02/P9-16 |
| In-memory rate limiter | Per-instance bypass in distributed runtime | High | `src/lib/rate-limit.ts`; P2 foundation/security work |
| Direct imports undeclared | Non-reproducible install | High | `zod`, `react-hook-form`, `uuid` imports absent from direct dependencies; P2-01 |
| Twelve no-op submit handlers | False-complete customer workflows | High | `rg` verification across `src/forms`; corresponding feature tasks |
| No request/error contract or request ID | Poor support/debugging | Medium | API handler inspection; P2-04 |
| Sample auth secret in env template | Unsafe copy-forward configuration | High | `.env.example`; P2-02 |
| Database errors collapse to empty results | Outage appears as legitimate no-data state | High | Browser/server-log capture on 2026-07-05; P2-02/P2-04 |

## Core migration requirements

1. Rental `Listing`/booking history must not be silently reinterpreted as retail Product/Order; disposition rules are in P1-08.
2. New retail Product, Variant, Inventory, Cart, Checkout, Payment, OrderItem, Shipment and settings boundaries are required.
3. Money must move to `Decimal` or minor units with ISO currency.
4. Role, account, order, payment and fulfillment states must be constrained.
5. Historical records must survive user/catalog archival and remain auditable.

## Verification note

This matrix describes the current implementation. A planned task appearing in `TASK_PLAN.md` is not evidence that the capability exists.
