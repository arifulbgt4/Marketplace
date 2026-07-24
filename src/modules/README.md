# Module Architecture

This directory is the migration boundary for the **single-business modular
monolith** accepted in `docs/ARCHITECTURE.md`. Existing code remains in its
current locations until a dedicated task migrates it. Creating this boundary
does not, by itself, move or change product behaviour.

## Public API rule

Every implemented business module must have exactly one public entry point:

```text
src/modules/<module>/index.ts
```

Code outside a module imports only from `src/modules/<module>`. It must not
import a module's internal file or directory. Code inside the same module may
use relative imports for its own internal files. Cross-module relative imports
are not allowed.

`src/modules/index.ts` is intentionally not a barrel for all modules. Consumers
must name the module they depend on so dependencies remain visible.

Examples:

```ts
// Allowed from another module, API adapter, or UI.
import { getCatalogItem } from "src/modules/catalog";

// Allowed only within src/modules/catalog.
import { mapProductRecord } from "./repository/map-product-record";

// Not allowed: bypasses the catalog public API.
import { mapProductRecord } from "src/modules/catalog/repository/map-product-record";

// Not allowed: hides a cross-module dependency behind a relative path.
import { placeOrder } from "../../order/application/place-order";
```

The repository guard in
`src/__tests__/module-boundaries.test.ts` checks these rules and also requires
every concrete module directory to contain `index.ts`.

## Module skeleton

Create only the folders needed by an approved implementation task:

```text
src/modules/<module>/
├── index.ts          # reviewed public exports only
├── domain/           # business vocabulary, invariants, policies
├── application/      # use-case orchestration and transaction intent
├── repository/       # persistence ports and Prisma-backed data access
└── provider/         # external provider ports/adapters owned by the module
```

Do not create empty feature modules in advance. A module may omit a layer it
does not need. Infrastructure-specific types must not leak through `index.ts`
unless they are deliberately part of the public contract.

## Layer responsibilities

| Layer | Responsibility | Allowed direction |
|---|---|---|
| **UI** | Pages, layouts, components and widgets in `src/app/`, `src/components/` and `src/widgets/` | Calls a module public API; contains no repository/provider access |
| **API** | Route handlers and server-action adapters in `src/app/api/` and `src/server/` | Authenticates, validates transport input, calls a module public API, maps output/errors |
| **Domain** | Business types, invariants, policies and state transitions | Must not depend on UI, API, Prisma or concrete providers |
| **Application** | Use-case orchestration and transaction intent | Depends on domain and owned ports; does not expose framework request/response types |
| **Repository** | Persistence implementation and record/domain mapping | Implements module-owned persistence ports; Prisma remains an implementation detail |
| **Provider** | Payment, email, media, delivery or other external integration | Implements module-owned provider ports; vendor SDK types stay internal |

The dependency direction is:

```text
UI / API -> module index -> application -> domain
                                  |-> repository port <- repository adapter
                                  `-> provider port   <- provider adapter
```

## Transitional source map

These are current locations, not approved cross-module public APIs:

| Concern | Current source |
|---|---|
| UI | `src/app/`, `src/components/`, `src/widgets/` |
| API adapters | `src/app/api/`, `src/server/` |
| Shared domain/types | `src/lib/domain.ts`, `src/lib/validations.ts` |
| Prisma client | `src/lib/prisma.ts` |
| Current services/adapters | `src/lib/services/` |

New implementation tasks should migrate one coherent vertical slice at a time.
They must not add new dependencies on another module's internals or treat the
transitional `src/lib/services/` directory as the final module architecture.

## Cross-cutting contracts

- Services use `AppError` or `Result<T>` from `src/lib/errors.ts`.
- Authorization uses `src/lib/authz.ts`.
- Environment configuration uses validated `src/lib/env.ts`.
- Currency operations use `src/lib/money.ts`.
- Sensitive mutations use `src/lib/audit.ts`.
- UI never trusts client-provided monetary totals.
