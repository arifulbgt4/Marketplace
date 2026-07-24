# Marketplace Testing Guide

## Purpose

This guide defines the reproducible quality gates for the reusable B2C
marketplace. A feature is not complete merely because a page or route exists;
its relevant static, unit, integration, browser, accessibility, visual, and
operational checks must pass.

## Prerequisites

- Node.js 22.x (`.nvmrc` and `package.json` are authoritative)
- pnpm 10.12.3 or a compatible pnpm 10 release
- PostgreSQL 15 for database-backed and browser suites
- Chromium installed through Playwright for browser tests
- a local environment based on `.env.example`, with no production secrets

Install dependencies and the browser once:

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

## Test layers and commands

| Layer | Command | Scope |
| --- | --- | --- |
| Environment contract | `pnpm env:check` | Required variables, secret length, SMTP grouping, worker bounds |
| Formatting | `pnpm format:check` | Repository formatting |
| Lint | `pnpm lint` | JavaScript/TypeScript and Next.js rules |
| Type safety | `pnpm type-check` | Full TypeScript graph |
| Unit/contract | `pnpm test:unit` | Domain rules, handlers, providers, state machines |
| Coverage | `pnpm test:coverage` | Unit plus non-database contract coverage report |
| Database integration | `pnpm test:integration` | Real PostgreSQL transaction and concurrency behavior |
| Full Vitest | `pnpm test:run` | Unit suite; DB cases skip unless explicitly enabled |
| Browser E2E | `pnpm test:e2e` | COD, online-payment simulation, admin, visual, a11y |
| Accessibility only | `pnpm test:a11y` | Axe scans and RTL/header checks |
| Visual baseline update | `pnpm test:e2e:update` | Explicit protected screenshot review only |
| Production compile | `pnpm build` | Prisma generation and Next.js production build |

## Unit and contract tests

Tests live under `src/__tests__`. The suite uses Vitest, Testing Library, jsdom,
and deterministic factories under `src/test`.

Important coverage areas include:

- money conversion, rounding, pricing, coupon, tax, and delivery order;
- COD rule precedence, reason codes, availability changes, and collection;
- order, payment, fulfillment, cancellation, return, and shipment transitions;
- authentication, RBAC, ownership, disabled accounts, and safe errors;
- product visibility, search bounds, inventory reservation, and oversell;
- checkout idempotency and server-authoritative totals;
- signed webhook replay/out-of-order behavior, reconciliation, and refund;
- outbox retry/locking, in-app notification, SMTP failure, and support requests;
- locale key parity, SEO metadata, retired legacy routes, and module boundaries.

Mocked unit dependencies prove boundary behavior, not database correctness.
Database-sensitive acceptance criteria must also run the integration suite.

## PostgreSQL integration suite

Use a database created only for tests. Never point this command at production.

```bash
export POSTGRES_PRISMA_URL='postgresql://USER:PASSWORD@HOST:PORT/marketplace_test'
export POSTGRES_URL_NON_POOLING="$POSTGRES_PRISMA_URL"
pnpm db:migrate:prod
pnpm db:seed
pnpm test:integration
```

`test:integration` sets `RUN_DB_TESTS=true`. The test database may be mutated by
the suite and must be disposable or isolated from normal development.

## Browser, COD, payment, and admin E2E

The managed Playwright mode starts the application, migrates and seeds the E2E
database, and then stops the server:

```bash
E2E_MANAGE_SERVER=true \
E2E_DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/marketplace_e2e' \
E2E_BASE_URL='http://127.0.0.1:3100' \
pnpm test:e2e
```

The E2E database is shared by the desktop and mobile projects, so the
configuration serializes workers. This protects cart, inventory, order, and
seeded-user state from test-to-test races.

The online-payment journey uses the signed `MOCK` adapter and is a deterministic
provider-contract test. It does not certify a live payment provider. A business
must run the selected provider's sandbox and webhook certification before
production activation.

## Visual contract

Homepage composition, Hero, and Search are the strict protected visual scope.
Snapshots are stored below `e2e/snapshots` using platform-neutral names.

- Do not update snapshots to hide an unexplained difference.
- Review desktop and mobile images before accepting a baseline.
- Copy, product terminology, and functional search behavior may change
  intentionally while the established composition remains protected.
- Other storefront/admin surfaces are reviewed for coherent responsive and
  accessible behavior; they are not locked to legacy rental pixels.

To accept an intentional protected change:

1. verify product/design approval and the documented design boundary;
2. run `pnpm test:e2e:update` against an isolated database;
3. inspect both generated images;
4. run the normal `pnpm test:e2e` gate without update mode.

## Accessibility

The browser suite runs Axe against the homepage, catalog, and sign-in surfaces
on desktop and mobile. Critical and serious violations must be zero. It also
checks RTL rendering and security headers.

Manual release smoke tests must include:

- keyboard-only navigation and visible focus;
- form labels, inline errors, and password controls;
- dialog/drawer focus behavior;
- screen-reader names for icon buttons and filters;
- branded color contrast;
- responsive zoom and RTL layout.

## Coverage

`pnpm test:coverage` writes ignored artifacts under `coverage/` and prints a
summary. Coverage is evidence, not a substitute for risk-based scenarios. New
financial, authorization, lifecycle, or provider logic requires direct positive
and negative tests even when aggregate coverage is unchanged.

## CI behavior

`.github/workflows/nextjs.yml` uses Node.js 22 and PostgreSQL 15. It performs:

1. frozen dependency install and environment validation;
2. Prisma validation, migration, and generic seed;
3. format, lint, type, coverage, and DB integration gates;
4. production build;
5. Playwright Chromium installation;
6. browser, accessibility, and visual gates;
7. failure-artifact upload for Playwright evidence.

Local results under a different Node major are diagnostic only. Release
authority belongs to the declared Node.js 22 environment.

## Failure handling

- Reproduce the exact failing command and preserve its output.
- Inspect the source route/service and the browser trace or DB state.
- Do not convert a failed test into a skip or weaken an assertion without an
  approved scope decision.
- A waiver must record owner, reason, risk, expiry date, and compensating
  control in the release record.
- Secrets, customer PII, raw payment payloads, and database dumps must not be
  committed as evidence.

## Minimum release sequence

```text
pnpm env:check
pnpm exec prisma validate
pnpm format:check
pnpm lint
pnpm type-check
pnpm test:coverage
pnpm test:integration
pnpm build
pnpm test:e2e
fresh migration and backup/restore rehearsal
operator smoke checklist
```

See `RELEASE_CHECKLIST.md` and
`evidence/phase-9/MIGRATION_REHEARSAL.md` for the operational gates.
