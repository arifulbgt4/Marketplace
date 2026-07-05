import { prisma } from "src/lib/prisma";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  asAppError,
  ConflictError,
  BusinessRuleError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import { couponSchema, type CouponInput } from "src/lib/checkout";

export class CouponService {
  async list(): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      return ok(
        await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getById(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      const coupon = await prisma.coupon.findUnique({ where: { id } });
      if (!coupon) return fail(new NotFoundError("Coupon", id));
      return ok(coupon);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async create(data: CouponInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const parsed = couponSchema.parse(data);
      const existing = await prisma.coupon.findUnique({
        where: { code: parsed.code },
      });
      if (existing)
        return fail(
          new ConflictError(`Coupon code "${parsed.code}" already exists`),
        );

      const coupon = await prisma.coupon.create({
        data: {
          ...parsed,
          scopeIds: parsed.scopeIds,
          startsAt: parsed.startsAt ? new Date(parsed.startsAt) : null,
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        },
      });
      return ok(coupon);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async update(
    id: string,
    data: Partial<CouponInput>,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.coupon.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("Coupon", id));

      const parsed = couponSchema.partial().parse(data);
      const updateData: Record<string, unknown> = { ...parsed };
      if (data.startsAt)
        updateData.startsAt = new Date(data.startsAt as string);
      if (data.expiresAt)
        updateData.expiresAt = new Date(data.expiresAt as string);

      const coupon = await prisma.coupon.update({
        where: { id },
        data: updateData,
      });
      return ok(coupon);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async archive(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.coupon.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("Coupon", id));

      const coupon = await prisma.coupon.update({
        where: { id },
        data: { isActive: false },
      });
      return ok(coupon);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async validate(
    code: string,
    subtotal: number,
    productIds: string[] = [],
    categoryIds: string[] = [],
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    if (!session) return fail(new AuthenticationError());
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (!coupon) return fail(new NotFoundError("Coupon", code));
    if (!coupon.isActive)
      return fail(new BusinessRuleError("Coupon is no longer active"));

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return fail(new BusinessRuleError("Coupon is not yet valid"));
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return fail(new BusinessRuleError("Coupon has expired"));
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return fail(new BusinessRuleError("Coupon usage limit reached"));
    }
    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return fail(
        new BusinessRuleError(
          `Minimum order amount of $${Number(coupon.minOrderAmount).toFixed(2)} required`,
        ),
      );
    }

    if (coupon.usagePerUser) {
      const userUsageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: session.userId },
      });
      if (userUsageCount >= coupon.usagePerUser) {
        return fail(
          new BusinessRuleError(
            "You have reached the usage limit for this coupon",
          ),
        );
      }
    }

    if (coupon.scope === "product") {
      const scopeIds = coupon.scopeIds as string[];
      const applicable = productIds.some((pid) => scopeIds.includes(pid));
      if (!applicable)
        return fail(
          new BusinessRuleError(
            "Coupon does not apply to any item in your cart",
          ),
        );
    }

    if (coupon.scope === "category") {
      const scopeIds = coupon.scopeIds as string[];
      const applicable = categoryIds.some((cid) => scopeIds.includes(cid));
      if (!applicable)
        return fail(
          new BusinessRuleError(
            "Coupon does not apply to any category in your cart",
          ),
        );
    }

    return ok({
      valid: true,
      coupon: { ...coupon, discountValue: Number(coupon.discountValue) },
    });
  }
}

export const couponService = new CouponService();
