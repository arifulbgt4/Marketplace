# Project Roadmap

## Objective

বর্তমান property/rental marketplace starter-কে existing design না বদলে configurable, scalable এবং reusable B2C marketplace template-এ রূপান্তর করা।

## Required core capabilities

- Authentication এবং customer account।
- Role-based admin panel।
- Product, variant, category এবং media management।
- Inventory এবং stock reservation।
- Cart, wishlist এবং checkout।
- Cash on Delivery এবং online payments।
- Multi-item orders এবং separate payment/fulfillment states।
- Delivery zones, shipping rates এবং tracking।
- Coupons, reviews এবং notifications।
- Search, filters, sort এবং pagination।
- Business, branding এবং homepage settings।
- Analytics, reports এবং audit trail।
- Complete operational এবং customization documentation।

## Phase overview

| Phase | Goal | Exit gate |
|---|---|---|
| Phase 1 | Analysis এবং planning baseline | Architecture, scope, permissions, migration এবং design baseline approved |
| Phase 2 | Secure foundation | Typed auth/RBAC, env, money, customer/address foundation verified |
| Phase 3 | Sellable catalog | Product/variant/category/inventory admin এবং storefront functional |
| Phase 4 | Purchasable journey | Cart থেকে reviewed checkout deterministic এবং idempotent |
| Phase 5 | Payment readiness | COD এবং online provider contract end-to-end verified |
| Phase 6 | Order operations | Customer/admin order, fulfillment, cancel/return lifecycle complete |
| Phase 7 | Business configurability | Branding, content, delivery, payment, COD, coupon settings usable |
| Phase 8 | Customer polish | Wishlist, reviews, notifications, search, i18n, SEO, accessibility ready |
| Phase 9 | Release candidate | Tests, docs, migration rehearsal, security/performance gates pass |

## Phase 1: Project analysis and documentation

- Current architecture, routes, APIs এবং feature gaps নথিভুক্ত করা।
- Single-business core বনাম optional multi-vendor extension স্থির করা।
- Domain glossary, permissions এবং status semantics স্থির করা।
- Existing design visual baseline capture করা।
- Listing/booking থেকে product/order migration strategy করা।
- Agent-friendly task backlog এবং Definition of Done স্থাপন করা।

## Phase 2: Core marketplace foundation

- Dependency, lint, format এবং environment setup reliable করা।
- Domain module এবং error/result conventions স্থাপন করা।
- Currency-safe money এবং constrained enums যোগ করা।
- Session claims, account status, RBAC এবং ownership policies implement করা।
- Audit log foundation করা।
- Real customer profile, address book, recovery এবং media abstraction করা।

## Phase 3: Product/catalog system

- Product, variants, SKU, options এবং media data model করা।
- Category lifecycle এবং admin CRUD করা।
- Draft/publish/archive product workflow করা।
- Public catalog detail/list query এবং current design wiring করা।
- Search/filter/sort URL contract করা।
- Inventory ledger, atomic stock operations এবং inventory admin UI করা।
- Generic reusable seed এবং legacy backfill করা।

## Phase 4: Cart and checkout

- Guest এবং authenticated cart lifecycle করা।
- Add/update/remove এবং login merge করা।
- Server-authoritative pricing, coupon, tax এবং shipping totals করা।
- Checkout session, address এবং delivery quote করা।
- Immutable multi-item order snapshot foundation করা।
- Final placement idempotency এবং transaction boundary করা।

## Phase 5: Cash on Delivery and payment flow

- Order, payment এবং fulfillment status আলাদা করা।
- Payment attempt/event model এবং provider adapter contract করা।
- Configurable COD settings এবং deterministic eligibility engine করা।
- Checkout payment selector এবং COD placement করা।
- Online payment initiation, webhook, reconciliation এবং refund flow করা।
- Admin COD collection এবং dedicated edge-case suite করা।

## Phase 6: Order management

- Order/fulfillment state machines এবং timeline করা।
- Admin order list/detail/action surfaces করা।
- Shipment, carrier, tracking এবং delivery state করা।
- Customer order history/detail করা।
- Cancellation, return, refund এবং resource rollback করা।
- Reliable order event/outbox করা।

## Phase 7: Admin and business settings

- Protected admin shell এবং real dashboard KPIs করা।
- Customer management এবং audit log viewer করা।
- Business identity, branding এবং SEO settings করা।
- Payment, delivery zone এবং COD rule editors করা।
- Coupon management করা।
- Homepage content model/editor করা।
- Review moderation এবং reports/exports করা।

## Phase 8: Customer experience improvements

- Wishlist persistence সম্পূর্ণ করা।
- Customer dashboard real data-তে wire করা।
- Verified-purchase reviews এবং correct aggregates করা।
- In-app/email notifications এবং preferences করা।
- Search suggestions, facets এবং URL-synced filters করা।
- Configured homepage render করা।
- i18n, SEO, accessibility এবং performance hardening করা।
- Mock peer-to-peer messaging রাখবে নাকি support flow হবে তা স্থির করা।

## Phase 9: Testing, documentation and cleanup

- Deterministic test factories এবং financial/state unit suites করা।
- Auth, catalog, inventory, cart, checkout, payment এবং order integration suites করা।
- COD, online payment এবং admin operation E2E করা।
- Visual, responsive এবং accessibility regression করা।
- Security, concurrency, performance এবং migration rehearsal করা।
- Mock/dead code এবং duplicate business logic সরানো।
- Overview, architecture, schema, API, feature, admin, customization, deployment, testing এবং release documentation final করা।

## Critical path

```text
Architecture and scope
  -> secure foundation
  -> product and inventory
  -> cart and checkout
  -> COD and payment
  -> order operations
  -> admin configuration
  -> customer experience
  -> release verification
```

## Parallel work opportunities

Foundation complete হওয়ার পরে সীমিত parallelization করা যায়:

- Catalog UI এবং inventory service আলাদা agent নিতে পারে, তবে shared schema task complete হতে হবে।
- Payment adapter contract এবং admin settings UI parallel হতে পারে, তবে payment settings model স্থির থাকতে হবে।
- Documentation প্রতিটি phase-এর সঙ্গে চলতে পারে; Phase 9 পর্যন্ত ফেলে রাখা যাবে না।
- Visual regression baseline এবং test fixtures early parallel task হতে পারে।

একই schema বা state machine নিয়ে parallel agents uncoordinated edit করবে না।

## Release principles

- Critical payment/order path-এ silent fallback থাকবে না।
- Admin UI action server-side authorization-এর বিকল্প নয়।
- COD enabled হলেই সব order-এ available হবে না; eligibility engine authoritative।
- Existing design change release goal নয়।
- Documentation ছাড়া configurable feature complete নয়।
- Migration rehearsal ছাড়া production schema release করা যাবে না।
