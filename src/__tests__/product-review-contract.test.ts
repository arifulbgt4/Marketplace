import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorCode } from "src/lib/errors";
import {
  productReviewCreateSchema,
  productReviewUpdateSchema,
} from "src/lib/reviews";

const mocks = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  orderItemFindFirst: vi.fn(),
  reviewFindFirst: vi.fn(),
  reviewFindMany: vi.fn(),
  reviewAggregate: vi.fn(),
  reviewUpdate: vi.fn(),
  auditCreate: vi.fn(),
  enqueueOutboxEvent: vi.fn(),
}));

vi.mock("src/lib/authz", () => ({
  getAuthSession: mocks.getAuthSession,
  requireRole: vi.fn(),
}));

vi.mock("src/lib/services/outbox", () => ({
  enqueueOutboxEvent: mocks.enqueueOutboxEvent,
}));

vi.mock("src/lib/prisma", () => ({
  prisma: {
    orderItem: { findFirst: mocks.orderItemFindFirst },
    review: {
      findFirst: mocks.reviewFindFirst,
      findMany: mocks.reviewFindMany,
      aggregate: mocks.reviewAggregate,
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => unknown) =>
      callback({
        review: { update: mocks.reviewUpdate },
        auditLog: { create: mocks.auditCreate },
      }),
    ),
  },
}));

import { productReviewService } from "src/lib/services/product-review";

describe("product review contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthSession.mockResolvedValue({ userId: "customer-1" });
    mocks.auditCreate.mockResolvedValue({ id: "audit-1" });
    mocks.enqueueOutboxEvent.mockResolvedValue({ id: "outbox-1" });
  });

  it("requires an order item only when creating a review", () => {
    expect(
      productReviewCreateSchema.safeParse({
        rating: 5,
        comment: "Excellent product",
      }).success,
    ).toBe(false);
    expect(
      productReviewUpdateSchema.safeParse({
        rating: 4,
        comment: "Updated after more use",
      }).success,
    ).toBe(true);
  });

  it("rejects review creation without an owned delivered order item", async () => {
    mocks.orderItemFindFirst.mockResolvedValue(null);

    const result = await productReviewService.create("product-1", {
      orderItemId: "123e4567-e89b-12d3-a456-426614174000",
      rating: 5,
      comment: "Excellent product",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(mocks.orderItemFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          productId: "product-1",
          order: expect.objectContaining({
            userId: "customer-1",
            fulfillmentStatus: { in: ["DELIVERED", "RETURNED"] },
          }),
        }),
      }),
    );
  });

  it("lists and aggregates approved reviews only", async () => {
    mocks.reviewFindMany.mockResolvedValue([]);
    mocks.reviewAggregate.mockResolvedValue({
      _avg: { rating: null },
      _count: { rating: 0 },
    });

    const result = await productReviewService.listPublished("product-1");

    expect(result).toMatchObject({
      success: true,
      data: { reviews: [], summary: { average: 0, count: 0 } },
    });
    expect(mocks.reviewFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { productId: "product-1", status: "APPROVED" },
        take: 100,
      }),
    );
    expect(mocks.reviewAggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { productId: "product-1", status: "APPROVED" },
      }),
    );
  });

  it("resubmits an owned verified review for moderation after editing", async () => {
    mocks.reviewFindFirst.mockResolvedValue({
      id: "review-1",
      status: "APPROVED",
    });
    mocks.reviewUpdate.mockResolvedValue({
      id: "review-1",
      status: "PENDING",
      updatedAt: new Date("2026-07-24T12:00:00.000Z"),
    });

    const result = await productReviewService.update("product-1", "review-1", {
      rating: 4,
      comment: "Updated after more use",
    });

    expect(result).toMatchObject({
      success: true,
      data: { id: "review-1", status: "PENDING" },
    });
    expect(mocks.reviewUpdate).toHaveBeenCalledWith({
      where: { id: "review-1" },
      data: expect.objectContaining({
        rating: 4,
        status: "PENDING",
        publishedAt: null,
        moderatedAt: null,
      }),
      include: expect.any(Object),
    });
    expect(mocks.enqueueOutboxEvent).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ eventType: "review.updated" }),
    );
  });
});
