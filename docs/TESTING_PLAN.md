# Marketplace Testing Plan

## Purpose

Marketplace correctness শুধু UI render দিয়ে প্রমাণিত হয় না। Money, stock, payment, order state এবং authorization-এর জন্য layered automated testing এবং operational rehearsal প্রয়োজন।

## Current baseline

Planning analysis-এর সময়:

- Existing Vitest suites: 2 passed।
- Existing tests: 25 passed।
- TypeScript check: passed।
- ESLint: passed with deprecated `next lint` warning।
- Format check: `prettier` executable missing হওয়ায় failed।
- Prisma validation: required environment variable absent হওয়ায় failed।

এগুলো current baseline; future release quality gate নয়।

## Test layers

| Layer | Scope | Examples |
|---|---|---|
| Unit | Pure business rules | Pricing, coupon, COD eligibility, state machines |
| Component | UI behavior | Form errors, cart quantities, settings, loading states |
| Integration | Database এবং service boundaries | RBAC, inventory transaction, checkout, webhook |
| Contract | External adapters এবং API DTOs | Payment, storage, email, shipping adapters |
| E2E | Critical user/admin journeys | COD purchase, online payment, fulfillment, return |
| Visual | Homepage/Hero/Search preservation; intentional redesign evidence elsewhere | Desktop/mobile/RTL snapshots |
| Accessibility | Keyboard, focus, semantics, contrast | Storefront এবং admin scans |
| Security | Abuse এবং privilege boundaries | IDOR, webhook forgery, rate abuse |
| Performance | Query/bundle/page budgets | Catalog pagination, dashboard aggregates |
| Operational | Deployment/data safety | Migration, backup/restore, reconciliation |

## Unit test matrix

### Money and pricing

- Decimal/minor-unit conversion।
- Percentage এবং fixed discounts।
- Coupon scope এবং stacking policy।
- Tax inclusive/exclusive policy when supported।
- Shipping এবং free-shipping threshold।
- Zero, boundary এবং large values।
- Deterministic calculation order।

### COD eligibility

- Global enabled/disabled।
- Zone allow/deny।
- Product/category restrictions।
- Minimum/maximum amount।
- Quantity/customer requirement।
- Deny precedence এবং reason codes।
- Rule version snapshot।

### State machines

- Every allowed transition।
- Every denied transition।
- Terminal state behavior।
- Payment-independent order state।
- Fulfillment-independent payment state।

## Integration suites

### Authentication and authorization

- Registration/login/logout।
- Disabled account।
- Customer/admin route access।
- Cross-user profile/address/order/wishlist access।
- Catalog manager permissions।
- Audit creation for sensitive action।

### Catalog and inventory

- Draft product hidden publicly।
- Publish requirements।
- Unique SKU/slug।
- Atomic stock reserve/commit/release।
- Concurrent last-item checkout।
- Archived product and order history behavior।

### Cart and checkout

- Guest cart lifecycle।
- Login merge।
- Stale price/stock revalidation।
- Address ownership।
- Delivery zone quote।
- Coupon usage limits।
- Duplicate submit idempotency।

### Payment

- COD pending collection।
- Online intent creation failure।
- Valid/invalid webhook signature।
- Duplicate/out-of-order webhook।
- Reconciliation after delayed event।
- Full/partial refund।
- Duplicate COD collection।

### Orders and fulfillment

- Immutable item/address/totals snapshots।
- Admin state transitions।
- Customer history ownership।
- Shipment/tracking lifecycle।
- Cancellation stock/coupon release।
- COD এবং prepaid returns।

## Required E2E journeys

1. Guest browses product, adds cart, signs in, cart merges।
2. Customer checks out with COD and sees `PENDING_COLLECTION`।
3. Admin confirms, ships, delivers এবং records COD collection।
4. COD becomes unavailable after address/cart change।
5. Customer completes supported online payment।
6. Online payment failure/cancel leaves recoverable checkout state।
7. Admin creates product, adjusts stock এবং publishes।
8. Customer cancels eligible order; stock/coupon restore হয়।
9. Customer submits verified-purchase review।
10. Admin updates branding/content without protected homepage/Hero/Search regression।

## Visual regression

Visual testing দুই ধরনের:

- **Strict:** Homepage overall composition, Hero এবং Search section। Material visual difference product approval ছাড়া fail।
- **Reference:** Product, cart, checkout, account, auth এবং admin screens। এগুলো business-fit redesign করতে পারে; test legacy pixels নয়, intentional responsive/accessibility baseline রক্ষা করবে।

MUI-specific DOM/class snapshot visual acceptance-এর অংশ নয়; rendered behavior এবং visual outcome test হবে।

Baseline viewports অন্তত:

- Small mobile।
- Large mobile/tablet।
- Desktop।
- Wide desktop।
- RTL locale critical pages।

Critical screens:

- Homepage, Hero এবং Search — strict baseline।
- Product list/detail।
- Cart/checkout।
- Customer account/order detail।
- Admin dashboard/product/order/settings।
- Empty/loading/error/forbidden states।

## Accessibility gate

- Keyboard-only navigation।
- Visible focus।
- Form label এবং inline error association।
- Modal/drawer focus management।
- Table/grid accessible names।
- Color contrast after branding configuration।
- RTL layout smoke check।
- Automated critical/serious violations zero।

## Security test focus

- IDOR against address, cart, order, review এবং notification IDs।
- Admin action as customer।
- Product price/total/payment method tampering।
- Webhook forgery/replay।
- Registration/login/reset rate abuse।
- Uploaded file validation।
- Sensitive setting or secret response leakage।
- Unsafe redirect এবং locale route bypass।

## Performance and reliability

- Catalog queries paginated এবং indexed।
- Dashboard queries bounded by date and aggregation।
- No N+1 on product/order lists।
- Double checkout does not double-order।
- Outbox consumer retries safely।
- Payment reconciliation repairs delayed state।
- Cache invalidation after product/settings publish verified।

## Migration and recovery tests

- Fresh database migrate এবং seed।
- Existing listing/booking data backfill rehearsal।
- Interrupted backfill resume behavior।
- Backup before destructive migration।
- Restore verification।
- Application rollback compatibility explicitly documented।

## Release gate

```text
dependency install
lint
format check
type check
unit tests
integration tests
critical E2E tests
production build
Prisma validate and migration status
visual regression
accessibility scan
migration rehearsal
```

কোনো failed mandatory gate waiver করলে owner, reason, risk এবং expiry date release record-এ লিখতে হবে।
