# Phase 1 Migration Planning Rehearsal

## Record

| Field | Value |
|---|---|
| Date | 2026-07-05 |
| Source baseline | `dev` at `b5fe836` |
| Data | Synthetic records only; no personal or production data |
| Purpose | Validate P1-08 disposition, resume/idempotency, reconciliation and rollback decisions before schema implementation |

Fixtures: [source records](./migration-source-fixture.json) and [expected dispositions](./migration-expected-dispositions.json)। SHA-256 values are recorded after artifact verification below.

## Representative source set

| ID | Type | Key facts | Expected disposition |
|---|---|---|---|
| `L-RENT-1` | Listing | `type=rent`, published, property fields | `ARCHIVE_ONLY` |
| `L-SALE-1` | Listing | `type=sale`, property-specific, no SKU/currency | `QUARANTINE` pending data-owner decision |
| `L-RETAIL-1` | Listing | Explicitly approved retail-compatible record, two images | `CONVERT_TO_DRAFT` |
| `B-1` | Order | Dates, guests, one rental listing | `ARCHIVE_ONLY` as legacy booking |
| `R-1` | Review | Review of `L-RENT-1` | Legacy-only review |
| `R-2` | Review | Review of `L-RETAIL-1`; purchase proof unavailable | Copy only as `LEGACY_UNVERIFIED` |
| `BM-1` | Bookmark | References `L-RETAIL-1` | Migrate through Product mapping |
| `BM-ORPHAN` | Bookmark | Missing Listing reference | `QUARANTINE` |

## Expected result and reconciliation

| Measure | Expected | Result |
|---|---:|---|
| Source records classified | 8/8 | Pass |
| Product drafts | 1 | Pass in paper mapping |
| Auto-published products | 0 | Pass |
| Commerce orders created from bookings | 0 | Pass |
| Legacy booking archive records | 1 | Pass |
| Migrated product reviews | 1 `LEGACY_UNVERIFIED` | Pass |
| Migrated wishlist rows | 1 | Pass |
| Quarantined records | 2 | Pass; no silent drop |

Classification invariant:

```text
source count (8) = converted/copied (3) + archive-only (3) + quarantined (2)
```

The categories overlap only at record type level; each source ID has exactly one primary disposition in the mapping ledger.

### Artifact integrity

| Artifact | SHA-256 |
|---|---|
| `migration-source-fixture.json` | `2b0dc9270a1712d397a83a6246e93b338f3775c36309050fa37f7717dad0f3fd` |
| `migration-expected-dispositions.json` | `ad08a69efb4129eff6e4a78cee1ea0249faa94d457f8c1d0d3837510c7842070` |

## Idempotency/resume walkthrough

Scenario: the backfill commits Product and media index 0 for `L-RETAIL-1`, then the process stops before media index 1.

Required restart behavior:

1. Read the last committed checkpoint and mapping ledger.
2. Upsert Product by `(sourceType, sourceId, transformVersion)`; existing Product is reused.
3. Upsert media using `(legacyListingId, imageIndex)`; index 0 is not duplicated.
4. Insert index 1 and commit the batch.
5. Re-running the entire batch changes no counts or checksums.

Result: **Pass at strategy level**. P3-17 must implement this key/checkpoint contract; P9-16 must prove it against a database.

## Rollback walkthrough

### Failure before activation

- Final reconciliation detects `BM-ORPHAN` outside quarantine.
- Cutover is aborted during the write freeze.
- Legacy writes reopen; additive target rows remain isolated.
- Mapping/quarantine records preserve diagnostics for corrected rerun.

Result: **Safe rollback available** because no new commerce write occurred.

### Failure after activation

- A new multi-item commerce order exists only in the new schema.
- Reverting to legacy booking code would lose its semantics.
- New order placement is disabled and a new-schema-compatible previous release/forward fix is deployed.

Result: **Legacy code rollback rejected by design**; preservation of order/payment/inventory history wins over a misleading reverse sync.

## Review conclusion

P1-08 is executable as a strategy and avoids unsafe rental-to-retail reinterpretation. This is not a production migration rehearsal: target schema, backfill executable, backup/restore and real-data reconciliation are intentionally gated by P3-17 and P9-16.
