# Marketplace Project Roadmap

## Current objective and status

Property/rental starter থেকে reusable, configurable, single-business B2C
marketplace modular monolith-এ রূপান্তরের implementation roadmap Phases 1–8
পর্যন্ত complete। Phase 9-এর final static/database/build/browser/accessibility/
visual/release gates এখনও **In Progress**।

এই status implementation presence ও current source audit বোঝায়; production
provider, deployment বা final release certification বোঝায় না।

## Durable product boundary

- Homepage overall composition, Hero এবং Search strict protected visual scope।
- Copy, locale, dynamic product data এবং search behavior business অনুযায়ী
  পরিবর্তনযোগ্য।
- Other storefront, account, checkout এবং admin surfaces business-fit
  redesignable।
- MUI current stack; alternative design system বা custom UI allowed।
- Per-business configuration core; runtime multi-tenant SaaS ও multi-vendor
  settlement excluded।
- COD first-class; order/payment/fulfillment states independent।
- Online payment production-এ disabled থাকবে যতক্ষণ real provider certified না
  হয়।

## Phase overview

| Phase                                 | Status          | Implemented outcome                                                                                          | Current evidence                                   |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 1. Analysis/documentation baseline    | **Complete**    | Architecture, domain, permission, design and migration governance                                            | Historical Phase 1 audit/approval                  |
| 2. Core foundation                    | **Complete**    | Environment, money, errors, auth/RBAC, account/address, media abstraction, audit                             | Current source/schema; Phase 2–4 report            |
| 3. Product/catalog                    | **Complete**    | Product/variant/category/media, public catalog/search and inventory ledger                                   | Catalog/inventory services/APIs                    |
| 4. Cart/checkout                      | **Complete**    | Signed guest/auth cart, merge, pricing, delivery/coupon, snapshots and idempotent placement                  | Cart/checkout services/APIs                        |
| 5. COD/payment baseline               | **Complete**    | COD rules/placement/collection plus adapter, signed `MOCK` webhook, reconciliation/refund                    | Payment/COD services/APIs/tests                    |
| 6. Order management                   | **Complete**    | Status history, customer/admin orders, cancellation, shipment, return, compensation and outbox               | Order/fulfillment services/APIs                    |
| 7. Admin/business settings            | **Complete**    | Admin catalog/orders/customers/settings/content/coupon/reviews/support/KPI/report/audit                      | Admin routes/services                              |
| 8. Customer experience                | **Complete**    | Search/suggestions, wishlist, verified reviews, notifications/preferences, support, i18n/SEO/a11y foundation | Customer APIs/UI/tests                             |
| 9. Verification/documentation/release | **In Progress** | Docs and migration rehearsal exist; exact-source browser/final gates pending                                 | Testing guide, release checklist, Phase 9 evidence |

## Phase 1: Analysis and documentation — Complete

Delivered:

- source inventory, gap analysis and single-business modular-monolith ADR;
- COD/order/payment/fulfillment terminology;
- permission and migration/disposition policy;
- protected homepage/Hero/Search baseline;
- atomic task and governance structure।

Historical evidence:

- [Phase 1 SQA Audit](./PHASE_1_SQA_AUDIT.md)
- [Phase 1 Exit Approval](./PHASE_1_EXIT_APPROVAL.md)
- [Design Baseline](./P1-07_DESIGN_BASELINE.md)
- [Migration Planning Rehearsal](./evidence/phase-1/MIGRATION_PLANNING_REHEARSAL.md)

The original property-starter findings are historical facts, not current
implementation claims.

## Phase 2: Core marketplace foundation — Complete

Implemented:

- reproducible dependency/environment/format/lint/type contracts;
- normalized application errors and currency-safe money;
- constrained roles/statuses;
- account verification, recovery, active status and session-version invalidation;
- server-side RBAC/ownership and route classification;
- customer profile/address book;
- audit foundation and validated media adapter boundary;
- committed database migrations and constraints।

Remaining production concerns such as CSP nonce, distributed rate limiting and
trusted proxy identity are Phase 9/security deployment gates, not missing core
module boundaries.

## Phase 3: Product and catalog — Complete

Implemented:

- Product, ProductVariant, SKU, options and media metadata;
- hierarchical category lifecycle and cycle prevention;
- publish/archive readiness rules;
- public catalog detail/list/search/suggestions/filter/sort/pagination;
- Inventory balances, ledger, reservation/commit/release/adjustment;
- reusable seed/catalog data;
- protected homepage composition with commerce product data।

Current scale limit: some admin configuration reads use explicit fixed caps
rather than pagination. Durable object storage/CDN is an adapter extension,
not implemented production infrastructure.

## Phase 4: Cart and checkout — Complete

Implemented:

- signed HttpOnly guest cart and authenticated cart;
- add/update/remove, merge, expiry and optimistic version;
- authoritative price/coupon/delivery totals;
- saved address and delivery quote;
- checkout snapshot/expiry/revalidation;
- immutable order item/address/price snapshots;
- transaction-safe, UUID-idempotent placement and replay।

Phase 9 still owns final customer browser journey and exact-source concurrency
evidence.

## Phase 5: Cash on Delivery and payment — Complete baseline

Implemented:

- independent order, payment and fulfillment statuses;
- Payment/PaymentEvent persistence and lifecycle policy;
- configurable COD enablement, amount, location/zone, product/category,
  quantity and verified-phone eligibility;
- checkout payment-method eligibility and COD placement;
- COD starts `PENDING_COLLECTION` without an online charge;
- staff-only idempotent collection changes payment to `COLLECTED`;
- adapter contract for intent, verify, webhook and refund;
- signed 64 KiB-capped `MOCK` webhook, replay/out-of-order reconciliation and
  cumulative refund protection।

Boundary: `MOCK` is deterministic test infrastructure, not a production
provider. Phase 5 implementation completeness does not waive live-provider
certification before online payment launch.

## Phase 6: Order management — Complete

Implemented:

- versioned order and fulfillment state machines/history;
- customer/admin order list/detail;
- policy-aware cancellation and idempotent inventory/coupon compensation;
- shipment allocation, tracking and transitions;
- customer return and staff resolution/restock workflow;
- full/partial refund orchestration;
- transactional outbox and audit events।

Financial records remain operationally non-deletable until a separate approved
anonymization/retention migration changes current cascades.

## Phase 7: Admin and business settings — Complete

Implemented:

- protected admin/navigation/API boundaries;
- real dashboard KPIs and reports;
- product/category/inventory/order/customer/support/review operations;
- business identity, branding, SEO and payment presentation settings;
- COD preview/configuration, delivery zones/methods and coupons;
- revisioned lower-homepage content;
- protected Hero/Search keys;
- audit log viewer and capped JSON/CSV exports।

Current hardening item: replace fixed configuration caps and report truncation
with explicit pagination/cursor/operator feedback for larger deployments.

## Phase 8: Customer experience — Complete

Implemented:

- persistent wishlist;
- account/dashboard data and owned order journeys;
- delivered-purchase reviews and moderation;
- in-app notifications, preferences and SMTP commerce templates;
- catalog suggestions, bounded filters/sort/pagination;
- support/contact/listing-report workflow replacing supported peer messaging;
- localized content foundation, metadata/sitemap, accessibility and visual
  automation।

Deployment-dependent: provider-side SMTP acceptance/bounce handling and the
external outbox schedule are not certified by repository source.

## Phase 9: Verification, documentation and release — In Progress

### Completed evidence within Phase 9

- implementation-accurate architecture, database and API documentation;
- feature, admin, customization, environment, deployment, testing, operations
  and release guides;
- mechanical 82-route/117-method API coverage cross-check;
- mechanical 43-model/23-enum schema documentation cross-check;
- local fresh migration of all eight migrations;
- local PostgreSQL integration pass and backup/restore checksum rehearsal।

Links:

- [Testing Guide](./TESTING_GUIDE.md)
- [Release Checklist](./RELEASE_CHECKLIST.md)
- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Operations Runbook](./OPERATIONS_RUNBOOK.md)
- [Phase 9 Migration and Recovery Rehearsal](./evidence/phase-9/MIGRATION_REHEARSAL.md)

### Open Phase 9 exit gates

Phase 9 must remain `In Progress` until the exact release source passes:

1. Node.js 22 frozen install and environment validation;
2. Prisma validation/migration status;
3. repository format, lint and type checks;
4. coverage and isolated PostgreSQL integration suites;
5. production build;
6. complete Playwright desktop/mobile customer, COD, admin and mock-payment
   journeys;
7. accessibility, RTL and strict homepage Hero/Search visual gates;
8. security review for CSP nonce, trusted proxy/shared rate limit and unresolved
   high findings;
9. documentation/source/link consistency;
10. clean reviewed release scope and signed go/no-go checklist।

Parent/browser/final gates are still active; no document may mark Phase 9
`Complete` before their terminal evidence.

## Production onboarding work after template verification

These do not change Phases 1–8 implementation status, but block relevant
production claims:

| Production concern | Required business/platform work                                                |
| ------------------ | ------------------------------------------------------------------------------ |
| Online payment     | Real adapter, secrets, sandbox/webhook/refund certification and reconciliation |
| Media              | Durable object storage/CDN adapter, upload/delete/lifecycle policy             |
| Rate limit         | Shared store or edge/WAF control plus trusted-proxy contract                   |
| CSP                | Nonce/hash-compatible CSP and browser validation                               |
| SMTP               | Sender-domain authentication, controlled delivery, bounce/alert verification   |
| Outbox             | External authenticated scheduler, backlog/retry/failure monitoring             |
| Database           | Automated backup/PITR, RPO/RTO, retention and production restore rehearsal     |
| Scale              | Admin configuration pagination/cursor and report/export governance             |

## Current critical path

```text
Freeze exact release source
  -> static and environment gates
  -> migration and DB integration
  -> production build
  -> browser + COD/admin/mock-payment journeys
  -> accessibility + Hero/Search visual gates
  -> source/doc/security review
  -> signed release decision
```

Parallel verification is allowed when agents do not mutate the same
schema/state-machine/document. Final evidence must be rerun against the exact
release source after all changes converge.

## Release principles

- Failed or unverified gates are not `Complete`.
- Client totals and UI role checks are not authoritative.
- COD availability always comes from the eligibility engine.
- Delivery does not imply COD collection.
- `MOCK` does not certify online payments.
- Outbox `PUBLISHED` does not by itself prove provider-side email delivery.
- Legacy `410` routes must not silently reactivate.
- Protected Hero/Search visuals require reviewed baseline evidence.
- No production down migration/destructive reset.
- Documentation and provider/deployment non-claims ship with the feature.

## Status authority

[Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md) and this roadmap
control current phase-level implementation status. `TASK_PLAN.md` is the atomic
ledger and requires a separate evidence-based row reconciliation; this roadmap
does not silently rewrite it. Final release authority is the completed
[Release Checklist](./RELEASE_CHECKLIST.md) against terminal Phase 9 evidence.
