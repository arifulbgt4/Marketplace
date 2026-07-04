# Phase 1 SQA Audit

## Audit record

| Field | Value |
|---|---|
| Audit date | 2026-07-05 |
| Audited branch/commit | `dev` / `71a9147` |
| Scope | P1-01 through P1-09, planning documents, source traceability and executable quality evidence |
| Method | Document review, source cross-check, static inspection, task-graph validation and local verification commands |
| Implementation boundary | Audit and feedback tasks only; no product code changed |

## Verdict

**Phase 1 is not complete. Status: Rework required.**

The roadmap exit gate requires architecture, scope, permissions, migration and design baseline approval. No dated approval/sign-off record exists. Several deliverables also fail their own acceptance or testing requirements, so approval alone would not close the phase.

Phase 2 implementation must remain blocked until P1-FB-01 through P1-FB-10 are complete and the Phase 1 exit review is signed off.

## Gate assessment

| Deliverable | Result | Evidence and gap |
|---|---|---|
| P1-01 Current architecture baseline | Rework required | Useful current/target separation exists, but the verification record has no commit/date/runner traceability and does not reflect all current source and environment risks. |
| P1-02 Route/API inventory | Failed | Inventory omits metadata/system routes from the production route table. It marks `/l/create` and `/message` protected, while the current dynamic-public regex matches both; the same regex also matches unrelated paths such as `/eeee`. Access claims are therefore not source-accurate. |
| P1-03 Feature gap matrix | Rework required | Status vocabulary is inconsistent (`Legacy/Partial`, `Minimal`, `Hardcoded` are used but not defined), several mock/partial classifications lack source references, and findings are not traceable to routes/modules. |
| P1-04 Target architecture ADR | Failed | `ARCHITECTURE.md` states a target, but there is no formal ADR with alternatives, trade-offs, decision owner/date, approval, or unresolved-decision log. |
| P1-05 Domain glossary | Failed | Canonical state names conflict with `COD_AND_PAYMENT_PLAN.md`: `PENDING` vs `PLACED`, `PACKING` vs `PROCESSING`, and payment states omit/use different `PENDING_COLLECTION`, `COLLECTED`, `AUTHORIZED`, and `CAPTURED` semantics. |
| P1-06 Permission matrix | Failed | Role-level capability tables exist, but every current/future mutation is not mapped to actor, resource scope, field restrictions, denial behavior and audit requirement. No product/security approval is recorded. |
| P1-07 Design baseline | Failed | Required screenshot comparison evidence is absent. The document also says dark mode is unavailable although dark palette/toggle code exists, documents 4px spacing while the configured theme uses the MUI default spacing, and omits the custom `xxl` breakpoint. |
| P1-08 Data migration strategy | Failed | No representative-data review or rehearsal evidence exists. Drop-vs-archive statements conflict, dual-write/sync has no source-of-truth or conflict policy, and checkpoint/resume, idempotency, cutover, measurable reconciliation and rollback compatibility are unspecified. |
| P1-09 Backlog and handoff convention | Failed | Exact-ID graph has no cycle or missing ID, but 28 dependencies use non-machine-checkable phase/range/state phrases. Phase 2-9 task rows also lack explicit status fields, so the backlog is not fully assignable or gate-checkable. |

## Key findings by severity

### Blocker

1. Phase 1 is marked `Complete` without the approval required by `PROJECT_ROADMAP.md`.
2. P1-02, P1-05, P1-07 and P1-08 fail explicit acceptance/testing requirements.

### Critical

1. The route inventory's protection claims are incorrect. Static evaluation of `src/middleware.ts` shows the dynamic-public regex matches `/l/create`, `/en/l/create`, `/message` and arbitrary character-class paths such as `/eeee`.
2. Conflicting state vocabularies make downstream schema, transition, payment and test tasks ambiguous.

### High

1. No reproducible visual baseline assets exist for desktop, mobile or RTL comparison.
2. Migration coexistence and rollback rules are not executable or safely testable.
3. Permission decisions are not mapped to individual mutation boundaries.
4. Twenty-eight backlog dependencies cannot be validated as exact task edges.

### Medium

1. The current-baseline command record is not tied to a date/commit and does not distinguish environment failure from product failure.
2. The design document contains source-inaccurate theme facts.
3. The route inventory omits `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, icon routes and the root redirect.

## Verification evidence

| Check | Result |
|---|---|
| `vitest run` | Passed: 2 files, 25 tests |
| `tsc --noEmit` | Passed |
| `next lint` | Passed; command is deprecated and needs a future tooling task |
| `prettier --check .` | Not runnable: local Prettier executable is absent |
| `prisma validate` without env contract | Failed as expected: `POSTGRES_URL_NON_POOLING` missing |
| `prisma validate` with `.env.example` contract | Passed |
| `next build` with `.env.example` contract and network access | Passed; 190 static pages generated |
| Internal Markdown links under `docs/` | Passed: 0 broken links |
| Backlog exact task IDs | 135 tasks; 0 missing exact dependency IDs; 0 exact-ID cycles |
| Backlog dependency quality | Failed: 28 vague/range/phase-state dependencies |
| Visual baseline assets | Failed: no screenshot/image baseline under `docs/` |

The initial `pnpm` wrapper attempt was excluded from product results because it stopped on a non-TTY module-purge prompt. Checks were rerun through repository-local executables.

## Exit criteria for the re-audit

Phase 1 may be marked complete only when:

1. P1-FB-01 through P1-FB-09 have evidence-backed `Complete` status.
2. All canonical documents use one scope and state vocabulary.
3. Route/access and mutation/permission matrices are source-traceable.
4. Visual and migration evidence artifacts are reviewable.
5. The dependency graph is exact and machine-checkable.
6. Product owner, architecture owner and SQA reviewer sign off against a named commit.
7. P1-FB-10 records the final review result and any time-bound waiver.

