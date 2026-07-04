# Documentation Plan

## Objective

Project documentation যেন source code-এর পরে stale appendix না হয়। প্রতিটি module implementation task behavior/schema/configuration বদলালে সংশ্লিষ্ট documentation একই change-set-এ update করবে।

## Documentation set

| Document | Audience | Required contents | Backlog task |
|---|---|---|---|
| Project overview | New developer/stakeholder | Purpose, current capability, setup, links | P9-18 |
| Architecture | Engineer/agent | Module boundaries, data flow, transactions, adapters | P9-19 |
| Environment setup | Developer/operator | Required vars, Docker, local services, troubleshooting | P2-02, P9-18 |
| Database schema | Engineer/operator | ERD, models, indexes, retention, migrations | P9-20 |
| API documentation | Frontend/integration developer | Inputs, outputs, errors, auth, examples | P9-21 |
| Feature documentation | Product/support/engineer | Business behavior and edge cases | P9-22 |
| Admin usage guide | Business operator | Catalog, stock, order, COD, settings workflows | P9-23 |
| Customization guide | Implementer/business admin | Branding, content, catalog, payment, delivery | P9-24 |
| Deployment guide | DevOps/operator | Secrets, DB, storage, webhooks, workers, rollback | P9-25 |
| Testing guide | Engineer/CI owner | Test layers, commands, fixtures, gates | P9-26 |
| Release guide | Release owner | Versioning, migrations, smoke, rollback | P9-27 |

## Current canonical planning documents

- `PLANNING_INDEX.md` — navigation এবং scope।
- `CURRENT_PROJECT_ANALYSIS.md` — verified current state।
- `ARCHITECTURE.md` — target architecture decisions।
- `PROJECT_ROADMAP.md` — phases এবং gates।
- `TASK_PLAN.md` — detailed agent backlog।
- `COD_AND_PAYMENT_PLAN.md` — payment/COD behavior।
- `REUSABILITY_AND_CUSTOMIZATION_PLAN.md` — configurable boundaries।
- `TESTING_PLAN.md` — quality strategy।

## Project overview requirements

- Current capability বনাম planned capability স্পষ্ট হবে।
- Quick-start commands verified হবে।
- Database port এবং env filename consistent হবে।
- Unsupported OAuth/real-time/payment claims থাকবে না।
- Planning index prominently linked থাকবে।

## Architecture documentation requirements

- Current এবং target architecture আলাদা sections।
- Module ownership এবং prohibited dependencies।
- Money, status, snapshot এবং deletion rules।
- Checkout transaction boundary।
- Payment/shipping/storage/email adapters।
- Security and authorization model।
- Homepage/Hero/Search protected visual scope, flexible non-home surfaces এবং design-system-neutral policy।
- ADR index।

## Database documentation requirements

- ER diagram।
- Each model-এর purpose এবং ownership।
- Enum/state definitions।
- Unique constraints এবং indexes।
- Money/currency representation।
- Snapshot এবং audit retention।
- Migration, backfill এবং rollback procedure।
- Seed data limitations।

## API documentation requirements

প্রতিটি supported endpoint/action-এর জন্য:

- Purpose এবং actor।
- HTTP method/path অথবা server action boundary।
- Authentication/authorization।
- Request schema।
- Success response।
- Error codes।
- Idempotency behavior।
- Pagination/filtering when applicable।
- Side effects/events।
- Example payload without secret/real personal data।

## Feature documentation requirements

অন্তত নিচের feature guides থাকবে:

- Authentication/customer account।
- Product/category/inventory।
- Cart/pricing/coupon।
- Checkout/delivery।
- COD এবং online payment।
- Order/fulfillment/cancellation/return।
- Wishlist/reviews/notifications।
- Business/branding/homepage settings।
- Analytics/reporting।

## Admin guide requirements

- Role prerequisites।
- Create/publish/archive product।
- Adjust inventory with reason।
- Configure delivery zone/rate।
- Enable/disable payment methods।
- Configure and preview COD rules।
- Process order and shipment।
- Record COD collection।
- Handle cancellation/return/refund।
- Moderate reviews।
- Update branding/homepage content।
- Read reports এবং audit log।

## Customization guide requirements

- Which changes require no code।
- Which settings are environment-only।
- Approved branding token boundaries।
- Homepage protected slots বনাম redesignable surface boundaries।
- MUI current stack হলেও alternative design system/custom UI adoption এবং consistency rules।
- Add payment/storage/email/shipping adapter procedure।
- Add business-specific product rule safely।
- Add locale/content।
- Unsupported multi-vendor scope এবং extension boundary।

## Deployment guide requirements

- Runtime prerequisites।
- Environment variable table with secret classification।
- Database provision এবং migration।
- Seed policy।
- Media storage।
- Payment callback/webhook URLs।
- Email configuration।
- Background/outbox worker operation।
- Health checks, logging এবং monitoring।
- Backup/restore।
- Rollback এবং incident checklist।

## Documentation verification

- Fresh-clone setup walkthrough।
- All internal links check।
- Commands copied and executed in clean environment।
- API docs compared with contract tests।
- Schema docs compared with Prisma schema।
- Admin guide operator walkthrough।
- Customization guide দিয়ে fictional business setup rehearsal।
- Release guide staging rehearsal।

## Maintenance rule

Documentation task আলাদা future cleanup হিসেবে defer করা যাবে না যদি একই implementation task public behavior, schema, configuration, environment variable, operational workflow বা API contract বদলায়।
