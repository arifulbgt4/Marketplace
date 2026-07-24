# API Documentation

## Scope and inventory

এই contract 2026-07-25 তারিখে `src/app/api/**/route.ts` mechanically
inventory করে তৈরি। Snapshot-এ:

- 82টি route file
- 117টি HTTP method/path contract
- 3টি explicit legacy `410 Gone` method family

এই document runtime source-এর human-readable companion; generated OpenAPI
spec নয়। Route/schema change হলে mechanical inventory পুনরায় চালিয়ে এই file
আপডেট করতে হবে।

## Base conventions

- Base path: `/api`
- Request/response format: JSON, CSV ব্যতিক্রম শুধু admin report export।
- Dynamic identifiers are UUID unless a contract explicitly uses slug,
  reference, provider reference or order number.
- Active NextAuth credential session carries `userId`, `role`, account status
  and session version.
- `Cache-Control: private, no-store` is used by newer PII/operation endpoints;
  public catalog/content reads use bounded surrogate caching.

### Authentication labels

| Label            | Meaning                                                  |
| ---------------- | -------------------------------------------------------- |
| Public           | Session not required                                     |
| Optional session | Anonymous accepted; active user is linked when present   |
| Customer         | Any active authenticated user; records are owner-scoped  |
| Owner/staff      | Owning customer or `admin`/`support` under domain policy |
| Catalog staff    | `admin` or `catalog_manager`                             |
| Staff read       | `admin`, `catalog_manager` or `support`                  |
| Operations       | `admin` or `support`                                     |
| Admin            | `admin` only                                             |
| Signed webhook   | HMAC-authenticated payment-provider request              |
| Worker bearer    | `Authorization: Bearer <OUTBOX_WORKER_SECRET>`           |

### Error contract

Most service-backed routes return:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "requestId": "opaque-id",
  "details": {
    "issues": []
  }
}
```

Common statuses:

| Status | Meaning                                                 |
| ------ | ------------------------------------------------------- |
| `400`  | Invalid JSON, field validation or malformed identifier  |
| `401`  | Missing/invalid session, signature or worker bearer     |
| `403`  | Role/ownership denied                                   |
| `404`  | Owned or staff-visible resource not found               |
| `409`  | Unique/version/idempotency/concurrent mutation conflict |
| `410`  | Explicitly retired legacy API                           |
| `413`  | Payment webhook larger than 64 KiB                      |
| `422`  | Business/state/eligibility rule rejected                |
| `429`  | Rate limit exceeded                                     |
| `500`  | Safe unexpected error                                   |
| `503`  | Required worker/webhook configuration unavailable       |

Registration and NextAuth retain their own compatible envelopes. A few older
routes do not normalize malformed JSON consistently; see **Known contract
gaps**.

### Idempotency

- Order placement body requires UUID `idempotencyKey`.
- COD collection and refund require `Idempotency-Key` header.
- Payment webhooks derive `webhook:<PROVIDER>:<eventId>`.
- Outbox, resource releases and notification projections have stored unique
  idempotency keys.

## Identity, account and address APIs

| Method   | Path                                | Auth             | Input                                                                                                  | Success                                                               | Specific errors                                                   |
| -------- | ----------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `POST`   | `/api/register`                     | Public           | `{name:2..100,email,password>=8 with upper/lower/digit}`                                               | `201`; safe user, verification requirement/delivery state, request ID | `409` duplicate email; `429` after 5/15 min per IP                |
| `GET`    | `/api/auth/[...nextauth]`           | NextAuth-managed | NextAuth callback/query contract                                                                       | NextAuth response/cookies                                             | NextAuth-managed                                                  |
| `POST`   | `/api/auth/[...nextauth]`           | NextAuth-managed | Credentials/callback contract                                                                          | NextAuth response/cookies                                             | NextAuth-managed                                                  |
| `GET`    | `/api/session`                      | Customer         | None                                                                                                   | `{authenticated:true,session}`                                        | `401` when not logged in                                          |
| `GET`    | `/api/profile`                      | Customer         | None                                                                                                   | Owned profile DTO                                                     | `401`, `404`                                                      |
| `PATCH`  | `/api/profile`                      | Customer         | Optional `name,email,phone,image,bio`                                                                  | Updated owned profile                                                 | `400`, `401`, `409`                                               |
| `POST`   | `/api/account/password`             | Customer         | `{currentPassword,newPassword,confirmPassword}`                                                        | `{changed:true,reauthenticationRequired:true}`                        | `400`, `401`, `422` wrong current password                        |
| `POST`   | `/api/account/recovery/request`     | Public           | `{email}`                                                                                              | `202` enumeration-safe accepted message; dev-only preview may appear  | `400`; `429` after 5/15 min per IP                                |
| `POST`   | `/api/account/recovery/reset`       | Public           | `{token:64 hex,password:12..128,confirmPassword}`                                                      | `{reset:true,reauthenticationRequired:true}`                          | `400`, `404`, `422` expired/used                                  |
| `POST`   | `/api/account/verification/request` | Public           | `{email}`                                                                                              | `202` enumeration-safe accepted message; dev-only preview may appear  | `400`; `429` after 5/15 min per IP                                |
| `GET`    | `/api/account/verification/confirm` | Public           | Query `token` 64 hex                                                                                   | Redirect `/signin?verified=1`                                         | Invalid/expired redirects `/signin?verification=invalid`          |
| `POST`   | `/api/account/verification/confirm` | Public           | `{token:64 hex}`                                                                                       | `{verified:true}`                                                     | `400`, `404`, `422`                                               |
| `GET`    | `/api/address`                      | Customer         | None                                                                                                   | `{addresses:[owned address DTO]}`                                     | `401`                                                             |
| `POST`   | `/api/address`                      | Customer         | Shipping/billing type, label, lines, city/state, postal code, 2-letter country, optional phone/default | `201` address DTO                                                     | `400`, `401`                                                      |
| `GET`    | `/api/address/[id]`                 | Customer owner   | Path address UUID                                                                                      | Owned address DTO                                                     | `401`, `403`, `404`                                               |
| `PATCH`  | `/api/address/[id]`                 | Customer owner   | Partial address fields                                                                                 | Updated address DTO                                                   | `400`, `401`, `403`, `404`                                        |
| `DELETE` | `/api/address/[id]`                 | Customer owner   | Path address UUID                                                                                      | `{deleted:true}`                                                      | `401`, `403`, `404`, business rule for referenced/default address |

Account verification and recovery delivery is direct SMTP, not transactional
outbox. In production, missing SMTP is unavailable internally while request
responses remain enumeration-safe.

## Cart, wishlist, notification and support APIs

| Method   | Path                             | Auth                             | Input                                                                                                      | Success                                                                                    | Specific errors                                       |
| -------- | -------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `GET`    | `/api/cart`                      | Guest signed cookie or customer  | Signed cart cookie optional                                                                                | Cart DTO with items, totals, version and warnings; issues HttpOnly cart cookie when needed | `400`, `422`                                          |
| `POST`   | `/api/cart`                      | Guest signed cookie or customer  | `{variantId:UUID,quantity:1..100}`                                                                         | `201` updated cart DTO                                                                     | `400`, `404`, `422` unavailable/stock                 |
| `PATCH`  | `/api/cart`                      | Guest signed cookie or customer  | `{variantId:UUID,quantity:0..100}`; zero removes                                                           | Updated cart DTO                                                                           | `400`, `404`, `422`                                   |
| `DELETE` | `/api/cart`                      | Guest signed cookie or customer  | None                                                                                                       | Cleared cart DTO                                                                           | `400`                                                 |
| `POST`   | `/api/cart/merge`                | Customer plus valid guest cookie | None                                                                                                       | Customer cart after deterministic merge; guest cookie deleted                              | `400` guest missing; `401`; stock warnings may remain |
| `GET`    | `/api/wishlist`                  | Customer                         | Query `ids=true` optional                                                                                  | Full wishlist or product ID list                                                           | `401`                                                 |
| `PUT`    | `/api/wishlist`                  | Customer                         | `{productId:UUID,wished:boolean}`                                                                          | Current wished state/count contract                                                        | `400`, `401`, `404`                                   |
| `GET`    | `/api/notifications`             | Customer                         | Query `page,limit<=100,unreadOnly`                                                                         | `{items,page,limit,total,unreadCount}` excluding expired                                   | `400`, `401`                                          |
| `PATCH`  | `/api/notifications/[id]/read`   | Customer owner                   | Notification UUID                                                                                          | `{id,readAt}`                                                                              | `401`, `404` without cross-user disclosure            |
| `PATCH`  | `/api/notifications/read-all`    | Customer                         | None                                                                                                       | `{count,readAt}`                                                                           | `401`                                                 |
| `GET`    | `/api/notifications/preferences` | Customer                         | None                                                                                                       | Transactional flags plus marketing preferences                                             | `401`                                                 |
| `PATCH`  | `/api/notifications/preferences` | Customer                         | One or both `emailMarketing,inAppMarketing`                                                                | Updated preferences; transactional channels remain enabled                                 | `400`, `401`                                          |
| `POST`   | `/api/support`                   | Optional session                 | Strict `{source,name,email,phone?,subject,message,context?}`; listing report requires listing UUID context | `202` `{accepted,reference,status,createdAt}` without submitted PII                        | `400`; `429` after 8/15 min per user/IP               |

Support sources are `CONTACT` and `LISTING_REPORT`; public callers cannot read a
request by reference. Full PII is staff-only.

## Public catalog, content, delivery and review APIs

| Method  | Path                                    | Auth                        | Input                                                                                                                                                      | Success                                                      | Specific errors                                                           |
| ------- | --------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `GET`   | `/api/catalog`                          | Public                      | Detail `slug`; category `category,page,limit`; featured `featured=true,limit`; or search `query,categoryId,minPrice,maxPrice,sort,availability,page,limit` | Product detail or paginated published catalog DTO            | `400`, `404`; `429` after 300/min per identity                            |
| `GET`   | `/api/catalog/categories`               | Public                      | None                                                                                                                                                       | Active category tree/list DTO                                | `500` safe service error                                                  |
| `GET`   | `/api/catalog/suggestions`              | Public                      | Query `query:2..100,limit<=10`                                                                                                                             | Bounded product/category suggestions                         | `400`; `429` after 120/min                                                |
| `GET`   | `/api/content/home`                     | Public                      | Query `locale` default `en`                                                                                                                                | Visible published lower-homepage sections                    | `400`; public cache                                                       |
| `GET`   | `/api/storefront/settings`              | Public                      | None                                                                                                                                                       | Allow-listed business/branding/payment presentation settings | `500`; public cache                                                       |
| `GET`   | `/api/delivery/zones`                   | Public                      | No query for active zones; or quote query `country,region?,postalCode?,subtotal,currency,weightGrams`                                                      | Active zones or eligible shipping quote/methods              | `400`, `422`; `429` after 120/min                                         |
| `GET`   | `/api/products/[id]/reviews`            | Public                      | Product UUID                                                                                                                                               | `{reviews,summary:{average,count}}` for approved reviews     | `429` after 240/min                                                       |
| `POST`  | `/api/products/[id]/reviews`            | Customer verified purchaser | `{orderItemId:UUID,rating:1..5,comment:3..2000}`                                                                                                           | `201` pending review                                         | `400`, `401`, `409`; `422` without delivered purchase; `429` after 20/min |
| `PATCH` | `/api/products/[id]/reviews/[reviewId]` | Customer review owner       | `{rating:1..5,comment:3..2000}`                                                                                                                            | Updated review reset to pending moderation                   | `400`, `401`, `404`, `422`                                                |

Public catalog responses use bounded surrogate cache headers. Customer/private
mutations must not be cached.

## Checkout, coupon and payment-method APIs

| Method  | Path                                 | Auth                | Input                                                                         | Success                                                                        | Specific errors                                                  |
| ------- | ------------------------------------ | ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `POST`  | `/api/checkout`                      | Customer cart owner | `{cartId,couponCode?,deliveryMethodId?,shippingAddressId?,billingAddressId?}` | `201` active 30-minute checkout snapshot/totals                                | `400`, `401`, `403`, `404`, `422` empty/stale cart               |
| `GET`   | `/api/checkout/[id]`                 | Customer owner      | Checkout UUID                                                                 | Checkout snapshot; expired active session may be marked expired                | `401`, `403`, `404`                                              |
| `PATCH` | `/api/checkout/[id]`                 | Customer owner      | Partial coupon/delivery/address IDs                                           | Recalculated checkout snapshot                                                 | `400`, `401`, `403`, `404`, `422` stale cart/rule                |
| `GET`   | `/api/checkout/[id]/payment-methods` | Customer owner      | Checkout UUID                                                                 | Array for `cod` and `online` with label, description, eligible and reason code | `401`, `403`, `404`; current fallback may expose raw 500 message |
| `POST`  | `/api/checkout/place`                | Customer owner      | `{checkoutSessionId:UUID,idempotencyKey:UUID,paymentMethod:"cod"              | "online",notes?}`                                                              | `201` order/payment result; replay returns stored result         | `400`, `401`, `403`, `404`, `409`, `422` revalidation/eligibility |
| `POST`  | `/api/coupon/validate`               | Customer            | `{code,subtotal,productIds<=100,categoryIds<=100}`                            | Coupon eligibility and discount contract                                       | `400`, `401`, `422`; `429` after 60/min                          |

`online` is eligible only when settings enable a registered provider. The only
online provider implemented in this repository is `MOCK`; that is not a
production payment claim.

## Customer order and payment webhook APIs

| Method | Path                       | Auth                    | Input                                                                                              | Success                                                                          | Specific errors                                            |
| ------ | -------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `GET`  | `/api/orders`              | Customer                | Query `orderStatus`/legacy `status`, `paymentStatus`, `fulfillmentStatus`, `page`, `limit<=100`    | Paginated owned order summaries                                                  | `400`, `401`                                               |
| `GET`  | `/api/orders/[id]`         | Customer owner          | Order UUID                                                                                         | Owned order detail, snapshots, history, payment, shipment and return projections | `401`, `404` for non-owned/unknown                         |
| `POST` | `/api/orders/[id]/cancel`  | Owner/staff             | `{reason:3..500,expectedVersion>=0}`                                                               | Cancellation result, payment/refund flag, compensation and next version          | `401`, `403`, `404`, `409`, `422` state/window/fulfillment |
| `POST` | `/api/orders/[id]/returns` | Customer owner          | `{reason:3..1000,items:[{orderItemId,quantity,reason?,condition?}]}`                               | `201` return request/items                                                       | `400`, `401`, `404`, `422` not delivered/excess quantity   |
| `POST` | `/api/payment/webhook`     | Signed webhook          | Query `provider` default `MOCK`; raw JSON <=64 KiB; `x-mock-signature`; event ID/ref/amount/status | Reconciliation applied or duplicate/ignored no-op result                         | `400`, `401`, `404`, `413`, `422`, `503` unconfigured      |
| `POST` | `/api/orders`              | Public retired contract | None used                                                                                          | Always `410`; replacement `/api/checkout/place`                                  | `410 LEGACY_FEATURE_RETIRED`                               |

## Admin catalog and inventory APIs

| Method   | Path                                | Auth          | Input                                                        | Success                                                | Specific errors                                                   |
| -------- | ----------------------------------- | ------------- | ------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `GET`    | `/api/admin/categories`             | Staff read    | None                                                         | All categories with hierarchy/counts                   | `401`, `403`                                                      |
| `POST`   | `/api/admin/categories`             | Catalog staff | `{name,slug,icon?,image?,parentId?,displayOrder?,isActive?}` | `201` category                                         | `400`, `401`, `403`, `404` parent, `409` slug                     |
| `GET`    | `/api/admin/categories/[id]`        | Staff read    | Category UUID                                                | Category, parent/children and counts                   | `401`, `403`, `404`                                               |
| `PATCH`  | `/api/admin/categories/[id]`        | Catalog staff | Partial category fields                                      | Updated category                                       | `400` cycle/self-parent, `401`, `403`, `404`, `409`               |
| `DELETE` | `/api/admin/categories/[id]`        | Catalog staff | Category UUID                                                | `{deleted:true}`                                       | `400` while children/products/listings exist; `401`, `403`, `404` |
| `GET`    | `/api/admin/categories/tree`        | Staff read    | None                                                         | Active nested category tree                            | `401`, `403`                                                      |
| `GET`    | `/api/admin/products`               | Staff read    | Query `status,categoryId,search,page,limit`                  | `{products,total,page,totalPages}`                     | `401`, `403`                                                      |
| `POST`   | `/api/admin/products`               | Catalog staff | Product fields plus optional variants/options/media          | `201` draft product graph                              | `400`, `401`, `403`, `409` slug/SKU                               |
| `GET`    | `/api/admin/products/[id]`          | Staff read    | Product UUID                                                 | Product with variants/inventory/options/media/category | `401`, `403`, `404`                                               |
| `PATCH`  | `/api/admin/products/[id]`          | Catalog staff | Partial name/slug/description/brand/tax/category             | Updated product graph                                  | `400`, `401`, `403`, `404`, `409`                                 |
| `DELETE` | `/api/admin/products/[id]`          | Catalog staff | Product UUID                                                 | Archived product; no hard delete                       | `401`, `403`, `404`                                               |
| `POST`   | `/api/admin/products/[id]/publish`  | Catalog staff | None                                                         | Published product graph                                | `400` publish readiness, `401`, `403`, `404`                      |
| `POST`   | `/api/admin/products/[id]/variants` | Catalog staff | `{sku,barcode?,price,compareAtPrice?,weightGrams?}`          | `201` variant with initial inventory                   | `400`, `401`, `403`, `404`, `409` SKU                             |
| `POST`   | `/api/admin/products/[id]/media`    | Catalog staff | `{url,alt?,order?,isPrimary?}`                               | `201` media metadata                                   | `400`, `401`, `403`, `404`, `409` primary                         |
| `GET`    | `/api/admin/inventory`              | Staff read    | `productId` or `lowStock=true` and optional product ID       | Inventory rows or low-stock rows                       | `400` missing selector, `401`, `403`                              |
| `GET`    | `/api/admin/inventory/ledger`       | Staff read    | `variantId`, optional `page,limit`                           | Paginated ledger                                       | `400`, `401`, `403`, `404`                                        |
| `POST`   | `/api/admin/inventory/adjust`       | Catalog staff | `{variantId,quantity nonzero -1m..1m,reason:3..500}`         | Updated balance and ledger entry                       | `400`, `401`, `403`, `404`, `422` negative balance                |

## Admin delivery, coupon, content and settings APIs

| Method   | Path                              | Auth       | Input                                                                      | Success                                                       | Specific errors                                       |
| -------- | --------------------------------- | ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `GET`    | `/api/admin/delivery/zones`       | Admin      | None                                                                       | All zones/methods                                             | `401`, `403`                                          |
| `POST`   | `/api/admin/delivery/zones`       | Admin      | Name/slug, country/region/postal arrays, active/priority                   | `201` zone                                                    | `400`, `401`, `403`, `409` slug                       |
| `GET`    | `/api/admin/delivery/zones/[id]`  | Admin      | Zone UUID                                                                  | Zone with methods                                             | `401`, `403`, `404`                                   |
| `PATCH`  | `/api/admin/delivery/zones/[id]`  | Admin      | Partial zone fields                                                        | Updated zone                                                  | `400`, `401`, `403`, `404`, `409`                     |
| `DELETE` | `/api/admin/delivery/zones/[id]`  | Admin      | Zone UUID                                                                  | Deleted zone when unused                                      | `401`, `403`, `404`, `422` referenced                 |
| `POST`   | `/api/admin/delivery/methods`     | Admin      | Zone, name/code, carrier, price/free threshold, weight/day windows, active | `201` delivery method                                         | `400`, `401`, `403`, `404`, `409` code                |
| `GET`    | `/api/admin/coupons`              | Admin      | None                                                                       | Coupon list                                                   | `401`, `403`                                          |
| `POST`   | `/api/admin/coupons`              | Admin      | Coupon code/type/value/scope/limits/window                                 | `201` coupon                                                  | `400`, `401`, `403`, `409` code                       |
| `GET`    | `/api/admin/coupons/[id]`         | Admin      | Coupon UUID                                                                | Coupon detail                                                 | `401`, `403`, `404`                                   |
| `PATCH`  | `/api/admin/coupons/[id]`         | Admin      | Partial coupon schema                                                      | Updated coupon                                                | `400`, `401`, `403`, `404`, `409`                     |
| `DELETE` | `/api/admin/coupons/[id]`         | Admin      | Coupon UUID                                                                | Archived/disabled coupon                                      | `401`, `403`, `404`                                   |
| `GET`    | `/api/admin/content`              | Admin      | Query `locale,status`                                                      | Revision list with editor                                     | `400`, `401`, `403`                                   |
| `POST`   | `/api/admin/content`              | Admin      | `{sectionKey,sectionType,locale,displayOrder>=100,isVisible,content}`      | `201` new draft revision                                      | `400`, `401`, `403`, `422` protected Hero/Search key  |
| `PATCH`  | `/api/admin/content/[id]`         | Admin      | Nonempty partial type/order/visible/content                                | Updated draft                                                 | `400`, `401`, `403`, `404`, `422` non-draft/protected |
| `POST`   | `/api/admin/content/[id]/publish` | Admin      | None                                                                       | Published revision; previous published revision archived      | `401`, `403`, `404`, `422`                            |
| `GET`    | `/api/admin/settings/business`    | Admin      | None                                                                       | Validated business settings                                   | `401`, `403`                                          |
| `PATCH`  | `/api/admin/settings/business`    | Admin      | Partial display/legal/support/currency/locale/timezone fields              | Merged settings                                               | `400`, `401`, `403`                                   |
| `GET`    | `/api/admin/settings/branding`    | Admin      | None                                                                       | Validated branding settings                                   | `401`, `403`                                          |
| `PATCH`  | `/api/admin/settings/branding`    | Admin      | Partial safe asset URLs, hex colors, SEO/social links                      | Merged branding                                               | `400` unsafe URL/secret-like field, `401`, `403`      |
| `GET`    | `/api/admin/settings/payments`    | Admin      | None                                                                       | COD/online labels, enabled state and provider key; no secrets | `401`, `403`                                          |
| `PATCH`  | `/api/admin/settings/payments`    | Admin      | Partial COD/online presentation plus provider key                          | Merged payment settings                                       | `400` unknown/secret-like field, `401`, `403`         |
| `GET`    | `/api/admin/settings/cod`         | Operations | None                                                                       | Effective COD rules                                           | `401`, `403`; unavailable DB fails closed             |
| `PATCH`  | `/api/admin/settings/cod`         | Admin      | Partial amount/zone/product/category/item/phone/instruction rules          | Saved rules with incremented rule version                     | `400`, `401`, `403`                                   |
| `POST`   | `/api/admin/settings/cod/preview` | Operations | Optional user, subtotal/currency/address and <=100 items                   | `{eligible,reasonCode,evaluatedAt,ruleVersion}`               | `400`, `401`, `403`                                   |

## Admin operations, support and reporting APIs

| Method  | Path                                | Auth        | Input                                                                             | Success                                                   | Specific errors                                                     |
| ------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| `GET`   | `/api/admin/orders`                 | Operations  | Search/status/payment/fulfillment/method/date/page/limit filters                  | Paginated order summaries with customer                   | `400`, `401`, `403`                                                 |
| `GET`   | `/api/admin/orders/[id]`            | Operations  | Order UUID                                                                        | Full operational order detail                             | `401`, `403`, `404`                                                 |
| `POST`  | `/api/admin/orders/[id]/transition` | Operations  | `{kind:"ORDER"                                                                    | "FULFILLMENT",status,reason,expectedVersion}`             | Updated status/version/history result                               | `400`, `401`, `403`, `404`, `409`, `422`                  |
| `POST`  | `/api/admin/orders/[id]/cancel`     | Owner/staff | Same cancellation body as customer route                                          | Cancellation/compensation result                          | `401`, `403`, `404`, `409`, `422`                                   |
| `POST`  | `/api/admin/orders/[id]/collect`    | Operations  | Header `Idempotency-Key` 8..200; `{collectedAmount,currency,notes?,receiptRef?}`  | COD collection result, `200`, private/no-store            | `400`, `401`, `403`, `404`, `409`, `422` amount/method/status       |
| `POST`  | `/api/admin/orders/[id]/refund`     | Operations  | Header `Idempotency-Key`; `{amount>0,reason:3..500}`                              | Refund/cumulative/status/reference result                 | `400`, `401`, `403`, `404`, `409`, `422` over-refund/state/provider |
| `POST`  | `/api/admin/orders/[id]/shipments`  | Operations  | Carrier/service/tracking/estimate plus nonempty item allocations                  | `201` shipment and derived fulfillment status             | `400`, `401`, `403`, `404`, `409`, `422` quantity/state             |
| `PATCH` | `/api/admin/shipments/[id]`         | Operations  | Nonempty status/tracking/carrier/service/estimate update plus reason              | Updated shipment and derived fulfillment status           | `400`, `401`, `403`, `404`, `409`, `422` transition                 |
| `PATCH` | `/api/admin/returns/[id]`           | Operations  | `{status:APPROVED                                                                 | REJECTED                                                  | RECEIVED                                                            | COMPLETED,resolutionNote,refundAmount?}`                  | Updated return; receive can restock; complete can update fulfillment | `400`, `401`, `403`, `404`, `422` transition/refund |
| `GET`   | `/api/admin/customers`              | Operations  | Query `search,status,page,limit<=100`                                             | Staff-only customer list and pagination                   | `400`, `401`, `403`                                                 |
| `GET`   | `/api/admin/customers/[id]`         | Operations  | Customer UUID                                                                     | PII, addresses and recent orders; private/no-store        | `401`, `403`, `404`                                                 |
| `PATCH` | `/api/admin/customers/[id]`         | Admin       | `{status,reason:3..500}`                                                          | Updated status; session version increment on suspension   | `400`, `401`, `403`, `404`, `422` self/role guard                   |
| `GET`   | `/api/admin/reviews`                | Operations  | Query `status,productId,page,limit<=100`                                          | Moderation queue with author/product                      | `400`, `401`, `403`                                                 |
| `PATCH` | `/api/admin/reviews/[id]`           | Operations  | `{status:APPROVED                                                                 | REJECTED                                                  | HIDDEN                                                              | FLAGGED,note:3..1000}`                                    | Moderated review and timestamps                                      | `400`, `401`, `403`, `404`, `422`                   |
| `GET`   | `/api/admin/support`                | Operations  | Status/priority/source/assignee/unassigned/search/page/limit filters              | Staff-only request summaries, assignees and pagination    | `400`, `401`, `403`                                                 |
| `GET`   | `/api/admin/support/[id]`           | Operations  | Support request UUID                                                              | Full PII/context/internal note; private/no-store          | `400`, `401`, `403`, `404`                                          |
| `PATCH` | `/api/admin/support/[id]`           | Operations  | Required `version`; optional status/priority/assignee/internal note, at least one | Versioned updated request; audit/outbox omit note content | `400`, `401`, `403`, `404`, `409` stale version, `422` transition   |
| `GET`   | `/api/admin/dashboard`              | Admin       | Query `dateFrom,dateTo,currency`                                                  | Order/revenue/customer/inventory KPIs                     | `400`, `401`, `403`                                                 |
| `GET`   | `/api/admin/reports`                | Admin       | `type=orders                                                                      | payments                                                  | cod                                                                 | inventory`, date/currency/timezone, optional `format=csv` | JSON or CSV, max 5,000 rows plus truncated flag                      | `400`, `401`, `403`                                 |
| `GET`   | `/api/admin/audit`                  | Admin       | Actor/action/target/date/page/limit filters                                       | Audit entries and pagination                              | `400`, `401`, `403`                                                 |

## Internal worker API

| Method | Path                   | Auth          | Input                                          | Success                              | Specific errors                                                       |
| ------ | ---------------------- | ------------- | ---------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------- |
| `POST` | `/api/internal/outbox` | Worker bearer | No body; runtime env controls batch/retry/lock | `{claimed,published,retried,failed}` | `401` bearer; `503` missing/invalid config; `500` safe worker failure |

The endpoint is Node-only and force-dynamic. It does not schedule itself.
Deployment must invoke it over a protected channel with a secret of at least 32
characters.

## Explicit retired legacy APIs

| Method | Path            | Auth                    | Input   | Success                                             | Specific errors                     |
| ------ | --------------- | ----------------------- | ------- | --------------------------------------------------- | ----------------------------------- |
| `GET`  | `/api/listings` | Public retired contract | Ignored | None; successor `/api/catalog`                      | Always `410 LEGACY_FEATURE_RETIRED` |
| `POST` | `/api/listings` | Public retired contract | Ignored | None; successor `/api/catalog`                      | Always `410 LEGACY_FEATURE_RETIRED` |
| `GET`  | `/api/reviews`  | Public retired contract | Ignored | None; successor `/api/products/{productId}/reviews` | Always `410 LEGACY_FEATURE_RETIRED` |
| `POST` | `/api/reviews`  | Public retired contract | Ignored | None; successor `/api/products/{productId}/reviews` | Always `410 LEGACY_FEATURE_RETIRED` |

`POST /api/orders` is also retired and is listed with customer order APIs.
All retired responses set `Cache-Control: no-store`, `Deprecation: true` and a
successor `Link`.

## Rate-limit snapshot

| Endpoint family                      | Current process-local limit                             |
| ------------------------------------ | ------------------------------------------------------- |
| Registration, recovery, verification | 5 per 15 minutes per derived IP                         |
| Support intake                       | 8 per 15 minutes per authenticated user or validated IP |
| Catalog                              | 300 per minute                                          |
| Suggestions                          | 120 per minute                                          |
| Delivery                             | 120 per minute                                          |
| Coupon validation                    | 60 per minute                                           |
| Product review read/write            | 240/20 per minute                                       |

These limits are implemented with an in-memory bounded map. They do not provide
cross-instance enforcement; production needs shared/edge rate limiting.

## Known contract gaps

1. No generated OpenAPI/JSON Schema artifact or automated client exists.
2. Several older handlers parse `request.json()` outside normalized error
   handling and can return a framework-level response for malformed JSON.
3. `/api/checkout/[id]/payment-methods` has a raw `error.message` fallback on
   unexpected failure; other hardened routes use `asAppError`.
4. Private/no-store headers are not consistently set across every legacy admin
   response, even when authentication is enforced.
5. NextAuth, registration and AppError routes use different envelope shapes.
6. Online provider names other than `MOCK` are not implemented. Do not document
   a production gateway as available merely because the settings field accepts
   a provider string.
7. Route inventory proves source presence, not deployed reachability,
   authentication cookies, provider callbacks or production smoke success.

## Mechanical route-inventory check

The following read-only check should continue to report 82 route files. Method
drift should be compared against the 117 table rows above:

```bash
find src/app/api -name route.ts -print | sort
rg -n "export (async )?function (GET|POST|PUT|PATCH|DELETE)|export \\{ handler as (GET|POST)|export \\{ POST \\}" \
  src/app/api -g "route.ts"
```
