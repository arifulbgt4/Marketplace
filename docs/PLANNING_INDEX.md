# Marketplace Planning Index

## উদ্দেশ্য

এই directory-র Markdown documents reusable B2C marketplace-টির canonical technical plan। বর্তমান repository এখনো property/rental listing-oriented starter; পরিকল্পনার লক্ষ্য হলো existing MUI design অক্ষত রেখে এটিকে configurable single-business B2C marketplace template-এ রূপান্তর করা।

এই planning update কোনো feature, database migration, API, UI behavior বা business logic implement করে না।

## Start here

1. [Current Project Analysis](./CURRENT_PROJECT_ANALYSIS.md)
2. [Architecture](./ARCHITECTURE.md)
3. [Project Roadmap](./PROJECT_ROADMAP.md)
4. [Detailed Task Plan](./TASK_PLAN.md)
5. [COD and Payment Plan](./COD_AND_PAYMENT_PLAN.md)
6. [Reusability and Customization Plan](./REUSABILITY_AND_CUSTOMIZATION_PLAN.md)
7. [Testing Plan](./TESTING_PLAN.md)
8. [Documentation Plan](./DOCUMENTATION_PLAN.md)

## Canonical-document ownership

| Concern | Canonical document |
|---|---|
| বর্তমান implementation, gaps, risks | `CURRENT_PROJECT_ANALYSIS.md` |
| Target boundaries ও technical decisions | `ARCHITECTURE.md` |
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
| Phase 1: Project analysis and documentation | Planned/documented |
| Phase 2: Core marketplace foundation | Not started |
| Phase 3: Product/catalog system | Not started |
| Phase 4: Cart and checkout | Not started |
| Phase 5: COD and online payment | Not started |
| Phase 6: Order management | Not started |
| Phase 7: Admin and business settings | Not started |
| Phase 8: Customer experience | Not started |
| Phase 9: Testing, documentation, cleanup | Not started |

কোনো task-কে complete ধরা যাবে না যতক্ষণ না `TASK_PLAN.md`-এর acceptance criteria এবং `TESTING_PLAN.md`-এর প্রাসঙ্গিক verification pass করে।
