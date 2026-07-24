# Marketplace Release Checklist

## Release record

Fill this section for every staging or production release.

| Field | Value |
| --- | --- |
| Version/tag | |
| Commit SHA | |
| Environment | Staging / Production |
| Release owner | |
| Product owner | |
| SQA reviewer | |
| Start time | |
| Decision | Go / No-go / Rolled back |

## 1. Scope and change control

- [ ] Release commit is identified and immutable.
- [ ] User-facing behavior, schema, API, environment, and operator changes are documented.
- [ ] Unsupported multi-vendor or live-provider capability is not advertised.
- [ ] Homepage/Hero/Search protected composition has approved visual evidence.
- [ ] No unrelated or unreviewed worktree changes are included.

## 2. Runtime and secrets

- [ ] Node.js 22.x and the locked pnpm version are used.
- [ ] All required environment variables pass `pnpm env:check`.
- [ ] `NEXTAUTH_SECRET`, database credentials, SMTP credentials, payment secrets, and `OUTBOX_WORKER_SECRET` come from the deployment secret store.
- [ ] Placeholder, local, E2E, and CI-only secrets are absent.
- [ ] Public domain, NextAuth URL, currency, locale, and marketplace name match the business.
- [ ] Partial SMTP configuration is rejected.
- [ ] Production uses a real approved payment adapter; `MOCK` is disabled.

## 3. Data and migration

- [ ] A pre-deployment PostgreSQL backup exists.
- [ ] Restore has been rehearsed and the backup retention location is known.
- [ ] `prisma validate` passes.
- [ ] `prisma migrate deploy` is reviewed against the exact release commit.
- [ ] Migration status contains no failed or rolled-back entry.
- [ ] Generic seed is used only when appropriate; production business data is not overwritten.
- [ ] Legacy listing/booking tables remain archived and are not destructively reinterpreted.
- [ ] Post-migration table, row-count, and key invariant checks are prepared.

## 4. Quality gates

- [ ] Frozen dependency installation succeeds.
- [ ] `pnpm format:check` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm type-check` passes.
- [ ] `pnpm test:coverage` passes.
- [ ] `pnpm test:integration` passes against PostgreSQL.
- [ ] `pnpm build` passes in the production environment contract.
- [ ] `pnpm test:e2e` passes for desktop and mobile.
- [ ] Critical/serious automated accessibility violations are zero.
- [ ] Strict homepage visual snapshots pass.
- [ ] Security/RBAC/IDOR/payment/query-cost review has no unresolved high severity finding.

## 5. Business configuration

- [ ] Business identity, contact information, currency, timezone, and SEO defaults are verified.
- [ ] Branding meets accessible contrast and asset requirements.
- [ ] Product categories, published products, variants, SKU, price, media, and stock are verified.
- [ ] Delivery zones/methods cover intended destinations and reject unsupported locations.
- [ ] COD enabled/disabled state and location/product/amount/zone rules are previewed.
- [ ] Online payment method visibility matches the configured production adapter.
- [ ] Coupons and homepage content have correct schedules and scopes.
- [ ] Admin, support, and customer accounts have least-privilege roles.

## 6. Deployment and workers

- [ ] Application deployment uses the exact built commit.
- [ ] Health and authenticated smoke routes respond successfully.
- [ ] Payment webhook URL, signature secret, body limits, and provider retries are configured.
- [ ] Outbox worker calls the protected internal endpoint with a rotated secret.
- [ ] Worker retry, attempt, batch, and stale-lock settings are reviewed.
- [ ] SMTP sender/domain authentication and a test delivery are verified.
- [ ] Logs, metrics, error alerts, database monitoring, and backup alerts are active.
- [ ] Rate limiting or WAF is shared across production instances; the in-process fallback is not treated as a distributed control.

## 7. Release smoke journeys

- [ ] Guest can browse, search, filter, sort, and view a published product.
- [ ] Customer registration/sign-in/recovery paths behave correctly.
- [ ] Cart add/update/remove and totals are server-authoritative.
- [ ] COD checkout creates an order without a gateway redirect and shows `PENDING_COLLECTION`.
- [ ] Ineligible COD disappears after relevant cart/address/rule changes.
- [ ] Admin can confirm, ship, deliver, and collect the exact COD amount with idempotency.
- [ ] Online sandbox payment success, failure, cancellation, webhook, and reconciliation are verified.
- [ ] Customer order history/detail and allowed cancellation work without IDOR.
- [ ] Admin product, inventory, order, settings, support, report, and audit surfaces work.
- [ ] Wishlist, verified review, notifications, and support request work.
- [ ] Homepage Hero/Search composition, mobile layout, keyboard use, and RTL smoke checks pass.

## 8. Go/no-go rules

Release is **No-go** when any of these is true:

- migration or backup restore is unverified;
- a high-severity security, payment, order, inventory, or PII issue is open;
- COD or payment state can diverge from the order without reconciliation;
- production build, DB integration, critical E2E, visual, or accessibility gate fails;
- required secret/provider/worker/SMTP configuration is missing;
- protected homepage visual scope changed without approval.

## 9. Monitoring window

- [ ] Observe authentication, catalog latency, checkout errors, order placement, and inventory conflicts.
- [ ] Reconcile payment provider events, payments, orders, and COD collection.
- [ ] Monitor outbox backlog, retry count, notification failures, and SMTP rejection.
- [ ] Monitor database connections, slow queries, storage, and backup completion.
- [ ] Review support requests and customer-impact reports during the release window.

## 10. Rollback or containment

Immediate containment options:

1. disable new checkout/payment method or affected content through configuration;
2. stop order writes if financial or inventory integrity is uncertain;
3. preserve logs, audit events, payment events, and outbox state;
4. deploy the last known-good new-schema-compatible release;
5. if the schema/data is compromised, restore the verified pre-release backup
   into a clean database and point the last known-good application to it;
6. reconcile before reopening traffic.

Do not run destructive resets or down migrations in production. New commerce
orders must never be forced back into legacy booking semantics.

## Waiver record

Mandatory financial, security, migration, build, DB integration, browser,
visual, and accessibility gates should not be waived. If an organization
accepts another exception, record it here.

| Item | Owner | Reason | Risk | Compensating control | Expiry |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Final decision

| Role | Name | Date | Decision |
| --- | --- | --- | --- |
| Release owner | | | Go / No-go |
| Product owner | | | Go / No-go |
| SQA reviewer | | | Go / No-go |
