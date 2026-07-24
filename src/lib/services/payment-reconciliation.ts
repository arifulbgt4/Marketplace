import { PaymentStatus, Prisma, type PrismaClient } from "@prisma/client";

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
import { orderCompensationService } from "src/lib/services/order-compensation";
import { evaluatePaymentTransition } from "src/lib/services/payment-lifecycle";
import { orderTransitionService } from "src/lib/services/order-transition";
import { enqueueOutboxEvent } from "src/lib/services/outbox";

export type ReconciliationResult = {
  paymentId: string;
  orderId: string;
  noop?: boolean;
  ignored?: boolean;
  reason?: string;
  orderNo?: string;
  orderStatus?: string;
  paymentStatus?: PaymentStatus;
};

export class PaymentReconciliationService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async reconcilePayment(
    providerRef: string,
    newStatus: PaymentStatus,
    rawPayload: Prisma.InputJsonValue,
    idempotencyKey?: string,
  ): Promise<Result<ReconciliationResult>> {
    try {
      const result = await this.withSerializableRetry(async (tx) => {
        if (idempotencyKey) {
          const existingEvent = await tx.paymentEvent.findUnique({
            where: { idempotencyKey },
            select: { paymentId: true },
          });
          if (existingEvent) {
            const existingPayment = await tx.payment.findUniqueOrThrow({
              where: { id: existingEvent.paymentId },
              select: { orderId: true },
            });
            return {
              paymentId: existingEvent.paymentId,
              orderId: existingPayment.orderId,
              noop: true,
            };
          }
        }

        const payment = await tx.payment.findUnique({
          where: { providerRef },
          include: { order: true },
        });
        if (!payment) throw new NotFoundError("Payment", providerRef);
        if (newStatus === PaymentStatus.PAID) {
          const webhookAmount = this.webhookAmount(rawPayload);
          if (webhookAmount === null || !webhookAmount.equals(payment.amount)) {
            throw new BusinessRuleError(
              "Webhook payment amount does not match the payment",
            );
          }
        }

        const decision = evaluatePaymentTransition(payment.status, newStatus);
        if (decision.kind === "duplicate") {
          return {
            paymentId: payment.id,
            orderId: payment.orderId,
            noop: true,
          };
        }
        if (decision.kind === "ignore") {
          return {
            paymentId: payment.id,
            orderId: payment.orderId,
            noop: true,
            ignored: true,
            reason: decision.reason,
          };
        }

        const changed = await tx.payment.updateMany({
          where: { id: payment.id, status: payment.status },
          data: { status: newStatus },
        });
        if (changed.count !== 1) {
          throw new ConflictError("Payment changed concurrently");
        }

        const paymentEvent = await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            idempotencyKey: idempotencyKey ?? null,
            type: "WEBHOOK_RECONCILIATION",
            statusFrom: payment.status,
            statusTo: newStatus,
            metadata: rawPayload,
          },
        });

        const orderPaymentStatus = this.orderPaymentStatus(
          payment.order.paymentStatus,
          newStatus,
        );
        if (
          newStatus === PaymentStatus.PAID &&
          payment.order.status === "pending"
        ) {
          await orderTransitionService.transitionOrderInTransaction(tx, {
            orderId: payment.orderId,
            toStatus: "confirmed",
            expectedVersion: payment.order.statusVersion,
            actorId: null,
            reason: "Online payment confirmed",
            metadata: {
              source: "payment_reconciliation",
              paymentId: payment.id,
              providerRef,
            },
          });
        }

        const shouldCompensate =
          (
            [PaymentStatus.FAILED, PaymentStatus.CANCELLED] as PaymentStatus[]
          ).includes(newStatus) &&
          (
            [PaymentStatus.UNPAID, PaymentStatus.PENDING] as PaymentStatus[]
          ).includes(payment.status) &&
          ["pending", "cancelled"].includes(payment.order.status);
        if (shouldCompensate && payment.order.status === "pending") {
          await orderTransitionService.transitionOrderInTransaction(tx, {
            orderId: payment.orderId,
            toStatus: "cancelled",
            expectedVersion: payment.order.statusVersion,
            actorId: null,
            reason: `Online payment ${newStatus.toLowerCase()}`,
            metadata: {
              source: "payment_reconciliation",
              paymentId: payment.id,
              providerRef,
            },
          });
        }

        const compensation = shouldCompensate
          ? await orderCompensationService.compensateOrderResourcesInTransaction(
              tx,
              {
                orderId: payment.orderId,
                actorId: payment.order.userId,
                reason: `Online payment ${newStatus.toLowerCase()}`,
                keyPrefix: `payment_${newStatus.toLowerCase()}`,
              },
            )
          : null;

        const updatedOrder = await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: orderPaymentStatus },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "payment",
          aggregateId: payment.id,
          eventType: "payment.status.changed",
          idempotencyKey: `payment-event:${paymentEvent.id}`,
          payload: {
            paymentId: payment.id,
            orderId: payment.orderId,
            orderNo: payment.order.orderNo,
            providerRef,
            fromStatus: payment.status,
            toStatus: newStatus,
          },
        });
        if (compensation) {
          await enqueueOutboxEvent(tx, {
            aggregateType: "order",
            aggregateId: payment.orderId,
            eventType: "order.resources.compensated",
            idempotencyKey: `payment-event:${paymentEvent.id}:compensation`,
            payload: {
              orderId: payment.orderId,
              paymentId: payment.id,
              trigger: newStatus,
              inventoryItemsRestocked: compensation.inventoryItemsRestocked,
              couponReleased: compensation.couponReleased,
            },
          });
        }
        await tx.auditLog.create({
          data: {
            actorId: payment.order.userId,
            action: `payment.reconcile.${newStatus.toLowerCase()}`,
            targetType: "payment",
            targetId: payment.id,
            metadata: {
              orderNo: payment.order.orderNo,
              paymentId: payment.id,
              amount: payment.amount.toString(),
              oldStatus: payment.status,
              newStatus,
              idempotencyKey,
            },
          },
        });

        return {
          paymentId: payment.id,
          orderId: updatedOrder.id,
          orderNo: updatedOrder.orderNo,
          orderStatus: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
        };
      });
      return ok(result);
    } catch (error: unknown) {
      if (
        idempotencyKey &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existing = await this.db.paymentEvent.findUnique({
          where: { idempotencyKey },
          include: { payment: { select: { orderId: true } } },
        });
        if (existing) {
          return ok({
            paymentId: existing.paymentId,
            orderId: existing.payment.orderId,
            noop: true,
          });
        }
      }
      return fail(asAppError(error));
    }
  }

  private orderPaymentStatus(
    current: PaymentStatus,
    next: PaymentStatus,
  ): PaymentStatus {
    return (
      [
        PaymentStatus.PAID,
        PaymentStatus.FAILED,
        PaymentStatus.CANCELLED,
        PaymentStatus.REFUNDED,
        PaymentStatus.PARTIALLY_REFUNDED,
      ] as PaymentStatus[]
    ).includes(next)
      ? next
      : current;
  }

  private webhookAmount(payload: Prisma.InputJsonValue): Prisma.Decimal | null {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }
    const amount = (payload as Prisma.InputJsonObject).amount;
    if (typeof amount !== "number" && typeof amount !== "string") return null;
    try {
      return new Prisma.Decimal(amount).toDecimalPlaces(2);
    } catch {
      return null;
    }
  }

  private async withSerializableRetry<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.db.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error: unknown) {
        const retryable =
          (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2034") ||
          error instanceof ConflictError;
        if (!retryable || attempt === 2) throw error;
      }
    }
    throw new ConflictError("Payment reconciliation could not be serialized");
  }
}

export const paymentReconciliationService = new PaymentReconciliationService();
