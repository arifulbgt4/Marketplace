import { prisma } from "src/lib/prisma";
import { auditService } from "src/lib/audit";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AuthorizationError,
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

export class ProductService {
  async create(
    data: ProductInput & {
      variants?: VariantInput[];
      options?: OptionInput[];
      media?: ProductMediaInput[];
    }
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const parsed = productSchema.parse(data);
      const slugExists = await prisma.product.findUnique({ where: { slug: parsed.slug } });
      if (slugExists) {
        return fail(new ConflictError(`Product with slug "${parsed.slug}" already exists`));
      }

      const product = await prisma.product.create({
        data: {
          ...parsed,
          status: "draft",
          createdById: session!.userId,
          variants: data.variants?.length
            ? {
                create: data.variants.map((v) => {
                  const pv = variantSchema.parse(v);
                  return {
                    sku: pv.sku,
                    barcode: pv.barcode ?? null,
                    price: pv.price,
                    compareAtPrice: pv.compareAtPrice ?? null,
                    inventory: { create: { onHand: 0, reserved: 0 } },
                  };
                }),
              }
            : undefined,
          options: data.options?.length
            ? { create: data.options.map((o) => optionSchema.parse(o)) }
            : undefined,
          media: data.media?.length
            ? { create: data.media.map((m) => productMediaSchema.parse(m)) }
            : undefined,
        },
        include: {
          variants: { include: { inventory: true } },
          options: true,
          media: { orderBy: { order: "asc" } },
          category: true,
        },
      });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.create",
        targetType: "product",
        targetId: product.id,
        metadata: { name: product.name, slug: product.slug },
      });

      return ok(product);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
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
        const slugExists = await prisma.product.findUnique({ where: { slug: parsed.slug } });
        if (slugExists) return fail(new ConflictError(`Product with slug "${parsed.slug}" already exists`));
      }

      const product = await prisma.product.update({
        where: { id },
        data: parsed,
        include: {
          variants: { include: { inventory: true } },
          options: true,
          media: { orderBy: { order: "asc" } },
          category: true,
        },
      });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.update",
        targetType: "product",
        targetId: id,
        metadata: { changes: Object.keys(parsed) },
      });

      return ok(product);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
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
        action: "listing.archive",
        targetType: "product",
        targetId: id,
        metadata: { previousStatus: existing.status },
      });

      return ok(product);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async publish(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true, media: true },
      });
      if (!product) return fail(new NotFoundError("Product", id));

      const validation = validatePublish(product);
      if (!validation.valid) {
        return fail(new ValidationError("Cannot publish: " + validation.errors.join("; ")));
      }

      const updated = await prisma.product.update({
        where: { id },
        data: { status: "published" },
        include: {
          variants: { include: { inventory: true } },
          options: true,
          media: { orderBy: { order: "asc" } },
          category: true,
        },
      });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.publish",
        targetType: "product",
        targetId: id,
      });

      return ok(updated);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async getById(id: string): Promise<Result<unknown>> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { include: { inventory: true } },
        options: true,
        media: { orderBy: { order: "asc" } },
        category: true,
      },
    });
    if (!product) return fail(new NotFoundError("Product", id));
    return ok(product);
  }

  async getBySlug(slug: string): Promise<Result<unknown>> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: { include: { inventory: true } },
        options: true,
        media: { orderBy: { order: "asc" } },
        category: true,
      },
    });
    if (!product) return fail(new NotFoundError("Product", slug));
    return ok(product);
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

      const { status, categoryId, search, page = 1, limit = 20 } = params;
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
            variants: { include: { inventory: true } },
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

      return ok({ products, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async addVariant(productId: string, data: VariantInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return fail(new NotFoundError("Product", productId));

      const parsed = variantSchema.parse(data);
      const skuExists = await prisma.productVariant.findUnique({ where: { sku: parsed.sku } });
      if (skuExists) return fail(new ConflictError(`Variant with SKU "${parsed.sku}" already exists`));

      const variant = await prisma.productVariant.create({
        data: {
          sku: parsed.sku,
          barcode: parsed.barcode ?? null,
          price: parsed.price,
          compareAtPrice: parsed.compareAtPrice ?? null,
          productId,
          inventory: { create: { onHand: 0, reserved: 0 } },
        },
        include: { inventory: true },
      });

      return ok(variant);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async updateVariant(variantId: string, data: VariantUpdateInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!existing) return fail(new NotFoundError("ProductVariant", variantId));

      const parsed = variantUpdateSchema.parse(data);
      if (parsed.sku && parsed.sku !== existing.sku) {
        const skuExists = await prisma.productVariant.findUnique({ where: { sku: parsed.sku } });
        if (skuExists) return fail(new ConflictError(`Variant with SKU "${parsed.sku}" already exists`));
      }

      const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: parsed,
        include: { inventory: true },
      });

      return ok(variant);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async removeVariant(variantId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);
      const existing = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!existing) return fail(new NotFoundError("ProductVariant", variantId));

      await prisma.productVariant.delete({ where: { id: variantId } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async addMedia(productId: string, data: ProductMediaInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return fail(new NotFoundError("Product", productId));

      const parsed = productMediaSchema.parse(data);
      const media = await prisma.productMedia.create({
        data: { ...parsed, productId },
      });

      return ok(media);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async removeMedia(mediaId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);
      const existing = await prisma.productMedia.findUnique({ where: { id: mediaId } });
      if (!existing) return fail(new NotFoundError("ProductMedia", mediaId));

      await prisma.productMedia.delete({ where: { id: mediaId } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
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
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }
}

export const productService = new ProductService();
