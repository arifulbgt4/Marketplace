# P1-03 Feature Gap Matrix

## Status: Complete

## Core Module Status

| Module | Status | Existing Capability | Missing/Incomplete |
|--------|--------|---------------------|-------------------|
| **Authentication** | Partial | Registration, credentials login, JWT session | Verification, reset, account status, role-aware session |
| **Authorization** | Missing | Logged-in route protection | RBAC, ownership policy, admin policy |
| **User Profile** | Partial | Basic user model + account | Real profile wiring, address book, preferences |
| **Product/Catalog** | Wrong Domain | Property-oriented `Listing` | Product, SKU, variant, attributes, tax class |
| **Category** | Partial | Hierarchical model + read query | CRUD, ordering, visibility, safe archive |
| **Inventory** | Missing | None | Balance, reservation, adjustment, threshold |
| **Search** | Partial | Text, price, category, bedroom filters | UI wiring, facets, sort, URL state |
| **Wishlist** | Partial | Bookmark persistence | Product card only toggles local state |
| **Cart** | Missing | None | Guest/auth cart, quantities, merge, repricing |
| **Checkout** | Missing | Booking form shell | Address, delivery, coupon, payment, finalization |
| **COD** | Missing | None | Settings, eligibility, pending collection, collection action |
| **Online Payment** | Missing | None | Provider adapter, intent, webhook, refund |
| **Orders** | Legacy/Partial | Single-listing booking order | Multi-item snapshots, payment and fulfillment state |
| **Shipping** | Missing | Listing location only | Zones, methods, rates, shipment, tracking |
| **Coupons** | Missing | Listing discount field only | Coupon lifecycle, scope, limits, evaluator |
| **Reviews** | Partial | Listing review persistence | Verified purchase, moderation, correct aggregates |
| **Notifications** | Missing | `nodemailer` installed | Templates, outbox, preferences, in-app notice |
| **Business Settings** | Minimal | Marketplace name/domain env | Currency, tax, contact, operational rules |
| **Branding** | Minimal | Theme + env name | Logo, theme tokens, SEO, social links settings |
| **Homepage Content** | Hardcoded | Existing visual sections | Configurable order, visibility, localized content |
| **Analytics** | Mock | Dashboard/chart components | Real aggregate queries + exports |
| **Admin Panel** | Missing | Seeded `admin` role | Admin routes, UI, policies, audit trail |
| **Messaging** | Partial | Message model + basic UI | Real-time, read receipts, file sharing |

## Feature Status Legend

| Status | Definition |
|--------|------------|
| **Complete** | Feature fully implemented and tested |
| **Partial** | Core functionality exists but incomplete |
| **Mock** | UI exists but data is hardcoded/mock |
| **Missing** | No implementation |
| **Wrong Domain** | Exists but for different business model |

## Detailed Gap Analysis

### Authentication Gaps

| Gap | Risk | Priority |
|-----|------|----------|
| No email verification | Account enumeration | High |
| No password reset | Account lockout | High |
| No account status check | Disabled users can login | High |
| No role in session | Cannot enforce RBAC | High |
| JWT cannot be revoked | Security risk | Medium |

### Authorization Gaps

| Gap | Risk | Priority |
|-----|------|----------|
| No RBAC system | Any user can access any resource | Critical |
| No ownership policies | Users can modify others' data | Critical |
| No admin UI protection | Admin functions exposed | High |
| No mutation authorization | Server actions callable without auth | Critical |

### Data Model Gaps

| Gap | Risk | Priority |
|-----|------|----------|
| Money stored as Float | Rounding/accounting errors | Critical |
| Roles as free-form String | Invalid roles can be persisted | High |
| Status as free-form String | Invalid states possible | High |
| No Product/Variant model | Cannot support retail | Critical |
| No Inventory model | Cannot track stock | Critical |
| No Cart model | Cannot support checkout | Critical |
| No Payment model | Cannot process payments | Critical |
| No Order snapshots | Order history can change | High |

### UI/UX Gaps

| Gap | Risk | Priority |
|-----|------|----------|
| Empty form handlers | Forms don't submit | High |
| Mock dashboard data | Users see fake metrics | Medium |
| No error states | Poor error handling | Medium |
| No loading states | Poor UX feedback | Medium |
| No empty states | Poor empty list handling | Medium |

### Infrastructure Gaps

| Gap | Risk | Priority |
|-----|------|----------|
| No Prisma migrations | Schema drift risk | High |
| In-memory rate limiter | Won't work in production | High |
| No audit logging | No change tracking | Medium |
| No API versioning | Breaking changes risk | Low |
| No request ID tracking | Debugging difficulty | Medium |

## Migration Requirements

1. **Listing → Product**: Property fields need generalization
2. **Order → Multi-item Order**: Single listing order needs expansion
3. **Float → Decimal**: Money fields need conversion
4. **String → Enum**: Roles and statuses need constraints
5. **Add Missing Models**: Cart, Payment, Inventory, Shipment, Coupon
