# Deployment Guide

This runbook is platform-neutral. A deployment needs Node.js 22, PostgreSQL,
persistent secret management, HTTPS and an external scheduler capable of
authenticated HTTP requests.

## Production prerequisites

- Node.js `22.x`
- immutable build from a reviewed commit
- production PostgreSQL with automated backup and tested restore
- separate runtime and direct/non-pooled database URLs
- canonical HTTPS domain
- unique auth, SMTP, outbox and payment-provider secrets
- SMTP sender authenticated for the production domain
- external outbox schedule
- monitoring for web errors, database, webhook and outbox failures

The current `MOCK` payment adapter is development/testing only. Keep online
payment disabled until a real provider is implemented and accepted.

## Release inputs

Record:

- commit SHA and artifact identifier;
- migration directories included in the release;
- configuration changes;
- operator/approver;
- backup identifier and restore verification;
- rollout window and rollback owner;
- known risks/waivers with expiry.

## Pre-deployment gates

Against an isolated database:

```bash
pnpm install --frozen-lockfile
pnpm env:check
pnpm exec prisma validate
pnpm db:migrate:prod
pnpm format:check
pnpm lint
pnpm type-check
pnpm test:coverage
pnpm test:integration
pnpm build
pnpm test:e2e
```

Do not mark the release ready if a required gate is failed or unverified.

## Environment

Configure variables from [Environment setup](ENVIRONMENT_SETUP.md) in the
platform secret/config store. Never upload a repository `.env`.

Required production groups:

- PostgreSQL runtime and direct URLs;
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`;
- public domain and marketplace name;
- complete SMTP group;
- `OUTBOX_WORKER_SECRET` and worker tuning;
- real payment provider settings/secrets after an adapter exists.

Use different secrets for preview/staging/production.

## Database migration

1. Stop incompatible writers or enable maintenance mode when a migration is not
   backward compatible.
2. Take and identify a production backup.
3. Confirm restore has been tested recently.
4. Run:

   ```bash
   pnpm exec prisma validate
   pnpm db:migrate:prod
   ```

5. Verify migration status and application database connectivity.
6. Do not run the sample seed in production.

Prefer expand/migrate/contract changes across releases. A code rollback cannot
automatically reverse a destructive schema migration.

## Build and start

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

The build validates environment and generates Prisma Client. Build the exact
commit that will run; do not mutate dependencies after the artifact is created.

## Outbox schedule

Configure a server-side cron/scheduler to call every minute initially:

```text
POST https://<production-domain>/api/internal/outbox
Authorization: Bearer <OUTBOX_WORKER_SECRET>
```

Do not expose the secret to browsers or logs. Alert on:

- non-2xx response;
- repeated `retried`;
- nonzero/persistent `failed`;
- growing old `PENDING` events;
- stale `PROCESSING` locks.

SMTP email and in-app notifications are published by this worker. There is no
in-process scheduler.

## Payment webhook

For the current test adapter:

```text
POST /api/payment/webhook?provider=MOCK
```

It requires an HMAC signature and is not a production payment endpoint.

For a real provider:

1. register the adapter;
2. configure provider webhook URL and secret;
3. use raw-body signature verification;
4. enforce payload size;
5. confirm idempotent replay;
6. reconcile amount, currency, provider reference and state;
7. test delayed/out-of-order callbacks;
8. monitor webhook failures and provider dashboard differences.

## Rollout sequence

1. Deploy to staging with production-like configuration and isolated services.
2. Run customer sign-up/verification/recovery.
3. Run catalog/search/cart/wishlist.
4. Run address, delivery, coupon and checkout.
5. Run COD order, fulfillment and collection.
6. Run payment adapter test, cancellation, return and refund.
7. Run review moderation, notifications and support.
8. Verify admin reports/audit.
9. Verify homepage Hero/Search visual contract at mobile, tablet, desktop, wide
   and Arabic RTL.
10. Deploy production with a small observation window before broad traffic.

## Production smoke test

- `/` and locale homepage render with protected Hero/Search visual identity.
- Catalog/category/product routes return expected published data.
- Sign-in and protected account redirect correctly.
- Admin APIs reject unauthorized users.
- Cart and wishlist work.
- Checkout lists only eligible payment methods.
- COD creates `PENDING_COLLECTION`, not `PAID`.
- Online payment is disabled unless a real provider is active.
- Order, payment and fulfillment statuses remain independent.
- Admin order transition and shipment work.
- SMTP and in-app event appear after worker run.
- Review moderation controls public visibility.
- Support request receives a reference and appears in the queue.
- Reports/audit load without exposing secrets.

## Monitoring

Monitor:

- HTTP error rate/latency and authentication failures;
- PostgreSQL connections, locks, storage and backup status;
- checkout/order placement conflicts and inventory shortages;
- payment webhook signature/reconciliation errors;
- COD amount anomalies and duplicate attempts;
- outbox age, retries and failures;
- SMTP rejection/bounce;
- support backlog and urgent unassigned requests;
- unexpected admin audit actions.

Logs must not contain auth secrets, database URLs, SMTP credentials, webhook
signatures, customer passwords or full payment data.

## Rollback

### Application-only rollback

Use when the previous code is compatible with the current schema:

1. stop/limit traffic if correctness is at risk;
2. redeploy the previous immutable artifact;
3. keep the outbox scheduler paused only if the old publisher cannot handle new
   event types;
4. rerun smoke checks;
5. reconcile orders/payments created during the window.

### Configuration rollback

Restore the previous versioned settings/secrets. For payment incidents, disable
the affected online method first; do not delete payment evidence.

### Database rollback

Do not automatically run down migrations. If schema/data corruption requires
restore:

1. stop writers and scheduler;
2. preserve incident evidence;
3. restore the named pre-release backup to a new instance where possible;
4. verify row counts, critical orders/payments and migration state;
5. point the application to the verified database;
6. reconcile external provider/COD events created after the backup.

Data created after the backup requires a deliberate recovery/reconciliation
plan.

## Incident containment

- Payment: disable online method; keep webhook evidence; reconcile provider.
- COD: stop collection permission/process; audit anomalies.
- Inventory: pause affected product publication/order acceptance.
- Email/outbox: keep committed events; fix provider; replay through worker.
- Auth/secret: rotate affected secret and invalidate sessions where applicable.
- Homepage regression: roll back artifact/content or use the last approved
  visual baseline.

After recovery, record timeline, impact, root cause, data reconciliation and
preventive actions.
