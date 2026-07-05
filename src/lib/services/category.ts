import { prisma } from "src/lib/prisma";
import { auditService } from "src/lib/audit";
import { requireRole, getAuthSession } from "src/lib/authz";
import type { PrismaClient } from "@prisma/client";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AuthorizationError,
  BusinessRuleError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import {
  categorySchema,
  categoryUpdateSchema,
  type CategoryInput,
  type CategoryUpdateInput,
} from "src/lib/catalog";

export class CategoryService {
  async create(data: CategoryInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const parsed = categorySchema.parse(data);

      if (parsed.parentId) {
        const parent = await prisma.category.findUnique({ where: { id: parsed.parentId } });
        if (!parent) return fail(new NotFoundError("Category", parsed.parentId));
      }

      const slugExists = await prisma.category.findUnique({ where: { slug: parsed.slug } });
      if (slugExists) return fail(new ConflictError(`Category with slug "${parsed.slug}" already exists`));

      const category = await prisma.category.create({ data: parsed });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.create",
        targetType: "category",
        targetId: category.id,
        metadata: { name: category.name, slug: category.slug },
      });

      return ok(category);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async update(id: string, data: CategoryUpdateInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("Category", id));

      const parsed = categoryUpdateSchema.parse(data);

      if (parsed.parentId) {
        if (parsed.parentId === id) return fail(new ValidationError("Category cannot be its own parent"));

        const parent = await prisma.category.findUnique({ where: { id: parsed.parentId } });
        if (!parent) return fail(new NotFoundError("Category", parsed.parentId));

        const wouldCycle = await this._wouldCreateCycle(id, parsed.parentId);
        if (wouldCycle) return fail(new ValidationError("Cannot create circular parent relationship"));
      }

      if (parsed.slug && parsed.slug !== existing.slug) {
        const slugExists = await prisma.category.findUnique({ where: { slug: parsed.slug } });
        if (slugExists) return fail(new ConflictError(`Category with slug "${parsed.slug}" already exists`));
      }

      const category = await prisma.category.update({
        where: { id },
        data: parsed,
      });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.update",
        targetType: "category",
        targetId: id,
        metadata: { changes: Object.keys(parsed) },
      });

      return ok(category);
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

      const existing = await prisma.category.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!existing) return fail(new NotFoundError("Category", id));

      if (existing.children.length > 0) {
        return fail(new ValidationError("Cannot archive category with subcategories. Reassign or remove them first."));
      }

      const category = await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });

      await auditService.log({
        actorId: session!.userId,
        action: "listing.archive",
        targetType: "category",
        targetId: id,
      });

      return ok(category);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async delete(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.category.findUnique({
        where: { id },
        include: { children: true, products: true, listings: true },
      });
      if (!existing) return fail(new NotFoundError("Category", id));

      if (existing.children.length > 0) {
        return fail(new ValidationError("Cannot delete category with subcategories"));
      }
      if (existing.products.length > 0 || existing.listings.length > 0) {
        return fail(new ValidationError("Cannot delete category that still has products or listings. Archive it instead."));
      }

      await prisma.category.delete({ where: { id } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async getById(id: string): Promise<Result<unknown>> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { orderBy: { displayOrder: "asc" } },
        _count: { select: { products: true, listings: true } },
      },
    });
    if (!category) return fail(new NotFoundError("Category", id));
    return ok(category);
  }

  async getBySlug(slug: string): Promise<Result<unknown>> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: { orderBy: { displayOrder: "asc" } },
        _count: { select: { products: true, listings: true } },
      },
    });
    if (!category) return fail(new NotFoundError("Category", slug));
    return ok(category);
  }

  async list(includeInactive: boolean = false): Promise<Result<unknown>> {
    const where = includeInactive ? {} : { isActive: true };
    const categories = await prisma.category.findMany({
      where,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true, listings: true } },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return ok(categories);
  }

  async getTree(): Promise<Result<unknown>> {
    const all = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    const buildTree = (parentId: string | null): unknown[] =>
      all
        .filter((c) => c.parentId === parentId)
        .map((c) => ({
          ...c,
          children: buildTree(c.id),
        }));

    return ok(buildTree(null));
  }

  private async _wouldCreateCycle(categoryId: string, newParentId: string): Promise<boolean> {
    return checkCategoryCycle(prisma, categoryId, newParentId);
  }
}

async function checkCategoryCycle(
  db: typeof prisma,
  categoryId: string,
  newParentId: string
): Promise<boolean> {
  const allCategories = await db.category.findMany({
    select: { id: true, parentId: true },
  });
  const parentMap = new Map<string, string | null>();
  for (const c of allCategories) {
    parentMap.set(c.id, c.parentId);
  }

  let currentId: string | null = newParentId;
  const visited = new Set<string>();
  while (currentId) {
    if (currentId === categoryId) return true;
    if (visited.has(currentId)) return false;
    visited.add(currentId);
    currentId = parentMap.get(currentId) ?? null;
  }
  return false;
}

export const categoryService = new CategoryService();
