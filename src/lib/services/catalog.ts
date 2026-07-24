import { Prisma } from "@prisma/client";

import { prisma } from "src/lib/prisma";
import {
  NotFoundError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import {
  catalogSearchSchema,
  catalogSuggestionSchema,
  type CatalogSearchInput,
} from "src/lib/catalog";

type CatalogPageRow = {
  id: string | null;
  minPrice: Prisma.Decimal | null;
  availableQuantity: number | bigint | null;
  total: number | bigint;
  facetMinPrice: Prisma.Decimal | null;
  facetMaxPrice: Prisma.Decimal | null;
  inStockCount: number | bigint;
  outOfStockCount: number | bigint;
};

const SEARCH_SORT_SQL: Record<CatalogSearchInput["sort"], Prisma.Sql> = {
  price_asc: Prisma.sql`"minPrice" ASC, id ASC`,
  price_desc: Prisma.sql`"minPrice" DESC, id ASC`,
  name_asc: Prisma.sql`LOWER(name) ASC, id ASC`,
  name_desc: Prisma.sql`LOWER(name) DESC, id ASC`,
  newest: Prisma.sql`"createdAt" DESC, id ASC`,
  oldest: Prisma.sql`"createdAt" ASC, id ASC`,
};

function boundedInteger(value: unknown, fallback: number, maximum: number) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1) return fallback;
  return Math.min(numeric, maximum);
}

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

  async search(params: unknown): Promise<Result<unknown>> {
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

      const whereConditions: Prisma.Sql[] = [
        Prisma.sql`p.status = 'published'::"ProductStatus"`,
        Prisma.sql`c."isActive" = TRUE`,
      ];
      if (categoryId) {
        whereConditions.push(Prisma.sql`p."categoryId" = ${categoryId}`);
      }
      if (query) {
        const escaped = query.replace(/[\\%_]/g, "\\$&");
        const pattern = `%${escaped}%`;
        whereConditions.push(
          Prisma.sql`(p.name ILIKE ${pattern} ESCAPE '\' OR p.description ILIKE ${pattern} ESCAPE '\')`,
        );
      }

      const havingConditions: Prisma.Sql[] = [];
      if (minPrice !== undefined) {
        havingConditions.push(Prisma.sql`MIN(v.price) >= ${minPrice}`);
      }
      if (maxPrice !== undefined) {
        havingConditions.push(Prisma.sql`MIN(v.price) <= ${maxPrice}`);
      }
      const havingClause = havingConditions.length
        ? Prisma.sql`HAVING ${Prisma.join(havingConditions, " AND ")}`
        : Prisma.sql``;
      const availabilityClause =
        availability === "in_stock"
          ? Prisma.sql`WHERE "availableQuantity" > 0`
          : availability === "out_of_stock"
            ? Prisma.sql`WHERE "availableQuantity" = 0`
            : Prisma.sql``;
      const offset = (page - 1) * limit;
      const sortSql = SEARCH_SORT_SQL[sort];

      const rows = await prisma.$queryRaw<CatalogPageRow[]>(Prisma.sql`
        WITH catalog AS (
          SELECT
            p.id,
            p.name,
            p."createdAt",
            MIN(v.price) AS "minPrice",
            COALESCE(
              SUM(GREATEST(COALESCE(i."onHand", 0) - COALESCE(i.reserved, 0), 0)),
              0
            )::int AS "availableQuantity"
          FROM "Product" p
          INNER JOIN "Category" c ON c.id = p."categoryId"
          INNER JOIN "ProductVariant" v ON v."productId" = p.id
          LEFT JOIN "Inventory" i ON i."variantId" = v.id
          WHERE ${Prisma.join(whereConditions, " AND ")}
          GROUP BY p.id, p.name, p."createdAt"
          ${havingClause}
        ),
        filtered AS (
          SELECT * FROM catalog
          ${availabilityClause}
        ),
        totals AS (
          SELECT
            (SELECT COUNT(*)::int FROM filtered) AS total,
            MIN("minPrice") AS "facetMinPrice",
            MAX("minPrice") AS "facetMaxPrice",
            COUNT(*) FILTER (WHERE "availableQuantity" > 0)::int AS "inStockCount",
            COUNT(*) FILTER (WHERE "availableQuantity" = 0)::int AS "outOfStockCount"
          FROM catalog
        )
        SELECT
          page.id,
          page."minPrice",
          page."availableQuantity",
          totals.total,
          totals."facetMinPrice",
          totals."facetMaxPrice",
          totals."inStockCount",
          totals."outOfStockCount"
        FROM totals
        LEFT JOIN LATERAL (
          SELECT * FROM filtered
          ORDER BY ${sortSql}
          LIMIT ${limit}
          OFFSET ${offset}
        ) page ON TRUE
      `);

      const aggregate = rows[0];
      const pageRows = rows.filter(
        (row): row is CatalogPageRow & { id: string } => row.id !== null,
      );
      const ids = pageRows.map((row) => row.id);
      const [records, categories] = await Promise.all([
        ids.length
          ? prisma.product.findMany({
              where: { id: { in: ids } },
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
                createdAt: true,
                category: {
                  select: { id: true, name: true, slug: true },
                },
                media: {
                  select: { url: true, alt: true },
                  orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
                  take: 1,
                },
              },
            })
          : Promise.resolve([]),
        prisma.category.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                products: { where: { status: "published" } },
              },
            },
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { id: "asc" }],
          take: 100,
        }),
      ]);
      const recordById = new Map(records.map((record) => [record.id, record]));
      const aggregateById = new Map(pageRows.map((row) => [row.id, row]));
      const products = ids.flatMap((id) => {
        const record = recordById.get(id);
        const row = aggregateById.get(id);
        if (!record || !row) return [];
        return [
          {
            ...record,
            minPrice: row.minPrice?.toString() ?? null,
            availableQuantity: Number(row.availableQuantity ?? 0),
          },
        ];
      });
      const total = Number(aggregate?.total ?? 0);

      return ok({
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        facets: {
          categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            count: category._count.products,
          })),
          price: {
            min: aggregate?.facetMinPrice?.toString() ?? null,
            max: aggregate?.facetMaxPrice?.toString() ?? null,
          },
          availability: {
            inStock: Number(aggregate?.inStockCount ?? 0),
            outOfStock: Number(aggregate?.outOfStockCount ?? 0),
          },
        },
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async suggest(params: unknown): Promise<Result<unknown>> {
    try {
      const parsed = catalogSuggestionSchema.parse(params);
      const products = await prisma.product.findMany({
        where: {
          status: "published",
          category: { isActive: true },
          OR: [
            {
              name: {
                contains: parsed.query,
                mode: "insensitive",
              },
            },
            {
              brand: {
                contains: parsed.query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          brand: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          media: {
            select: { url: true, alt: true },
            orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
            take: 1,
          },
          variants: {
            select: { price: true },
            orderBy: [{ price: "asc" }, { id: "asc" }],
            take: 1,
          },
        },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: parsed.limit,
      });

      return ok({
        suggestions: products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          category: product.category,
          image: product.media[0] ?? null,
          minPrice: product.variants[0]?.price.toString() ?? null,
        })),
        query: parsed.query,
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
          take: 100,
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      take: 100,
    });
    return ok(categories);
  }

  async getFeatured(limit: unknown = 12): Promise<Result<unknown>> {
    const boundedLimit = boundedInteger(limit, 12, 48);
    const products = await prisma.product.findMany({
      where: { status: "published" },
      include: {
        variants: {
          include: { inventory: true },
          orderBy: [{ price: "asc" }, { id: "asc" }],
          take: 100,
        },
        media: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: boundedLimit,
    });
    return ok(products);
  }

  async getByCategory(
    categorySlug: string,
    page: unknown = 1,
    limit: unknown = 24,
  ): Promise<Result<unknown>> {
    const boundedPage = boundedInteger(page, 1, 10_000);
    const boundedLimit = boundedInteger(limit, 24, 100);
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug, isActive: true },
    });
    if (!category) return fail(new NotFoundError("Category", categorySlug));

    const where = { status: "published" as const, categoryId: category.id };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: {
            include: { inventory: true },
            orderBy: [{ price: "asc" }, { id: "asc" }],
            take: 100,
          },
          media: { orderBy: { order: "asc" }, take: 1 },
          category: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip: (boundedPage - 1) * boundedLimit,
        take: boundedLimit,
      }),
      prisma.product.count({ where }),
    ]);

    return ok({
      products,
      total,
      page: boundedPage,
      totalPages: Math.ceil(total / boundedLimit),
      category,
    });
  }
}

export const catalogQueryService = new CatalogQueryService();
