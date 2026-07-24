import { PaymentStatus, Prisma, type PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

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
import {
  paymentRegistry,
  type PaymentRegistry,
} from "src/lib/services/payment-adapter";
import { evaluatePaymentTransition } from "src/lib/services/payment-lifecycle";
import { enqueueOutboxEvent } from "src/lib/services/outbox";

export type RefundExecutionResult = {
  paymentId: string;
  orderId: string;
  orderNo: string;
  refundedAmount: string;
  cumulativeRefundedAmount: string;
  newStatus: PaymentStatus;
  refundRef: string;
  noop?: boolean;
};

export class PaymentRefundService {
  constructor(
    private readonly db: PrismaClient = prisma,
    private readonly registry: PaymentRegistry = paymentRegistry,
  ) {}

  async refundPayment(
    actorId: string,
    orderId: string,
    amountToRefund: number,
    reason: string,
    idempotencyKey?: string,
  ): Promise<Result<RefundExecutionResult>> {
    try {
      if (!Number.isFinite(amountToRefund) || amountToRefund <= 0) {
        throw new BusinessRuleError("Refund amount must be positive");
      }
      const requested = new Prisma.Decimal(
        amountToRefund.toString(),
      ).toDecimalPlaces(2);
      if (requested.lte(0)) {
        throw new BusinessRuleError(
          "Refund amount is below the supported currency precision",
        );
      }
      if (reason.trim().length < 3) {
        throw new BusinessRuleError(
          "Refund reason must be at least 3 characters",
        );
      }

      const actor = await this.db.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });
      if (!actor || !["admin", "support"].includes(actor.role)) {
        throw new BusinessRuleError(
          "Actor is not authorized to refund payments",
        );
      }

      const result = await this.withSerializableRetry(async (tx) => {
        if (idempotencyKey) {
          const prior = await this.findPriorRefund(tx, idempotencyKey);
          if (prior) return prior;
        }

        const payment = await tx.payment.findFirst({
          where: {
            orderId,
            status: {
              in: [
                PaymentStatus.PAID,
                PaymentStatus.COLLECTED,
                PaymentStatus.PARTIALLY_REFUNDED,
              ],
            },
          },
          include: { order: true },
        });
        if (!payment) throw new NotFoundError("Refundable payment", orderId);

        const nextRefunded = payment.refundedAmount.add(requested);
        if (nextRefunded.gt(payment.amount)) {
          throw new BusinessRuleError(
            "Total refund amount exceeds original payment amount",
          );
        }
        const isFullRefund = nextRefunded.equals(payment.amount);
        const newStatus = isFullRefund
          ? PaymentStatus.REFUNDED
          : PaymentStatus.PARTIALLY_REFUNDED;
        const decision = evaluatePaymentTransition(payment.status, newStatus);
        if (decision.kind !== "apply") {
          throw new BusinessRuleError(
            `Payment cannot transition from ${payment.status} to ${newStatus}`,
          );
        }

        const reserved = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: payment.status,
            refundedAmount: payment.refundedAmount,
          },
          data: {
            refundedAmount: { increment: requested },
            status: newStatus,
          },
        });
        if (reserved.count !== 1) {
          throw new ConflictError("Refund balance changed concurrently");
        }

        let refundRef = `manual_refund_${randomUUID()}`;
        if (payment.provider !== "CASH_ON_DELIVERY" && payment.providerRef) {
          const adapter = this.registry.getAdapter(payment.provider);
          const refundResult = await adapter.processRefund(
            payment.providerRef,
            requested.toNumber(),
          );
          if (!refundResult.success) {
            throw new BusinessRuleError(
              "Payment gateway refund request failed",
            );
          }
          refundRef = refundResult.data.refundRef;
        }

        const event = await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            idempotencyKey: idempotencyKey ?? null,
            type: "REFUND",
            statusFrom: payment.status,
            statusTo: newStatus,
            metadata: {
              actorId,
              amountToRefund: requested.toFixed(2),
              cumulativeRefundedAmount: nextRefunded.toFixed(2),
              reason: reason.trim(),
              refundRef,
              isFullRefund,
            },
          },
        });
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: newStatus },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: isFullRefund
              ? "payment.refund.full"
              : "payment.refund.partial",
            targetType: "payment",
            targetId: payment.id,
            metadata: {
              orderNo: updatedOrder.orderNo,
              amountToRefund: requested.toFixed(2),
              cumulativeRefundedAmount: nextRefunded.toFixed(2),
              reason: reason.trim(),
              refundRef,
              idempotencyKey,
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "payment",
          aggregateId: payment.id,
          eventType: isFullRefund
            ? "payment.refunded"
            : "payment.partially_refunded",
          idempotencyKey: `payment-refund:${event.id}`,
          payload: {
            paymentId: payment.id,
            orderId,
            orderNo: updatedOrder.orderNo,
            amount: requested.toFixed(2),
            cumulativeAmount: nextRefunded.toFixed(2),
            status: newStatus,
          },
        });
        return {
          paymentId: payment.id,
          orderId,
          orderNo: updatedOrder.orderNo,
          refundedAmount: requested.toFixed(2),
          cumulativeRefundedAmount: nextRefunded.toFixed(2),
          newStatus,
          refundRef,
        };
      });
      return ok(result);
    } catch (error: unknown) {
      if (
        idempotencyKey &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const prior = await this.findPriorRefund(this.db, idempotencyKey);
        if (prior) return ok({ ...prior, noop: true });
      }
      return fail(asAppError(error));
    }
  }

  private async findPriorRefund(
    db: Pick<PrismaClient, "paymentEvent"> | Prisma.TransactionClient,
    idempotencyKey: string,
  ): Promise<RefundExecutionResult | null> {
    const event = await db.paymentEvent.findUnique({
      where: { idempotencyKey },
      include: {
        payment: {
          include: { order: { select: { id: true, orderNo: true } } },
        },
      },
    });
    if (!event || event.type !== "REFUND") return null;
    const metadata = event.metadata as Record<string, unknown>;
    return {
      paymentId: event.paymentId,
      orderId: event.payment.order.id,
      orderNo: event.payment.order.orderNo,
      refundedAmount: String(metadata.amountToRefund ?? "0.00"),
      cumulativeRefundedAmount: String(
        metadata.cumulativeRefundedAmount ??
          event.payment.refundedAmount.toFixed(2),
      ),
      newStatus: event.statusTo,
      refundRef: String(metadata.refundRef ?? ""),
      noop: true,
    };
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
    throw new ConflictError("Refund could not be serialized");
  }
}

export const paymentRefundService = new PaymentRefundService();
