import { z } from "zod";
import type { ProductStatus } from "@prisma/client";

export type { ProductStatus };

export const PRODUCT_STATUS_VALUES = [
  "draft",
  "published",
  "archived",
] as const;

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(10000),
  brand: z.string().max(100).optional().nullable(),
  taxClass: z.string().max(50).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  status: z.enum(PRODUCT_STATUS_VALUES).default("draft"),
});

export const productUpdateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(10).max(10000).optional(),
  brand: z.string().max(100).optional().nullable(),
  taxClass: z.string().max(50).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50),
  barcode: z.string().max(50).optional().nullable(),
  price: z.number().positive("Price must be positive").max(999999.99),
  compareAtPrice: z.number().positive().max(999999.99).optional().nullable(),
  weightGrams: z.number().int().min(0).max(1000000).default(0),
});

export const variantUpdateSchema = z.object({
  sku: z.string().min(1).max(50).optional(),
  barcode: z.string().max(50).optional().nullable(),
  price: z.number().positive().max(999999.99).optional(),
  compareAtPrice: z.number().positive().max(999999.99).optional().nullable(),
  weightGrams: z.number().int().min(0).max(1000000).optional(),
});

export const optionSchema = z.object({
  name: z.string().min(1).max(50),
  values: z
    .array(z.string().min(1).max(100))
    .min(1, "At least one option value is required"),
});

export const optionUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  values: z.array(z.string().min(1).max(100)).min(1).optional(),
});

export const productMediaSchema = z.object({
  url: z.string().url("Invalid URL"),
  alt: z.string().max(200).optional().nullable(),
  order: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  icon: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  icon: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const catalogSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z
    .enum([
      "price_asc",
      "price_desc",
      "name_asc",
      "name_desc",
      "newest",
      "oldest",
    ])
    .optional()
    .default("newest"),
  availability: z.enum(["in_stock", "out_of_stock"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(24),
});

export const inventoryAdjustSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int(),
  reason: z.string().min(1).max(500),
});

export const inventoryReserveSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive("Quantity must be positive"),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
export type VariantUpdateInput = z.infer<typeof variantUpdateSchema>;
export type OptionInput = z.infer<typeof optionSchema>;
export type OptionUpdateInput = z.infer<typeof optionUpdateSchema>;
export type ProductMediaInput = z.infer<typeof productMediaSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CatalogSearchInput = z.infer<typeof catalogSearchSchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;
export type InventoryReserveInput = z.infer<typeof inventoryReserveSchema>;

export function validatePublish(product: {
  status: string;
  variants: {
    sku: string;
    price: unknown;
    inventory?: { onHand: number; reserved: number } | null;
  }[];
  media: { isPrimary?: boolean; url?: string }[];
  categoryId: string | null;
  category?: { isActive: boolean } | null;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!product.categoryId) {
    errors.push("Product must have a category");
  } else if (product.category?.isActive === false) {
    errors.push("Product category must be active");
  }
  if (!product.variants || product.variants.length === 0) {
    errors.push("Product must have at least one variant");
  } else {
    for (const v of product.variants) {
      if (!v.sku) errors.push("All variants must have a SKU");
      if (v.price == null || Number(v.price) <= 0)
        errors.push("All variants must have a positive price");
    }
    const hasStock = product.variants.some((variant) =>
      variant.inventory
        ? variant.inventory.onHand - variant.inventory.reserved > 0
        : false,
    );
    if (!hasStock)
      errors.push("At least one variant must have available stock");
  }
  if (!product.media || product.media.length === 0) {
    errors.push("Product must have at least one media item");
  } else if (
    product.media.length > 1 &&
    !product.media.some((item) => item.isPrimary)
  ) {
    errors.push("Product must identify one primary media item");
  }

  return { valid: errors.length === 0, errors };
}
