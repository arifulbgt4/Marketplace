import { prisma } from "src/lib/prisma";
import { NotFoundError, ok, fail, type Result } from "src/lib/errors";
import { catalogSearchSchema, type CatalogSearchInput } from "src/lib/catalog";

export class CatalogQueryService {
  async getPublishedById(id: string): Promise<Result<unknown>> {
    const product = await prisma.product.findUnique({
      where: { id, status: "published" },
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
    const product = await prisma.product.findUnique({
      where: { slug, status: "published" },
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
    const parsed = catalogSearchSchema.parse(params);
    const { query, categoryId, minPrice, maxPrice, sort, page, limit } = parsed;

    const where: Record<string, unknown> = { status: "published" };

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

    let orderBy: Record<string, string> = {};
    switch (sort) {
      case "price_asc":
        orderBy = { id: "asc" };
        break;
      case "price_desc":
        orderBy = { id: "desc" };
        break;
      case "name_asc":
        orderBy = { name: "asc" };
        break;
      case "name_desc":
        orderBy = { name: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: where as any,
        include: {
          variants: {
            include: { inventory: true },
          },
          media: { orderBy: { order: "asc" }, take: 1 },
          category: true,
        },
        orderBy,
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
      limit,
    });
  }

  async getActiveCategories(): Promise<Result<unknown>> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
        children: { where: { isActive: true }, select: { id: true, name: true, slug: true } },
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
    limit: number = 24
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
