# Customization Guide

The template is designed for one B2C business per deployment. A normal business
launch should be achievable through configuration, catalog data and provider
adapters—not by scattering business-name conditionals throughout the source.

## Configuration layers

| Layer             | Examples                                                | Owner                 |
| ----------------- | ------------------------------------------------------- | --------------------- |
| Secret manager    | Database, auth, SMTP, worker and provider secrets       | Deployment operator   |
| Business settings | Identity, contacts, address, currency, locale, timezone | Admin                 |
| Branding settings | Logo, favicon, colors, SEO and social links             | Admin/design owner    |
| Catalog           | Categories, products, variants, media, stock            | Admin/catalog manager |
| Commerce policy   | Payments, COD, delivery and coupon rules                | Authorized admin      |
| Content           | Homepage section payload, order and publication         | Admin/content owner   |
| Code adapters     | Real payment, storage, shipping or search provider      | Engineering           |

## Recommended reuse procedure

1. Create a clean database for the new business.
2. Configure environment URLs and secrets.
3. Set business identity and default locale/currency/timezone.
4. Apply branding assets and accessible color tokens.
5. Create categories, products, variants, media and inventory.
6. Configure delivery zones/methods.
7. Configure COD and keep online payment disabled until a real adapter passes
   release gates.
8. Create/publish homepage content.
9. Configure SMTP and the outbox schedule.
10. Run a complete customer-to-admin order rehearsal.

Do not use `prisma/seed.ts` as production business configuration. It is a
development fixture with sample identities and catalog.

## Business identity

The implemented business settings support:

- display and legal name;
- support email and phone;
- public address;
- three-letter default currency;
- default locale;
- IANA timezone.

Validate public/legal copy with the business owner. Keep tax identifiers,
regulated notices and jurisdiction-specific policy additions in approved
content/schema extensions rather than overloading unrelated fields.

## Branding

The implemented branding settings support:

- logo and favicon URL;
- primary and secondary six-digit hex colors;
- SEO title and description;
- Facebook, Instagram, LinkedIn and YouTube links.

Use root-relative or HTTPS assets. Verify contrast, focus visibility, RTL,
mobile layouts, metadata/social preview and failure behavior when an image URL
is unavailable.

Theme implementation currently uses MUI and Emotion. MUI is not a product
restriction. Other screens may use another design system or custom UI when the
chosen approach has:

- shared tokens and primitives;
- accessible semantics, focus and contrast;
- responsive behavior;
- locale and RTL support;
- documented ownership;
- no accidental mix of incompatible interaction patterns.

## Protected homepage contract

The current homepage/Hero/Search visual composition is protected at:

- `src/app/[locale]/(WrappedPages)/page.tsx`
- `src/widgets/SearchBanner/index.tsx`
- `src/forms/SearchFilterForm/index.tsx`

Without explicit product approval, preserve:

- overall homepage visual identity;
- Hero/Search placement and hierarchy;
- spacing and responsive character;
- mobile, tablet, desktop, wide and RTL behavior.

Copy, category/product data, translations and search behavior may change for the
business while preserving the rendered visual contract. A material approved
change requires a new visual baseline and change record.

All other product, cart, checkout, auth, account, order and admin screens are
flexible and may be redesigned for the target business.

## Catalog and product rules

Use data for:

- category names/hierarchy/order;
- product/variant name, SKU, price, weight and media;
- stock;
- product status;
- category/product-specific COD restrictions.

Do not hardcode category names, product attributes, fixed currency symbols or
business-specific eligibility in pages/routes. When a new business rule is
genuinely generic, add a validated policy/settings boundary and tests.

## Payments

Admins can enable/disable and label COD/online methods. COD rules support amount,
zone, product, category, quantity and optional phone constraints.

The current online provider `MOCK` is not a real gateway. For production:

1. Implement `PaymentAdapter`.
2. Register a non-mock provider identifier.
3. Store provider secrets only in the deployment secret manager.
4. Verify signed webhook, event replay, amount/currency, out-of-order events,
   refunds and reconciliation.
5. Update the admin/provider runbook.
6. Enable online payment only after production-like acceptance.

Provider-specific logic belongs behind the adapter, not in checkout UI or order
services.

## Delivery

Configure country and optional region/postal zones, then attach active delivery
methods/rates. Test thresholds and weight/value boundaries. COD references zone
ids, so review COD eligibility whenever zones are changed.

A carrier integration should be an adapter that returns normalized shipment
and tracking data. Do not make order state depend directly on a carrier SDK.

## Homepage content

Content sections are stored with type, locale, order, payload, active and
publication state. Use the admin content workflow rather than embedding
business copy in components.

Content payloads must be validated. Unknown section types or malformed payloads
must fail safely rather than crash the storefront.

## Internationalization

Supported locale files live in `messages/`. English is the complete fallback
contract; Bengali and Arabic have meaningful core translations, and Arabic is
RTL. When adding a message:

1. Add the English key.
2. Add meaningful translations for launch locales.
3. Run locale-parity tests.
4. Verify money/date with the selected locale and currency.
5. Manually verify RTL for directional icons and complex layouts.

## Prohibited hardcoding

Do not hardcode:

- business name, address, support contact or social links;
- currency symbol or locale;
- category/product names;
- payment availability/provider secret;
- COD limits;
- delivery zone/rate;
- coupon/discount calculation;
- homepage section order/content;
- SMTP sender;
- order/payment/fulfillment shortcuts.

## Multi-vendor boundary

Multi-vendor is not enabled by legacy listing/user relations. A multi-vendor
extension requires separate seller organizations/members, KYC, product
ownership/moderation, commission ledger, settlement, payout, dispute, return
allocation and financial controls. Do not advertise the current core as a
seller marketplace.

## Launch rehearsal

On a clean non-production database:

1. Configure a fictional business without source edits.
2. Create category, product, variant and inventory.
3. Add delivery and COD rules.
4. Complete COD checkout, fulfillment and collection.
5. Complete mock online flow only as adapter verification.
6. Cancel and return eligible orders.
7. Moderate a review.
8. Confirm in-app/email outbox delivery.
9. Submit and resolve a support request.
10. Review report and audit evidence.

Any required business-specific source edit should be reviewed as a missing
configuration or adapter boundary.
