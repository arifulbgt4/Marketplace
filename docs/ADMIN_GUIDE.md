# Admin and Operator Guide

The operational console lives under `/{locale}/admin`. Server-side route and
service authorization is the source of truth; seeing a navigation item does not
grant permission.

## Roles

| Role              | Primary implemented responsibility                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `admin`           | Full business administration, settings, reporting and audit                                                     |
| `catalog_manager` | Product, category, media and stock operations permitted by service policy                                       |
| `support`         | Customer/order support, shipments, returns, COD collection, review moderation and support queue where permitted |
| `user`            | Customer-owned storefront/account resources only                                                                |

Apply least privilege. Never convert a UI visibility rule into a replacement
for server authorization.

## Daily dashboard

Open `/admin` and review current order/customer/inventory summaries. Dashboard
metrics are operational signals, not accounting statements. Use Reports for the
implemented aggregated views and reconcile payment-provider/COD records before
financial decisions.

## Catalog workflow

### Categories

At `/admin/categories`:

1. Create generic business categories and optional parent hierarchy.
2. Set slug, display order and active status.
3. Confirm the tree is valid before assigning products.
4. Deactivate rather than deleting a category that is still referenced.

### Products

At `/admin/products`:

1. Create a draft with name, slug, description, brand and category.
2. Add variants with unique SKUs, prices and optional comparison price/weight.
3. Add media with meaningful alt text and primary ordering.
4. Set initial stock through inventory workflow.
5. Preview the customer product route.
6. Publish only after price, stock, media and category checks pass.
7. Archive products that should no longer be sold.

Publishing is an explicit action. Editing catalog content does not alter
snapshotted historical order items.

## Inventory

At `/admin/inventory`:

- search by product/SKU;
- inspect on-hand, reserved and available quantity;
- apply a reasoned adjustment;
- review the inventory ledger.

Never edit stock directly in the database. Reservation, commit, release and
manual adjustment are different ledger events. Investigate negative or
unexpected availability before accepting more orders.

## Orders and fulfillment

At `/admin/orders`:

1. Filter by order, payment or fulfillment status.
2. Open the order and verify customer, items, totals, address and payment
   method.
3. Confirm only when the order is valid and fulfillable.
4. Create shipment data and tracking when dispatch begins.
5. Move fulfillment through allowed transitions.
6. Complete the order only when business policy and delivery evidence support
   it.

Order updates are versioned. If another operator changed the record, refresh
and reassess; do not bypass a conflict.

Cancellation releases applicable resources and records history/audit/outbox
events. Returns must follow the return-request workflow. Refund only against an
eligible paid/collected payment and verify the resulting payment state.

## Cash on Delivery

At `/admin/cod`:

1. Configure enabled state, minimum/maximum amount, zone allow/block lists,
   product/category restrictions, maximum item quantity, phone requirement and
   collection instructions.
2. Use eligibility preview with realistic address/cart inputs.
3. Save rules only after previewing allowed and denied cases.

At the COD order:

1. Confirm payment method is COD and status is `PENDING_COLLECTION`.
2. Receive money using the business's delivery/collection procedure.
3. Enter collected amount, matching ISO currency, optional receipt/reference
   and notes.
4. Submit once. The server uses an idempotency key to prevent duplicate
   collection.
5. Investigate any amount anomaly recorded by the response/audit log.

COD collection changes payment status to `COLLECTED`; it does not replace order
confirmation or delivery transitions.

## Online payment

At `/admin/settings/payments`, disable online payment in production until a real
provider adapter is installed and verified. `MOCK` is development/testing only.

For a real adapter rollout, operations must have:

- provider credentials in the secret manager;
- signed webhook endpoint configured;
- replay/idempotency verification;
- amount/currency reconciliation;
- refund testing;
- monitoring and provider-dashboard reconciliation;
- a documented disable/rollback procedure.

## Delivery

At `/admin/delivery`:

1. Create zones using country and optional region/postal matching.
2. Add active delivery methods and rate rules.
3. Verify cart thresholds and weight/value behavior.
4. Test an address inside, outside and on each boundary.
5. Coordinate zone ids with COD allow/block rules.

Deactivate obsolete methods only after checking active checkout/order impact.

## Coupons

At `/admin/coupons`:

1. Choose fixed or percentage discount.
2. Set validity window, minimum order, maximum discount where relevant, total
   and per-customer usage limits.
3. Choose all-catalog, category or product scope.
4. Activate only after testing below/at/above boundaries.
5. Deactivate compromised or mistaken codes; do not rewrite historical order
   discounts.

## Homepage content

At `/admin/content`, create/edit sections, ordering, locale-aware payload,
visibility and publication state.

The homepage Hero/Search visual contract is protected. Content may change but
operators must not use content configuration or a development task to
materially change its placement, hierarchy, spacing or responsive identity
without explicit product approval.

Unsupported or invalid section payloads should be corrected instead of forcing
publication.

## Reviews

At `/admin/reviews`:

1. Filter pending/flagged content.
2. Inspect rating, comment, order-item eligibility and verified-purchase data.
3. Approve suitable reviews; reject/hide/flag according to policy.
4. Record moderation consistently.

Only approved reviews are public and included in aggregate rating. Editing a
published review returns it to moderation.

## Support queue

At `/admin/support`, admin/support users can:

- search and filter by status, priority, source and assignment;
- assign an active admin/support operator;
- add internal notes;
- update priority;
- move through allowed support states.

Refresh after a version conflict. Internal notes must never contain passwords,
payment credentials or unnecessary sensitive information.

## Customers

At `/admin/customers`, admin/support may inspect customer state where permitted.
Account-status changes are privileged; admin-only actions must remain
admin-only. Verify business reason and audit entry before suspending or
reactivating an account.

## Reports and audit

`/admin/reports` provides implemented operational aggregations.
`/admin/audit` provides actor/action/target/time evidence.

- Reports are not a general ledger or tax report.
- Audit records should be append-only operational evidence.
- Filter by date/action/actor when investigating.
- Never put secrets into action metadata.

## Business, branding and payment settings

Use:

- `/admin/settings/business`
- `/admin/settings/branding`
- `/admin/settings/payments`

Business settings include display/legal name, public support contacts, address,
currency, locale and timezone. Branding includes logo/favicon URLs, colors,
SEO fields and social links. Payment settings enable/label COD and online
payment and select the online provider identifier.

After changes, smoke-test storefront metadata, header/footer, checkout payment
availability, email sender identity and locale/currency display.

## Shift checklist

- Review failed/retried outbox events.
- Reconcile online provider and COD collection totals.
- Review stuck pending orders and stale shipments.
- Review low/negative availability.
- Moderate pending reviews.
- Triage urgent/unassigned support requests.
- Inspect unusual audit activity.
- Record incidents and handoff unresolved items.
