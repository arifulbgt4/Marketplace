# Feature Guide

This guide describes the implemented single-business B2C behavior. It is not a
roadmap. Multi-vendor seller, commission and payout workflows are outside the
core.

## Customer identity

Customers can sign up with name, email and password, verify email, sign in,
request password recovery and manage account/profile data. Unverified,
suspended or inactive users do not receive an active application session.

Operational edge cases:

- Verification and recovery links are one-use and expiry-sensitive.
- SMTP must be fully configured in production.
- Development preview URLs are not a production delivery mechanism.
- A stale or invalid verification/recovery token must not reveal account
  existence or secret data.
- Session-protected cart, checkout, order, wishlist and notification resources
  are owner-scoped.

## Catalog, search and product detail

Published products, active categories, variants, media, inventory availability,
review summary and approved reviews are exposed to the storefront. Search,
filter, sort and suggestions use database-backed catalog queries.

Edge cases:

- Draft or archived products cannot be newly ordered.
- Out-of-stock variants cannot be reserved at checkout.
- Product price, name and SKU are snapshotted into order items so historical
  orders do not mutate when the catalog changes.
- Only approved reviews are public.

## Cart and wishlist

Guests receive a cookie-backed cart identity; authenticated users have an
owner-scoped cart. Cart merge support reconciles the guest cart after sign-in.
Quantity updates reprice from current variant data and surface availability
warnings.

Wishlist entries are account-scoped and idempotent from the customer
perspective.

Edge cases:

- Repeated add/remove requests must not create duplicate wishlist rows.
- Cart quantity may be reduced to remove an item.
- A cart changed after checkout starts invalidates the checkout snapshot; the
  customer must refresh checkout.
- A product becoming unavailable or insufficient stock blocks placement.

## Checkout

Checkout requires an authenticated customer, non-empty valid cart, owned
shipping address and active delivery method. The session snapshots cart version
and expires after 30 minutes. Coupon, address and delivery changes recalculate
subtotal, discount, shipping and total.

Placement uses an idempotency key. Retrying the same request returns the prior
result for the same customer rather than creating another order.

Before placement, the service revalidates:

- cart ownership and version;
- published product state;
- inventory availability;
- shipping-address ownership;
- delivery method and delivery-zone eligibility;
- coupon validity and usage constraints;
- enabled payment method;
- COD rules when COD is selected.

## Cash on Delivery

COD is independent from online payment.

1. Admin enables COD in payment settings and configures COD rules.
2. Checkout evaluates global enablement, min/max amount, allowed/blocked zones,
   blocked products/categories, maximum item quantity and optional phone
   requirement.
3. Eligible customers select COD.
4. Order placement creates the order without an online charge.
5. Payment state is `PENDING_COLLECTION`; order and fulfillment start in their
   own states.
6. Admin/support records collection after money is received.
7. Collection moves payment and order payment status to `COLLECTED`; it does
   not silently mark delivery complete.

Collection requires a positive amount, matching currency and an idempotency
key. A mismatch between expected and collected amount is recorded as an
anomaly in payment/audit metadata. Repeating the same valid idempotency key is a
safe no-op; reusing it for another operation is rejected.

COD edge cases:

- Disabled COD remains unavailable even if the rules engine would otherwise
  allow it.
- Missing or unmatched address/zone can make COD unavailable.
- Blocked product or category makes the whole cart ineligible.
- Amount thresholds are evaluated against the checkout total used by the
  current implementation.
- Concurrent collection attempts cannot collect the same pending payment twice.
- Cancellation moves an uncollected COD payment to a cancelled state.
- Refunds after collection follow payment refund workflow; they are not a
  second COD collection.

## Online payment

The application has a provider adapter boundary for intent creation,
verification, webhook handling and refunds. The implemented registry currently
contains only `MOCK` (and the internal COD registration).

`MOCK` is for development and automated tests. Do not accept real customer
payments through it.

The mock webhook:

- accepts at most 64 KiB;
- requires an HMAC signature in `x-mock-signature`;
- reconciles by provider reference and event idempotency key;
- ignores duplicate, terminal or out-of-order status regressions.

A production provider must be implemented, reviewed and exercised through the
same lifecycle tests before enabling online payment.

## Orders, fulfillment and returns

Order, payment and fulfillment status are separate:

| Dimension   | Implemented states                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| Order       | `pending`, `confirmed`, `cancelled`, `completed`                                                                        |
| Payment     | `UNPAID`, `PENDING`, `PENDING_COLLECTION`, `PAID`, `COLLECTED`, `FAILED`, `CANCELLED`, `PARTIALLY_REFUNDED`, `REFUNDED` |
| Fulfillment | `UNFULFILLED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `RETURNED`                                                         |

State transitions use version checks, append history, write audit records and
enqueue outbox events. A stale admin/customer view receives a conflict and must
refresh rather than overwriting a newer state.

Customers can:

- list and inspect their orders;
- view totals, address snapshot, shipment/tracking and timeline;
- cancel within the permitted pre-shipment window;
- request a return after delivery when no active return already exists;
- review delivered/returned order items.

Admin/support can transition allowed order/fulfillment states, create/update
shipments, process returns, collect COD and initiate valid refunds.

## Coupons and delivery

Coupons support fixed/percentage discounts, scope, active windows, minimum
order, usage limits and per-customer constraints. Validation and final
application both occur server-side.

Delivery zones match country and optional region/postal lists. Methods can
apply flat, threshold and weight/value-based rules configured by the current
delivery service.

Edge cases:

- Expired, inactive, exhausted or out-of-scope coupons are rejected.
- A delivery method unavailable for the selected address/cart cannot be used.
- Changing address or delivery method recalculates checkout.
- Free-shipping thresholds and COD zone rules are separate settings and must be
  tested together.

## Reviews

Customers create or edit one review per eligible order item. New or edited
reviews enter moderation. Admin/support can approve, reject, hide or flag
according to the review service contract. Only approved reviews contribute to
public lists and aggregate rating.

## Notifications and email

Transactional order/payment/fulfillment events are stored in the outbox within
the commerce transaction. The external outbox worker publishes in-app and SMTP
notifications.

Customers can mark one or all notifications read and configure optional
marketing channels. Transactional channels remain enabled by policy.

Email delivery failure does not roll back an already committed order. The
outbox retries it and records failure evidence.

## Support

Public contact/listing-report submissions create a reference, are rate-limited
and enqueue an event. Admin/support can filter, assign, prioritize, add internal
notes and transition:

```text
OPEN -> IN_PROGRESS | RESOLVED | CLOSED
IN_PROGRESS -> OPEN | WAITING_FOR_CUSTOMER | RESOLVED | CLOSED
WAITING_FOR_CUSTOMER -> IN_PROGRESS | RESOLVED | CLOSED
RESOLVED -> IN_PROGRESS | CLOSED
CLOSED -> OPEN
```

Updates use optimistic version checks so two agents cannot silently overwrite
each other.
