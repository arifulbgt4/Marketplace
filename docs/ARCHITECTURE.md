# Marketplace Architecture

## Status

এই document target architecture-এর planning baseline। এখানে বর্ণিত module বা schema এখনো implement হয়েছে ধরে নেওয়া যাবে না। Current implementation-এর সত্যতা `CURRENT_PROJECT_ANALYSIS.md`-এ নথিভুক্ত।

## Target system shape

Target হবে per-business deployable modular monolith। একই Next.js application storefront, customer account এবং admin surface serve করবে; business rules domain modules-এ থাকবে; PostgreSQL authoritative store হবে।

```mermaid
flowchart TB
    Store["Storefront and customer account"]
    Admin["Admin panel"]
    Boundary["Validated Route Handlers or Server Actions"]

    Store --> Boundary
    Admin --> Boundary

    Boundary --> Identity["Identity and authorization"]
    Boundary --> Catalog["Catalog and inventory"]
    Boundary --> Checkout["Cart, pricing and checkout"]
    Boundary --> Orders["Orders and fulfillment"]
    Boundary --> Payments["Payment orchestration"]
    Boundary --> Settings["Business settings and content"]
    Boundary --> Notify["Notifications and reporting"]

    Payments --> COD["Cash on Delivery"]
    Payments --> Gateway["Online payment adapters"]
    Orders --> Shipping["Delivery adapters"]
    Catalog --> Storage["Media storage adapter"]

    Identity --> DB["PostgreSQL via Prisma"]
    Catalog --> DB
    Checkout --> DB
    Orders --> DB
    Payments --> DB
    Settings --> DB
    Notify --> DB
```

## Core decisions

### Single-business core

প্রতিটি deployment একটি business-এর জন্য। Reusability configuration এবং adapters থেকে আসবে, runtime multi-tenancy থেকে নয়। ভবিষ্যতে SaaS control plane দরকার হলে সেটি আলাদা architecture decision হবে।

### Multi-vendor is optional

Core catalog business-owned। `admin` বা `catalog_manager` product manage করবে। External seller onboarding, KYC, commission, payout, disputes এবং seller settlement core backlog-এর অংশ নয়। এগুলো future seller bounded context।

### Modular monolith before microservices

Authentication, catalog, checkout, order এবং payment আলাদা logical modules হবে, কিন্তু initial deployment একটি application এবং database। Transactional correctness ও operational simplicity microservice decomposition-এর চেয়ে গুরুত্বপূর্ণ।

### Preserve visual design

Existing MUI theme, layout এবং component composition design baseline। Implementation task behavior এবং data wiring বদলাবে; redesign আলাদা explicit project ছাড়া করা হবে না।

## Proposed modules

| Module | Responsibility |
|---|---|
| Identity | Registration, login, verification, password recovery, account state |
| Authorization | Role এবং resource-level policies |
| Customer | Profile, addresses, preferences |
| Catalog | Product, variants, media, category, public queries |
| Inventory | Balances, reservations, commits, releases, adjustments |
| Wishlist | Customer-product saved relationship |
| Cart | Guest/customer cart lifecycle |
| Pricing | Currency-safe subtotal, discount, coupon, tax, shipping total |
| Checkout | Address, delivery quote, payment eligibility, finalization |
| Payment | Payment attempts, adapters, webhooks, COD collection, refunds |
| Order | Immutable order snapshots, statuses, history, cancellation, return |
| Fulfillment | Shipment, carrier, tracking, delivery status |
| Settings | Business, branding, payment, delivery এবং operational rules |
| Content | Homepage sections এবং localized content |
| Notification | Outbox, email, in-app events, customer preferences |
| Reporting | Operational KPIs এবং exports |
| Audit | Sensitive changes-এর actor এবং metadata |

## Layering rules

প্রতিটি domain module-এর recommended internal layers:

```text
UI page/widget/form
    -> Route Handler or Server Action
        -> validation and authorization
            -> domain/application service
                -> repository/Prisma transaction
                    -> database or external adapter
```

- UI কখনো authoritative total বা permission সিদ্ধান্ত নেবে না।
- Route Handler/Server Action complex Prisma mutation সরাসরি করবে না।
- Domain service Next.js response object জানবে না।
- External provider response canonical domain types-এ normalize হবে।
- Read model প্রয়োজনমতো optimized হতে পারে, কিন্তু mutation domain invariant bypass করবে না।

## Data rules

### Money

- Money `Float` হবে না।
- Prisma `Decimal` অথবা integer minor units ব্যবহার হবে।
- প্রতিটি monetary aggregate-এর সঙ্গে ISO currency থাকবে।
- Order totals immutable snapshot হবে।
- Client-submitted price কখনো authoritative নয়।

### Status separation

Order, payment এবং fulfillment status আলাদা থাকবে। একটি order delivered হলেও COD payment collection pending থাকতে পারে; system এটি anomaly হিসেবে report করবে, একই status field দিয়ে ঢেকে দেবে না।

### Historical retention

- Product update পুরোনো order item বদলাবে না।
- Customer/product hard delete financial history cascade করবে না।
- Archive বা anonymization policy ব্যবহার হবে।
- Payment events, status history এবং audit records append-oriented হবে।

### Transaction boundaries

Checkout finalization transaction অন্তত নিচের operations coordinate করবে:

1. Idempotency key claim।
2. Cart এবং checkout version revalidation।
3. Product price/visibility/stock revalidation।
4. Coupon eligibility revalidation।
5. Inventory reserve/commit।
6. Order এবং item snapshots create।
7. Payment attempt বা COD pending-collection record create।
8. Reliable outbox event persist।

Failure হলে partial order বা silent stock loss থাকা যাবে না।

## Security architecture

- Deny-by-default authorization policy।
- Session-এ typed user ID, role এবং account status।
- Admin layout protection যথেষ্ট নয়; প্রতিটি mutation server-side policy enforce করবে।
- Webhook signature verification এবং event idempotency বাধ্যতামূলক।
- Secrets environment-এ থাকবে; admin UI secret value ফেরত দেবে না।
- Customer শুধু নিজের profile, address, cart, wishlist, order এবং notification access করবে।
- Sensitive admin action audit হবে।
- Distributed deployment-এর rate limiting shared store-backed হবে।

## Configuration architecture

| Layer | Examples | Storage |
|---|---|---|
| Secrets | Payment secret, SMTP password, storage secret | Environment/secret manager |
| Business identity | Name, legal name, contact, address | Database settings |
| Commerce policy | Currency, tax, order rules | Database settings |
| Payment rules | Enabled methods, COD constraints | Database settings |
| Delivery rules | Zones, rates, free shipping | Database tables/settings |
| Branding | Logo, colors, favicon, SEO defaults | Database plus media storage |
| Content | Homepage sections, localized text | Database content models |
| Feature flags | Optional modules | Validated configuration |

## External adapters

Payment, storage, email এবং shipping provider-এর জন্য interface/adapter ব্যবহার হবে। Provider-specific identifiers persistence-এ রাখা যাবে, কিন্তু provider response সরাসরি storefront বা core order logic-এ leak করবে না।

## Caching and events

- Product/catalog read caching explicit invalidation policyসহ হবে।
- Business settings bounded cache ব্যবহার করতে পারে।
- Cart, checkout, payment এবং inventory mutation cached response-এর উপর নির্ভর করবে না।
- Reliable outbox order/payment/fulfillment transaction-এর সঙ্গে event persist করবে।
- Notification এবং analytics consumer idempotent হবে।

## Future extension boundaries

- Multi-vendor seller, commission, payout।
- Multiple warehouses।
- Multi-currency catalog pricing।
- Subscription products।
- Advanced tax provider।
- Search engine adapter।
- Native mobile client/API separation।

এই extension-গুলোর জন্য current core-এ অপ্রয়োজনীয় tables বা abstractions আগে থেকে যোগ করা হবে না; তবে order snapshots, adapters এবং module boundaries extension বন্ধ করবে না।
