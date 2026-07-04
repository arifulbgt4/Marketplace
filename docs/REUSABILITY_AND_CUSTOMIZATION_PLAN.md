# Reusability and Customization Plan

## Goal

একই codebase বিভিন্ন B2C business-এর জন্য reuse করা যাবে। Business-specific branding, catalog, operational rules এবং content configuration দিয়ে বদলাবে; core commerce correctness fork বা hardcoded conditional-এর উপর নির্ভর করবে না।

## Deployment model

- একটি deployment একটি business serve করবে।
- Database settings business configuration রাখবে।
- Environment/secret manager provider credentials রাখবে।
- Multi-tenant SaaS current scope নয়।
- Multi-vendor seller/commission/payout current core scope নয়।

## Configuration layers

| Layer | Examples | Owner |
|---|---|---|
| Environment secrets | DB, auth secret, payment secret, SMTP, storage credentials | Deployment operator |
| Business identity | Name, legal name, phone, email, address | Business admin |
| Commerce settings | Currency, tax, minimum order, cancellation rules | Business admin |
| Catalog settings | Categories, product rules, visibility | Catalog manager/admin |
| Payment settings | Enabled methods, COD rules | Authorized admin |
| Delivery settings | Zones, methods, rates, thresholds | Authorized admin |
| Branding | Logo, favicon, colors, typography tokens, social links | Business admin |
| Content | Homepage sections, banners, localized text | Content/admin user |
| Feature flags | Optional reviews, wishlist, support behavior | Deployment/business admin by policy |

## Branding configuration

Required settings:

- Marketplace display name, short name এবং legal name।
- Primary/secondary color tokens এবং safe contrast validation।
- Logo, compact logo, favicon এবং social sharing image।
- Default theme mode।
- Typography selection from approved options।
- SEO title template, description এবং social profiles।
- Support email/phone এবং footer business information।

Existing MUI design structure থাকবে; branding settings approved design tokens বদলাবে, component layout নয়।

## Catalog customization

- Admin-defined category hierarchy এবং ordering।
- Product options/variants business অনুযায়ী dynamic।
- Product attributes hardcoded bedroom/guest/property fields হবে না।
- Optional category-specific attribute definitions future extension হতে পারে।
- SKU, barcode, media এবং visibility generic থাকবে।
- Product rules centralized validation policy ব্যবহার করবে।

## Payment customization

- Payment methods enable/disable করা যাবে।
- COD নিজস্ব rule editor ব্যবহার করবে।
- Online gateways adapter contract implement করবে।
- Provider secret database settings বা client response-এ থাকবে না।
- Checkout provider-specific UI minimal normalized configuration থেকে render করবে।

## Delivery customization

- Zone location match country, region, city বা postal pattern থেকে করা যাবে।
- Zone-specific delivery methods এবং rates থাকবে।
- Flat, threshold-based এবং extensible weight/value rules থাকবে।
- Free shipping threshold configurable হবে।
- COD zone eligibility delivery settings-এর সঙ্গে coordinated হবে।
- Carrier integration optional adapter হবে।

## Business information

- Legal/display business name।
- Registered/operational address।
- Support email এবং phone।
- Default locale, timezone এবং currency।
- Tax registration/reference fields।
- Terms, privacy, return, cancellation এবং delivery policy links/content।
- Social links এবং public contact channels।

## Homepage/content sections

Recommended section types:

- Hero/banner।
- Featured categories।
- Featured/new/best-selling products।
- Promotional banner।
- Rich text/business message।
- Trust/service benefits।
- Review/testimonial section when enabled।
- Newsletter/contact CTA when enabled।

প্রতিটি section-এর order, visibility, schedule এবং localized content configuration থাকবে। Unknown section type storefront crash করবে না; safe validation error বা unsupported-state handling থাকবে।

## Hardcoding prohibited

- Currency symbol বা fixed `$`।
- `/month`, bedroom, guest বা property terminology।
- Business name, address, contact বা social links।
- Category names বা product attribute names।
- Payment method availability।
- Delivery fee/zone।
- COD thresholds।
- Homepage section order/content।
- Tax/discount calculation।
- Customer email sender বা support address।

## Provider abstraction

| Capability | Adapter boundary |
|---|---|
| Payment | Create, verify, webhook, refund, reconcile |
| Storage | Upload, validate, delete, resolve public URL |
| Email | Send template with normalized payload |
| Shipping | Quote, create shipment, track if integrated |
| Search | Core database query initially; external engine optional |

## Optional seller extension

External sellers দরকার হলে আলাদা models/modules প্রয়োজন:

- Seller organization এবং members।
- Seller verification/KYC।
- Product ownership/moderation।
- Commission rules।
- Ledger, payout এবং settlement।
- Seller order view এবং fulfillment responsibility।
- Dispute এবং return allocation।

এই capability বর্তমান `User.listings` relation-কে rename করে অর্জন করা যাবে না; separate architecture এবং financial controls দরকার।

## Customization verification

Release-এর আগে একটি clean database-এ fictional নতুন business configure করে যাচাই করতে হবে:

1. Branding এবং business identity।
2. Categories এবং products।
3. Currency এবং pricing।
4. Delivery zones/rates।
5. COD এবং online payment methods।
6. Homepage content।
7. Customer purchase এবং admin fulfillment।
8. Email/notification content।

Core source code edit ছাড়া এই rehearsal-এর standard business setup সম্পন্ন হওয়া উচিত।
