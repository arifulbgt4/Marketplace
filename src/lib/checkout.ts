import { z } from "zod";
import type {
  DiscountType,
  CouponScope,
  CheckoutSessionStatus,
} from "@prisma/client";

export type { DiscountType, CouponScope, CheckoutSessionStatus };

export const DISCOUNT_TYPE_VALUES = ["percentage", "fixed"] as const;
export const COUPON_SCOPE_VALUES = ["all", "category", "product"] as const;
export const CHECKOUT_SESSION_STATUS_VALUES = [
  "active",
  "expired",
  "completed",
] as const;

export const cartAddItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

export const cartUpdateItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(0).max(100),
});

export const cartMergeSchema = z.object({
  sessionToken: z.string().min(1),
});

export const checkoutCreateSchema = z.object({
  cartId: z.string().uuid(),
  couponCode: z.string().optional(),
  deliveryMethodId: z.string().uuid().nullable().optional(),
  shippingAddressId: z.string().uuid().nullable().optional(),
  billingAddressId: z.string().uuid().nullable().optional(),
});

export const checkoutUpdateSchema = z.object({
  couponCode: z.string().optional(),
  deliveryMethodId: z.string().uuid().nullable().optional(),
  shippingAddressId: z.string().uuid().nullable().optional(),
  billingAddressId: z.string().uuid().nullable().optional(),
});

export const placeOrderSchema = z.object({
  checkoutSessionId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
  paymentMethod: z.enum(["cod", "online"]).default("cod"),
  notes: z.string().max(1000).optional(),
});

export const deliveryZoneSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  countries: z.array(z.string().min(2).max(100)).min(1).max(100),
  regions: z.array(z.string().min(1).max(100)).max(500).default([]),
  postalCodes: z.array(z.string().min(1).max(30)).max(1_000).default([]),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
});

export const deliveryMethodSchema = z
  .object({
    zoneId: z.string().uuid(),
    name: z.string().min(2).max(100),
    code: z.string().min(2).max(50),
    carrier: z.string().max(100).optional().nullable(),
    price: z.number().min(0).max(999999.99),
    freeShippingAbove: z
      .number()
      .positive()
      .max(999999.99)
      .optional()
      .nullable(),
    minWeightGrams: z.number().int().min(0).optional().nullable(),
    maxWeightGrams: z.number().int().positive().optional().nullable(),
    estimatedDaysMin: z.number().int().min(1).optional().nullable(),
    estimatedDaysMax: z.number().int().min(1).optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .superRefine((method, context) => {
    if (
      method.minWeightGrams != null &&
      method.maxWeightGrams != null &&
      method.minWeightGrams > method.maxWeightGrams
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxWeightGrams"],
        message:
          "Maximum weight must be greater than or equal to minimum weight",
      });
    }
  });

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[A-Z0-9_-]+$/),
    description: z.string().max(500).optional().nullable(),
    discountType: z.enum(DISCOUNT_TYPE_VALUES),
    discountValue: z.number().positive().max(999999.99),
    minOrderAmount: z.number().positive().max(999999.99).optional().nullable(),
    maxDiscountAmount: z
      .number()
      .positive()
      .max(999999.99)
      .optional()
      .nullable(),
    scope: z.enum(COUPON_SCOPE_VALUES).default("all"),
    scopeIds: z.array(z.string().min(1).max(100)).max(500).default([]),
    usageLimit: z.number().int().positive().optional().nullable(),
    usagePerUser: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().default(true),
    startsAt: z.string().datetime().optional().nullable(),
    expiresAt: z.string().datetime().optional().nullable(),
  })
  .superRefine((coupon, context) => {
    if (coupon.discountType === "percentage" && coupon.discountValue > 100) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100",
      });
    }
    if (coupon.scope !== "all" && coupon.scopeIds.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["scopeIds"],
        message: "Scoped coupons require at least one scope ID",
      });
    }
    if (
      coupon.startsAt &&
      coupon.expiresAt &&
      new Date(coupon.startsAt) >= new Date(coupon.expiresAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiry must be after the start time",
      });
    }
  });

export const pricingLineItemSchema = z.object({
  label: z.string(),
  amount: z.number(),
});

export const pricingSummarySchema = z.object({
  subtotal: z.number(),
  discountAmount: z.number().default(0),
  discountLabel: z.string().optional(),
  shippingCost: z.number().default(0),
  shippingLabel: z.string().optional(),
  taxAmount: z.number().default(0),
  total: z.number(),
  currency: z.string().default("USD"),
});

export type CartAddItemInput = z.infer<typeof cartAddItemSchema>;
export type CartUpdateItemInput = z.infer<typeof cartUpdateItemSchema>;
export type CartMergeInput = z.infer<typeof cartMergeSchema>;
export type CheckoutCreateInput = z.infer<typeof checkoutCreateSchema>;
export type CheckoutUpdateInput = z.infer<typeof checkoutUpdateSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type DeliveryZoneInput = z.infer<typeof deliveryZoneSchema>;
export type DeliveryMethodInput = z.infer<typeof deliveryMethodSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type PricingLineItem = z.infer<typeof pricingLineItemSchema>;
export type PricingSummary = z.infer<typeof pricingSummarySchema>;
