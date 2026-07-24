import { ReviewStatus } from "@prisma/client";

import { getAuthSession, requireRole } from "src/lib/authz";
import {
  AuthorizationError,
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import {
  productReviewCreateSchema,
  productReviewUpdateSchema,
  reviewAdminListSchema,
  reviewModerationSchema,
  type ProductReviewCreateInput,
  type ProductReviewUpdateInput,
  type ReviewModerationInput,
} from "src/lib/reviews";
import { enqueueOutboxEvent } from "src/lib/services/outbox";

export class ProductReviewService {
  async create(
    productId: string,
    input: ProductReviewCreateInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = productReviewCreateSchema.parse(input);
      const orderItem = await prisma.orderItem.findFirst({
        where: {
          id: parsed.orderItemId,
          productId,
          order: {
            userId: session.userId,
            placedAt: { not: null },
            fulfillmentStatus: { in: ["DELIVERED", "RETURNED"] },
          },
        },
        include: { review: { select: { id: true } } },
      });
      if (!orderItem) {
        return fail(
          new BusinessRuleError(
            "A delivered purchase is required to review this product",
          ),
        );
      }
      if (orderItem.review) {
        return fail(
          new ConflictError("This purchase has already been reviewed"),
        );
      }
      const existingProductReview = await prisma.review.findFirst({
        where: { productId, userId: session.userId },
        select: { id: true },
      });
      if (existingProductReview) {
        return fail(
          new ConflictError("You have already reviewed this product"),
        );
      }

      const review = await prisma.$transaction(async (tx) => {
        const created = await tx.review.create({
          data: {
            productId,
            orderItemId: orderItem.id,
            userId: session.userId,
            rating: parsed.rating,
            comment: parsed.comment,
            verifiedPurchase: true,
            status: "PENDING",
          },
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "admin.action",
            targetType: "review",
            targetId: created.id,
            metadata: { action: "review.create", productId, verified: true },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "review",
          aggregateId: created.id,
          eventType: "review.submitted",
          payload: { reviewId: created.id, productId, userId: session.userId },
          idempotencyKey: `review:${created.id}:submitted`,
        });
        return created;
      });
      return ok(review);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async update(
    productId: string,
    reviewId: string,
    input: ProductReviewUpdateInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = productReviewUpdateSchema.parse(input);
      const existing = await prisma.review.findFirst({
        where: {
          id: reviewId,
          productId,
          userId: session.userId,
          verifiedPurchase: true,
          orderItem: {
            order: {
              userId: session.userId,
              fulfillmentStatus: { in: ["DELIVERED", "RETURNED"] },
            },
          },
        },
      });
      if (!existing) {
        return fail(new NotFoundError("Verified product review", reviewId));
      }

      const review = await prisma.$transaction(async (tx) => {
        const updated = await tx.review.update({
          where: { id: existing.id },
          data: {
            rating: parsed.rating,
            comment: parsed.comment,
            status: "PENDING",
            publishedAt: null,
            moderatedById: null,
            moderationNote: null,
            moderatedAt: null,
          },
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "admin.action",
            targetType: "review",
            targetId: updated.id,
            metadata: {
              action: "review.update",
              productId,
              statusFrom: existing.status,
              statusTo: "PENDING",
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "review",
          aggregateId: updated.id,
          eventType: "review.updated",
          payload: {
            reviewId: updated.id,
            productId,
            userId: session.userId,
          },
          idempotencyKey: `review:${updated.id}:updated:${updated.updatedAt.toISOString()}`,
        });
        return updated;
      });
      return ok(review);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async listPublished(productId: string): Promise<Result<unknown>> {
    try {
      const [reviews, aggregate] = await Promise.all([
        prisma.review.findMany({
          where: { productId, status: "APPROVED" },
          select: {
            id: true,
            rating: true,
            comment: true,
            verifiedPurchase: true,
            publishedAt: true,
            createdAt: true,
            author: { select: { id: true, name: true, image: true } },
          },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 100,
        }),
        prisma.review.aggregate({
          where: { productId, status: "APPROVED" },
          _avg: { rating: true },
          _count: { rating: true },
        }),
      ]);
      return ok({
        reviews,
        truncated: aggregate._count.rating > reviews.length,
        summary: {
          average: aggregate._avg.rating ?? 0,
          count: aggregate._count.rating,
        },
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async listAdmin(input: {
    status?: unknown;
    productId?: unknown;
    page?: unknown;
    limit?: unknown;
  }): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const parsed = reviewAdminListSchema.parse(input);
      const where = {
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.productId ? { productId: parsed.productId } : {}),
      };
      const [reviews, total] = await prisma.$transaction([
        prisma.review.findMany({
          where,
          include: {
            author: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, name: true, slug: true } },
            moderatedBy: { select: { id: true, name: true } },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        prisma.review.count({ where }),
      ]);
      return ok({
        reviews,
        pagination: {
          page: parsed.page,
          limit: parsed.limit,
          total,
          totalPages: Math.ceil(total / parsed.limit),
        },
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async moderate(
    id: string,
    input: ReviewModerationInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const parsed = reviewModerationSchema.parse(input);
      const review = await prisma.$transaction(async (tx) => {
        const existing = await tx.review.findUnique({ where: { id } });
        if (!existing) throw new NotFoundError("Review", id);
        const updated = await tx.review.update({
          where: { id },
          data: {
            status: parsed.status,
            moderatedById: session!.userId,
            moderationNote: parsed.note,
            moderatedAt: new Date(),
            publishedAt:
              parsed.status === ReviewStatus.APPROVED
                ? (existing.publishedAt ?? new Date())
                : existing.publishedAt,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "admin.action",
            targetType: "review",
            targetId: id,
            metadata: {
              action: "review.moderate",
              statusFrom: existing.status,
              statusTo: parsed.status,
              note: parsed.note,
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "review",
          aggregateId: id,
          eventType: "review.moderated",
          payload: {
            reviewId: id,
            statusFrom: existing.status,
            statusTo: parsed.status,
          },
          idempotencyKey: `review:${id}:moderation:${updated.updatedAt.toISOString()}`,
        });
        return updated;
      });
      return ok(review);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const productReviewService = new ProductReviewService();
