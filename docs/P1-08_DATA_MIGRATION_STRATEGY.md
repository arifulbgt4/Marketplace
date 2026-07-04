# P1-08 Data Migration Strategy

## Status: Complete

## Decision summary

Current rental/property records and target retail-commerce records have different semantics. Migration therefore uses an **additive schema, explicit disposition and controlled cutover**; it does not blindly rename `Listing` to `Product` or booking `Order` to commerce `Order`.

Core rules:

1. Legacy rows remain authoritative until cutover.
2. New commerce tables are additive and do not cascade-delete legacy history.
3. Rental listings/bookings are archived as legacy history, not converted into retail sales.
4. Only data-owner-approved sale listings may become draft products.
5. Incompatible legacy/new order models are not dual-written.
6. Rollback to legacy code is allowed only before the first post-cutover commerce write; afterward rollback means a forward-compatible application release using the new schema.
7. Legacy tables are archived, never dropped automatically.

## Current source model

| Legacy model | Important semantics | Target disposition |
|---|---|---|
| `User`, `Account`, `UserMedia` | Identity/profile | Reuse with additive role/account/address changes; preserve IDs |
| `Category` | Property-oriented hierarchy | Review and map explicitly; do not auto-publish as retail categories |
| `Listing(type=rent)` | Rental/property inventory | Preserve in read-only legacy archive; no Product conversion |
| `Listing(type=sale)` | May represent property sale, not necessarily retail SKU | Quarantine by default; convert only approved records to Product `DRAFT` |
| `Order` | Single-listing date/guest booking | Preserve as `LegacyBooking`/archive; no commerce Order conversion |
| `Review` | Listing review without purchase verification | Preserve as legacy review; converted-product review starts `LEGACY_UNVERIFIED` |
| `Message` | Peer-message record | Archive; ADR-001 selects support/contact replacement |
| `Bookmark` | User→Listing save | Preserve legacy relation; migrate only when listing has approved Product mapping |

## Target model groups

- Catalog: Product, ProductVariant, ProductOption, ProductMedia, Category mapping
- Inventory: balance, reservation, adjustment/ledger
- Customer: Address and preferences
- Commerce: Cart, CartItem, CheckoutSession, Order, OrderItem snapshot
- Payment: Payment, PaymentEvent, refund/COD collection records
- Fulfillment: Shipment and status history
- Configuration: Business, branding, delivery, COD and coupon settings
- Operations: AuditLog, Outbox/Event, Notification
- Migration control: mapping ledger, run/checkpoint and conflict/quarantine records

Exact table names are finalized in their schema tasks; this strategy defines required behavior, not premature Prisma code.

## Migration control records

Every backfill implementation must persist:

| Record | Required fields |
|---|---|
| Migration run | `runId`, version, source/target schema version, started/finished time, status |
| Checkpoint | `runId`, entity type, stable cursor, processed/succeeded/quarantined counts |
| Mapping ledger | source type/id, disposition, target type/id, transform version, checksum |
| Quarantine/conflict | source reference, reason code, redacted details, reviewer, resolution |

Stable source IDs plus transform version form the idempotency key. Re-running a batch must upsert the same target/mapping and must not duplicate media, variants, reviews or order history.

## Disposition and mapping rules

### User/account

- Preserve `User.id`; normalize role through an explicit lookup (`user` → `CUSTOMER`, `admin` → `ADMIN`).
- Unknown role goes to quarantine; it is never promoted automatically.
- Password hashes are copied unchanged only between compatible auth implementations.
- Email/phone values are not written to logs or rehearsal fixtures.

### Listing

| Condition | Disposition | Transformation |
|---|---|---|
| `type=rent` | `ARCHIVE_ONLY` | Keep complete legacy row and relations; no Product |
| `type=sale`, property-specific | `QUARANTINE` | Data owner chooses archive or manual product draft |
| Explicitly approved retail-compatible record | `CONVERT_TO_DRAFT` | New Product with `legacyListingId`; never auto-publish |
| Missing/invalid category or creator | `QUARANTINE` | No partial Product |

For approved conversion:

- `price` converts through a decimal string, never binary floating arithmetic.
- Currency must be supplied by an approved business setting; it cannot be guessed from `$` or locale.
- Product requires at least one manually reviewed variant/SKU before publish.
- `images[]` becomes ordered ProductMedia rows with stable `(legacyListingId, index)` keys.
- Property-only fields remain in migration metadata for audit; they are not silently promoted to generic product attributes.

### Booking order

- Existing `Order` rows become immutable legacy booking history or remain in archived legacy tables.
- They do **not** become target commerce Orders because date/guest/single-listing semantics cannot satisfy quantity, SKU, address, tax, shipping, payment and item-snapshot invariants.
- `totalPrice` is retained as a decimal-string snapshot with recorded legacy currency assumption; uncertainty is flagged.
- User/listing deletion must not remove preserved booking history.

### Review/bookmark

- Review for archive-only listing stays legacy-only.
- Review for converted Product may be copied with `verificationState=LEGACY_UNVERIFIED`; it is excluded from verified-purchase badges unless eligibility can be proven.
- Bookmark migrates only if its listing has a Product mapping; otherwise it remains legacy-only.

## Phased execution

### Stage A — Prepare and profile

1. Take and verify a restorable database backup.
2. Record source counts, orphan counts, status/role distributions and money ranges.
3. Assign every legacy row a disposition rule.
4. Resolve unknown currency, invalid status and broken references or quarantine them.

### Stage B — Additive schema

1. Deploy new tables, constraints and migration-control records only.
2. Keep legacy application and legacy tables authoritative.
3. Verify old application smoke tests and backup restore.

### Stage C — Idempotent backfill

1. Process stable primary-key batches.
2. Write target row and mapping ledger in one transaction where possible.
3. Persist checkpoint after each committed batch.
4. Resume from the last committed cursor after interruption.
5. Re-run completed batches to prove duplicate-free behavior.

### Stage D — Reconcile and approve

| Check | Gate |
|---|---|
| Source rows classified | 100%; converted + archive-only + quarantined = source count |
| Target/mapping counts | Exact for every `CONVERT_*` disposition |
| Orphan/reference checks | Zero unresolved outside quarantine |
| Key-field checksum | Exact for mapped IDs/status/text hashes |
| Money conversion | Exact decimal-string equality at defined precision |
| Duplicate idempotency keys | Zero |
| Quarantine | Reviewed and explicitly accepted; no silent drop |

### Stage E — Cutover

1. Deploy a release that can read legacy history and new commerce schema.
2. Enter a bounded write freeze for legacy listing/booking mutations.
3. Run final delta backfill and reconciliation.
4. Obtain data owner, architecture and SQA go/no-go approval.
5. Enable new catalog/commerce routes; keep legacy history read-only.
6. Monitor errors, reconciliation, order placement and stock invariants.

### Stage F — Archive

- Legacy tables remain queryable through an explicit legacy-history boundary, then may be renamed after the monitoring window.
- Minimum archive retention: six months, subject to legal/business retention.
- Drop requires a separate destructive-migration approval, verified backup and restore rehearsal; it is not part of this plan.

## No unsafe dual-write rule

Legacy booking and target commerce order schemas cannot represent the same invariant set. Therefore:

- Do not best-effort async dual-write orders.
- Do not claim a legacy application rollback can process new commerce orders.
- During pre-cutover, legacy writes remain authoritative and are captured by delta backfill.
- After cutover, new writes use only the new schema. Legacy history is read-only.

## Rollback strategy

### Before commerce activation

Feature flags may return reads/writes to the unchanged legacy application because no new-schema-only commerce write exists. Additive tables can remain unused; no destructive rollback is required.

### During final write freeze

If reconciliation fails, abort cutover, reopen legacy writes, preserve diagnostics and resume/re-run backfill after correction.

### After first new commerce write

Database rollback to legacy semantics is forbidden. Recovery uses:

1. Disable new order placement if integrity is at risk.
2. Deploy the previous **new-schema-compatible** application release or a forward fix.
3. Preserve new orders, payments, stock ledger and audit events.
4. Reconcile before reopening writes.

Rollback trigger examples: unexplained count/checksum mismatch, negative stock, lost payment/order linkage, or quarantine outside approved threshold.

## Representative review evidence

The Phase 1 planning rehearsal is recorded in [Migration Planning Rehearsal](./evidence/phase-1/MIGRATION_PLANNING_REHEARSAL.md). It proves disposition, idempotency and rollback reasoning against synthetic non-personal records. Actual database backfill/restore rehearsal remains P9-16 after target schemas and scripts exist.

## Ownership

| Decision/action | Owner |
|---|---|
| Record disposition and currency assumption | Product/data owner |
| Transform/schema design | Data/architecture owner |
| Backup/restore and cutover execution | Deployment operator |
| Reconciliation and phase gate | SQA reviewer |
| Quarantine acceptance/destructive drop | Product/data owner with written approval |
