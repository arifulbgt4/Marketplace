import { Prisma, ReturnStatus } from "@prisma/client";

import { prisma } from "src/lib/prisma";
import { getAuthSession, requireRole } from "src/lib/authz";
import {
  AuthorizationError,
  BusinessRuleError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { orderCompensationService } from "src/lib/services/order-compensation";
import {
  evaluateFulfillmentTransition,
  returnDecisionSchema,
  returnRequestSchema,
  type ReturnDecisionInput,
  type ReturnRequestInput,
} from "src/modules/order";

const RETURN_TRANSITIONS: Readonly<
  Record<ReturnStatus, readonly ReturnStatus[]>
> = {
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["RECEIVED", "REJECTED"],
  REJECTED: [],
  RECEIVED: ["COMPLETED"],
  COMPLETED: [],
};

export class OrderReturnService {
  async request(
    orderId: string,
    input: ReturnRequestInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = returnRequestSchema.parse(input);

      const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: { id: orderId, userId: session.userId, placedAt: { not: null } },
          include: {
            items: true,
            returnRequests: {
              where: { status: { not: "REJECTED" } },
              include: { items: true },
            },
          },
        });
        if (!order) throw new NotFoundError("Order", orderId);
        if (order.fulfillmentStatus !== "DELIVERED") {
          throw new BusinessRuleError(
            "Returns can be requested only after delivery",
          );
        }

        const itemMap = new Map(order.items.map((item) => [item.id, item]));
        for (const item of parsed.items) {
          const orderedItem = itemMap.get(item.orderItemId);
          if (!orderedItem) {
            throw new BusinessRuleError(
              "A return item does not belong to this order",
            );
          }
          const alreadyRequested = order.returnRequests.reduce(
            (sum, request) =>
              sum +
              request.items
                .filter(
                  (returnItem) =>
                    returnItem.orderItemId === item.orderItemId,
                )
                .reduce((quantity, returnItem) => quantity + returnItem.quantity, 0),
            0,
          );
          if (alreadyRequested + item.quantity > orderedItem.quantity) {
            throw new BusinessRuleError(
              `${orderedItem.sku} return quantity exceeds remaining quantity`,
            );
          }
        }

        const request = await tx.returnRequest.create({
          data: {
            orderId: order.id,
            requestedById: session.userId,
            reason: parsed.reason,
            currency: order.currency,
            items: {
              create: parsed.items.map((item) => ({
                orderItemId: item.orderItemId,
                quantity: item.quantity,
                reason: item.reason,
                condition: item.condition,
              })),
            },
          },
          include: { items: true },
        });
        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "order.return.request",
            targetType: "return_request",
            targetId: request.id,
            metadata: { orderId: order.id, reason: parsed.reason },
          },
        });
        await tx.outboxEvent.create({
          data: {
            aggregateType: "return_request",
            aggregateId: request.id,
            eventType: "order.return_requested",
            payload: {
              orderId: order.id,
              returnRequestId: request.id,
              customerId: session.userId,
            },
            idempotencyKey: `return:${request.id}:requested`,
          },
        });
        return request;
      });
      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async decide(
    returnRequestId: string,
    input: ReturnDecisionInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const parsed = returnDecisionSchema.parse(input);

      const result = await prisma.$transaction(
        async (tx) => {
          const request = await tx.returnRequest.findUnique({
            where: { id: returnRequestId },
            include: {
              items: { include: { orderItem: true } },
              order: {
                include: {
                  items: true,
                  payments: true,
                  returnRequests: {
                    where: { status: "COMPLETED" },
                    include: { items: true },
                  },
                },
              },
            },
          });
          if (!request)
            throw new NotFoundError("ReturnRequest", returnRequestId);
          if (!RETURN_TRANSITIONS[request.status].includes(parsed.status)) {
            throw new BusinessRuleError(
              `Return cannot transition from ${request.status} to ${parsed.status}`,
            );
          }

          const calculatedRefund = request.items.reduce(
            (sum, item) =>
              sum + Number(item.orderItem.unitPrice) * item.quantity,
            0,
          );
          const refundAmount =
            parsed.refundAmount ??
            (request.refundAmount
              ? Number(request.refundAmount)
              : calculatedRefund);
          if (refundAmount > Number(request.order.totalPrice)) {
            throw new BusinessRuleError(
              "Return refund exceeds the order total",
            );
          }

          const timestamps = {
            approvedAt:
              parsed.status === "APPROVED" ? new Date() : request.approvedAt,
            receivedAt:
              parsed.status === "RECEIVED" ? new Date() : request.receivedAt,
            completedAt:
              parsed.status === "COMPLETED" ? new Date() : request.completedAt,
          };
          const updated = await tx.returnRequest.update({
            where: { id: request.id },
            data: {
              status: parsed.status,
              resolutionNote: parsed.resolutionNote,
              refundAmount:
                parsed.status === "APPROVED" ||
                parsed.status === "RECEIVED" ||
                parsed.status === "COMPLETED"
                  ? new Prisma.Decimal(refundAmount)
                  : request.refundAmount,
              ...timestamps,
            },
            include: { items: true },
          });

          if (parsed.status === "RECEIVED") {
            for (const item of request.items) {
              if (!item.orderItem.variantId) continue;
              await orderCompensationService.restockCommittedInTransaction(tx, {
                orderId: request.orderId,
                orderItemId: item.orderItemId,
                variantId: item.orderItem.variantId,
                quantity: item.quantity,
                actorId: session!.userId,
                reason: `Return ${request.id} received`,
                idempotencyKey: `return:${request.id}:inventory:${item.id}`,
              });
            }
          }

          let orderFulfillmentStatus = request.order.fulfillmentStatus;
          if (parsed.status === "COMPLETED") {
            const completedQuantities = new Map<string, number>();
            for (const completed of [
              ...request.order.returnRequests,
              { items: request.items },
            ]) {
              for (const item of completed.items) {
                completedQuantities.set(
                  item.orderItemId,
                  (completedQuantities.get(item.orderItemId) ?? 0) +
                    item.quantity,
                );
              }
            }
            const allReturned = request.order.items.every(
              (item) =>
                (completedQuantities.get(item.id) ?? 0) >= item.quantity,
            );
            if (allReturned) {
              const transition = evaluateFulfillmentTransition(
                request.order.fulfillmentStatus,
                "RETURNED",
              );
              if (!transition.allowed) {
                throw new BusinessRuleError(transition.reason.message);
              }
              const sequence = request.order.statusVersion + 1;
              await tx.order.update({
                where: { id: request.orderId },
                data: {
                  fulfillmentStatus: "RETURNED",
                  statusVersion: { increment: 1 },
                },
              });
              await tx.orderStatusHistory.create({
                data: {
                  orderId: request.orderId,
                  sequence,
                  kind: "FULFILLMENT",
                  fromFulfillmentStatus: request.order.fulfillmentStatus,
                  toFulfillmentStatus: "RETURNED",
                  actorId: session!.userId,
                  reason: `Return ${request.id} completed`,
                },
              });
              orderFulfillmentStatus = "RETURNED";
            }

            const refundablePayment = request.order.payments.some((payment) =>
              ["PAID", "COLLECTED", "PARTIALLY_REFUNDED"].includes(
                payment.status,
              ),
            );
            if (refundablePayment && refundAmount > 0) {
              await tx.outboxEvent.createMany({
                data: [
                  {
                    aggregateType: "payment",
                    aggregateId: request.orderId,
                    eventType: "payment.refund_requested",
                    payload: {
                      orderId: request.orderId,
                      returnRequestId: request.id,
                      amount: refundAmount,
                      reason: parsed.resolutionNote,
                    },
                    idempotencyKey: `return:${request.id}:refund`,
                  },
                ],
                skipDuplicates: true,
              });
            }
          }

          await tx.auditLog.create({
            data: {
              actorId: session!.userId,
              action: `order.return.${parsed.status.toLowerCase()}`,
              targetType: "return_request",
              targetId: request.id,
              metadata: {
                orderId: request.orderId,
                resolutionNote: parsed.resolutionNote,
                refundAmount,
              },
            },
          });
          await tx.outboxEvent.createMany({
            data: [
              {
                aggregateType: "return_request",
                aggregateId: request.id,
                eventType: `order.return_${parsed.status.toLowerCase()}`,
                payload: {
                  orderId: request.orderId,
                  returnRequestId: request.id,
                  status: parsed.status,
                },
                idempotencyKey: `return:${request.id}:${parsed.status.toLowerCase()}`,
              },
            ],
            skipDuplicates: true,
          });

          return {
            ...updated,
            orderFulfillmentStatus,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const orderReturnService = new OrderReturnService();
