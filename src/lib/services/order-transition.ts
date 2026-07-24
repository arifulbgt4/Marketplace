import {
  OrderTransitionKind,
  Prisma,
  type FulfillmentStatus,
  type OrderStatus,
} from "@prisma/client";

import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import { enqueueOutboxEvent } from "src/lib/services/outbox";
import {
  evaluateFulfillmentTransition,
  evaluateOrderTransition,
} from "src/modules/order";

export type OrderTransitionCommand = Readonly<{
  orderId: string;
  toStatus: OrderStatus;
  expectedVersion: number;
  actorId: string | null;
  reason: string;
  metadata?: Prisma.InputJsonObject;
}>;

export type FulfillmentTransitionCommand = Readonly<{
  orderId: string;
  toStatus: FulfillmentStatus;
  expectedVersion: number;
  actorId: string | null;
  reason: string;
  metadata?: Prisma.InputJsonObject;
}>;

export type OrderTransitionResult = Readonly<{
  orderId: string;
  kind: OrderTransitionKind;
  fromStatus: OrderStatus | FulfillmentStatus;
  toStatus: OrderStatus | FulfillmentStatus;
  statusVersion: number;
  sequence: number;
}>;

export interface TransactionRunner {
  $transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T>;
}

export type InitialOrderStateInput = Readonly<{
  orderId: string;
  orderNo: string;
  userId: string;
  orderStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: string;
}>;

export async function recordInitialOrderStateInTransaction(
  tx: Prisma.TransactionClient,
  input: InitialOrderStateInput,
): Promise<void> {
  await tx.orderStatusHistory.create({
    data: {
      orderId: input.orderId,
      sequence: 1,
      kind: OrderTransitionKind.ORDER,
      fromOrderStatus: null,
      toOrderStatus: input.orderStatus,
      actorId: input.userId,
      reason: "Order placed",
      metadata: {
        fulfillmentStatus: input.fulfillmentStatus,
        paymentStatus: input.paymentStatus,
      },
    },
  });
  await enqueueOutboxEvent(tx, {
    aggregateType: "order",
    aggregateId: input.orderId,
    eventType: "order.placed",
    idempotencyKey: `order:${input.orderId}:placed`,
    payload: {
      orderId: input.orderId,
      orderNo: input.orderNo,
      userId: input.userId,
      orderStatus: input.orderStatus,
      fulfillmentStatus: input.fulfillmentStatus,
      paymentStatus: input.paymentStatus,
      statusVersion: 1,
    },
  });
}

export class OrderTransitionService {
  constructor(private readonly db: TransactionRunner = prisma) {}

  async transitionOrder(
    command: OrderTransitionCommand,
  ): Promise<Result<OrderTransitionResult>> {
    try {
      return ok(
        await this.db.$transaction((tx) =>
          this.transitionOrderInTransaction(tx, command),
        ),
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async transitionFulfillment(
    command: FulfillmentTransitionCommand,
  ): Promise<Result<OrderTransitionResult>> {
    try {
      return ok(
        await this.db.$transaction((tx) =>
          this.transitionFulfillmentInTransaction(tx, command),
        ),
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async transitionOrderInTransaction(
    tx: Prisma.TransactionClient,
    command: OrderTransitionCommand,
  ): Promise<OrderTransitionResult> {
    const order = await tx.order.findUnique({
      where: { id: command.orderId },
      select: {
        id: true,
        orderNo: true,
        status: true,
        statusVersion: true,
      },
    });
    if (!order) throw new NotFoundError("Order", command.orderId);
    if (order.statusVersion !== command.expectedVersion) {
      throw this.versionConflict(command.expectedVersion, order.statusVersion);
    }

    const decision = evaluateOrderTransition(order.status, command.toStatus);
    if (!decision.allowed) {
      throw new BusinessRuleError(decision.reason.message);
    }

    const nextVersion = command.expectedVersion + 1;
    const updated = await tx.order.updateMany({
      where: {
        id: command.orderId,
        status: order.status,
        statusVersion: command.expectedVersion,
      },
      data: {
        status: command.toStatus,
        statusVersion: { increment: 1 },
      },
    });
    if (updated.count !== 1) {
      throw this.versionConflict(command.expectedVersion);
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: command.orderId,
        sequence: nextVersion,
        kind: OrderTransitionKind.ORDER,
        fromOrderStatus: order.status,
        toOrderStatus: command.toStatus,
        actorId: command.actorId,
        reason: command.reason,
        metadata: command.metadata ?? {},
      },
    });
    await this.recordAuditAndEvent(tx, {
      orderId: command.orderId,
      orderNo: order.orderNo,
      actorId: command.actorId,
      kind: OrderTransitionKind.ORDER,
      fromStatus: order.status,
      toStatus: command.toStatus,
      reason: command.reason,
      statusVersion: nextVersion,
      metadata: command.metadata,
    });

    return {
      orderId: command.orderId,
      kind: OrderTransitionKind.ORDER,
      fromStatus: order.status,
      toStatus: command.toStatus,
      statusVersion: nextVersion,
      sequence: nextVersion,
    };
  }

  async transitionFulfillmentInTransaction(
    tx: Prisma.TransactionClient,
    command: FulfillmentTransitionCommand,
  ): Promise<OrderTransitionResult> {
    const order = await tx.order.findUnique({
      where: { id: command.orderId },
      select: {
        id: true,
        orderNo: true,
        fulfillmentStatus: true,
        statusVersion: true,
      },
    });
    if (!order) throw new NotFoundError("Order", command.orderId);
    if (order.statusVersion !== command.expectedVersion) {
      throw this.versionConflict(command.expectedVersion, order.statusVersion);
    }

    const decision = evaluateFulfillmentTransition(
      order.fulfillmentStatus,
      command.toStatus,
    );
    if (!decision.allowed) {
      throw new BusinessRuleError(decision.reason.message);
    }

    const nextVersion = command.expectedVersion + 1;
    const updated = await tx.order.updateMany({
      where: {
        id: command.orderId,
        fulfillmentStatus: order.fulfillmentStatus,
        statusVersion: command.expectedVersion,
      },
      data: {
        fulfillmentStatus: command.toStatus,
        statusVersion: { increment: 1 },
      },
    });
    if (updated.count !== 1) {
      throw this.versionConflict(command.expectedVersion);
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: command.orderId,
        sequence: nextVersion,
        kind: OrderTransitionKind.FULFILLMENT,
        fromFulfillmentStatus: order.fulfillmentStatus,
        toFulfillmentStatus: command.toStatus,
        actorId: command.actorId,
        reason: command.reason,
        metadata: command.metadata ?? {},
      },
    });
    await this.recordAuditAndEvent(tx, {
      orderId: command.orderId,
      orderNo: order.orderNo,
      actorId: command.actorId,
      kind: OrderTransitionKind.FULFILLMENT,
      fromStatus: order.fulfillmentStatus,
      toStatus: command.toStatus,
      reason: command.reason,
      statusVersion: nextVersion,
      metadata: command.metadata,
    });

    return {
      orderId: command.orderId,
      kind: OrderTransitionKind.FULFILLMENT,
      fromStatus: order.fulfillmentStatus,
      toStatus: command.toStatus,
      statusVersion: nextVersion,
      sequence: nextVersion,
    };
  }

  private versionConflict(expected: number, actual?: number): ConflictError {
    const suffix = actual === undefined ? "" : `; current version is ${actual}`;
    return new ConflictError(
      `Order status version conflict: expected ${expected}${suffix}`,
    );
  }

  private async recordAuditAndEvent(
    tx: Prisma.TransactionClient,
    input: {
      orderId: string;
      orderNo: string;
      actorId: string | null;
      kind: OrderTransitionKind;
      fromStatus: string;
      toStatus: string;
      reason: string;
      statusVersion: number;
      metadata?: Prisma.InputJsonObject;
    },
  ): Promise<void> {
    const eventType =
      input.kind === OrderTransitionKind.ORDER
        ? "order.status.changed"
        : "order.fulfillment.changed";
    const metadata = {
      kind: input.kind,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      reason: input.reason,
      statusVersion: input.statusVersion,
      ...(input.metadata ?? {}),
    };

    await tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: "order.update",
        targetType: "order",
        targetId: input.orderId,
        metadata,
      },
    });
    await enqueueOutboxEvent(tx, {
      aggregateType: "order",
      aggregateId: input.orderId,
      eventType,
      idempotencyKey: `order:${input.orderId}:transition:${input.statusVersion}`,
      payload: {
        orderId: input.orderId,
        orderNo: input.orderNo,
        actorId: input.actorId,
        ...metadata,
      },
    });
  }
}

export const orderTransitionService = new OrderTransitionService();
