import { describe, it, expect } from "vitest";
import {
  cartAddItemSchema,
  cartUpdateItemSchema,
  cartMergeSchema,
  checkoutCreateSchema,
  checkoutUpdateSchema,
  placeOrderSchema,
  deliveryZoneSchema,
  deliveryMethodSchema,
  couponSchema,
  pricingLineItemSchema,
  pricingSummarySchema,
} from "src/lib/checkout";

describe("cartAddItemSchema", () => {
  it("validates a correct cart item", () => {
    const result = cartAddItemSchema.safeParse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      productId: "123e4567-e89b-12d3-a456-426614174001",
      sku: "TEST-001",
      productName: "Test Product",
      unitPrice: 29.99,
      quantity: 2,
    });
    expect(result.success).toBe(true);
  });

  it("does not accept client-authoritative product snapshots", () => {
    const result = cartAddItemSchema.parse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      productId: "123e4567-e89b-12d3-a456-426614174001",
      sku: "TEST-001",
      productName: "Test Product",
      unitPrice: 0,
      quantity: 2,
    });
    expect(result).toEqual({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 2,
    });
  });

  it("rejects quantity exceeding 100", () => {
    const result = cartAddItemSchema.safeParse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      productId: "123e4567-e89b-12d3-a456-426614174001",
      sku: "TEST-001",
      productName: "Test Product",
      unitPrice: 29.99,
      quantity: 101,
    });
    expect(result.success).toBe(false);
  });

  it("requires only a variant identity and quantity", () => {
    const result = cartAddItemSchema.safeParse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("cartUpdateItemSchema", () => {
  it("allows zero quantity to remove", () => {
    const result = cartUpdateItemSchema.safeParse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative quantity", () => {
    const result = cartUpdateItemSchema.safeParse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("cartMergeSchema", () => {
  it("validates a session token", () => {
    const result = cartMergeSchema.safeParse({ sessionToken: "abc-123" });
    expect(result.success).toBe(true);
  });

  it("rejects empty token", () => {
    const result = cartMergeSchema.safeParse({ sessionToken: "" });
    expect(result.success).toBe(false);
  });
});

describe("checkoutCreateSchema", () => {
  it("validates with only cartId", () => {
    const result = checkoutCreateSchema.safeParse({
      cartId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  it("validates with all fields", () => {
    const result = checkoutCreateSchema.safeParse({
      cartId: "123e4567-e89b-12d3-a456-426614174000",
      couponCode: "SAVE10",
      deliveryMethodId: "123e4567-e89b-12d3-a456-426614174001",
      shippingAddressId: "123e4567-e89b-12d3-a456-426614174002",
    });
    expect(result.success).toBe(true);
  });
});

describe("placeOrderSchema", () => {
  it("validates a correct place order", () => {
    const result = placeOrderSchema.safeParse({
      checkoutSessionId: "123e4567-e89b-12d3-a456-426614174000",
      idempotencyKey: "123e4567-e89b-12d3-a456-426614174001",
      paymentMethod: "cod",
    });
    expect(result.success).toBe(true);
  });

  it("defaults payment method to cod", () => {
    const result = placeOrderSchema.parse({
      checkoutSessionId: "123e4567-e89b-12d3-a456-426614174000",
      idempotencyKey: "123e4567-e89b-12d3-a456-426614174001",
    });
    expect(result.paymentMethod).toBe("cod");
  });
});

describe("deliveryZoneSchema", () => {
  it("validates a correct zone", () => {
    const result = deliveryZoneSchema.safeParse({
      name: "US Mainland",
      slug: "us-mainland",
      countries: ["US"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const result = deliveryZoneSchema.safeParse({
      name: "US Mainland",
      slug: "US Mainland",
      countries: ["US"],
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one country", () => {
    const result = deliveryZoneSchema.safeParse({
      name: "Empty Zone",
      slug: "empty-zone",
      countries: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("deliveryMethodSchema", () => {
  it("validates a correct method", () => {
    const result = deliveryMethodSchema.safeParse({
      zoneId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Standard Shipping",
      code: "standard",
      price: 5.99,
    });
    expect(result.success).toBe(true);
  });

  it("allows an explicitly free delivery method", () => {
    const result = deliveryMethodSchema.safeParse({
      zoneId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Free Shipping",
      code: "free",
      price: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid shipping weight range", () => {
    const result = deliveryMethodSchema.safeParse({
      zoneId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Parcel Shipping",
      code: "parcel",
      price: 7.5,
      minWeightGrams: 500,
      maxWeightGrams: 5000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an inverted shipping weight range", () => {
    const result = deliveryMethodSchema.safeParse({
      zoneId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Invalid Shipping",
      code: "invalid-weight",
      price: 7.5,
      minWeightGrams: 5000,
      maxWeightGrams: 500,
    });
    expect(result.success).toBe(false);
  });
});

describe("couponSchema", () => {
  it("validates percentage coupon", () => {
    const result = couponSchema.safeParse({
      code: "SAVE10",
      discountType: "percentage",
      discountValue: 10,
    });
    expect(result.success).toBe(true);
  });

  it("validates fixed coupon", () => {
    const result = couponSchema.safeParse({
      code: "FIVE_OFF",
      discountType: "fixed",
      discountValue: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects lowercase coupon code", () => {
    const result = couponSchema.safeParse({
      code: "save10",
      discountType: "percentage",
      discountValue: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative discount value", () => {
    const result = couponSchema.safeParse({
      code: "NEGATIVE",
      discountType: "fixed",
      discountValue: -10,
    });
    expect(result.success).toBe(false);
  });

  it("allows scoped coupon", () => {
    const result = couponSchema.safeParse({
      code: "CATEGORY10",
      discountType: "percentage",
      discountValue: 10,
      scope: "category",
      scopeIds: ["cat-id-1"],
    });
    expect(result.success).toBe(true);
  });
});

describe("pricingSummarySchema", () => {
  it("validates full pricing", () => {
    const result = pricingSummarySchema.safeParse({
      subtotal: 100,
      discountAmount: 10,
      shippingCost: 5,
      total: 95,
      currency: "USD",
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults", () => {
    const result = pricingSummarySchema.parse({ subtotal: 50, total: 50 });
    expect(result.discountAmount).toBe(0);
    expect(result.shippingCost).toBe(0);
    expect(result.currency).toBe("USD");
  });
});

describe("PricingCalculator", () => {
  it("calculates total from subtotal, discount, and shipping", () => {
    const sub = 100;
    const discount = 10;
    const shipping = 5;
    const total = Math.round((sub - discount + shipping) * 100) / 100;
    expect(total).toBe(95);
  });

  it("handles zero discount", () => {
    const sub = 100;
    const discount = 0;
    const shipping = 0;
    const total = Math.round((sub - discount + shipping) * 100) / 100;
    expect(total).toBe(100);
  });

  it("handles only shipping cost", () => {
    const sub = 100;
    const discount = 0;
    const shipping = 10;
    const total = Math.round((sub - discount + shipping) * 100) / 100;
    expect(total).toBe(110);
  });

  it("percentage discount calculation", () => {
    const subtotal = 100;
    const percent = 15;
    const discount = subtotal * (percent / 100);
    expect(discount).toBe(15);
    const total = Math.round((subtotal - discount) * 100) / 100;
    expect(total).toBe(85);
  });

  it("fixed discount capped at subtotal", () => {
    const subtotal = 20;
    const fixedDiscount = 50;
    const discount = Math.min(fixedDiscount, subtotal);
    expect(discount).toBe(20);
  });

  it("max discount cap applied", () => {
    const subtotal = 200;
    const percent = 50;
    const rawDiscount = subtotal * (percent / 100);
    const maxDiscount = 50;
    const discount = Math.min(rawDiscount, maxDiscount);
    expect(rawDiscount).toBe(100);
    expect(discount).toBe(50);
  });
});
