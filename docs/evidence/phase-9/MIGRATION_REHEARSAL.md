# Phase 9 Migration and Recovery Rehearsal

## Record

- Date: 2026-07-24
- Environment: local Docker PostgreSQL 15
- Application branch: `dev`
- Database scope: isolated rehearsal databases only
- Result: Pass

This rehearsal did not modify or drop the normal local development database.
Connection credentials and dump contents are intentionally excluded from this
record.

## Fresh-database migration

An empty database named `marketplace_rehearsal_20260724a` was created. The
production migration command applied all eight checked-in migrations in order:

1. `20260705000000_phase_2_4_baseline`
2. `20260705010000_listing_money_decimal`
3. `20260705020000_shipping_weight_rules`
4. `20260713165612_phase_5_models`
5. `20260724233000_phase_6_persistence`
6. `20260724234500_phase_7_8_experience_persistence`
7. `20260725001000_payment_hardening`
8. `20260725002000_support_requests`

`prisma migrate deploy` reported that every migration applied successfully.
The generic seed then completed with:

- 2 users
- 8 categories
- 8 products
- 17 product variants
- 17 inventory records

The database contained 46 public tables, including Prisma migration metadata.

## Database-backed integration verification

The integration suite ran against the freshly migrated database:

```text
pnpm test:integration
Test Files  1 passed (1)
Tests       6 passed (6)
```

The suite covered transaction-backed commerce behavior and completed without a
skipped database test.

## Backup and restore dry run

A PostgreSQL custom-format backup of the fresh seeded database was created with
`pg_dump`. It was restored with `pg_restore --no-owner --no-privileges` into a
second empty database named `marketplace_restore_20260724a`.

Verification results:

| Check | Source | Restored | Result |
| --- | ---: | ---: | --- |
| Applied migrations | 8 | 8 | Match |
| Users | 2 | 2 | Match |
| Categories | 8 | 8 | Match |
| Products | 8 | 8 | Match |
| Product variants | 17 | 17 | Match |
| Inventory records | 17 | 17 | Match |
| Public table inventory | 46 | 46 | Match |

Ordered JSON row checksums for `User`, `Category`, `Product`,
`ProductVariant`, `Inventory`, and `_prisma_migrations` also matched exactly
between the source and restored databases.

## Rollback posture

The schema uses forward-only production migrations. Operational rollback is:

1. stop writes or place the application in maintenance mode;
2. retain the failed deployment logs and migration status;
3. restore the pre-deployment PostgreSQL backup into a clean database;
4. point the last known-good application version at the restored database;
5. run smoke and reconciliation checks before reopening traffic.

No down migration or destructive reset is part of the production rollback
procedure.

## Environment note

The repository requires Node.js 22.x. This local rehearsal ran under Node.js
24.12.0 and therefore emitted the expected engine warning. CI and production
must use Node.js 22.x as declared by the repository and workflow.
