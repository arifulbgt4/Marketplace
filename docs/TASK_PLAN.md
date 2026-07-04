# Detailed Marketplace Task Plan

## Status and usage

এই file reusable B2C marketplace implementation-এর canonical agent backlog। Phase 1-এর analysis/planning baseline documents তৈরি হয়েছে, তবে formal review/approval pending থাকতে পারে। কোনো Phase 2–9 code implementation task শুরু বা complete করা হয়নি; সেগুলোর default status `Not started`।

Coding agent একটি task নেওয়ার আগে:

1. `PLANNING_INDEX.md`, `CURRENT_PROJECT_ANALYSIS.md` এবং `ARCHITECTURE.md` পড়বে।
2. Task dependency complete কি না যাচাই করবে।
3. Existing design baseline বদলাবে না।
4. Scope-এর বাইরে adjacent refactor করবে না।
5. Acceptance criteria এবং testing requirement পূরণ না হলে task complete বলবে না।
6. Schema/API behavior বদলালে একই task-এ relevant docs update করবে।

## Shared Definition of Done

- Server-side validation এবং authorization আছে।
- Financial calculation client input trust করে না।
- Error, empty, loading এবং forbidden state defined।
- Relevant unit/integration/E2E test pass।
- TypeScript, lint এবং formatting checks pass।
- Existing visual design-এর unintended regression নেই।
- Migration/backfill প্রয়োজন হলে reversible এবং documented।
- Documentation current implementation-এর সঙ্গে মেলে।

## Phase 1: Project analysis and documentation

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement | Status |
|---|---|---|---|---|---|---|
| P1-01 Current architecture baseline | Existing request/data flow নথিভুক্ত করা | `docs/ARCHITECTURE.md`, `src/app`, `src/server`, `src/lib` | Diagram, layers, runtime boundaries documented | None; fact ও assumption আলাদা রাখতে হবে | Paths এবং imports manual cross-check | Complete |
| P1-02 Route/API inventory | Pages, APIs, server actions এবং access level map করা | `src/app/**`, `src/server/**`, routes config | Route, method, auth এবং data source matrix complete | P1-01 | Filesystem inventory cross-check | Complete |
| P1-03 Feature gap matrix | Functional, partial, mock এবং missing feature চিহ্নিত করা | Pages, forms, widgets, Prisma | প্রতিটি core module-এর verified status আছে | P1-01, P1-02 | Empty handler/mock searches rerun | Complete |
| P1-04 Target architecture ADR | Single-business modular monolith এবং optional seller extension lock করা | `docs/ARCHITECTURE.md`, future ADRs | Scope, alternatives এবং boundaries approved | P1-03; multi-vendor assume করা যাবে না | Architecture review | Complete |
| P1-05 Domain glossary | Product, cart, checkout, payment, order এবং fulfillment terms lock করা | `docs/P1-05_DOMAIN_GLOSSARY.md` | Ambiguous term/status নেই | P1-04 | Product এবং engineering review | Complete |
| P1-06 Permission matrix | Customer/admin/support/catalog-manager actions define করা | `docs/P1-06_PERMISSION_MATRIX.md` | প্রতিটি mutation-এর actor এবং policy আছে | P1-02, P1-05 | Deny-by-default matrix review | Complete |
| P1-07 Design baseline | Existing responsive UI baseline record করা | `docs/P1-07_DESIGN_BASELINE.md` | Desktop/mobile/RTL states এবং no-redesign rule captured | P1-02 | Screenshot comparison | Complete |
| P1-08 Data migration strategy | Listing/booking data Product/Order model-এ নেওয়ার plan | `docs/P1-08_DATA_MIGRATION_STRATEGY.md` | Coexistence, backfill, rollback, archive rules আছে | P1-04, P1-05 | Representative legacy records review | Complete |
| P1-09 Backlog and handoff convention | Agent task IDs, dependencies এবং completion reporting standard করা | `TASK_PLAN.md` | Every task assignable এবং dependency-aware | P1-01 through P1-08 | Dependency graph cycle review | Complete |

## Phase 2: Core marketplace foundation

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P2-01 Dependency baseline | Source imports direct dependencies করা এবং tooling reliable করা | `package.json`, lockfile | Runtime imports declared; lint/format commands valid | P1-09; unrelated upgrades নয় | Install, lint, format, type-check |
| P2-02 Environment contract | Required/optional env validation এবং setup consistency | `.env.example`, future `src/lib/env`, Docker docs | Fail-fast validation; ports/docs consistent; no real secret defaults | P2-01 | Missing/valid env tests; Prisma validate |
| P2-03 Module boundary skeleton | Domain module folder এবং public API convention স্থাপন | Future `src/modules/*` | UI/API/domain/repository/provider responsibilities clear | P1-04 | Import-boundary check |
| P2-04 Error/result contract | Validation/auth/conflict/not-found responses standard করা | Future error and API helpers | Stable error code, safe message, request ID | P2-03 | Handler unit tests |
| P2-05 Money/currency primitive | `Float` arithmetic-এর বদলে safe representation | Prisma এবং pricing module | Decimal/minor-unit conversion এবং ISO currency defined | P1-05, P2-03 | Rounding, zero, large amount tests |
| P2-06 Role/status enums | Free-form role/status constrained করা | Prisma enums, domain types | Invalid role/status persistence rejected | P1-05, P1-06 | Schema এবং validation tests |
| P2-07 Session claims | Typed ID, role এবং account status session-এ আনা | `src/lib/auth.ts`, NextAuth types | Disabled user denied; `any` required নয় | P2-06 | Login/session tests |
| P2-08 Authorization helpers | Reusable admin/owner/customer policies তৈরি | Future authz module | Every mutation reusable policy call করতে পারে | P2-07, P1-06 | Allow/deny matrix tests |
| P2-09 Route protection | Locale-aware public/customer/admin routing correct করা | `src/middleware.ts`, layouts | Regex ambiguity নেই; admin/customer boundary correct | P2-07, P2-08 | Route table tests |
| P2-10 Audit log foundation | Sensitive mutation actor/change record করা | Prisma `AuditLog`, audit service | Actor, action, target, timestamp, metadata retained | P2-08 | Admin mutation integration test |
| P2-11 Customer profile read | Account pages real current-user data ব্যবহার করবে | User service এবং account pages | Mock profile removed; own data only | P2-07 | Unauthorized/own-profile tests |
| P2-12 Customer profile update | Name, phone, locale/preferences safe update | Profile service/form | Caller foreign user ID update করতে পারে না | P2-08, P2-11 | Validation/ownership tests |
| P2-13 Address book | Shipping/billing addresses এবং default address | Prisma Address, account API/UI | Multiple address CRUD; one default per type | P2-05, P2-08 | CRUD/default/ownership tests |
| P2-14 Account recovery | Password change/reset এবং email verification | Auth module, notification adapter | Expiring one-use tokens এবং session invalidation | P2-02, P2-07 | Expired/reused token tests |
| P2-15 Media storage abstraction | Product/branding/customer media provider-independent করা | Future media module, upload components | Type/size validation, stable URL, delete policy | P2-03 | Invalid file এবং adapter tests |

## Phase 3: Product and catalog system

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P3-01 Product base schema | Rental Listing-এর পাশে reusable Product model | Prisma Product models | Name, slug, description, status, brand, tax class আছে | P1-08, P2-05, P2-06 | Migration validation |
| P3-02 Variant and SKU schema | Size/color/pack sellable variants support | ProductVariant/ProductOption | Unique SKU, optional barcode, price override | P3-01 | Duplicate SKU/option tests |
| P3-03 Product media model | Ordered product images/media metadata | ProductMedia এবং media service | Primary media, order, alt text supported | P2-15, P3-01 | Ordering/ownership tests |
| P3-04 Category rules | Hierarchy, visibility, order এবং archive rules | Category model/domain | Parent cycles prevented; archived hidden | P3-01 | Cycle/slug tests |
| P3-05 Category CRUD | Admin create/edit/reorder/archive | Category service/API/admin UI | Unsafe delete blocked; validation visible | P2-08, P3-04 | RBAC/conflict tests |
| P3-06 Product create service | Validated draft product creation | Product service/API | Product এবং variants atomically created | P2-08, P3-01 to P3-03 | Invalid payload/rollback tests |
| P3-07 Product update/archive | Edit এবং non-destructive removal | Product service/API | Existing order snapshot unaffected | P3-06 | Archive/concurrent update tests |
| P3-08 Publish validator | Incomplete product publication block করা | Catalog policy | Category, media, SKU, price, stock policy enforced | P3-03, P3-06 | Missing-field matrix |
| P3-09 Public catalog queries | Published product list/detail DTO | Catalog query module | Draft/archived inaccessible; pagination typed | P3-08 | Visibility/pagination tests |
| P3-10 Search/filter/sort contract | Query, category, price, availability এবং sort | Catalog query/API | Stable URL params; deterministic sorting | P3-09 | Filter combination tests |
| P3-11 Storefront catalog wiring | Existing cards/lists/details-এ product data | Listing widgets/pages/routes | Existing layout preserved; rental labels removed/configured | P3-09, P1-07 | Visual এবং interaction tests |
| P3-12 Product admin list | Admin search/filter/status list | Future admin catalog pages | Paginated list এবং state-aware actions | P3-06 to P3-08 | Admin E2E smoke |
| P3-13 Product editor | Product/variant/media editor | Existing ListingForm or new product form | Create/edit/publish errors visible; no silent no-op | P3-06, P3-08, P3-12 | Form integration tests |
| P3-14 Inventory schema | Variant-level on-hand/reserved/available stock | Inventory and ledger models | Balances এবং low-stock threshold supported | P3-02 | Constraints/aggregate tests |
| P3-15 Atomic stock operations | Reserve/commit/release/adjust service | Inventory service | Concurrent checkout oversell করতে পারে না | P3-14 | Transaction/concurrency tests |
| P3-16 Inventory admin UI | Stock view এবং reasoned adjustment | Admin inventory pages | Adjustment audited; balance consistent | P2-10, P3-15 | RBAC/adjustment E2E |
| P3-17 Seed and legacy backfill | Generic reusable demo catalog এবং mapping | `prisma/seed.ts`, migration scripts | Seed idempotent; property data core dependency নয় | P1-08, P3-01 to P3-16 | Empty/populated database dry run |

## Phase 4: Cart and checkout

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P4-01 Cart schema and guest identity | Guest এবং customer carts persist করা | Cart/CartItem, signed cart token | One active cart per identity; expiry defined | P3-02, P3-14 | Identity/expiry tests |
| P4-02 Cart read service | Authoritative cart summary | Cart query/pricing DTO | Current prices, availability, warnings returned | P4-01 | Empty/stale cart tests |
| P4-03 Add to cart | Variant/quantity validated mutation | Cart service/API | Unpublished/out-of-stock product rejected | P3-15, P4-01 | Guest/auth/quantity tests |
| P4-04 Update/remove cart item | Quantity update এবং removal | Cart service/API | Zero removes; stock limits respected | P4-03 | Boundary/ownership tests |
| P4-05 Guest cart merge | Login-এর সময় deterministic merge | Auth callback/cart service | Duplicate variants merged within stock | P4-03, P2-07 | Merge conflict tests |
| P4-06 Pricing calculator | Subtotal, discount, coupon, tax, shipping totals | Pricing module | Server total deterministic; client amount ignored | P2-05, P3-02 | Rounding/rule-order tests |
| P4-07 Cart UI | Existing visual language-এ functional cart | Header/cart page/widgets | Add/update/remove/error/empty states work | P4-02 to P4-06, P1-07 | Component/visual tests |
| P4-08 Checkout session | Expiring checkout draft from cart | Checkout models/service | Cart identity, version এবং expiry retained | P4-06 | Expired/stale session tests |
| P4-09 Checkout address | Saved/new shipping address select | Checkout UI, Address module | Ownership এবং required fields validated | P2-13, P4-08 | Address E2E |
| P4-10 Delivery zone schema | Location-based zones এবং methods | Delivery models | Priority, active flag, matching rules | P2-05 | Overlap/no-zone tests |
| P4-11 Shipping quote | Cart/address অনুযায়ী eligible rates | Shipping module | Value/weight/location/free-shipping rules | P4-09, P4-10 | Rule matrix tests |
| P4-12 Coupon evaluator | Scoped, expiring, usage-limited coupon | Coupon models/pricing | Product/category/order scope এবং user limits | P4-06 | Expiry/limit/stacking tests |
| P4-13 Checkout review UI | Address, delivery, coupon, totals, method summary | Checkout pages/widgets | Server quote shown; stale data prompts refresh | P4-08 to P4-12 | Checkout component/E2E |
| P4-14 Immutable order snapshots | Multi-item order, totals এবং addresses snapshot | Order/OrderItem schema | Product changes old order বদলায় না | P2-05, P4-13 | Snapshot tests |
| P4-15 Placement idempotency | Duplicate submit থেকে duplicate order ঠেকানো | Checkout coordinator | Same key same outcome; rollback safe | P4-14, P3-15 | Double-submit/rollback tests |

## Phase 5: COD and online payment

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P5-01 Separate commerce statuses | Order/payment/fulfillment state split করা | Order/Payment enums/models | States independent এবং typed | P4-14, P2-06 | Invalid transition tests |
| P5-02 Payment transaction model | Attempts, provider refs এবং event records | Payment/PaymentEvent | Multiple attempts/idempotent events retained | P5-01 | Unique/replay tests |
| P5-03 Payment adapter contract | Gateway interchangeable করা | Future payment providers | Create, verify, capture, refund contract | P5-02 | Fake adapter contract suite |
| P5-04 COD settings model | Global, amount, zone, category/product rules | Payment/business settings | Admin-editable validated rules; no secrets | P4-10, P5-01 | Settings validation |
| P5-05 COD eligibility engine | Checkout context থেকে deterministic decision | COD policy | Allowed flag, reason code, rule snapshot | P5-04, P4-11 | Full rule matrix |
| P5-06 Payment method selector | Eligible methods checkout-এ দেখানো | Checkout UI/API | Unavailable reason visible; tampering rejected | P5-03, P5-05 | UI/API tampering tests |
| P5-07 COD order placement | Online charge ছাড়া COD order create | Checkout/order/payment services | Payment is `PENDING_COLLECTION`; stock/order atomic | P4-15, P5-05 | Success/duplicate/rollback tests |
| P5-08 Online payment initiation | Provider intent/session create | Payment service/API | Server amount authoritative; attempt persisted | P5-03, P4-15 | Provider failure tests |
| P5-09 Payment webhook | Signature এবং idempotent event processing | Webhook route/payment service | Duplicate/out-of-order event safe | P5-08 | Signature/replay tests |
| P5-10 Reconciliation | Verified provider state authoritative করা | Payment/order service | Paid/failed/expired consistent; anomaly logged | P5-09, P2-10 | Delayed webhook tests |
| P5-11 COD collection | Authorized admin collection record | Admin order action/payment service | Actor/time/amount/note; duplicate blocked | P5-07, P2-08, P2-10 | RBAC/duplicate tests |
| P5-12 Refund/reversal | Full/partial refund record এবং provider action | Payment service/adapter | Original transaction preserved; audit exists | P5-03, P5-10 | Partial/failed refund tests |
| P5-13 COD edge-case suite | COD failure and reversal rules lock করা | COD/payment tests | Disabled/conflict/cancel/return/collection cases covered | P5-04 to P5-12 | Dedicated unit/integration suite |

## Phase 6: Order management

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P6-01 Order state machine | Legal order/fulfillment transitions | Order policy | Illegal skip/reopen rejected | P5-01 | Transition table tests |
| P6-02 Transition history | Actor/reasonসহ atomic timeline | OrderStatusHistory/service | Chronological immutable history | P6-01, P2-10 | Concurrent transition tests |
| P6-03 Admin order list | Search/filter/date/payment status list | Admin order query/pages | Stable pagination এবং filters | P2-08, P5-07, P5-10 | Admin query tests |
| P6-04 Admin order detail | Items, addresses, payment, status, audit | Admin detail page | Sensitive data gated; actions state-aware | P6-02, P6-03 | RBAC/visual tests |
| P6-05 Shipment model | Package, carrier, tracking, delivery dates | Shipment models/service | Multiple shipment extension possible | P6-01 | Shipment lifecycle tests |
| P6-06 Fulfillment actions | Pack, ship, deliver, tracking update | Admin order actions | Invalid transitions blocked | P6-05 | Fulfillment E2E |
| P6-07 Customer order history | Own order list/detail | Customer account query/pages | Cross-user access impossible; snapshots shown | P6-02 | IDOR/ownership tests |
| P6-08 Cancellation policy | Customer/admin cancellation windows | Order policy/service | Reason, stock release, payment action coordinated | P3-15, P5-12, P6-02 | Before/after shipment tests |
| P6-09 Return/refund workflow | Return request through refund | Return models/services | Order/payment/stock states coordinated | P6-05, P6-08 | COD/prepaid return tests |
| P6-10 Resource rollback | Cancel/expiry/failure stock/coupon release | Inventory/coupon/checkout services | Exactly-once release; no negative stock | P3-15, P4-12, P6-08 | Retry/idempotency tests |
| P6-11 Reliable order events | Transactional outbox for downstream work | Outbox/Event models | Event persistence atomic with domain change | P6-02 | Retry/duplicate consumer tests |

## Phase 7: Admin and business settings

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P7-01 Admin shell | Protected responsive admin navigation | Future admin routes/layout | Non-admin denied; existing design language used | P2-09, P1-07 | Route/RBAC/visual tests |
| P7-02 Dashboard KPIs | Real orders, revenue, customers, stock | Analytics queries/dashboard | Date range/currency respected; no mock data | P5, P6 | Aggregate fixture tests |
| P7-03 Customer management | Search, status, order summary, disable/enable | Admin customer module | No secret exposure; changes audited | P2-08, P2-10 | RBAC/disabled-login tests |
| P7-04 Business settings | Legal/contact/address/locale/currency | BusinessSettings/admin form | Validated settings power storefront | P2-05, P7-01 | Update/cache tests |
| P7-05 Branding settings | Logo, favicon, theme tokens, SEO, social links | Branding/media/theme adapter | Safe values applied; fallback works | P2-15, P7-04 | Preview/visual tests |
| P7-06 Payment settings | Enabled methods এবং public provider config | Admin payment settings | Disabled method unavailable; secrets hidden | P5-03, P7-01 | Settings/RBAC tests |
| P7-07 Delivery zone editor | Zones, rates, methods, priorities | Admin delivery pages | Overlap warning এবং rule preview | P4-10, P4-11 | Preview integration tests |
| P7-08 COD rule editor | Global/zone/product/category/min/max rules | Admin COD settings | Preview actual eligibility engine ব্যবহার করে | P5-04, P5-05, P7-07 | Edit/eligibility E2E |
| P7-09 Coupon management | Coupon create/edit/archive/usage | Admin coupon pages | Invalid values/scope rejected | P4-12, P7-01 | CRUD/rule tests |
| P7-10 Homepage content model | Section type, order, visibility, locale content | ContentSection models/API | Draft/published এবং ordering supported | P7-04 | Schema/order tests |
| P7-11 Homepage editor | Configure/reorder/preview/publish sections | Admin content pages | Revision-friendly publishing | P7-10, P1-07 | Editor/visual E2E |
| P7-12 Review moderation | Approve/hide/flag actions | Admin review service/pages | History retained; no silent rewrite | P2-10 | RBAC/visibility tests |
| P7-13 Reports and exports | Orders, payments, COD, inventory outputs | Reporting module | Filters/timezone/currency explicit | P7-02, P5, P6 | Export fixture tests |
| P7-14 Audit log viewer | Restricted admin activity viewer | Admin audit pages | Immutable filtered log | P2-10, P7-01 | RBAC/filter tests |

## Phase 8: Customer experience

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P8-01 Wishlist wiring | Bookmarkকে persisted Product wishlist করা | Bookmark/product card/service | Toggle persists; optimistic failure rolls back | P3-01, P2-08 | Toggle/ownership tests |
| P8-02 Customer dashboard | Real profile/order/wishlist summary | Account dashboard/widgets | Hardcoded metrics removed | P6-07, P8-01 | Dashboard integration |
| P8-03 Verified reviews | Delivered purchase ছাড়া review block | Review model/service | Defined one-review eligibility rule | P6-07 | Eligibility tests |
| P8-04 Review aggregates | Moderated review averages/display | Catalog queries/widgets | Hidden review excluded; average accurate | P8-03, P7-12 | Aggregate tests |
| P8-05 Notification center | In-app read/unread notifications | Notification model/account UI | Own notifications only | P6-11 | Ownership/read-state tests |
| P8-06 Email templates/preferences | Transactional emails এবং preferences | Email adapter/templates | Mandatory vs optional messaging separated | P2-14, P6-11 | Template/fake-mail tests |
| P8-07 Search suggestions | Accessible suggestions/no-result UX | Search components/API | Debounced, keyboard usable, no stale results | P3-10 | Component/API tests |
| P8-08 URL-synced facets | Filter, sort, pagination browser state | Search forms/widgets | Reload/share/back preserves state | P3-10, P3-11 | Navigation E2E |
| P8-09 Configured homepage | Published content sections render | Homepage/content query | Draft/hidden absent; order/locale respected | P7-10, P7-11 | Visual/locale tests |
| P8-10 Internationalization | Hardcoded strings message files-এ নেওয়া | `messages/*.json`, UI | Locale key parity; date/money localized | P7, P8 | Missing-key/RTL tests |
| P8-11 SEO | Product/category metadata and structured data | Metadata/sitemap modules | Draft excluded; settings drive domain/brand | P3-09, P7-05 | Metadata snapshot tests |
| P8-12 Accessibility | Forms, focus, keyboard, contrast, errors | Storefront/admin components | Critical WCAG 2.1 AA issues resolved | Completed UI, P1-07 | Automated/manual tests |
| P8-13 Performance | Images, queries, cache, bundle, pagination | Catalog/Next config/widgets | No unbounded query; budgets documented | P3 through P8 | Query/Lighthouse/bundle checks |
| P8-14 Messaging/support decision | Mock peer chat replace, remove বা support flow | Message model/UI/docs | Unsupported mock experience publicly exposed নয় | P1-04 | Selected flow smoke test |

## Phase 9: Testing, documentation and cleanup

| ID এবং title | Goal ও context | Likely files/modules | Acceptance criteria | Dependencies ও agent note | Testing requirement |
|---|---|---|---|---|---|
| P9-01 Test factories | Deterministic domain fixtures | Test helpers/database setup | Isolated users/products/carts/orders/payments | Core schema complete | Factory self-tests |
| P9-02 Pricing unit suite | Financial rules lock করা | Pricing tests | Rounding/tax/shipping/coupon combinations covered | P4-06, P4-12 | Coverage report |
| P9-03 COD unit suite | Rule precedence/reason codes lock | COD tests | Every eligibility dimension covered | P5-05 | Table-driven tests |
| P9-04 State machine suite | Commerce transitions lock | Domain policy tests | Every allowed/denied edge covered | P5-01, P6-01 | Transition matrix |
| P9-05 Auth/RBAC integration | Customer/admin boundaries verify | Auth/API tests | Unauthorized/forbidden/disabled cases pass | P2 | Integration suite |
| P9-06 Catalog/inventory integration | Publish/query/reserve concurrency | Catalog tests | No draft leakage or oversell | P3 | Database integration |
| P9-07 Cart/checkout integration | Merge/reprice/address/delivery/coupon | Checkout tests | Tampered/stale client data rejected | P4 | Database integration |
| P9-08 Payment integration | Adapter/webhook/reconcile/refund | Payment tests | Replay/signature/out-of-order safe | P5 | Fake provider suite |
| P9-09 Order integration | Placement through return | Order tests | Snapshots/timeline/stock effects correct | P6 | Lifecycle suite |
| P9-10 Customer COD E2E | Product to COD order history | Browser E2E | Pending collection and no gateway redirect | P5 through P8 | Desktop/mobile E2E |
| P9-11 Online payment E2E | Success/failure/cancel/webhook | Browser/provider sandbox | Verified state reflected | P5 through P8 | Sandbox E2E |
| P9-12 Admin operations E2E | Catalog/stock/order/COD/settings | Admin E2E | RBAC এবং audit verified | P7 | Browser E2E |
| P9-13 Visual regression | Existing design preserved | Storybook/screenshots | Unapproved visual differences absent | P1-07 | Key viewport snapshots |
| P9-14 Accessibility regression | Storefront/admin automated scan | E2E/a11y setup | Critical/serious violations zero | P8-12 | axe/keyboard checklist |
| P9-15 Security/performance audit | IDOR, validation, PII, rate, query cost | Full system | High severity resolved; budgets pass | Functional phases complete | Abuse/load/security tests |
| P9-16 Migration rehearsal | Empty/legacy upgrade এবং rollback | Prisma migrations/backfill | Production-like repeatable rehearsal | P1-08, final schema | Backup/restore dry run |
| P9-17 Mock/dead-code cleanup | No-op/mocks/duplicate business logic remove | Forms/widgets/server/API | Supported route silently no-op নয় | Functional tests green | Search, lint, type-check, build |
| P9-18 Project overview/setup docs | Accurate purpose এবং quick start | README/setup docs | Commands verified; claims match reality | Final feature set | Fresh clone walkthrough |
| P9-19 Architecture docs finalization | Module/request/transaction/provider details | Architecture docs | Implementation and docs match | All modules | Engineering review |
| P9-20 Database schema docs | ERD, indexes, retention, statuses | Database docs | Migration/backup rules complete | Final schema | Schema/doc comparison |
| P9-21 API documentation | Input/output/error/auth contracts | API docs/OpenAPI | Every supported API documented | APIs stable | Contract comparison |
| P9-22 Feature documentation | Customer/admin business behavior | Feature docs | Rules and edge cases included | Feature tests green | Product review |
| P9-23 Admin usage guide | Operational workflows | Admin guide | Non-developer operator can follow | P7 stable | Operator walkthrough |
| P9-24 Customization guide | Branding/content/catalog/payment/delivery setup | Customization docs | Code-free settings and extension points clear | P7, P8 | New-business rehearsal |
| P9-25 Deployment guide | Env, DB, webhook, workers, storage, rollback | Deployment docs | Staging/production checklist complete | P2, P5, P6 | Staging rehearsal |
| P9-26 Testing guide | Commands, fixtures, layers, CI | Testing docs | Local/CI instructions reproducible | P9-01 to P9-15 | Clean-machine run |
| P9-27 Release checklist | Versioning, migration, smoke, rollback | Release docs | Go/no-go ownership and triggers clear | All tasks | Release simulation |

## Task selection order

Generic “implement next task” requests হলে এই order অনুসরণ করতে হবে:

1. Lowest-numbered `Not started` task whose dependencies are complete।
2. Security/data-correctness task UI polish-এর আগে।
3. Schema task এবং migration task split করা যাবে না যদি partial state unsafe হয়।
4. একই phase-এর independent UI/documentation work parallel হতে পারে।
5. COD বা payment task prerequisite ছাড়া শুরু করা যাবে না।

## Status update format

Task complete করার সময় agent লিখবে:

```text
Task: P?-??
Status: Complete | Blocked
Changed files:
Behavior delivered:
Acceptance criteria:
Tests run and results:
Documentation updated:
Remaining risks:
```
