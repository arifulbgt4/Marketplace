# P1-05 Domain Glossary

## Status: Complete

## Core Commerce Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Product** | A sellable item with variants, pricing, and inventory | `Listing` (property-specific) | Generic Product model |
| **Variant** | A specific SKU of a product (size, color, etc.) | Not implemented | ProductVariant with unique SKU |
| **SKU** | Stock Keeping Unit - unique identifier for a variant | Not implemented | Required unique string |
| **Category** | Hierarchical product classification | Implemented | Enhanced with visibility/ordering |
| **Catalog** | The complete set of published products | Partial (listings only) | Full product catalog |

## Cart & Checkout Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Cart** | Temporary collection of items before checkout | Not implemented | Guest + authenticated carts |
| **Cart Item** | A product variant and quantity in the cart | Not implemented | CartItem with quantity |
| **Checkout** | Process of finalizing an order | Booking form shell | Full checkout flow |
| **Checkout Session** | Expiring draft of checkout state | Not implemented | Time-limited session |
| **Quote** | Calculated totals including tax/shipping | Not implemented | Server-side calculation |

## Payment Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Payment** | Transaction attempt for an order | Not implemented | Payment model with attempts |
| **COD** | Cash on Delivery - pay at delivery | Not implemented | First-class payment option |
| **Online Payment** | Digital payment via gateway | Not implemented | Provider adapter system |
| **Payment Intent** | Provider session for collecting payment | Not implemented | Created per checkout |
| **Refund** | Return of payment to customer | Not implemented | Full/partial refund support |
| **Reconciliation** | Matching provider state with system state | Not implemented | Webhook + manual reconciliation |

## Order Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Order** | Immutable record of a purchase | Single listing booking | Multi-item order snapshots |
| **Order Item** | Snapshot of a product in an order | Not implemented | Immutable product snapshot |
| **Order Status** | Commercial lifecycle independent of payment and shipment progress | Free-form string | Typed enum (`PLACED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| **Payment Status** | Current state of payment | Combined with order | Separate enum (unpaid, pending, pending_collection, paid, collected, failed, refunded, partially_refunded) |
| **Fulfillment Status** | Current state of delivery | Not implemented | Separate enum (unfulfilled, processing, shipped, delivered, returned) |
| **Return Status** | Return-request lifecycle independent of original order history | Not implemented | Separate enum (none, requested, approved, rejected, received, completed) |
| **Order History** | Timeline of status changes | Not implemented | Immutable status history |

## Fulfillment Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Shipment** | Physical delivery of order items | Not implemented | Package with tracking |
| **Carrier** | Shipping provider | Not implemented | Configurable carrier |
| **Tracking** | Shipment progress monitoring | Not implemented | Tracking number + status |
| **Delivery Zone** | Geographic area for shipping rules | Not implemented | Zone-based rates |
| **Shipping Method** | How order will be delivered | Not implemented | Multiple methods per zone |

## Inventory Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Stock** | Available quantity of a variant | Not implemented | On-hand, reserved, available |
| **Reservation** | Stock held during checkout | Not implemented | Time-limited hold |
| **Commit** | Final stock deduction at order | Not implemented | Atomic stock commit |
| **Release** | Return stock to available pool | Not implemented | On cancellation/expiry |
| **Adjustment** | Manual stock correction | Not implemented | Audited adjustment |

## Customer Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Customer** | End user who purchases | User model | Enhanced with addresses |
| **Address** | Shipping/billing location | Not implemented | Multiple addresses per type |
| **Wishlist** | Saved products for later | Bookmark (partial) | Product-focused wishlist |
| **Review** | Product rating and feedback | Implemented | Verified purchase required |

## Business Terms

| Term | Definition | Current State | Target State |
|------|------------|---------------|--------------|
| **Business Settings** | Core configuration | env vars | Database-stored settings |
| **Branding** | Visual identity config | MUI theme only | Logo, colors, SEO, social এবং design-system-neutral tokens; protected homepage composition |
| **Content** | Homepage/marketing sections | Hardcoded | Configurable sections |
| **Coupon** | Discount promotion | Listing discount field | Full coupon system |
| **Tax** | Government levy on sales | Not implemented | Tax class + calculation |

## Status Enums (Target)

Canonical source: `COD_AND_PAYMENT_PLAN.md`। All status enums below follow that document.

### Order Status
- `PLACED` - Order placed, awaiting confirmation
- `CONFIRMED` - Order confirmed by seller
- `CANCELLED` - Cancelled by customer/seller
- `COMPLETED` - Commercial lifecycle explicitly closed after required fulfillment/payment conditions

### Payment Status
- `UNPAID` - Awaiting payment
- `PENDING` - Payment initiated but not confirmed (pre-paid)
- `PENDING_COLLECTION` - COD order awaiting cash collection
- `PAID` - Payment confirmed
- `COLLECTED` - COD cash collected by delivery/support actor
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded
- `PARTIALLY_REFUNDED` - Partial refund issued

### Fulfillment Status
- `UNFULFILLED` - Not yet processed
- `PROCESSING` - Being packed
- `SHIPPED` - In transit
- `DELIVERED` - Delivered
- `RETURNED` - Returned to seller

### Return Status
- `NONE` - No return workflow
- `REQUESTED` - Customer/support opened a request
- `APPROVED` - Return authorized
- `REJECTED` - Return rejected with reason
- `RECEIVED` - Returned items received and inspected
- `COMPLETED` - Return-side stock/payment actions completed

### Separation invariant

`OrderStatus`, `PaymentStatus`, `FulfillmentStatus` এবং `ReturnStatus` আলাদা axes। উদাহরণ: COD delivery-এর পরে `order=CONFIRMED`, `fulfillment=DELIVERED`, `payment=PENDING_COLLECTION` একটি বৈধ anomaly state; collection record হওয়ার আগে delivery নিজে payment বা order completion ঘটায় না।

### User Roles
- `CUSTOMER` - End user (default)
- `ADMIN` - Full system access
- `CATALOG_MANAGER` - Product/category management
- `SUPPORT` - Customer support access

## Relationship Rules

1. **Product → Variant**: One product has many variants
2. **Variant → SKU**: Each variant has unique SKU
3. **Cart → Cart Item**: One cart has many items
4. **Cart Item → Variant**: Each item references one variant
5. **Order → Order Item**: One order has many items
6. **Order Item → Product Snapshot**: Immutable product data at order time
7. **Payment → Order**: One order can have multiple payment attempts
8. **Shipment → Order**: One order can have multiple shipments
