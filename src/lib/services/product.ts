import { z } from "zod";

import { prisma } from "src/lib/prisma";
import { auditService } from "src/lib/audit";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  BusinessRuleError,
  ValidationError,
  NotFoundError,
  ConflictError,
  AuthorizationError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import {
  productSchema,
  productUpdateSchema,
  variantSchema,
  variantUpdateSchema,
  optionSchema,
  optionUpdateSchema,
  productMediaSchema,
  validatePublish,
  type ProductInput,
  type ProductUpdateInput,
  type VariantInput,
  type VariantUpdateInput,
  type OptionInput,
  type OptionUpdateInput,
  type ProductMediaInput,
} from "src/lib/catalog";
import type { ProductStatus } from "@prisma/client";

export const MAX_PRODUCT_VARIANTS = 100;
export const MAX_PRODUCT_OPTIONS = 20;
export const MAX_PRODUCT_MEDIA = 50;

const productCreatePayloadSchema = productSchema.extend({
  variants: z.array(variantSchema).max(MAX_PRODUCT_VARIANTS).optional(),
  options: z.array(optionSchema).max(MAX_PRODUCT_OPTIONS).optional(),
  media: z.array(productMediaSchema).max(MAX_PRODUCT_MEDIA).optional(),
});

const productListFilterSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().trim().max(120).optional(),
});

const boundedProductRelations = {
  variants: {
    include: { inventory: true },
    orderBy: { id: "asc" as const },
    take: MAX_PRODUCT_VARIANTS,
  },
  options: {
    orderBy: { id: "asc" as const },
    take: MAX_PRODUCT_OPTIONS,
  },
  media: {
    orderBy: [{ order: "asc" as const }, { id: "asc" as const }],
    take: MAX_PRODUCT_MEDIA,
  },
  category: true,
};

export class ProductService {
  async create(
    data: ProductInput & {
      variants?: VariantInput[];
      options?: OptionInput[];
      media?: ProductMediaInput[];
    },
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const payload = productCreatePayloadSchema.parse(data);
      const {
        variants,
        options,
        media: mediaInput,
        ...parsed
      } = payload;
      const slugExists = await prisma.product.findUnique({
        where: { slug: parsed.slug },
      });
      if (slugExists) {
        return fail(
          new ConflictError(
            `Product with slug "${parsed.slug}" already exists`,
          ),
        );
      }
      const media = mediaInput ?? [];
      if (media.filter((item) => item.isPrimary).length > 1) {
        return fail(
          new ValidationError("Only one product media item can be primary"),
        );
      }
      if (media.length && !media.some((item) => item.isPrimary))
        media[0].isPrimary = true;

      const product = await prisma.product.create({
        data: {
          ...parsed,
          status: "draft",
          createdById: session!.userId,
          variants: variants?.length
            ? {
                create: variants.map((variant) => {
                  return {
                    sku: variant.sku,
                    barcode: variant.barcode ?? null,
                    price: variant.price,
                    compareAtPrice: variant.compareAtPrice ?? null,
                    weightGrams: variant.weightGrams,
                    inventory: { create: { onHand: 0, reserved: 0 } },
                  };
                }),
              }
            : undefined,
          options: options?.length
            ? { create: options }
            : undefined,
          media: media.length ? { create: media } : undefined,
        },
        include: boundedProductRelations,
      });

      await auditService.log({
        actorId: session!.userId,
        action: "product.create",
        targetType: "product",
        targetId: product.id,
        metadata: { name: product.name, slug: product.slug },
      });

      return ok(product);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async update(id: string, data: ProductUpdateInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("Product", id));

      const parsed = productUpdateSchema.parse(data);

      if (parsed.slug && parsed.slug !== existing.slug) {
        const slugExists = await prisma.product.findUnique({
          where: { slug: parsed.slug },
        });
        if (slugExists)
          return fail(
            new ConflictError(
              `Product with slug "${parsed.slug}" already exists`,
            ),
          );
      }

      const product = await prisma.product.update({
        where: { id },
        data: parsed,
        include: boundedProductRelations,
      });

      await auditService.log({
        actorId: session!.userId,
        action: "product.update",
        targetType: "product",
        targetId: id,
        metadata: { changes: Object.keys(parsed) },
      });

      return ok(product);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async archive(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("Product", id));

      const product = await prisma.product.update({
        where: { id },
        data: { status: "archived" },
      });

      await auditService.log({
        actorId: session!.userId,
        action: "product.archive",
        targetType: "product",
        targetId: id,
        metadata: { previousStatus: existing.status },
      });

      return ok(product);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async publish(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: { inventory: true },
            orderBy: { id: "asc" },
            take: MAX_PRODUCT_VARIANTS + 1,
          },
          media: {
            orderBy: [{ order: "asc" }, { id: "asc" }],
            take: MAX_PRODUCT_MEDIA + 1,
          },
          category: { select: { isActive: true } },
        },
      });
      if (!product) return fail(new NotFoundError("Product", id));
      if (
        product.variants.length > MAX_PRODUCT_VARIANTS ||
        product.media.length > MAX_PRODUCT_MEDIA
      ) {
        return fail(
          new BusinessRuleError(
            "Product configuration exceeds the supported variant or media limit",
          ),
        );
      }

      const validation = validatePublish(product);
      if (!validation.valid) {
        return fail(
          new ValidationError(
            "Cannot publish: " + validation.errors.join("; "),
          ),
        );
      }

      const updated = await prisma.product.update({
        where: { id },
        data: { status: "published" },
        include: boundedProductRelations,
      });

      await auditService.log({
        actorId: session!.userId,
        action: "product.publish",
        targetType: "product",
        targetId: id,
      });

      return ok(updated);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getById(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const product = await prisma.product.findUnique({
        where: { id },
        include: boundedProductRelations,
      });
      if (!product) return fail(new NotFoundError("Product", id));
      return ok(product);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getBySlug(slug: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const product = await prisma.product.findUnique({
        where: { slug },
        include: boundedProductRelations,
      });
      if (!product) return fail(new NotFoundError("Product", slug));
      return ok(product);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async list(params: {
    status?: ProductStatus;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);

      const {
        status: rawStatus,
        categoryId: rawCategoryId,
        search: rawSearch,
        page: requestedPage = 1,
        limit: requestedLimit = 20,
      } = params;
      const { status, categoryId, search } = productListFilterSchema.parse({
        status: rawStatus,
        categoryId: rawCategoryId,
        search: rawSearch,
      });
      const page = Number.isFinite(requestedPage)
        ? Math.min(10_000, Math.max(1, Math.trunc(requestedPage)))
        : 1;
      const limit = Number.isFinite(requestedLimit)
        ? Math.min(100, Math.max(1, Math.trunc(requestedLimit)))
        : 20;
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (categoryId) where.categoryId = categoryId;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: where as any,
          include: {
            variants: {
              include: { inventory: true },
              orderBy: { id: "asc" },
              take: MAX_PRODUCT_VARIANTS,
            },
            media: { orderBy: { order: "asc" }, take: 1 },
            category: true,
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.product.count({ where: where as any }),
      ]);

      return ok({
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async addVariant(
    productId: string,
    data: VariantInput,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          _count: { select: { variants: true } },
        },
      });
      if (!product) return fail(new NotFoundError("Product", productId));
      if (product._count.variants >= MAX_PRODUCT_VARIANTS) {
        return fail(
          new BusinessRuleError(
            "Product variant limit reached; remove a variant before adding another",
          ),
        );
      }

      const parsed = variantSchema.parse(data);
      const skuExists = await prisma.productVariant.findUnique({
        where: { sku: parsed.sku },
      });
      if (skuExists)
        return fail(
          new ConflictError(`Variant with SKU "${parsed.sku}" already exists`),
        );

      const variant = await prisma.productVariant.create({
        data: {
          sku: parsed.sku,
          barcode: parsed.barcode ?? null,
          price: parsed.price,
          compareAtPrice: parsed.compareAtPrice ?? null,
          weightGrams: parsed.weightGrams,
          productId,
          inventory: { create: { onHand: 0, reserved: 0 } },
        },
        include: { inventory: true },
      });

      return ok(variant);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateVariant(
    variantId: string,
    data: VariantUpdateInput,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      if (!existing)
        return fail(new NotFoundError("ProductVariant", variantId));

      const parsed = variantUpdateSchema.parse(data);
      if (parsed.sku && parsed.sku !== existing.sku) {
        const skuExists = await prisma.productVariant.findUnique({
          where: { sku: parsed.sku },
        });
        if (skuExists)
          return fail(
            new ConflictError(
              `Variant with SKU "${parsed.sku}" already exists`,
            ),
          );
      }

      const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: parsed,
        include: { inventory: true },
      });

      return ok(variant);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async removeVariant(variantId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);
      const existing = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      if (!existing)
        return fail(new NotFoundError("ProductVariant", variantId));

      await prisma.productVariant.delete({ where: { id: variantId } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async addMedia(
    productId: string,
    data: ProductMediaInput,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          _count: { select: { media: true } },
        },
      });
      if (!product) return fail(new NotFoundError("Product", productId));
      if (product._count.media >= MAX_PRODUCT_MEDIA) {
        return fail(
          new BusinessRuleError(
            "Product media limit reached; remove media before adding another",
          ),
        );
      }

      const parsed = productMediaSchema.parse(data);
      const media = await prisma.$transaction(async (tx) => {
        if (parsed.isPrimary) {
          await tx.productMedia.updateMany({
            where: { productId, isPrimary: true },
            data: { isPrimary: false },
          });
        }
        return tx.productMedia.create({
          data: { ...parsed, productId },
        });
      });

      return ok(media);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async removeMedia(mediaId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);
      const existing = await prisma.productMedia.findUnique({
        where: { id: mediaId },
      });
      if (!existing) return fail(new NotFoundError("ProductMedia", mediaId));

      await prisma.productMedia.delete({ where: { id: mediaId } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async reorderMedia(mediaId: string, order: number): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);
      const media = await prisma.productMedia.update({
        where: { id: mediaId },
        data: { order },
      });
      return ok(media);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const productService = new ProductService();
