import { prisma } from "src/lib/prisma";
import {
  NotFoundError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import { catalogSearchSchema, type CatalogSearchInput } from "src/lib/catalog";

export class CatalogQueryService {
  async getPublishedById(id: string): Promise<Result<unknown>> {
    const product = await prisma.product.findFirst({
      where: { id, status: "published", category: { isActive: true } },
      include: {
        variants: {
          include: { inventory: true },
        },
        options: true,
        media: { orderBy: { order: "asc" } },
        category: true,
        createdBy: { select: { id: true, name: true } },
      },
    });
    if (!product) return fail(new NotFoundError("Product", id));
    return ok(product);
  }

  async getPublishedBySlug(slug: string): Promise<Result<unknown>> {
    const product = await prisma.product.findFirst({
      where: { slug, status: "published", category: { isActive: true } },
      include: {
        variants: {
          include: { inventory: true },
        },
        options: true,
        media: { orderBy: { order: "asc" } },
        category: true,
        createdBy: { select: { id: true, name: true } },
      },
    });
    if (!product) return fail(new NotFoundError("Product", slug));
    return ok(product);
  }

  async search(params: CatalogSearchInput): Promise<Result<unknown>> {
    try {
      const parsed = catalogSearchSchema.parse(params);
      const {
        query,
        categoryId,
        minPrice,
        maxPrice,
        availability,
        sort,
        page,
        limit,
      } = parsed;

      const where: Record<string, unknown> = {
        status: "published",
        category: { isActive: true },
      };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (query) {
        where.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.variants = {
          some: {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          },
        };
      }

      const candidates = await prisma.product.findMany({
        where: where as any,
        include: {
          variants: {
            include: { inventory: true },
          },
          media: { orderBy: { order: "asc" }, take: 1 },
          category: true,
        },
      });

      const availableQuantity = (product: (typeof candidates)[number]) =>
        product.variants.reduce(
          (sum, variant) =>
            sum +
            Math.max(
              0,
              (variant.inventory?.onHand ?? 0) -
                (variant.inventory?.reserved ?? 0),
            ),
          0,
        );
      const minVariantPrice = (product: (typeof candidates)[number]) =>
        Math.min(...product.variants.map((variant) => Number(variant.price)));

      const filtered = candidates.filter((product) => {
        if (!availability) return true;
        const inStock = availableQuantity(product) > 0;
        return availability === "in_stock" ? inStock : !inStock;
      });
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sort === "price_asc")
          comparison = minVariantPrice(a) - minVariantPrice(b);
        else if (sort === "price_desc")
          comparison = minVariantPrice(b) - minVariantPrice(a);
        else if (sort === "name_asc") comparison = a.name.localeCompare(b.name);
        else if (sort === "name_desc")
          comparison = b.name.localeCompare(a.name);
        else if (sort === "oldest")
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
        else comparison = b.createdAt.getTime() - a.createdAt.getTime();
        return comparison || a.id.localeCompare(b.id);
      });
      const total = filtered.length;
      const products = filtered.slice((page - 1) * limit, page * limit);

      return ok({
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getActiveCategories(): Promise<Result<unknown>> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return ok(categories);
  }

  async getFeatured(limit: number = 12): Promise<Result<unknown>> {
    const products = await prisma.product.findMany({
      where: { status: "published" },
      include: {
        variants: { include: { inventory: true } },
        media: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return ok(products);
  }

  async getByCategory(
    categorySlug: string,
    page: number = 1,
    limit: number = 24,
  ): Promise<Result<unknown>> {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug, isActive: true },
    });
    if (!category) return fail(new NotFoundError("Category", categorySlug));

    const where = { status: "published" as const, categoryId: category.id };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: { include: { inventory: true } },
          media: { orderBy: { order: "asc" }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return ok({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      category,
    });
  }
}

export const catalogQueryService = new CatalogQueryService();
