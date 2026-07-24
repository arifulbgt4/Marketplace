# Environment Setup

Verified against the repository on 2026-07-25.

## Prerequisites

- Node.js `22.x`
- pnpm CLI (use the version selected for this repository/CI)
- Docker Compose for the default local PostgreSQL 15 container, or an external
  PostgreSQL database

Confirm the toolchain:

```bash
node --version
pnpm --version
docker compose version
```

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm env:check
pnpm db:start
pnpm db:migrate:prod
pnpm db:seed
pnpm dev
```

`pnpm dev` and `pnpm build` both run `env:check` and `prisma generate`.

The default Docker database is:

| Setting   | Local value        |
| --------- | ------------------ |
| Host      | `localhost`        |
| Host port | `5433`             |
| Database  | `marketplace`      |
| User      | `marketplace_user` |

The sample password is intentionally kept in Docker configuration for local
development only. Do not reuse any local value in production.

To change the local database port:

```bash
MARKETPLACE_DB_PORT=5435 pnpm db:start
```

Then use port `5435` in both PostgreSQL URLs.

## Environment variables

The table documents names and intent without supplying secrets.

| Variable                         | Required          | Purpose                                                                              |
| -------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `POSTGRES_PRISMA_URL`            | Yes               | Prisma runtime URL; pooled URL is acceptable when the provider supports it           |
| `POSTGRES_URL_NON_POOLING`       | Yes               | Direct database URL for migrations and operations requiring a direct connection      |
| `NEXTAUTH_SECRET`                | Yes               | At least 32 characters; signs/authenticates session material                         |
| `NEXTAUTH_URL`                   | Yes               | Absolute canonical auth origin                                                       |
| `NEXT_PUBLIC_DOMAIN_URL`         | Yes               | Absolute public site origin, normally with a trailing slash                          |
| `NEXT_PUBLIC_MARKETPLACE_NAME`   | Yes               | Public fallback marketplace name                                                     |
| `MARKETPLACE_DB_PORT`            | Local Docker only | Host port mapped to PostgreSQL; defaults to `5433`                                   |
| `NEXT_PUBLIC_MAPBOX_TOKEN`       | Optional          | Mapbox-powered legacy location/search features                                       |
| `NEXT_PUBLIC_CURRENCY_CODE`      | Optional          | Three-letter storefront currency fallback; defaults to `USD`                         |
| `NEXT_PUBLIC_CURRENCY_SYMBOL`    | Optional          | Legacy display fallback; prefer locale-aware currency formatting                     |
| `NEXT_PUBLIC_CURRENCY_LOCALE`    | Optional          | Currency formatting locale; defaults to `en-US`                                      |
| `NEXT_PUBLIC_MAX_PRICE`          | Optional          | Search/filter maximum; defaults to `100000`                                          |
| `NEXT_PUBLIC_SEARCH_DEBOUNCE_MS` | Optional          | Search debounce interval; defaults to `300`                                          |
| `RATE_LIMIT_WINDOW_MS`           | Optional          | Generic rate-limit window; defaults to 15 minutes                                    |
| `RATE_LIMIT_MAX`                 | Optional          | Generic request count per window; defaults to `100`                                  |
| `MAX_UPLOAD_SIZE`                | Optional          | Upload byte limit; defaults to 10 MiB                                                |
| `SESSION_MAX_AGE`                | Optional          | Session lifetime in seconds; defaults to 30 days                                     |
| `SMTP_HOST`                      | Production email  | SMTP hostname                                                                        |
| `SMTP_PORT`                      | Optional          | SMTP port; defaults to `587`                                                         |
| `SMTP_SECURE`                    | Optional          | `true` for implicit TLS, otherwise `false`                                           |
| `SMTP_USER`                      | Production email  | SMTP username                                                                        |
| `SMTP_PASSWORD`                  | Production email  | SMTP credential                                                                      |
| `SMTP_FROM`                      | Production email  | Valid sender identity                                                                |
| `MOCK_PAYMENT_WEBHOOK_SECRET`    | Mock webhook only | At least 32 characters; signs the development/testing mock callback                  |
| `OUTBOX_WORKER_SECRET`           | Worker endpoint   | At least 32 characters; authenticates the internal outbox endpoint                   |
| `OUTBOX_WORKER_BATCH_SIZE`       | Optional          | Events claimed per run, `1..100`; defaults to `25`                                   |
| `OUTBOX_WORKER_MAX_ATTEMPTS`     | Optional          | Attempts before terminal failure, `1..20`; defaults to `5`                           |
| `OUTBOX_WORKER_RETRY_DELAY_MS`   | Optional          | Retry delay, minimum one second; defaults to 30 seconds                              |
| `OUTBOX_WORKER_LOCK_TIMEOUT_MS`  | Optional          | Reclaim timeout for abandoned locks; defaults to five minutes                        |
| `PRISMA_LOG_QUERIES`             | Diagnostic only   | Set to `true` to log Prisma queries; avoid in production unless temporarily required |
| `RUN_DB_TESTS`                   | Test only         | Enables the disposable database integration suite                                    |

SMTP configuration is all-or-nothing: `SMTP_HOST`, `SMTP_USER`,
`SMTP_PASSWORD` and `SMTP_FROM` must be supplied together. Production signup,
verification, recovery and commerce email should not rely on development
preview links.

## Database lifecycle

Use committed migrations for shared and production environments:

```bash
pnpm exec prisma validate
pnpm db:migrate:prod
```

Use `pnpm db:migrate` only while authoring a new migration in development.
`pnpm db:push` is not a substitute for an auditable production migration.

Local-only helpers:

```bash
pnpm db:status
pnpm db:studio
pnpm pgadmin:start
```

Destructive commands:

```bash
pnpm db:reset
pnpm db:migrate:reset
pnpm docker:clean
```

They remove data and must never target production.

## Development seed

`prisma/seed.ts` creates sample users, categories, products, inventory, delivery
configuration, COD rules and other fixtures for development. It contains
known development credentials. Treat all seeded identities as public test
fixtures, never as deployable operators.

## Outbox and email setup

The application stores event work in the database. It does not run a background
timer inside the web process. Configure an external scheduler to call:

```text
POST /api/internal/outbox
Authorization: Bearer <OUTBOX_WORKER_SECRET>
```

Recommended initial interval: every minute. Keep scheduler concurrency at one
until production throughput demonstrates a need for more; the worker has lock,
retry and idempotency protections, but operational simplicity is preferable.

Monitor returned counts:

- `claimed`
- `published`
- `retried`
- `failed`

Persistent retries or failures require investigation of SMTP/provider
availability and `OutboxEvent.lastError`.

## Verification

```bash
pnpm env:check
pnpm exec prisma validate
pnpm db:migrate:prod
pnpm type-check
pnpm test:unit
pnpm build
```

If environment validation fails, correct the named variable rather than
bypassing the gate.
