# Marketplace Documentation Plan

## Objective and status

Documentation implementation-এর পরে stale appendix নয়; schema, API,
configuration, provider boundary, operational workflow বা public behavior
বদলালে একই change-set-এ canonical document update হবে।

Current documentation set implementation-accurateভাবে refreshed হয়েছে।
Documentation creation tasks materially complete, কিন্তু Phase 9 source/link/
browser/release review শেষ না হওয়া পর্যন্ত overall documentation gate
**In Progress**।

## Current document registry

| Document                                                    | Audience                 | Current purpose                                                              | Status                                  |
| ----------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------- |
| [Planning Index](./PLANNING_INDEX.md)                       | Everyone                 | Current/historical navigation and authority map                              | Current                                 |
| [Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md)   | Engineer/stakeholder     | Implemented capabilities, inventory, residual risks and non-claims           | Current                                 |
| [Architecture](./ARCHITECTURE.md)                           | Engineer/agent           | Modular boundaries, request/transaction/provider/outbox flows and ADR        | Current                                 |
| [Database Schema](./DATABASE_SCHEMA.md)                     | Engineer/operator        | ERD, all models/enums, constraints, retention, migration and recovery        | Current                                 |
| [API Documentation](./API_DOCUMENTATION.md)                 | Frontend/integration     | All supported method/path/auth/input/output/error contracts and legacy `410` | Current                                 |
| [Feature Guide](./FEATURE_GUIDE.md)                         | Product/support/engineer | Customer/business behavior and edge cases                                    | Current                                 |
| [Admin Guide](./ADMIN_GUIDE.md)                             | Business operator        | Catalog, inventory, order, COD, settings, review and support workflows       | Current                                 |
| [Customization Guide](./CUSTOMIZATION_GUIDE.md)             | Implementer/business     | Branding, business, content, delivery, payment and extension boundaries      | Current                                 |
| [Environment Setup](./ENVIRONMENT_SETUP.md)                 | Developer/operator       | Runtime, Docker, PostgreSQL and environment variables                        | Current                                 |
| [Deployment Guide](./DEPLOYMENT_GUIDE.md)                   | Platform/release         | Deploy, migration, webhook, worker, monitoring and rollback                  | Current                                 |
| [Operations Runbook](./OPERATIONS_RUNBOOK.md)               | Operator/on-call         | Outbox/SMTP, COD/payment reconciliation, recovery and incidents              | Current                                 |
| [Testing Guide](./TESTING_GUIDE.md)                         | Engineer/CI/SQA          | Exact test layers, commands, fixtures and gates                              | Current                                 |
| [Release Checklist](./RELEASE_CHECKLIST.md)                 | Release owner            | Go/no-go, smoke, monitoring, rollback and sign-off                           | Current template; sign-off pending      |
| [Project Roadmap](./PROJECT_ROADMAP.md)                     | Product/engineering      | Phase outcomes and open Phase 9 gates                                        | Current                                 |
| [Feature Gap Matrix](./P1-03_FEATURE_GAP_MATRIX.md)         | Product/engineering/SQA  | Current coverage and residual production gaps                                | Current                                 |
| [COD and Payment Plan](./COD_AND_PAYMENT_PLAN.md)           | Product/engineering      | COD rules and provider-neutral payment target contract                       | Planning companion                      |
| [Reusability Plan](./REUSABILITY_AND_CUSTOMIZATION_PLAN.md) | Product/engineering      | Configuration and adapter strategy                                           | Planning companion                      |
| [Testing Plan](./TESTING_PLAN.md)                           | SQA/engineering          | Quality strategy; executable current commands live in Testing Guide          | Historical/planning companion           |
| [Detailed Task Plan](./TASK_PLAN.md)                        | Agents/governance        | Atomic task ledger                                                           | Separate status reconciliation required |

## Evidence registry

| Evidence                                                                                   | Meaning                                                                   | Status boundary                                         |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Phase 9 Migration and Recovery Rehearsal](./evidence/phase-9/MIGRATION_REHEARSAL.md)      | Local fresh migration, DB integration and backup/restore checksum dry run | Pass locally; Node 24, not production certification     |
| [Visual Baseline Index](./visual-baseline/INDEX.md)                                        | Historical/reference screenshots and protected homepage baseline          | Final exact-source Playwright comparison still required |
| [Phase 1 SQA Audit](./PHASE_1_SQA_AUDIT.md)                                                | 2026-07-05 planning baseline audit                                        | Historical, not current feature state                   |
| [Phase 1 Exit Approval](./PHASE_1_EXIT_APPROVAL.md)                                        | Approved Phase 1 evidence commit                                          | Historical governance                                   |
| [Phase 1 Migration Planning Rehearsal](./evidence/phase-1/MIGRATION_PLANNING_REHEARSAL.md) | Documentation-only migration disposition exercise                         | Historical planning, not runtime migration              |
| [Phase 2–4 SQA Report](./PHASE_2_4_SQA_REPORT.md)                                          | Phase 2–4 evidence at audit date                                          | Historical phase exit evidence                          |

Historical evidence must remain labeled by its date/scope. Do not rewrite it to
pretend old property-starter findings or earlier test counts describe current
source.

## Canonical authority and update triggers

| Change                                        | Documents that must update in the same change             |
| --------------------------------------------- | --------------------------------------------------------- |
| Route method/path/auth/request/response/error | `API_DOCUMENTATION.md`, relevant feature/admin guide      |
| Prisma model/enum/index/check/delete behavior | `DATABASE_SCHEMA.md`, migration/recovery docs             |
| Module/transaction/provider/outbox flow       | `ARCHITECTURE.md`, `OPERATIONS_RUNBOOK.md`                |
| Environment variable/secret/default           | `ENVIRONMENT_SETUP.md`, `DEPLOYMENT_GUIDE.md`, runbook    |
| COD/payment lifecycle or rule                 | COD/payment plan, API, feature/admin guide, tests/runbook |
| Admin/customer/support workflow               | Feature/Admin/API docs and permission evidence            |
| Branding/content/design boundary              | Customization, Architecture and Design Baseline           |
| Test command/fixture/CI gate                  | `TESTING_GUIDE.md`, workflow and release checklist        |
| Release/migration/rollback policy             | Deployment, Operations, Database and Release Checklist    |
| Phase/gap status                              | Current Analysis, Gap Matrix, Roadmap and Planning Index  |

When a current implementation fact conflicts with a historical document, update
the current authority and retain the historical record with an explicit
historical label.

## Required content contracts

### Project overview/current analysis

- Current implementation versus deployment-dependent capability.
- Mechanical API/schema/migration inventory.
- Module and role coverage.
- Legacy retirement boundary.
- Protected Hero/Search design policy.
- Production/provider/security/scale non-claims.
- Phase status and exact evidence boundary.

### Architecture

- Modular-monolith shape and dependency direction.
- Request/auth/RBAC/ownership flow.
- Checkout transaction and idempotency.
- Separate order/payment/fulfillment/COD states.
- Webhook, refund, outbox, SMTP and in-app flows.
- Provider/customization boundaries.
- Legacy retirement and ADR history.

### Database schema

- Complete ERD/model/enum registry.
- State transitions and money/snapshot rules.
- Prisma and raw-SQL indexes/check constraints.
- Delete/cascade and financial-retention risk.
- Migration history, retention, backup/restore and rollback policy.

### API

Every supported method requires:

- actor/auth and ownership;
- method/path;
- request/query/header/body constraints;
- success output/status;
- specific errors;
- idempotency/cache/side-effect notes where relevant।

Explicit retired `410` contracts remain documented until consumers are removed
and a separately approved compatibility decision deletes them.

### Feature/admin/customization

- Customer and operator workflow, prerequisites and edge cases.
- COD enablement/eligibility/collection.
- `MOCK` versus production provider distinction.
- Configurable versus environment-only versus adapter/code changes.
- Business/branding/content/delivery/catalog configuration.
- Hero/Search protected scope and design-system neutrality.
- Unsupported multi-vendor/runtime multi-tenant scope.

### Deployment/operations/release

- Runtime and secret classification.
- Migrations, backups, restore and rollback.
- Worker authentication, schedule, retry/lock and replay.
- Account SMTP versus commerce outbox email behavior.
- COD/provider reconciliation and incidents.
- Monitoring, release smoke and go/no-go.

## Current residual documentation work

These documents describe missing production integrations without claiming them
implemented. When the integration exists, evidence must be added:

| Future integration/hardening    | Required documentation evidence                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Real payment provider           | Adapter/config, secret names, sandbox/webhook/refund cases, reconciliation and disable/rollback |
| Object storage/CDN              | Upload/delete/signing, tenancy/path policy, size/type, lifecycle and disaster recovery          |
| Shared rate limit/trusted proxy | Trust topology, canonical client identity, shared-store/WAF behavior and alerts                 |
| CSP nonce/hash                  | Request propagation, framework compatibility and browser evidence                               |
| Admin pagination at scale       | Page/cursor/limit contract, totals/truncation UX and performance budget                         |
| SMTP provider                   | Sender-domain auth, test delivery, bounce/rejection and alert evidence                          |
| External scheduler              | Platform definition, secret rotation, cadence, concurrency, backlog alerts and incident steps   |
| Production database             | Backup/PITR retention, RPO/RTO and isolated restore rehearsal                                   |

## Documentation verification matrix

| Gate                 | Required check                                       | Current position                            |
| -------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Formatting           | Prettier check on current docs                       | Run during this refresh                     |
| Internal links       | Every relative link resolves                         | Run during this refresh                     |
| API drift            | Source method/path set equals documented set         | 82 files / 117 methods mechanically matched |
| Schema drift         | Prisma model/enum set equals docs                    | 43 models / 23 enums mechanically matched   |
| Migration drift      | Directory list matches schema docs/evidence          | 8 migrations recorded                       |
| Mermaid/fences       | Balanced fenced blocks; diagrams reviewable          | Structural check required                   |
| Commands             | Testing/deployment commands exist in package scripts | Cross-check required                        |
| Admin walkthrough    | Operator follows admin/COD/order/support procedures  | Pending final browser gate                  |
| Customer walkthrough | Catalog/cart/checkout/COD/order/review/support       | Pending final browser gate                  |
| Visual/a11y          | Hero/Search, responsive, RTL, accessibility          | Pending final Playwright gate               |
| Release record       | Exact commit and signed go/no-go                     | Pending                                     |

## Phase 9 documentation exit gate

Documentation phase may be marked `Complete` only when:

1. current source route/schema/migration inventories match docs;
2. all relative links and formatting pass;
3. executable commands are valid against package scripts;
4. final customer/admin/browser journeys match feature/admin docs;
5. Hero/Search visual and accessibility evidence passes;
6. production-provider/deployment assumptions remain explicitly unverified or
   receive real certification evidence;
7. exact release commit/worktree scope is recorded;
8. Release Checklist receives terminal go/no-go decisions।

At present items 4, 5, 7 and 8 depend on the active parent/browser/final gates;
therefore Phase 9 remains `In Progress`.

## Maintenance rule

Documentation work cannot be deferred to an unspecified cleanup when a change
alters public behavior, schema, API, configuration, environment, security,
provider boundary or operator workflow. A file existing is not sufficient:
source traceability, verification and the appropriate release gate must remain
current.
