# Marketplace Planning Index

## উদ্দেশ্য

এই directory-র Markdown documents reusable B2C marketplace-টির canonical technical plan। বর্তমান repository এখনো property/rental listing-oriented starter; পরিকল্পনার লক্ষ্য হলো existing MUI design অক্ষত রেখে এটিকে configurable single-business B2C marketplace template-এ রূপান্তর করা।

এই planning update কোনো feature, database migration, API, UI behavior বা business logic implement করে না।

## Start here

### Phase 1: Analysis and Planning Baseline
1. [Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md) - P1-01
2. [Architecture](./ARCHITECTURE.md) - P1-04
3. [Route/API Inventory](./P1-02_ROUTE_API_INVENTORY.md) - P1-02
4. [Feature Gap Matrix](./P1-03_FEATURE_GAP_MATRIX.md) - P1-03
5. [Domain Glossary](./P1-05_DOMAIN_GLOSSARY.md) - P1-05
6. [Permission Matrix](./P1-06_PERMISSION_MATRIX.md) - P1-06
7. [Design Baseline](./P1-07_DESIGN_BASELINE.md) - P1-07
8. [Data Migration Strategy](./P1-08_DATA_MIGRATION_STRATEGY.md) - P1-08

### Implementation Planning
9. [Project Roadmap](./PROJECT_ROADMAP.md)
10. [Detailed Task Plan](./TASK_PLAN.md) - P1-09
11. [COD and Payment Plan](./COD_AND_PAYMENT_PLAN.md)
12. [Reusability and Customization Plan](./REUSABILITY_AND_CUSTOMIZATION_PLAN.md)
13. [Testing Plan](./TESTING_PLAN.md)
14. [Documentation Plan](./DOCUMENTATION_PLAN.md)

## Canonical-document ownership

| Concern | Canonical document |
|---|---|
| বর্তমান implementation, gaps, risks | `CURRENT_PROJECT_ANALYSIS.md` |
| Target boundaries ও technical decisions | `ARCHITECTURE.md` |
| Pages, APIs, server actions inventory | `P1-02_ROUTE_API_INVENTORY.md` |
| Functional gaps and priorities | `P1-03_FEATURE_GAP_MATRIX.md` |
| Commerce terms definitions | `P1-05_DOMAIN_GLOSSARY.md` |
| Role-based access control | `P1-06_PERMISSION_MATRIX.md` |
| UI/UX design constraints | `P1-07_DESIGN_BASELINE.md` |
| Data migration procedures | `P1-08_DATA_MIGRATION_STRATEGY.md` |
| Phase sequence ও release gates | `PROJECT_ROADMAP.md` |
| Agent-assignable implementation backlog | `TASK_PLAN.md` |
| COD eligibility, statuses, edge cases | `COD_AND_PAYMENT_PLAN.md` |
| Branding, settings, provider abstraction | `REUSABILITY_AND_CUSTOMIZATION_PLAN.md` |
| Test layers ও release quality gates | `TESTING_PLAN.md` |
| Required project documentation backlog | `DOCUMENTATION_PLAN.md` |

## Scope decisions

- Core product হবে per-business deployable single-business B2C application।
- Multi-tenant SaaS এবং multi-vendor payout/commission core scope নয়।
- বর্তমান seller/host model legacy behavior; business catalog admin বা catalog manager পরিচালনা করবে।
- Multi-vendor support ভবিষ্যতে আলাদা bounded context হিসেবে যোগ করা যাবে।
- Existing MUI layout, theme এবং visual language implementation চলাকালে baseline হিসেবে সংরক্ষিত থাকবে।
- COD first-class payment option হবে।
- Order, payment এবং fulfillment status আলাদা থাকবে।
- Secrets environment-এ এবং editable business rules database settings-এ থাকবে।

## Planning status

| Phase | Status |
|---|---|
| Phase 1: Project analysis and documentation | Complete |
| Phase 2: Core marketplace foundation | Not started |
| Phase 3: Product/catalog system | Not started |
| Phase 4: Cart and checkout | Not started |
| Phase 5: COD and online payment | Not started |
| Phase 6: Order management | Not started |
| Phase 7: Admin and business settings | Not started |
| Phase 8: Customer experience | Not started |
| Phase 9: Testing, documentation, cleanup | Not started |

কোনো task-কে complete ধরা যাবে না যতক্ষণ না `TASK_PLAN.md`-এর acceptance criteria এবং `TESTING_PLAN.md`-এর প্রাসঙ্গিক verification pass করে।
