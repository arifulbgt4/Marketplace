# P1-03 Feature Coverage and Residual Gap Matrix

## Status

**Current implementation coverage refreshed 2026-07-25; Phase 9 verification
in progress.**

`P1-03` originally captured the 2026-07-05 property/rental starter gap. That
snapshot remains valid historical Phase 1 evidence, but this matrix now records
the implemented reusable B2C system. It does not certify production deployment
or close the pending Phase 9 browser/release gate.

## Current evidence baseline

| Evidence            | Current snapshot                                                   |
| ------------------- | ------------------------------------------------------------------ |
| API inventory       | 82 route files, 117 unique HTTP method/path contracts              |
| Data model          | 43 Prisma models, 23 enums                                         |
| Migration history   | 8 ordered migration directories                                    |
| Architecture        | Single-business reusable modular monolith                          |
| Payment             | First-class COD plus adapter contract; only `MOCK` online provider |
| Legacy HTTP         | Listing/review/order-create contracts explicitly return `410`      |
| Strict visual scope | Homepage composition, especially Hero and Search                   |

Canonical evidence:

- [Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md)
- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Feature Guide](./FEATURE_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)

## Status taxonomy

| Status                               | Meaning                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Implemented                          | Source, persistence/API boundary and relevant automated contract exist    |
| Implemented — operational dependency | Application boundary exists; live provider/platform configuration remains |
| Bounded limitation                   | Safe baseline exists with an explicit scale/security/provider limit       |
| Retired legacy                       | Historical storage may remain, but supported HTTP workflow returns `410`  |
| Verification in progress             | Implementation exists; Phase 9 browser/release evidence is not final      |

## Source-traceable capability matrix

| Capability                         | Current status                            | Verified implementation                                                                                                 | Primary evidence                                                     |
| ---------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Authentication                     | Implemented                               | Registration, credential login, verification, recovery, password change, active status and session-version invalidation | `src/lib/auth.ts`, account API routes, `src/lib/services/account.ts` |
| Authorization                      | Implemented                               | Server-side RBAC/ownership for `user`, `admin`, `support`, `catalog_manager`; deny-oriented route policy                | `src/lib/authz.ts`, `src/lib/route-access.ts`, API/services          |
| Customer profile/address           | Implemented                               | Owner-scoped profile and address CRUD, default-address constraint                                                       | `src/lib/services/user.ts`, `address.ts`, address/profile APIs       |
| Product/catalog                    | Implemented                               | Product, variant, SKU, options, media metadata, publish/archive and public DTOs                                         | `Product*` models, product/catalog services and APIs                 |
| Category                           | Implemented with cap                      | Hierarchy, cycle prevention, lifecycle and staff CRUD; maximum validation/list boundary is 1,000                        | `src/lib/services/category.ts`                                       |
| Inventory                          | Implemented                               | Atomic balance changes, reservation/commit/release/adjust and append-oriented ledger                                    | Inventory models/service/admin APIs                                  |
| Search/filter/sort                 | Implemented                               | Text/category/price/availability/sort/pagination and bounded suggestions                                                | `src/lib/services/catalog.ts`, `/api/catalog*`                       |
| Wishlist                           | Implemented                               | User/product persistent state and customer API                                                                          | `ProductWishlistItem`, wishlist service/API                          |
| Cart                               | Implemented                               | Signed guest cart, authenticated cart, quantities, merge, expiry/version and repricing                                  | Cart models/service/APIs                                             |
| Checkout                           | Implemented; Phase 9 browser gate pending | Address, delivery, coupon, snapshot, server totals, expiry and idempotent placement                                     | Checkout service/APIs and tests                                      |
| Cash on Delivery                   | Implemented                               | Settings, deterministic eligibility, `PENDING_COLLECTION`, idempotent staff collection                                  | COD settings/eligibility/collection services and APIs                |
| Online payment                     | Implemented contract; provider limitation | Intent, signed webhook, lifecycle reconciliation and refund exist                                                       | Payment adapter/lifecycle/reconciliation/refund; `MOCK` only         |
| Order                              | Implemented                               | Multi-item snapshots, separate status/version/history, customer/admin query and cancellation                            | Order models/services/APIs                                           |
| Delivery/shipping                  | Implemented                               | Zones, methods, quotes, weight/value rules, shipment allocation, tracking and states                                    | Delivery/Shipment models and services                                |
| Return/refund                      | Implemented                               | Return request/review/receive/complete, inventory restock and cumulative refund protection                              | Return/refund services and admin/customer APIs                       |
| Coupon                             | Implemented with cap                      | Scope, schedule, amount, global/user usage limits and checkout revalidation; list capped at 500                         | Coupon models/service/APIs                                           |
| Review                             | Implemented                               | Delivered-purchase eligibility, ownership, moderation and public approved aggregates                                    | Product review service/APIs                                          |
| Notification                       | Implemented — operational dependency      | Transactional outbox, in-app projection, preferences and SMTP templates                                                 | Outbox/notification models, worker and publishers                    |
| Business/branding/payment settings | Implemented                               | Validated namespaced settings, public allow-list and admin audit                                                        | Business settings service/APIs                                       |
| Homepage content                   | Implemented with protected boundary       | Revisioned lower-page sections; protected Hero/Search keys rejected                                                     | ContentSection model/service/admin/home API                          |
| Analytics/reporting                | Implemented with cap                      | Real KPIs, audit pagination and JSON/CSV reports; exports truncate at 5,000                                             | Dashboard/reporting services/APIs                                    |
| Admin                              | Implemented                               | Catalog, inventory, orders, customers, settings, content, delivery, coupons, reviews, support and audit                 | Admin route group and services                                       |
| Support                            | Implemented                               | Rate-limited intake, opaque reference, staff-only PII, assignment/status/version flow                                   | `SupportRequest`, support APIs/service                               |
| Localization/SEO/a11y              | Implemented; Phase 9 gate pending         | Localized route/content foundations, metadata/sitemap, automated accessibility/RTL checks                               | locale messages, layout/sitemap, Playwright suites                   |
| Documentation                      | Implemented; final audit active           | Architecture, schema, API, feature, admin, customization, deployment, testing, operations and release guides            | `docs/` current guide set                                            |
| Media storage                      | Bounded limitation                        | Validated adapter and safe local storage exist; durable object storage/CDN provider does not                            | `src/lib/services/media.ts`                                          |
| Rate limiting                      | Bounded limitation                        | Per-process bounded store and endpoint limits exist                                                                     | `src/lib/rate-limit.ts`; shared edge/store absent                    |
| CSP/security headers               | Bounded limitation                        | CSP, HSTS, frame/content/referrer policies exist; CSP still uses `unsafe-inline` without nonce                          | `next.config.js`                                                     |
| Legacy listing/review/order-create | Retired legacy                            | Explicit `410`, no-store, deprecation and successor links                                                               | `/api/listings`, `/api/reviews`, `POST /api/orders`                  |

## Residual gap register

| Gap                                       | Current risk                                                                                  | Required closure/evidence                                                                | Release effect                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| No real online payment adapter            | `MOCK` cannot move money or certify provider behavior                                         | Implement selected adapter; provider sandbox/webhook/refund/reconciliation certification | Online payment must remain disabled                             |
| Local media is not durable cloud storage  | Ephemeral/server-local files can be lost or unavailable across instances                      | Object-storage adapter, signed upload/delete policy, CDN and lifecycle tests             | Production media upload must use approved external solution     |
| In-memory rate limiting                   | Limits do not coordinate across instances                                                     | Shared store or edge/WAF enforcement and abuse metrics                                   | High-traffic/multi-instance launch needs external control       |
| Unverified proxy trust                    | Client can supply forwarded headers unless platform strips/normalizes them                    | Trusted-proxy/edge contract and tests for canonical client identity                      | Public abuse controls are not independently sufficient          |
| CSP uses `unsafe-inline`                  | XSS mitigation is weaker than nonce/hash policy                                               | Per-request nonce/hash-compatible CSP and browser verification                           | Security hardening item; unresolved high finding blocks release |
| Admin fixed caps                          | Categories/content/coupons/inventory/delivery may omit records at scale without page feedback | Pagination/cursor contract and UI totals for capped collections                          | Small-template baseline works; larger businesses need hardening |
| SMTP provider not certified               | Verification/recovery/commerce mail may not arrive or bounce handling may be absent           | Sender-domain authentication, controlled delivery, bounce/alert evidence                 | Production account/notification readiness remains unverified    |
| No repository scheduler                   | Outbox events remain pending unless platform invokes worker                                   | Authenticated cron/scheduler, monitoring and retry alert evidence                        | Production notifications require external scheduler             |
| Production backup/retention not automated | Restore/RPO/privacy/financial retention uncertain                                             | Provider backup, PITR, RPO/RTO, restore rehearsal and retention jobs/policy              | Production data-readiness gate                                  |
| Financial cascade policy                  | Hard-deleting root records can remove financial history                                       | Operational no-delete rule, then approved anonymization/retention migration              | Hard deletion prohibited                                        |
| Final browser/release gate pending        | UI, a11y, visual or exact-worktree regressions may remain                                     | Full Node 22/static/DB/build/Playwright gates and signed checklist                       | Phase 9 stays `In Progress`                                     |

## Former Phase 1 gap disposition

| 2026-07-05 finding                                | Current disposition                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Property `Listing` was the core product domain    | Product/Variant catalog is authoritative; listing HTTP retired              |
| Cart, checkout, inventory, COD and payment absent | Implemented as separate commerce modules                                    |
| Booking-style single-listing order                | Multi-item order snapshots and separate lifecycle states implemented        |
| Money used `Float`                                | Commerce and legacy listing money migrated/guarded with `Decimal`           |
| Free-form role/status and unsafe session          | Prisma enums plus active-account/session-version/RBAC policy implemented    |
| Unguarded mutations/route leakage                 | API/service authorization and route policy implemented with security tests  |
| No migration history                              | Eight committed migrations; local fresh migration/restore rehearsal passed  |
| Review lacked purchase/moderation policy          | Delivered-purchase review and staff moderation implemented                  |
| No notification workflow                          | Transactional outbox, in-app and SMTP boundaries implemented                |
| Hardcoded business/admin surface                  | Validated settings, content, admin operations, KPI/report/audit implemented |
| Peer chat was ambiguous B2C behavior              | SupportRequest workflow replaces supported peer messaging                   |

The original source facts remain visible in historical Phase 1 audit artifacts;
this table records their current disposition rather than rewriting the old
evidence.

## Phase status

| Phase   | Status          | Gate note                                                                             |
| ------- | --------------- | ------------------------------------------------------------------------------------- |
| Phase 1 | Complete        | Historical analysis/governance approved                                               |
| Phase 2 | Complete        | Secure foundation implemented                                                         |
| Phase 3 | Complete        | Catalog/inventory implemented                                                         |
| Phase 4 | Complete        | Cart/checkout implemented                                                             |
| Phase 5 | Complete        | COD and adapter-ready payment baseline implemented; `MOCK` is not production provider |
| Phase 6 | Complete        | Order/fulfillment/return/refund/outbox implemented                                    |
| Phase 7 | Complete        | Admin/settings/content/reporting implemented                                          |
| Phase 8 | Complete        | Customer discovery/wishlist/review/notification/support experience implemented        |
| Phase 9 | **In Progress** | Browser, final exact-source and release gates are not closed                          |

`TASK_PLAN.md` remains the atomic implementation/governance ledger and is not
edited by this refresh. Any stale row-level status in that file requires a
separate evidence-based reconciliation; it must not override this current
source snapshot or be silently treated as verified.

## Verification note

Current route/model/enum counts were mechanically compared with
[API Documentation](./API_DOCUMENTATION.md) and
[Database Schema](./DATABASE_SCHEMA.md), with no missing/extra entries.
[Phase 9 Migration and Recovery Rehearsal](./evidence/phase-9/MIGRATION_REHEARSAL.md)
records a passing local fresh-migration/integration/restore dry run.

Final production readiness still requires
[Testing Guide](./TESTING_GUIDE.md) and
[Release Checklist](./RELEASE_CHECKLIST.md) gates. A planned or implemented
code path is not provider/deployment proof.
