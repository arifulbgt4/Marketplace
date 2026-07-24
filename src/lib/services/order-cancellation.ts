import { Prisma } from "@prisma/client";

import { getAuthSession } from "src/lib/authz";
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
import { orderCompensationService } from "src/lib/services/order-compensation";
import {
  cancelOrderSchema,
  evaluateCancellation,
  evaluateOrderTransition,
  type CancelOrderInput,
  type CancellationPolicyConfig,
} from "src/modules/order";

function cancellationPolicy(value: Prisma.JsonValue): Partial<CancellationPolicyConfig> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  return {
    customerWindowMinutes:
      typeof record.customerWindowMinutes === "number"
        ? Math.max(0, Math.floor(record.customerWindowMinutes))
        : undefined,
    allowCustomerAfterConfirmed:
      typeof record.allowCustomerAfterConfirmed === "boolean"
        ? record.allowCustomerAfterConfirmed
        : undefined,
  };
}

export class OrderCancellationService {
  async cancel(
    orderId: string,
    input: CancelOrderInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = cancelOrderSchema.parse(input);
      const setting = await prismaBusinessSetting();
      const result = await prismaTransaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { payments: true },
        });
        if (!order) throw new NotFoundError("Order", orderId);

        const decision = evaluateCancellation({
          actorId: session.userId,
          actorRole: session.role,
          customerId: order.userId,
          orderStatus: order.status,
          fulfillmentStatus: order.fulfillmentStatus,
          placedAt: order.placedAt,
          policy: cancellationPolicy(setting?.value ?? {}),
        });
        if (!decision.allowed) {
          if (decision.code === "NOT_OWNER") throw new AuthorizationError();
          throw new BusinessRuleError(decision.message);
        }
        const transition = evaluateOrderTransition(order.status, "cancelled");
        if (!transition.allowed) {
          throw new BusinessRuleError(transition.reason.message);
        }
        if (order.statusVersion !== parsed.expectedVersion) {
          throw new ConflictError(
            "Order changed while cancellation was being submitted",
          );
        }

        const changed = await tx.order.updateMany({
          where: {
            id: order.id,
            status: order.status,
            statusVersion: parsed.expectedVersion,
          },
          data: {
            status: "cancelled",
            statusVersion: { increment: 1 },
          },
        });
        if (changed.count !== 1) {
          throw new ConflictError(
            "Order changed while cancellation was being submitted",
          );
        }

        const unpaidPayments = order.payments.filter((payment) =>
          ["UNPAID", "PENDING", "PENDING_COLLECTION"].includes(payment.status),
        );
        for (const payment of unpaidPayments) {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "CANCELLED" },
          });
          await tx.paymentEvent.create({
            data: {
              paymentId: payment.id,
              type: "ORDER_CANCELLED",
              statusFrom: payment.status,
              statusTo: "CANCELLED",
              metadata: { actorId: session.userId, reason: parsed.reason },
            },
          });
        }

        const refundRequired = order.payments.some((payment) =>
          ["PAID", "COLLECTED", "PARTIALLY_REFUNDED"].includes(payment.status),
        );
        const paymentStatus = refundRequired ? order.paymentStatus : "CANCELLED";
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus },
        });

        const compensation =
          await orderCompensationService.compensateOrderResourcesInTransaction(
            tx,
            {
              orderId: order.id,
              actorId: session.userId,
              reason: `Order cancelled: ${parsed.reason}`,
            },
          );

        const sequence = order.statusVersion + 1;
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            sequence,
            kind: "ORDER",
            fromOrderStatus: order.status,
            toOrderStatus: "cancelled",
            actorId: session.userId,
            reason: parsed.reason,
            metadata: { refundRequired, compensation },
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session.userId,
            action: "order.cancel",
            targetType: "order",
            targetId: order.id,
            metadata: {
              reason: parsed.reason,
              refundRequired,
              compensation,
            },
          },
        });
        await tx.outboxEvent.createMany({
          data: [
            {
              aggregateType: "order",
              aggregateId: order.id,
              eventType: "order.cancelled",
              payload: {
                orderId: order.id,
                orderNo: order.orderNo,
                reason: parsed.reason,
                refundRequired,
              },
              idempotencyKey: `order:${order.id}:cancelled:v${sequence}`,
            },
            ...(refundRequired
              ? [
                  {
                    aggregateType: "payment",
                    aggregateId: order.id,
                    eventType: "payment.refund_requested",
                    payload: {
                      orderId: order.id,
                      reason: parsed.reason,
                    },
                    idempotencyKey: `order:${order.id}:refund:cancel:v${sequence}`,
                  },
                ]
              : []),
          ],
          skipDuplicates: true,
        });

        return {
          orderId: order.id,
          orderNo: order.orderNo,
          status: "cancelled" as const,
          paymentStatus,
          refundRequired,
          compensation,
          statusVersion: sequence,
        };
      });
      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

// These indirections keep transaction behavior easy to isolate in unit tests.
const prismaBusinessSetting = async () => {
  const { prisma } = await import("src/lib/prisma");
  return prisma.businessSettings.findUnique({
    where: { key: "order_policy" },
  });
};

const prismaTransaction = async <T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> => {
  const { prisma } = await import("src/lib/prisma");
  return prisma.$transaction(operation, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  });
};

export const orderCancellationService = new OrderCancellationService();
