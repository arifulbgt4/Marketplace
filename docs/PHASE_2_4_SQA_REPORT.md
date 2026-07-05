# Phase 2–4 SQA Exit Report

## Decision

- Audit date: 2026-07-05
- Scope: Phase 2 (P2-01–P2-15), Phase 3 (P3-01–P3-17), Phase 4 (P4-01–P4-15)
- Decision: **Complete**
- Open blocker: None
- Waiver: None
- Next eligible task: P5-01

Phase 2–4 শুধু file presence বা unit test-এর ভিত্তিতে complete করা হয়নি। Schema constraints, clean migration, database concurrency, authorization boundaries, production build এবং browser acceptance flow যাচাই করে exit gate বন্ধ করা হয়েছে।

## Resolved SQA findings

| Priority | Finding                                                          | Resolution and evidence                                                                                                                 |
| -------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Authentication bypass, stale sessions এবং incomplete API RBAC    | Status/session-version validation, deny-by-default route classifier, resource authorization এবং admin/customer boundary tests যোগ হয়েছে |
| P0       | Schema ছিল কিন্তু deployable migration/DB constraints ছিল না     | Three ordered migrations, FK/index/unique/check constraints এবং empty-database rehearsal যোগ হয়েছে                                      |
| P0       | Concurrent stock reservation oversell করতে পারত                  | Conditional atomic SQL update এবং 10-request concurrency test-এ stock 5 হলে ঠিক 5টি success যাচাই হয়েছে                                 |
| P0       | Duplicate checkout placement stock/order দুইবার commit করতে পারত | Transactional idempotency key; concurrent duplicate placement-এ একটি order এবং একটি stock commit যাচাই হয়েছে                            |
| P0       | Guest cart identity client-controlled ছিল                        | HMAC-signed guest cart cookie, expiry, merge এবং ownership enforcement যোগ হয়েছে                                                        |
| P0       | Pending registration account verification-এর usable path ছিল না  | One-use hashed verification/reset token, request/confirm routes, recovery pages এবং SMTP adapter যোগ হয়েছে                              |
| P1       | Financial values এবং legacy listing money `Float`-এ ছিল          | Prisma `Decimal`, minor-unit `Money` primitive এবং server-authoritative totals প্রয়োগ হয়েছে                                             |
| P1       | Address CRUD ও checkout new-address flow অসম্পূর্ণ ছিল           | Owned CRUD, one-default constraint, inline create/select এবং server validation যোগ হয়েছে                                                |
| P1       | Shipping quote cart weight যাচাই করত না                          | Variant weight, method min/max weight, authoritative cart weight এবং eligibility checks যোগ হয়েছে                                       |
| P1       | Dependency graph/lockfile-এ peer ও production advisory debt ছিল  | Frozen install, peer check এবং production audit clean করা হয়েছে                                                                         |

## Phase exit gates

### Phase 2 — Core marketplace foundation

- Validated environment contract এবং documented local/production settings আছে।
- Stable error codes/request ID, safe money primitive, constrained roles/status এবং session invalidation আছে।
- Customer profile/address/account recovery বাস্তব current-user data এবং ownership policy ব্যবহার করে।
- Media input path traversal, size/type এবং content signature validation দ্বারা constrained।
- Route/API access matrix unit tests এবং browser authorization smoke test pass।

### Phase 3 — Product and catalog

- Product/variant/category/media/inventory schema migrationসহ deployable।
- Publication incomplete product, inactive category, missing primary media, invalid price বা missing stock reject করে।
- Public catalog শুধু published/active/in-stock data দেয়; sorting/filtering deterministic।
- Inventory reserve/commit/release atomic এবং ledger-backed; database concurrency test oversell প্রতিরোধ প্রমাণ করে।
- Seed empty/populated উভয় অবস্থায় idempotent; 8টি reusable demo product এবং weighted delivery fixture আছে।
- Protected homepage/Hero/Search baseline-এর hierarchy, spacing, search shell এবং category composition visual smoke-এ preserved; personal contact copy marketplace-safe tagline দিয়ে একই typography slot-এ replaced।

### Phase 4 — Cart and checkout

- Guest/auth cart identity, merge, expiry, version এবং authoritative repricing implemented।
- Address, coupon, location/value/weight shipping এবং checkout totals server-side পুনর্গণিত হয়।
- Order item/address/price immutable snapshots রাখা হয়।
- Duplicate placement idempotent এবং stock/order/coupon transaction rollback-safe।
- Browser flow-এ catalog → product → cart → login → saved address → delivery quote → enabled order action verified।

## Verification evidence

| Gate                                            | Result                                                                                                               |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                | Pass                                                                                                                 |
| `pnpm peers check`                              | Pass; no peer issues                                                                                                 |
| `pnpm audit --prod`                             | Pass; no known production vulnerabilities                                                                            |
| `pnpm exec prisma validate` / `prisma generate` | Pass                                                                                                                 |
| Main DB `prisma migrate status`                 | Pass; all three migrations applied                                                                                   |
| Empty disposable DB `prisma migrate deploy`     | Pass from zero schema                                                                                                |
| Disposable DB seed run twice                    | Pass; idempotent                                                                                                     |
| Unit/security suite                             | 116 passed; 4 DB-conditional tests skipped                                                                           |
| Database integration suite                      | 4 passed; oversell, idempotency, constraints and one-use account tokens covered                                      |
| `pnpm lint`                                     | Pass; zero warnings/errors                                                                                           |
| `pnpm type-check`                               | Pass                                                                                                                 |
| Changed-file Prettier check                     | Pass                                                                                                                 |
| `pnpm build`                                    | Pass; production build generated 286 static pages                                                                    |
| Browser acceptance                              | Pass; protected homepage, catalog/detail/cart/auth/checkout/admin denial/recovery page, zero console warnings/errors |
| `git diff --check`                              | Pass                                                                                                                 |

## Operational requirements and remaining scope

- Production signup, verification এবং recovery email-এর জন্য `.env.example` অনুযায়ী সম্পূর্ণ SMTP configuration দিতে হবে। Partial SMTP configuration startup-এই rejected হয়। Development/test-এ safe preview URL ব্যবহার করা যায়; raw token log করা হয় না।
- Phase 5 payment/COD state machine, provider integration এবং webhook এই report-এর scope নয়; task plan-এ সেগুলো `Not started`।
- Google-hosted font ব্যবহার করার কারণে clean production build environment-এ font host network access অথবা ভবিষ্যতে self-hosted font asset প্রয়োজন। এটি Phase 2–4 behavior blocker নয়।

## Approval record

| Role                              | Decision            | Date       | Basis                                                                                 |
| --------------------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Codex SQA/implementation reviewer | Approved — Complete | 2026-07-05 | Source review, automated tests, DB rehearsal, production build and browser acceptance |
