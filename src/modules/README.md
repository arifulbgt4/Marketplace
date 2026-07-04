# Module Architecture

This directory implements the **modular monolith** architecture defined in the project ADR.

## Layer Responsibilities

| Layer | Responsibility | Location |
|---|---|---|
| **UI** | Page components, layouts, widgets | `src/app/`, `src/components/`, `src/widgets/` |
| **API** | Route handlers, server actions, API routes | `src/app/api/`, `src/server/` |
| **Domain** | Business logic, validation, domain services | `src/lib/domain.ts`, `src/lib/validations.ts` |
| **Repository** | Data access via Prisma | `src/lib/prisma.ts`, `src/lib/services/` |
| **Provider** | External integrations (email, media, payment) | `src/lib/services/` |

## Module Boundaries

| Module | Domain Dir | Service Dir | API Dir |
|---|---|---|---|
| Auth | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/auth/` |
| Catalog | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/catalog/` |
| Checkout | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/checkout/` |
| Payment | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/payment/` |
| Admin | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/admin/` |
| Customer | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/customer/` |
| Media | `src/lib/domain.ts` | `src/lib/services/` | `src/app/api/media/` |

## Conventions

- Services throw `AppError` or return `Result<T>` types from `src/lib/errors.ts`.
- Authorization checks use `src/lib/authz.ts` helpers.
- Environment config uses validated `src/lib/env.ts`.
- Currency operations use `src/lib/money.ts`.
- Sensitive mutations are logged via `src/lib/audit.ts`.
- UI never trusts client-provided amounts; always use server-calculated totals.
