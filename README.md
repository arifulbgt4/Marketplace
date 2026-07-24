# Reusable B2C Marketplace

A single-business B2C marketplace foundation built with Next.js 15, React,
TypeScript, PostgreSQL, Prisma, NextAuth, next-intl and MUI.

The repository currently implements customer commerce and an operational admin
console: catalog, inventory, cart, checkout, Cash on Delivery (COD), a mock
online-payment adapter, order lifecycle, delivery, coupons, reviews, wishlist,
notifications, support requests, reports, audit history and configurable
business/branding/content settings.

## Scope

- One deployment serves one B2C business.
- Business identity, branding, catalog, payments, delivery and homepage content
  are configurable.
- The core does not include marketplace commissions, seller onboarding,
  settlements or payouts. Multi-vendor commerce is explicitly out of core and
  requires a separate architecture.
- `MOCK` is the only implemented online-payment adapter. It exists for local
  development, automated testing and provider-contract validation. It is not a
  production payment gateway.
- COD is a first-class payment method. Order, payment and fulfillment statuses
  remain separate.

## Documentation

| Need                                           | Document                                           |
| ---------------------------------------------- | -------------------------------------------------- |
| Local prerequisites, environment and first run | [Environment setup](docs/ENVIRONMENT_SETUP.md)     |
| Customer and commerce behavior                 | [Feature guide](docs/FEATURE_GUIDE.md)             |
| Admin/operator procedures                      | [Admin guide](docs/ADMIN_GUIDE.md)                 |
| Rebranding and adapting for another business   | [Customization guide](docs/CUSTOMIZATION_GUIDE.md) |
| Production release and rollback                | [Deployment guide](docs/DEPLOYMENT_GUIDE.md)       |
| Live operations and incidents                  | [Operations runbook](docs/OPERATIONS_RUNBOOK.md)   |
| System boundaries and module design            | [Architecture](docs/ARCHITECTURE.md)               |
| Database models, statuses and migrations       | [Database schema](docs/DATABASE_SCHEMA.md)         |
| HTTP inputs, auth, output and errors            | [API documentation](docs/API_DOCUMENTATION.md)     |
| Reproducible local/CI verification             | [Testing guide](docs/TESTING_GUIDE.md)             |
| Release go/no-go and smoke checks              | [Release checklist](docs/RELEASE_CHECKLIST.md)     |
| Detailed backlog and evidence gates            | [Task plan](docs/TASK_PLAN.md)                     |

## Quick start

Prerequisites:

- Node.js `22.x` (`.nvmrc` and `package.json` agree)
- pnpm
- Docker with Compose, or an accessible PostgreSQL 15-compatible database

```bash
pnpm install
cp .env.example .env
pnpm db:start
pnpm db:migrate:prod
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000`. Local PostgreSQL is exposed on port `5433` by
default. To use a different host port, set `MARKETPLACE_DB_PORT` and update both
database URLs to the same port.

`pnpm db:seed` creates development-only identities and sample catalog data.
Never run the sample seed against production, and never reuse its credentials.

The convenience command below installs dependencies, starts PostgreSQL, deploys
migrations and seeds the local database:

```bash
pnpm setup:local
```

## Quality gates

```bash
pnpm env:check
pnpm exec prisma validate
pnpm format:check
pnpm lint
pnpm type-check
pnpm test:unit
pnpm test:integration
pnpm build
pnpm test:e2e
```

The database integration suite requires a disposable database and is enabled by
`RUN_DB_TESTS=true`; use the provided script rather than pointing it at shared
or production data.

## Common commands

| Command                          | Purpose                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `pnpm dev`                       | Validate environment, generate Prisma Client and start Next.js |
| `pnpm build`                     | Validate environment, generate Prisma Client and build         |
| `pnpm start`                     | Start an existing production build                             |
| `pnpm db:start` / `pnpm db:stop` | Start or stop local PostgreSQL                                 |
| `pnpm db:migrate`                | Create/apply a development migration                           |
| `pnpm db:migrate:prod`           | Deploy committed migrations                                    |
| `pnpm db:seed`                   | Seed local/demo data                                           |
| `pnpm db:studio`                 | Open Prisma Studio                                             |
| `pnpm pgadmin:start`             | Start optional pgAdmin on port `5050`                          |
| `pnpm test:run`                  | Run the Vitest suite once                                      |
| `pnpm test:a11y`                 | Run Playwright accessibility coverage                          |
| `pnpm test:e2e`                  | Run browser, accessibility and visual contracts                |

Commands containing `reset`, `clean` or Docker volume removal are destructive.
Do not use them on data that must be retained.

## Runtime operations

Transactional events are written to `OutboxEvent` in the same database
transaction as commerce state changes. A scheduler must periodically call:

```text
POST /api/internal/outbox
Authorization: Bearer <OUTBOX_WORKER_SECRET>
```

That worker publishes in-app notifications and SMTP email, retries transient
failures and records terminal failures. The application does not create its own
cron schedule.

Online payment callbacks enter through:

```text
POST /api/payment/webhook?provider=MOCK
```

The current mock adapter requires an HMAC signature in `x-mock-signature`. A
real provider must implement the existing adapter contract, signature
verification, intent/refund semantics and reconciliation tests before online
payments are enabled in production.

## Design and customization contract

The homepage visual composition is protected, especially:

- `src/app/[locale]/(WrappedPages)/page.tsx`
- `src/widgets/SearchBanner/index.tsx`
- `src/forms/SearchFilterForm/index.tsx`

Hero and Search placement, hierarchy, responsive character and visual identity
must not materially change without explicit product approval and a new visual
baseline. Their copy and data may be made business-specific while preserving
that rendered contract.

Other screens may be redesigned for the target product and business. MUI is the
current implementation, not a restriction: MUI, another design system or custom
UI are all acceptable when accessibility, responsiveness, shared tokens and
coherent interaction patterns are maintained.

Business-specific rules must be settings, data or adapter policy—not scattered
conditionals or hardcoded names, currency symbols, categories, payment methods
or delivery fees.

## Security notes

- Keep database, auth, SMTP, worker and provider credentials in the deployment
  secret manager; never commit `.env`.
- Configure all required SMTP fields together.
- Use a unique, high-entropy `NEXTAUTH_SECRET`, mock/provider webhook secret and
  outbox worker secret per environment.
- Admin navigation is not an authorization boundary. Server routes and services
  enforce roles; do not weaken those checks when customizing UI.
- Back up and test restore before every schema-bearing production release.

See the [Deployment guide](docs/DEPLOYMENT_GUIDE.md) for the complete production
runbook.
