# P1-06 Permission Matrix

## Status: Rework required

## Role Definitions

| Role | Description | Default |
|------|-------------|---------|
| **CUSTOMER** | End user who browses and purchases | Target default; current persisted value is lowercase `user` |
| **ADMIN** | Full system access | No (seeded) |
| **CATALOG_MANAGER** | Product and category management | No |
| **SUPPORT** | Customer support and order assistance | No |

## Mutation-Level Permission Matrix

Each mutation below specifies:
- **Actor**: which roles can perform this action
- **Resource scope**: which instances the actor can access (own, any, assigned)
- **Ownership rule**: how identity is verified
- **Field/PII constraint**: which fields are restricted
- **Denial response**: HTTP status/code on denial
- **Audit required**: whether the action is logged

### Current mutations (Phase 1 baseline)

| Mutation | Source | Actor | Resource scope | Ownership rule | Field/PII constraint | Denial response | Audit required |
|----------|--------|-------|----------------|----------------|----------------------|-----------------|----------------|
| `register` (POST `/api/register`) | `src/app/api/register/route.ts` | Any unauthenticated | N/A | N/A | Password strength enforced | 429 (rate limit) | No |
| POST `/api/listings` | `src/app/api/listings/route.ts` | Any authenticated account | New own listing | `userId` comes from session | Listing schema; caller may still choose draft/published status | 401 | Target: catalog change audit |
| POST `/api/orders` | `src/app/api/orders/route.ts` | Any authenticated account | New own booking | `userId` comes from session | Server calculates total; listing visibility/date overlap incomplete | 401 | Target: order audit |
| POST `/api/reviews` | `src/app/api/reviews/route.ts` | Any authenticated account | Own authored review | `userId` comes from session | One review/listing; purchase eligibility absent | 401/409 | No |
| `getUser()` | `src/server/user.ts` | Any authenticated account | Own only | Query uses `session.user.id` | Returns full user record including current contact fields | 401/no result | No |
| `updateUser()` | `src/server/user.ts` | **Any caller (missing auth)** | Caller-selected user | None | Name/email/phone/image caller-writable; target requires self/admin and email verification | Currently none; target 401/403 | Target: profile/email audit |
| `getUserListings()` | `src/server/user.ts` | Any authenticated account | Own only | Query uses `session.user.id` | None | Empty result when unauthenticated | No |
| `getFeaturedListings()` | `src/server/listing.ts` | Any (unauthenticated) | Public published only | N/A | Draft/archived excluded | N/A | No |
| `getListingBySlug()` | `src/server/listing.ts` | Any | Any matching slug | N/A | **No published-status filter**; target hides draft/archived | Current 404 only when missing | No |
| `getSearchListings()` | `src/server/listing.ts` | Any | Public published only | N/A | Draft/archived excluded | N/A | No |
| `getListingCategories()` | `src/server/listing.ts` | Any | All | N/A | None | N/A | No |
| `createListing()` | `src/server/listing.ts` | **None (missing)** | Any authenticated | Should require CUSTOMER or ADMIN | No ownership filter | Currently none; should be 401/403 | No |
| `updateListing()` | `src/server/listing.ts` | **None (missing)** | Any | Should verify owner or ADMIN | No field restrictions | Currently none; should be 403 | No |
| `deleteListing()` | `src/server/listing.ts` | **None (missing)** | Any | Should verify owner or ADMIN | Cascade prevention | Currently none; should be 403 | Yes |
| `createOrder()` | `src/server/order.ts` | Any authenticated account | Own only | User ID comes from session | Status not caller-set, but listing visibility/date invariants are incomplete | Throws unauthorized | Target: order audit |
| `getUserOrders()` | `src/server/order.ts` | Any authenticated account | Own only | Query uses session user ID; no current admin bypass | None | Empty result when unauthenticated | No |
| `updateOrderStatus()` | `src/server/order.ts` | **Any caller (missing auth)** | Any order ID | None; target requires ADMIN/SUPPORT policy | Arbitrary string accepted | Currently none; target 401/403 | Target: Yes |
| `getListingReviews()` | `src/server/review.ts` | Any | Public | N/A | None | N/A | No |
| `getListingRatingSummary()` | `src/server/review.ts` | Any | Public | N/A | None | N/A | No |
| `createReview()` | `src/server/review.ts` | CUSTOMER | Own only | `session.user.id === userId` | Should require verified purchase | 401 | No |
| `toggleBookmark()` | `src/server/bookmark.ts` | CUSTOMER | Own only | `session.user.id === userId` | None | 401 | No |
| `getUserBookmarks()` | `src/server/bookmark.ts` | CUSTOMER | Own only | `session.user.id === userId` | None | 401 | No |
| `isBookmarked()` | `src/server/bookmark.ts` | CUSTOMER | Own only | `session.user.id === userId` | None | 401 | No |

### Planned mutations (Phase 2–9)

| Mutation | Planned phase | Actor | Resource scope | Ownership rule | Field/PII constraint | Denial response | Audit required |
|----------|--------------|-------|----------------|----------------|----------------------|-----------------|----------------|
| Create product | P3-06 | ADMIN, CATALOG_MANAGER | N/A | N/A | Cannot set `published` directly | 403 | Yes |
| Update product | P3-07 | ADMIN, CATALOG_MANAGER | Any | N/A | Price/status change logged | 403 | Yes |
| Archive product | P3-07 | ADMIN, CATALOG_MANAGER | Any | N/A | Cannot delete (archive only) | 403 | Yes |
| Publish product | P3-08 | ADMIN, CATALOG_MANAGER | Any | N/A | Validator checks completeness | 403 | Yes |
| Manage variants | P3-06 | ADMIN, CATALOG_MANAGER | Any | N/A | SKU uniqueness enforced | 403 | Yes |
| Adjust inventory | P3-15 | ADMIN, CATALOG_MANAGER | Any | N/A | Reason required; negative blocked | 403 | Yes |
| Add to cart | P4-03 | CUSTOMER, guest | Own cart | Cart token or session | Stock limits respected | 401 (auth), 403 (stock) | No |
| Remove from cart | P4-04 | CUSTOMER, guest | Own cart | Cart token or session | N/A | 401/403 | No |
| Merge guest cart | P4-05 | CUSTOMER | Own cart | Login event | Duplicate merged; stock respected | 401 | No |
| Place order (COD) | P5-07 | CUSTOMER | Own checkout | `session.user.id === checkout.userId` | COD eligibility rechecked server-side | 403 (eligibility) | Yes |
| Initiate online payment | P5-08 | CUSTOMER | Own order | `session.user.id === order.userId` | Server amount authoritative | 403 | Yes |
| Process webhook | P5-09 | Provider (signed) | N/A | Signature verification | Idempotency enforced | 401 (signature) | Yes |
| Record COD collection | P5-11 | ADMIN, SUPPORT | Assigned order | Role + assignment | Amount validated; duplicate blocked | 403 | Yes |
| Process refund | P5-12 | ADMIN | Any | N/A | Original transaction preserved | 403 | Yes |
| Cancel order | P6-08 | CUSTOMER (own), ADMIN (any), SUPPORT | Own or any | CUSTOMER: ownership only; ADMIN/SUPPORT: any | Policy window checked | 403 (window) | Yes |
| Process return | P6-09 | ADMIN, SUPPORT | Any | N/A | Stock/payment coordinated | 403 | Yes |
| Update branding | P7-05 | ADMIN | N/A | N/A | Logo type/size validated | 403 | Yes |
| Manage delivery zones | P7-07 | ADMIN | N/A | N/A | Overlap warning | 403 | Yes |
| Manage coupons | P7-09 | ADMIN, CATALOG_MANAGER | N/A | N/A | Invalid values rejected | 403 | Yes |
| Moderate reviews | P7-12 | ADMIN | Any | N/A | History retained | 403 | Yes |
| Manage homepage content | P7-11 | ADMIN | N/A | N/A | Draft/published workflow | 403 | Yes |
| Write review | P8-03 | CUSTOMER | Own purchase only | Verified purchase check | One review per product | 403 (no purchase) | No |
| Toggle wishlist | P8-01 | CUSTOMER | Own only | Session match | Optimistic failure rollback | 401 | No |
| Update own profile/preferences | P2-12 | CUSTOMER | Own profile | Session ID, never caller-selected foreign ID | Role/password excluded; email change separate | 401/403 | Sensitive-field changes |
| Manage own addresses | P2-13 | CUSTOMER | Own addresses | Address owner must equal session user | One default/type; validated shipping fields | 401/403 | No |
| Start/consume recovery token | P2-14 | Account owner/token holder | Own account | Expiring one-use token | No account enumeration; invalidate sessions | 400/401 | Yes |
| Upload/delete media | P2-15 | CUSTOMER (own), ADMIN/CATALOG_MANAGER (catalog) | Owned/authorized target | Target ownership/policy | File type/size; stable delete policy | 401/403/413 | Admin/catalog changes |
| Manage categories | P3-05 | ADMIN, CATALOG_MANAGER | Any catalog category | Role policy | Cycle, slug and unsafe-delete rules | 403/409 | Yes |
| Update cart quantity | P4-04 | CUSTOMER, guest token | Own cart | Session or signed cart identity | Quantity/stock bounds | 401/403/409 | No |
| Apply coupon/checkout quote | P4-12/P4-13 | CUSTOMER | Own checkout | Checkout owner/session | Server rules/totals authoritative | 401/403/409 | No |
| Finalize checkout | P4-15 | CUSTOMER | Own checkout | Owner + idempotency key | Revalidate price/stock/coupon/address | 401/403/409 | Yes |
| Create/update delivery rule | P7-07 | ADMIN | Any delivery zone/method | Role policy | Priority/overlap/rate validation | 403/409 | Yes |
| Update COD rules | P7-08 | ADMIN | Global/scoped rules | Role policy | No secret fraud signals in response | 403 | Yes |
| Create/update shipment | P6-05/P6-06 | ADMIN, SUPPORT by policy | Assigned/any order | Role + assignment/state policy | Legal transition/tracking validation | 403/409 | Yes |
| Update customer status | P7-03 | ADMIN | Any customer except protected self constraints | Role policy | Cannot expose password/provider secrets | 403/409 | Yes |
| Change customer role | P7-03 | ADMIN | Any eligible account | Role policy; prevent last-admin removal | Role allow-list | 403/409 | Yes |
| Update business settings | P7-04 | ADMIN | Singleton business config | Role policy | Valid locale/currency/legal fields | 403 | Yes |
| Update payment method config | P7-06 | ADMIN | Provider/public config | Role policy | Secret values write-only/environment-managed | 403 | Yes |
| Read/mark notification | P8-05 | CUSTOMER | Own notifications | Notification owner/session | No cross-user ID access | 401/403 | No |

## Authorization rules

### Rule 1: Deny by default
All operations are denied unless explicitly allowed by role and ownership.

### Rule 2: Own-resource boundary
Customers can access only their own:
- Profile, addresses, orders, reviews, bookmarks, wishlist, cart, checkout sessions

### Rule 3: Ownership verification chain
Before any customer-owned mutation:
1. User is authenticated (session exists, not expired)
2. User has required role (CUSTOMER for customer operations)
3. Resource ownership matches (`resource.userId === session.user.id`)
4. Account is active (not disabled)

### Rule 4: Admin bypass with audit
ADMIN role bypasses ownership checks for all operations except:
- Password change (must verify old password)
- Direct email change without verification
All ADMIN mutations on customer resources are logged to audit trail.

### Rule 5: Mutation logging requirements

| Audit level | Operations | Retention |
|-------------|------------|-----------|
| Full (actor, action, target, old/new value, timestamp) | All financial mutations, role changes, status transitions, refunds, collections | 3 years |
| Metadata (actor, action, target, timestamp) | Product CRUD, category changes, content edits, coupon management | 1 year |
| None | Read queries, public operations, own-profile reads | N/A |

### Rule 6: Field-level restrictions

| Sensitive field | Restriction |
|----------------|-------------|
| `User.password` | Never returned; write-only with hashing |
| `User.email` | Returned to owner only; change requires verification |
| `User.role` | Readable by ADMIN only; changeable by ADMIN only |
| Provider credential/secret | Environment or secret manager only; never returned via API |
| `Payment.providerData` | Returned to ADMIN only; masked for SUPPORT |
| `Order.totalPrice` | Readable by owner and ADMIN; not client-writable |

## Current gaps (source-verified)

| Gap | Risk | Source evidence | Mitigation phase |
|-----|------|-----------------|------------------|
| No auth on `createListing`, `updateListing`, `deleteListing` | Unauthenticated users can create/edit/delete listings | `src/server/listing.ts:40-70` | P2-08 |
| No auth on `updateOrderStatus` | Any server-action caller can change any order's status | `src/server/order.ts` | P2-08 |
| `updateUser()` lacks auth/ownership check | Any server-action caller can update a caller-selected user | `src/server/user.ts` | P2-08 |
| No role in session | Middleware and server actions cannot check role | `src/lib/auth.ts:50-70` | P2-07 |
| No admin routes | Admin functions not exposed but also not protected | No `src/app/admin/` directory | P7-01 |
| No audit trail | Admin mutations leave no trace | No `AuditLog` model | P2-10 |
| No account status | Disabled users retain full access | `User` model lacks `status` field | P2-07 |
