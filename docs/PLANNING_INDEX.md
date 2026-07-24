# Marketplace Documentation and Planning Index

## Purpose and current position

এই directory reusable single-business B2C marketplace-এর canonical
implementation, operations, verification এবং historical planning record।
Property/rental starter থেকে commerce modular monolith-এ Phases 1–8
implementation complete হয়েছে। Phase 9 browser, accessibility, visual,
exact-source এবং final release gates শেষ না হওয়া পর্যন্ত **In Progress**।

Homepage overall composition—বিশেষ করে Hero এবং Search—strict protected visual
contract। Copy/data/search behavior পরিবর্তনযোগ্য; অন্য product/account/admin
surface business requirements অনুযায়ী redesign করা যাবে। MUI current
implementation choice, architectural restriction নয়।

## Start here: current implementation

1. [Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md) — current
   capabilities, counts, residual risks and phase position.
2. [Architecture](./ARCHITECTURE.md) — modular-monolith boundaries,
   request/transaction/provider/outbox flows and ADR-001.
3. [Database Schema](./DATABASE_SCHEMA.md) — ERD, 43 models, 23 enums,
   constraints, migrations, retention and recovery.
4. [API Documentation](./API_DOCUMENTATION.md) — all 117 current HTTP
   method/path contracts, auth, input/output/error and legacy `410`.
5. [Feature Guide](./FEATURE_GUIDE.md) — customer and business behavior.
6. [Admin Guide](./ADMIN_GUIDE.md) — operator workflows and permissions.
7. [Customization Guide](./CUSTOMIZATION_GUIDE.md) — branding, business,
   catalog, content, delivery and adapter customization.

## Setup, operation and release

8. [Environment Setup](./ENVIRONMENT_SETUP.md) — Node, pnpm, PostgreSQL,
   Docker and environment contract.
9. [Deployment Guide](./DEPLOYMENT_GUIDE.md) — platform-neutral deploy,
   migration, worker, webhook and rollback.
10. [Operations Runbook](./OPERATIONS_RUNBOOK.md) — ownership, outbox/SMTP,
    COD/payment reconciliation, recovery and incidents.
11. [Testing Guide](./TESTING_GUIDE.md) — reproducible static, unit,
    integration, build, browser, a11y and visual commands.
12. [Release Checklist](./RELEASE_CHECKLIST.md) — release record, go/no-go,
    smoke, monitoring and rollback.
13. [Phase 9 Migration and Recovery Rehearsal](./evidence/phase-9/MIGRATION_REHEARSAL.md)
    — local fresh migration, DB integration and backup/restore evidence.

## Current planning and governance

14. [Project Roadmap](./PROJECT_ROADMAP.md) — implemented phase outcomes and
    remaining Phase 9 gates.
15. [Feature Coverage and Residual Gap Matrix](./P1-03_FEATURE_GAP_MATRIX.md) —
    current module coverage and production/deployment gaps.
16. [Detailed Task Plan](./TASK_PLAN.md) — atomic implementation/governance
    ledger; row-status reconciliation is a separate controlled update.
17. [COD and Payment Plan](./COD_AND_PAYMENT_PLAN.md) — first-class COD,
    payment separation and provider contract.
18. [Reusability and Customization Plan](./REUSABILITY_AND_CUSTOMIZATION_PLAN.md)
    — per-business configuration and extension boundaries.
19. [Testing Plan](./TESTING_PLAN.md) — quality strategy and planned layers;
    executable commands are canonical in `TESTING_GUIDE.md`.
20. [Documentation Plan](./DOCUMENTATION_PLAN.md) — document ownership,
    status, maintenance and Phase 9 documentation gates.

## Historical Phase 1 evidence

These files preserve the source and governance state captured on 2026-07-05.
They are not current capability inventories:

21. [Phase 1 SQA Audit](./PHASE_1_SQA_AUDIT.md) — historical planning
    re-audit and evidence.
22. [Phase 1 Exit Approval](./PHASE_1_EXIT_APPROVAL.md) — approved Phase 1
    decision against evidence commit `df3a95d`.
23. [Historical Route/API Inventory](./P1-02_ROUTE_API_INVENTORY.md) —
    pre-commerce starter inventory; current HTTP contract is
    `API_DOCUMENTATION.md`.
24. [Domain Glossary](./P1-05_DOMAIN_GLOSSARY.md) — original target
    terminology; current schema/API docs control implemented names.
25. [Permission Matrix](./P1-06_PERMISSION_MATRIX.md) — original current/target
    policy; actual service/API enforcement and API docs control current facts.
26. [Design Baseline](./P1-07_DESIGN_BASELINE.md) — protected Hero/Search
    scope and reference screenshots.
27. [Data Migration Strategy](./P1-08_DATA_MIGRATION_STRATEGY.md) — legacy
    disposition and cutover policy.
28. [Phase 1 Migration Planning Rehearsal](./evidence/phase-1/MIGRATION_PLANNING_REHEARSAL.md)
    — documentation-only representative planning evidence.
29. [Phase 2–4 SQA Exit Report](./PHASE_2_4_SQA_REPORT.md) — historical
    evidence for those phase gates at their audit date.
30. [Visual Baseline Index](./visual-baseline/INDEX.md) — captured homepage
    and reference images.

Historical records are intentionally not rewritten to pretend their
property-starter or “not implemented” statements were current. Current facts
start from `CURRENT_PROJECT_ANALYSIS.md`.

## Canonical-document ownership

| Concern                                     | Current authority                                   |
| ------------------------------------------- | --------------------------------------------------- |
| Current implementation, gaps and non-claims | `CURRENT_PROJECT_ANALYSIS.md`                       |
| Module/request/transaction architecture     | `ARCHITECTURE.md`                                   |
| Current HTTP route contracts                | `API_DOCUMENTATION.md`                              |
| Current data model/constraints/migrations   | `DATABASE_SCHEMA.md`                                |
| Customer/business feature behavior          | `FEATURE_GUIDE.md`                                  |
| Operator/admin workflow                     | `ADMIN_GUIDE.md`                                    |
| Business/template customization             | `CUSTOMIZATION_GUIDE.md`                            |
| Local environment                           | `ENVIRONMENT_SETUP.md`                              |
| Production deployment                       | `DEPLOYMENT_GUIDE.md`                               |
| Runtime incidents/recovery                  | `OPERATIONS_RUNBOOK.md`                             |
| Executable test commands                    | `TESTING_GUIDE.md`                                  |
| Release decision                            | `RELEASE_CHECKLIST.md`                              |
| Phase sequence/status                       | `PROJECT_ROADMAP.md`                                |
| Atomic task history/status                  | `TASK_PLAN.md` after evidence-based reconciliation  |
| Protected UI/visual contract                | `P1-07_DESIGN_BASELINE.md` and current architecture |
| Phase 1 approval history                    | `PHASE_1_SQA_AUDIT.md`, `PHASE_1_EXIT_APPROVAL.md`  |

When historical and current documents differ, preserve the historical record
and use the current authority above for implementation facts.

## Durable scope decisions

- Core is per-business deployable, configuration-first B2C.
- Runtime multi-tenant SaaS and multi-vendor KYC/commission/payout/settlement
  are outside the reusable core.
- Business catalog is managed by `admin` or `catalog_manager`; `support`
  operates approved customer/order/support workflows.
- COD is first-class and rule-driven.
- Order, payment and fulfillment statuses remain separate.
- COD payment is `PENDING_COLLECTION` until explicit idempotent collection.
- Online payment stays disabled for production until a real provider is
  implemented and certified; `MOCK` is test-only.
- Secrets remain environment/provider-managed; editable business rules remain
  validated database settings.
- Homepage Hero/Search composition is protected; other UI and design-system
  choices may evolve.
- Legacy listing/review/order-create routes are explicitly retired with `410`.

## Phase status

| Phase                               | Current status  | Evidence authority                                                |
| ----------------------------------- | --------------- | ----------------------------------------------------------------- |
| Phase 1: Analysis and documentation | **Complete**    | Historical SQA/exit approval                                      |
| Phase 2: Core foundation            | **Complete**    | Current source/schema plus Phase 2–4 report                       |
| Phase 3: Product/catalog            | **Complete**    | Current catalog/inventory source and contracts                    |
| Phase 4: Cart/checkout              | **Complete**    | Current cart/checkout source and contracts                        |
| Phase 5: COD/payment baseline       | **Complete**    | COD plus adapter/`MOCK` contract; not live-provider certification |
| Phase 6: Order management           | **Complete**    | Order/fulfillment/return/refund/outbox source                     |
| Phase 7: Admin/settings             | **Complete**    | Admin/settings/content/reporting source                           |
| Phase 8: Customer experience        | **Complete**    | Search/wishlist/review/notification/support source                |
| Phase 9: Verification/release       | **In Progress** | Final browser/exact-source/release gates pending                  |

Phase 9 becomes `Complete` only after the full
[Testing Guide](./TESTING_GUIDE.md) sequence and
[Release Checklist](./RELEASE_CHECKLIST.md) decision pass against the exact
release source. File presence, a historical pass or an unverified provider
claim is not an exit gate.
