import { Prisma } from "@prisma/client";

import { BusinessRuleError, NotFoundError } from "src/lib/errors";

export type CompensationResult = Readonly<{
  inventoryItemsRestocked: number;
  couponReleased: boolean;
}>;

export class OrderCompensationService {
  async compensateOrderResourcesInTransaction(
    tx: Prisma.TransactionClient,
    input: {
      orderId: string;
      actorId: string;
      reason: string;
      keyPrefix?: string;
    },
  ): Promise<CompensationResult> {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundError("Order", input.orderId);

    let inventoryItemsRestocked = 0;
    for (const item of order.items) {
      if (!item.variantId) continue;
      const released = await this.restockCommittedInTransaction(tx, {
        orderId: order.id,
        orderItemId: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        actorId: input.actorId,
        reason: input.reason,
        idempotencyKey: `${input.keyPrefix ?? "cancel"}:${order.id}:inventory:${item.id}`,
      });
      if (released) inventoryItemsRestocked += 1;
    }

    const couponReleased = order.couponId
      ? await this.releaseCouponInTransaction(tx, {
          orderId: order.id,
          couponId: order.couponId,
          reason: input.reason,
          idempotencyKey: `${input.keyPrefix ?? "cancel"}:${order.id}:coupon:${order.couponId}`,
        })
      : false;

    return { inventoryItemsRestocked, couponReleased };
  }

  async restockCommittedInTransaction(
    tx: Prisma.TransactionClient,
    input: {
      orderId: string;
      orderItemId: string;
      variantId: string;
      quantity: number;
      actorId: string;
      reason: string;
      idempotencyKey: string;
    },
  ): Promise<boolean> {
    if (input.quantity <= 0) {
      throw new BusinessRuleError("Restock quantity must be positive");
    }

    const claimed = await tx.resourceRelease.createMany({
      data: [
        {
          orderId: input.orderId,
          type: "INVENTORY",
          resourceId: input.variantId,
          quantity: input.quantity,
          idempotencyKey: input.idempotencyKey,
          metadata: {
            orderItemId: input.orderItemId,
            reason: input.reason,
          },
        },
      ],
      skipDuplicates: true,
    });
    if (claimed.count === 0) return false;

    const updated = await tx.inventory.updateMany({
      where: { variantId: input.variantId },
      data: { onHand: { increment: input.quantity } },
    });
    if (updated.count !== 1) {
      throw new NotFoundError("Inventory", input.variantId);
    }
    await tx.inventoryLedger.create({
      data: {
        variantId: input.variantId,
        entryType: "adjustment",
        quantity: input.quantity,
        reason: input.reason,
        referenceId: input.orderId,
        referenceType: "order_compensation",
        actorId: input.actorId,
      },
    });
    return true;
  }

  async releaseCouponInTransaction(
    tx: Prisma.TransactionClient,
    input: {
      orderId: string;
      couponId: string;
      reason: string;
      idempotencyKey: string;
    },
  ): Promise<boolean> {
    const claimed = await tx.resourceRelease.createMany({
      data: [
        {
          orderId: input.orderId,
          type: "COUPON",
          resourceId: input.couponId,
          idempotencyKey: input.idempotencyKey,
          metadata: { reason: input.reason },
        },
      ],
      skipDuplicates: true,
    });
    if (claimed.count === 0) return false;

    const usage = await tx.couponUsage.updateMany({
      where: {
        orderId: input.orderId,
        couponId: input.couponId,
        releasedAt: null,
      },
      data: {
        releasedAt: new Date(),
        releaseReason: input.reason,
      },
    });
    if (usage.count === 0) return false;

    await tx.$executeRaw`
      UPDATE "Coupon"
      SET "usedCount" = GREATEST("usedCount" - 1, 0),
          "updatedAt" = NOW()
      WHERE "id" = ${input.couponId}
    `;
    return true;
  }
}

export const orderCompensationService = new OrderCompensationService();
