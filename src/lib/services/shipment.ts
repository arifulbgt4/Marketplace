import {
  FulfillmentStatus,
  OrderStatus,
  Prisma,
  ShipmentStatus,
  type OrderTransitionKind,
} from "@prisma/client";
import { randomUUID } from "crypto";

import { requireRole, type Role } from "src/lib/authz";
import type { UserSession } from "src/lib/domain";
import {
  asAppError,
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import {
  evaluateFulfillmentTransition,
  type ShipmentCreateInput,
  type ShipmentUpdateInput,
} from "src/modules/order";

const SHIPMENT_TRANSITIONS = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
  CANCELLED: [],
} as const satisfies Record<ShipmentStatus, readonly ShipmentStatus[]>;

const FULFILLMENT_RANK: Record<FulfillmentStatus, number> = {
  UNFULFILLED: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  RETURNED: 4,
};

type OrderItemQuantity = { id: string; quantity: number };
type ShipmentQuantity = {
  id: string;
  status: ShipmentStatus;
  items: { orderItemId: string; quantity: number }[];
};

export type ShipmentResult = {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  carrier: string | null;
  service: string | null;
  trackingNumber: string | null;
  estimatedDeliveryAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  fulfillmentStatus: FulfillmentStatus;
};

function assertShipmentTransition(
  from: ShipmentStatus,
  to: ShipmentStatus,
): void {
  if (from === to) {
    throw new BusinessRuleError(`Shipment is already "${to}"`);
  }
  if (!(SHIPMENT_TRANSITIONS[from] as readonly ShipmentStatus[]).includes(to)) {
    throw new BusinessRuleError(
      `Shipment transition from "${from}" to "${to}" is not allowed`,
    );
  }
}

function totalByItem(
  shipments: ShipmentQuantity[],
  acceptedStatuses?: ReadonlySet<ShipmentStatus>,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const shipment of shipments) {
    if (shipment.status === ShipmentStatus.CANCELLED) continue;
    if (acceptedStatuses && !acceptedStatuses.has(shipment.status)) continue;
    for (const item of shipment.items) {
      totals.set(
        item.orderItemId,
        (totals.get(item.orderItemId) ?? 0) + item.quantity,
      );
    }
  }
  return totals;
}

function coversEveryOrderItem(
  orderItems: OrderItemQuantity[],
  totals: Map<string, number>,
): boolean {
  return orderItems.every(
    (item) => (totals.get(item.id) ?? 0) >= item.quantity,
  );
}

function deriveFulfillmentStatus(
  orderItems: OrderItemQuantity[],
  shipments: ShipmentQuantity[],
): FulfillmentStatus {
  const active = shipments.filter(
    (shipment) => shipment.status !== ShipmentStatus.CANCELLED,
  );
  if (active.length === 0) return FulfillmentStatus.UNFULFILLED;

  if (
    coversEveryOrderItem(
      orderItems,
      totalByItem(active, new Set([ShipmentStatus.RETURNED])),
    )
  ) {
    return FulfillmentStatus.RETURNED;
  }
  if (
    coversEveryOrderItem(
      orderItems,
      totalByItem(
        active,
        new Set([ShipmentStatus.DELIVERED, ShipmentStatus.RETURNED]),
      ),
    )
  ) {
    return FulfillmentStatus.DELIVERED;
  }
  if (
    coversEveryOrderItem(
      orderItems,
      totalByItem(
        active,
        new Set([
          ShipmentStatus.SHIPPED,
          ShipmentStatus.DELIVERED,
          ShipmentStatus.RETURNED,
        ]),
      ),
    )
  ) {
    return FulfillmentStatus.SHIPPED;
  }
  return FulfillmentStatus.PROCESSING;
}

function assertShipmentQuantities(
  orderItems: OrderItemQuantity[],
  existingShipments: ShipmentQuantity[],
  requestedItems: ShipmentCreateInput["items"],
): void {
  const orderQuantities = new Map(
    orderItems.map((item) => [item.id, item.quantity]),
  );
  const requestedIds = new Set<string>();
  for (const item of requestedItems) {
    if (requestedIds.has(item.orderItemId)) {
      throw new BusinessRuleError(
        `Order item ${item.orderItemId} appears more than once`,
      );
    }
    requestedIds.add(item.orderItemId);
    if (!orderQuantities.has(item.orderItemId)) {
      throw new BusinessRuleError(
        `Order item ${item.orderItemId} does not belong to this order`,
      );
    }
  }

  const allocated = totalByItem(existingShipments);
  for (const item of requestedItems) {
    const ordered = orderQuantities.get(item.orderItemId)!;
    const nextAllocated =
      (allocated.get(item.orderItemId) ?? 0) + item.quantity;
    if (nextAllocated > ordered) {
      throw new BusinessRuleError(
        `Shipment quantity exceeds ordered quantity for item ${item.orderItemId}`,
      );
    }
  }
}

function canManageShipments(role: Role): boolean {
  return role === "admin" || role === "support";
}

export class ShipmentService {
  async create(
    session: UserSession | null,
    orderId: string,
    input: ShipmentCreateInput,
  ): Promise<Result<ShipmentResult>> {
    try {
      requireRole(session, ["admin", "support"]);
      if (!session || !canManageShipments(session.role)) {
        throw new BusinessRuleError("Actor cannot manage shipments");
      }

      const result = await this.withSerializableRetry(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          select: {
            id: true,
            orderNo: true,
            status: true,
            fulfillmentStatus: true,
            statusVersion: true,
            items: { select: { id: true, quantity: true } },
            shipments: {
              select: {
                id: true,
                status: true,
                items: { select: { orderItemId: true, quantity: true } },
              },
            },
          },
        });
        if (!order) throw new NotFoundError("Order", orderId);
        if (order.status !== OrderStatus.confirmed) {
          throw new BusinessRuleError(
            "Shipments can only be created for confirmed orders",
          );
        }
        assertShipmentQuantities(order.items, order.shipments, input.items);

        const shipment = await tx.shipment.create({
          data: {
            orderId,
            carrier: input.carrier ?? null,
            service: input.service ?? null,
            trackingNumber: input.trackingNumber ?? null,
            estimatedDeliveryAt: input.estimatedDeliveryAt ?? null,
            items: { create: input.items },
          },
        });

        const nextFulfillment = deriveFulfillmentStatus(order.items, [
          ...order.shipments,
          {
            id: shipment.id,
            status: ShipmentStatus.PENDING,
            items: input.items,
          },
        ]);
        const fulfillmentStatus = await this.recordAggregateTransition(
          tx,
          order,
          nextFulfillment,
          session.userId,
          "Shipment created",
        );

        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "order.update",
            targetType: "shipment",
            targetId: shipment.id,
            metadata: {
              orderId,
              orderNo: order.orderNo,
              action: "shipment.created",
              itemCount: input.items.length,
            },
          },
        });
        await tx.outboxEvent.create({
          data: {
            aggregateType: "order",
            aggregateId: orderId,
            eventType: "shipment.created",
            payload: {
              orderId,
              shipmentId: shipment.id,
              status: ShipmentStatus.PENDING,
            },
            idempotencyKey: `shipment:${shipment.id}:created`,
          },
        });

        return {
          ...shipment,
          fulfillmentStatus,
        } satisfies ShipmentResult;
      });
      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async update(
    session: UserSession | null,
    shipmentId: string,
    input: ShipmentUpdateInput,
  ): Promise<Result<ShipmentResult>> {
    try {
      requireRole(session, ["admin", "support"]);
      if (!session || !canManageShipments(session.role)) {
        throw new BusinessRuleError("Actor cannot manage shipments");
      }

      const result = await this.withSerializableRetry(async (tx) => {
        const current = await tx.shipment.findUnique({
          where: { id: shipmentId },
          select: {
            id: true,
            orderId: true,
            status: true,
            carrier: true,
            service: true,
            trackingNumber: true,
            estimatedDeliveryAt: true,
            shippedAt: true,
            deliveredAt: true,
            items: { select: { orderItemId: true, quantity: true } },
            order: {
              select: {
                id: true,
                orderNo: true,
                status: true,
                fulfillmentStatus: true,
                statusVersion: true,
                items: { select: { id: true, quantity: true } },
                shipments: {
                  select: {
                    id: true,
                    status: true,
                    items: {
                      select: { orderItemId: true, quantity: true },
                    },
                  },
                },
              },
            },
          },
        });
        if (!current) throw new NotFoundError("Shipment", shipmentId);
        if (
          current.order.status === OrderStatus.completed ||
          (current.order.status === OrderStatus.cancelled &&
            input.status !== ShipmentStatus.CANCELLED)
        ) {
          throw new BusinessRuleError(
            "Shipment cannot be updated for this order status",
          );
        }

        const nextStatus = input.status ?? current.status;
        if (input.status !== undefined) {
          assertShipmentTransition(current.status, input.status);
        }
        const nextTracking =
          input.trackingNumber === undefined
            ? current.trackingNumber
            : input.trackingNumber;
        if (
          nextStatus === ShipmentStatus.SHIPPED &&
          (!nextTracking || nextTracking.trim().length === 0)
        ) {
          throw new BusinessRuleError(
            "Tracking number is required before shipping",
          );
        }

        const now = new Date();
        const shipment = await tx.shipment.update({
          where: { id: shipmentId },
          data: {
            status: input.status,
            carrier: input.carrier,
            service: input.service,
            trackingNumber: input.trackingNumber,
            estimatedDeliveryAt: input.estimatedDeliveryAt,
            shippedAt:
              input.status === ShipmentStatus.SHIPPED
                ? (current.shippedAt ?? now)
                : undefined,
            deliveredAt:
              input.status === ShipmentStatus.DELIVERED
                ? (current.deliveredAt ?? now)
                : undefined,
          },
        });

        const shipments = current.order.shipments.map((candidate) =>
          candidate.id === shipmentId
            ? { ...candidate, status: nextStatus }
            : candidate,
        );
        const derived = deriveFulfillmentStatus(current.order.items, shipments);
        const nextAggregate =
          FULFILLMENT_RANK[derived] <
          FULFILLMENT_RANK[current.order.fulfillmentStatus]
            ? current.order.fulfillmentStatus
            : derived;
        const fulfillmentStatus = await this.recordAggregateTransition(
          tx,
          current.order,
          nextAggregate,
          session.userId,
          input.reason,
        );

        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "order.update",
            targetType: "shipment",
            targetId: shipmentId,
            metadata: {
              orderId: current.orderId,
              action: "shipment.updated",
              statusFrom: current.status,
              statusTo: nextStatus,
              reason: input.reason,
            },
          },
        });
        await tx.outboxEvent.create({
          data: {
            aggregateType: "order",
            aggregateId: current.orderId,
            eventType: "shipment.updated",
            payload: {
              orderId: current.orderId,
              shipmentId,
              statusFrom: current.status,
              statusTo: nextStatus,
            },
            idempotencyKey: `shipment:${shipmentId}:updated:${randomUUID()}`,
          },
        });

        return {
          ...shipment,
          fulfillmentStatus,
        } satisfies ShipmentResult;
      });
      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  private async recordAggregateTransition(
    tx: Prisma.TransactionClient,
    order: {
      id: string;
      fulfillmentStatus: FulfillmentStatus;
      statusVersion: number;
    },
    nextStatus: FulfillmentStatus,
    actorId: string,
    reason: string,
  ): Promise<FulfillmentStatus> {
    if (nextStatus === order.fulfillmentStatus) {
      return order.fulfillmentStatus;
    }
    const decision = evaluateFulfillmentTransition(
      order.fulfillmentStatus,
      nextStatus,
    );
    if (!decision.allowed) {
      throw new BusinessRuleError(decision.reason.message);
    }
    const nextVersion = order.statusVersion + 1;
    const updated = await tx.order.updateMany({
      where: { id: order.id, statusVersion: order.statusVersion },
      data: {
        fulfillmentStatus: nextStatus,
        statusVersion: { increment: 1 },
      },
    });
    if (updated.count !== 1) {
      throw new ConflictError("Order fulfillment changed concurrently");
    }
    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        sequence: nextVersion,
        kind: "FULFILLMENT" satisfies OrderTransitionKind,
        fromFulfillmentStatus: order.fulfillmentStatus,
        toFulfillmentStatus: nextStatus,
        actorId,
        reason,
      },
    });
    await tx.outboxEvent.create({
      data: {
        aggregateType: "order",
        aggregateId: order.id,
        eventType: "order.fulfillment_status_changed",
        payload: {
          orderId: order.id,
          from: order.fulfillmentStatus,
          to: nextStatus,
          version: nextVersion,
        },
        idempotencyKey: `order:${order.id}:fulfillment:${nextVersion}`,
      },
    });
    return nextStatus;
  }

  private async withSerializableRetry<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error: unknown) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034";
        if (!retryable || attempt === 2) throw error;
      }
    }
    throw new ConflictError("Shipment update could not be serialized");
  }
}

export const shipmentService = new ShipmentService();
