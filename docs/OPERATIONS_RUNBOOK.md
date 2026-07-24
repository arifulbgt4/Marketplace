# Marketplace Operations Runbook

## Status and operating boundary

এই runbook 2026-07-25-এর repository source, Prisma schema, migrations এবং
runtime configuration contract অনুযায়ী লেখা।

- **Implemented fact** — source বা committed migration-এ উপস্থিত।
- **Deployment-dependent** — operator/platform configuration ও live
  verification প্রয়োজন।
- **Known gap** — repository-তে automation বা production evidence নেই।

এই repository-তে production hosting, managed database, scheduler, SMTP
account, production payment provider, backup job বা monitoring integration
verified নয়। `MOCK` adapter production payment gateway নয়।

Companion documents:

- [Architecture](ARCHITECTURE.md)
- [Database schema](DATABASE_SCHEMA.md)
- [API documentation](API_DOCUMENTATION.md)
- [Environment setup](ENVIRONMENT_SETUP.md)
- [Deployment guide](DEPLOYMENT_GUIDE.md)

## Ownership model

প্রতি environment-এর release record-এ নাম বা team নির্ধারণ করতে হবে:

| Responsibility                               | Required owner            |
| -------------------------------------------- | ------------------------- |
| Release approval and rollback                | Release owner             |
| Database migration, backup and restore       | Database owner            |
| Authentication and secret rotation           | Security/platform owner   |
| Payment/COD reconciliation                   | Finance/operations owner  |
| Outbox, SMTP and customer notification       | Platform/operations owner |
| Customer order, shipment, return and support | Business operations owner |

Repository কোনো on-call roster নির্ধারণ করে না। Production launch-এর আগে
escalation path এবং contact channel আলাদাভাবে record করতে হবে।

## Runtime requirements

### Required application configuration

| Variable/group                 | Source contract        | Operating rule                                               |
| ------------------------------ | ---------------------- | ------------------------------------------------------------ |
| `POSTGRES_PRISMA_URL`          | PostgreSQL runtime URL | Secret store-এ রাখুন; application runtime-এর জন্য            |
| `POSTGRES_URL_NON_POOLING`     | Direct PostgreSQL URL  | Migration/administrative connection; browser-এ নয়            |
| `NEXTAUTH_SECRET`              | Minimum 32 characters  | Environment-unique; rotation session impactসহ পরিকল্পনা করুন |
| `NEXTAUTH_URL`                 | Absolute URL           | Deployed canonical auth origin-এর সঙ্গে exact match          |
| `NEXT_PUBLIC_DOMAIN_URL`       | Absolute URL           | Email links ও public origin                                  |
| `NEXT_PUBLIC_MARKETPLACE_NAME` | Non-empty string       | Public fallback name                                         |

### Conditional configuration

| Variable/group                                         | Current behavior                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | All-or-none; port defaults `587`, `SMTP_SECURE=false`                     |
| `OUTBOX_WORKER_SECRET`                                 | Worker চালাতে minimum 32 characters                                       |
| `MOCK_PAYMENT_WEBHOOK_SECRET`                          | Test-only mock webhook চালাতে minimum 32 characters                       |
| Outbox tuning                                          | Batch `1..100`, attempts `1..20`, retry `1s..24h`, lock timeout `10s..1h` |

Public currency, search, upload-size, session and Mapbox values-এর complete
registry [Environment setup](ENVIRONMENT_SETUP.md)-এ আছে। Secret কখনও settings
JSON, client bundle, logs বা source control-এ রাখা যাবে না।

### Environment validation

Application start বা build-এর আগে:

```bash
pnpm env:check
pnpm exec prisma validate
```

`pnpm dev` এবং `pnpm build` নিজেরাও environment validation ও Prisma Client
generation চালায়। Validation bypass করে release করা যাবে না।

## Release procedure

### Pre-release evidence

Release record-এ রাখুন:

- exact commit SHA এবং immutable artifact identifier;
- included migration directory list;
- environment/settings changes;
- named database backup;
- gate results, approver, rollout window এবং rollback owner;
- open risk/waiver, owner এবং expiry।

Isolated production-like environment-এ baseline gates:

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

কোনো failed বা unverified required gate-কে passed ধরা যাবে না।

### Deployment sequence

1. নতুন writes-এর সঙ্গে migration backward-compatible কি না যাচাই করুন।
2. Named backup নিন এবং recent restore rehearsal evidence confirm করুন।
3. প্রয়োজন হলে incompatible writer/worker pause করুন।
4. `pnpm db:migrate:prod` দিয়ে committed migrations deploy করুন।
5. Exact reviewed artifact deploy করুন।
6. Application, database এবং auth smoke check করুন।
7. Catalog, cart, checkout, COD, order ও admin smoke check করুন।
8. Worker trigger করুন এবং outbox result observe করুন।
9. SMTP/provider callback live check কেবল approved staging/production
   credentials দিয়ে করুন।
10. Observation window শেষে release result record করুন।

Sample seed production-এ চালানো যাবে না।

## Application smoke matrix

| Area           | Minimum check                                                                               |
| -------------- | ------------------------------------------------------------------------------------------- |
| Public UI      | Homepage, locale, protected Hero/Search visual identity                                     |
| Catalog        | Published category/product/search/suggestion                                                |
| Auth           | Sign-in, verification, recovery, protected redirect                                         |
| Customer       | Profile, address, cart merge, wishlist, notification                                        |
| Checkout       | Address, delivery, coupon এবং payment eligibility revalidation                              |
| COD            | Eligible order creates `PENDING_COLLECTION`, never `PAID`                                   |
| Online         | Disabled unless a reviewed registered provider exists; repository currently has only `MOCK` |
| Order          | Order/payment/fulfillment states change independently                                       |
| Operations     | Transition, shipment, return, cancellation, COD collection, refund                          |
| Admin          | Catalog, inventory, settings, audit and reports enforce role                                |
| Support/review | PII staff-only; moderation controls public visibility                                       |
| Legacy         | Retired listing/review/order-create methods return explicit `410`                           |

Production reachability ও external callback এই documentation audit-এ run করা
হয়নি।

## Transactional outbox operation

### Trigger contract

Worker web process-এর মধ্যে self-schedule করে না। External scheduler-কে
protected server-side channel থেকে call করতে হবে:

```text
POST https://<domain>/api/internal/outbox
Authorization: Bearer <OUTBOX_WORKER_SECRET>
```

Initial cadence: প্রতি minute একটি invocation। Current worker:

- `PENDING` এবং stale `PROCESSING` event conditionally claim করে;
- claim-এর সময় attempt increment করে;
- in-app notification প্রথমে, SMTP publisher শেষে চালায়;
- success-এ `PUBLISHED`;
- transient failure-এ delayed `PENDING`;
- maximum attempts-এ `FAILED`;
- response-এ `claimed`, `published`, `retried`, `failed` count দেয়।

Scheduler definition repository-তে নেই; deployer-কে তৈরি ও monitor করতে হবে।
Concurrent scheduler শুরু করার আগে throughput/load evidence নিন।

### Monitoring queries

Read-only PostgreSQL diagnostics:

```sql
SELECT "status", COUNT(*) AS event_count, MIN("createdAt") AS oldest_created
FROM "OutboxEvent"
GROUP BY "status"
ORDER BY "status";
```

```sql
SELECT "id", "eventType", "aggregateType", "aggregateId", "attempts",
       "availableAt", "lockedAt", "lockedBy", "lastError"
FROM "OutboxEvent"
WHERE "status" IN ('PENDING', 'PROCESSING', 'FAILED')
ORDER BY "availableAt" ASC
LIMIT 100;
```

Alert conditions:

- scheduler non-2xx বা invocation missing;
- old `PENDING` age continuously grows;
- `PROCESSING` lock configured timeout-এর চেয়ে পুরোনো;
- repeated `retried`;
- any persistent `FAILED`;
- SMTP rejection/provider lookup failure;
- `PUBLISHED` বৃদ্ধি পেলেও expected customer notification অনুপস্থিত।

Repository metrics exporter বা alert integration দেয় না।

### Failed event recovery

1. Scheduler থামাবেন না, যদি না bad publisher/data আরও ক্ষতি করছে।
2. `eventType`, aggregate identifiers, attempts এবং safe application logs দিয়ে
   root cause নির্ধারণ করুন।
3. Order/payment current state authoritativeভাবে পুনরায় পড়ুন; payload blindly
   trust করবেন না।
4. SMTP/config/code/data issue ঠিক করে staging-এ একই event family verify করুন।
5. Backup এবং change approval ছাড়া row পরিবর্তন করবেন না।
6. Approved manual replay হলে কেবল target `FAILED` row-কে নতুন schedule-এ
   `PENDING` করুন; payload/idempotency key বদলাবেন না।
7. Worker result, notification projection এবং recipient outcome reconcile
   করে incident record করুন।

Current source কোনো staff replay API দেয় না। Direct SQL replay একটি exceptional
database operation; bulk reset করা যাবে না। Unique
`Notification.sourceEventId` in-app duplicate ঠেকায় এবং email deterministic
message ID দেয়, কিন্তু downstream SMTP delivery exactly-once guarantee নয়।

### SMTP-specific behavior

Commerce publisher-এর current behavior:

- SMTP fully configured এবং provider rejects/returns no accepted recipient হলে
  worker retries।
- SMTP unconfigured হলে mailer network call করে না এবং
  `smtp-unconfigured` reason দেয়।
- Current publisher এই explicit reason-কে terminal delivery failure হিসেবে
  throw করে না; ফলে in-app projection-এর পরে event `PUBLISHED` হতে পারে, যদিও
  email পাঠানো হয়নি।
- Preference-disabled email একইভাবে skip হয়।

অতএব production-এ worker চালুর আগে SMTP group configure ও controlled recipient
delivery verify করা বাধ্যতামূলক। শুধু `PUBLISHED` status email delivery receipt
প্রমাণ করে না।

Account verification/recovery commerce outbox ব্যবহার করে না। এটি request-এর
মধ্যে direct SMTP call করে; failure server log-এ request IDসহ record হয় এবং
public endpoint enumeration-safe `202` রাখে। Non-production missing SMTP
preview URL দিতে পারে; production operation preview-এর ওপর নির্ভর করতে পারবে
না।

## Payment and COD operation

### Supported methods

- **Cash on Delivery:** implemented, rule-driven এবং online provider ছাড়াই
  order create করে।
- **Online:** adapter contract implemented; only `MOCK` registered. Production
  provider implemented বা verified নয়।

Payment-method settings-এ arbitrary provider key save করা সম্ভব হলেও adapter
registry-তে provider না থাকলে সেটি usable gateway নয়।

### COD invariants

Order, payment এবং fulfillment আলাদা state machine:

```text
Order.status             pending -> confirmed -> completed/cancelled
Order.fulfillmentStatus  UNFULFILLED -> PROCESSING -> SHIPPED -> DELIVERED
COD Payment.status       PENDING_COLLECTION -> COLLECTED
```

COD eligibility global enablement, amount, delivery zone, blocked
product/category, item quantity এবং optional verified phone rule দিয়ে
revalidate হয়। Admin collection:

- `admin` বা `support` role প্রয়োজন;
- `Idempotency-Key` প্রয়োজন;
- COD payment ও amount/currency match প্রয়োজন;
- collection evidence/reference append করে;
- order বা fulfillment-কে implicitভাবে completed করে না।

### COD reconciliation

Daily/shift reconciliation-এ:

1. `paymentMethod=CASH_ON_DELIVERY` এবং `PENDING_COLLECTION` orders list করুন।
2. Shipment/delivery evidence-এর সঙ্গে expected collectible amount মিলান।
3. Physical collection confirm হওয়ার আগে admin collect action চালাবেন না।
4. Duplicate request-এ same idempotency key ব্যবহার করুন।
5. Collected amount, currency, operator, receipt reference এবং audit record
   মিলান।
6. Delivered কিন্তু pending collection, অথবা collected কিন্তু cancelled/return
   হওয়া anomaly finance owner-এর কাছে escalate করুন।

COD cancellation/refund cash-handling policy application-এর বাইরে business
procedure দিয়েও নিয়ন্ত্রণ করতে হবে। Collected order cancellation automatic
cash refund করে না।

### Mock webhook operation

Test-only endpoint:

```text
POST /api/payment/webhook?provider=MOCK
x-mock-signature: sha256=<HMAC-SHA256>
```

Raw body 64 KiB-এর বেশি নয়। Signature `MOCK_PAYMENT_WEBHOOK_SECRET` দিয়ে
verify হয়। Event ID idempotency, provider reference, amount এবং lifecycle
transition reconcile হয়। Secret বা signature logs-এ রাখা যাবে না।

Production provider যোগ না হওয়া পর্যন্ত online payment disabled রাখুন।
Provider incident-এ online method disable করুন, webhook evidence preserve করুন
এবং external provider ledger-এর সঙ্গে application payment events reconcile
করুন; payment/order rows delete করবেন না।

## Database operation

### Migration

- Shared/production environment-এ শুধু committed migration এবং
  `pnpm db:migrate:prod` ব্যবহার করুন।
- `prisma db push`, reset, sample seed বা ad-hoc schema edit production-এ নয়।
- Expand/migrate/contract pattern prefer করুন।
- Destructive migration-এর আগে backup, restore proof, data migration check,
  compatibility window এবং explicit approval প্রয়োজন।
- Migration apply হওয়ার পরে migration state, critical row counts, order,
  payment, inventory এবং outbox smoke checks record করুন।

Current migration inventory ও SQL-only checks/indexes
[Database schema](DATABASE_SCHEMA.md)-এ আছে।

### Backup and restore

Repository backup job বা cloud retention policy implement করে না। Deployment
owner-কে externalভাবে নির্ধারণ করতে হবে:

- encrypted automated full backup;
- point-in-time recovery/window where supported;
- access control এবং separate failure domain;
- retention schedule aligned with legal/business policy;
- periodic restore rehearsal এবং evidence।

Restore rehearsal:

1. Named backup নতুন isolated database-এ restore করুন।
2. Database/schema version এবং all committed migrations match করুন।
3. Critical row counts ও order/payment/inventory/outbox constraints যাচাই করুন।
4. Application read-only smoke এবং তারপর controlled mutation চালান।
5. Recovery time, data-loss window, operator এবং result record করুন।

Production incident restore:

1. Writers, worker এবং provider mutation path contain করুন।
2. Incident evidence ও current database snapshot preserve করুন।
3. Prefer new database instance-এ restore।
4. Backup timestamp-এর পরের orders, payments, COD collections, shipments ও
   webhooks-এর reconciliation plan বানান।
5. Verified database-এ application point করুন।
6. Auth, checkout, order, payment এবং worker smoke test শেষে traffic resume
   করুন।

Restore automation বা production-like rehearsal repository-তে verified নয়।

## Rollback

### Application-only

Schema backward-compatible হলে previous immutable artifact redeploy করুন।
Worker কেবল তখন pause করুন যখন old publisher নতুন event type safeভাবে handle
করতে পারে না। Rollback-এর পরে orders/payments/outbox reconcile এবং smoke test
করুন।

### Configuration

Versioned previous settings restore করুন। Provider incident-এ online method
আগে disable করুন। Secret rollback-এর বদলে compromise হলে rotate করুন।

### Database

Prisma down migration automaticভাবে চালাবেন না। Destructive schema/data
failure-এ named backup restore process অনুসরণ করুন। Backup-এর পরের business
events manual reconciliation ছাড়া হারিয়ে গেছে ধরে নেওয়া যাবে না।

## Incident playbooks

| Symptom                        | Immediate containment                                                                        | Recovery evidence                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Authentication/secret exposure | Affected secret rotate; প্রয়োজন হলে `sessionVersion`/session policy দিয়ে sessions invalidate | Rotation time, affected environments, auth smoke           |
| Checkout/order conflict spike  | New checkout load limit; DB/stock/idempotency errors inspect                                 | No duplicate orders, inventory/coupon reconciliation       |
| COD anomaly                    | Collection action/process pause; affected order/payment audit                                | Physical receipt, payment event, operator and amount match |
| Payment webhook failure        | Online method disable if correctness at risk; evidence retain                                | Provider ledger vs payment event reconciliation            |
| Outbox backlog                 | Scheduler/config/DB/SMTP inspect; destructive bulk reset নয়                                  | Queue age returns to normal, failed events resolved        |
| SMTP rejection                 | Sender/config/provider fix; account flow and commerce flow separately test                   | Controlled accepted recipient and worker result            |
| Inventory mismatch             | Affected product ordering/publish contain                                                    | On-hand/reserved/ledger/order reservation reconcile        |
| Database corruption            | Writers and worker stop; restore to new instance                                             | Restore check, migration state, post-backup reconciliation |
| Homepage visual regression     | Last approved artifact/content revert                                                        | Hero/Search baseline across required viewports/RTL         |

## Security operation

- Worker, webhook, SMTP, database এবং auth secret পৃথক রাখুন।
- Secrets logs, audit payload, outbox payload, settings বা browser-এ প্রকাশ
  করবেন না।
- Worker endpoint-এ HTTPS, restricted scheduler egress এবং rate/network control
  যোগ করুন।
- Database least privilege, encrypted transit এবং audited operator access
  প্রয়োজন।
- Customer password, token, full payment data বা unnecessary support PII log
  করবেন না।
- In-memory rate limit multi-instance boundary রক্ষা করে না; edge/shared store
  ছাড়া production distributed enforcement দাবি করা যাবে না।
- Staff role/PII access এবং unusual COD/refund/audit actions monitor করুন।

## Retention and cleanup

Schema expiry/timestamp রাখলেও tokens, checkout sessions, notifications,
idempotency records, audit logs, outbox events, support records বা legacy
entities-এর automated cleanup job নেই। Legal, finance, fraud, support এবং
privacy owners policy approve না করা পর্যন্ত ad-hoc deletion করবেন না।
Financial/audit relations-এ cascade risk আছে; hard-delete-এর বদলে
archive/anonymization migration design করতে হবে।

## Deployment readiness checklist

- [ ] Exact commit/artifact এবং migration list recorded
- [ ] Environment validation passed
- [ ] Database backup current এবং restore rehearsal accepted
- [ ] Auth/domain/HTTPS configured and verified
- [ ] SMTP complete group এবং controlled delivery verified
- [ ] External outbox scheduler configured, secret protected, alerts active
- [ ] Outbox backlog/retry/failed dashboard or equivalent query operational
- [ ] COD rules, role permissions এবং finance reconciliation approved
- [ ] Online payment disabled, অথবা real provider separately implemented,
      reviewed and verified
- [ ] Webhook signature, replay and out-of-order tests passed
- [ ] Application gates and production smoke passed
- [ ] Hero/Search visual contract passed
- [ ] Monitoring, incident owner এবং rollback path recorded
- [ ] No expired waiver is being treated as evidence

Unchecked deployment-dependent items mean the repository may be
implementation-complete for that code path but production readiness remains
unverified.
