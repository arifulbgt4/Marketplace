import { prisma } from "src/lib/prisma";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { ok, fail, type Result, BusinessRuleError, NotFoundError } from "src/lib/errors";

export class PaymentReconciliationService {
  async reconcilePayment(
    providerRef: string,
    newStatus: PaymentStatus,
    rawPayload: any
  ): Promise<Result<any>> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Find the payment by providerRef
        const payment = await tx.payment.findUnique({
          where: { providerRef },
          include: { order: true },
        });

        if (!payment) {
          throw new NotFoundError("Payment", providerRef);
        }

        const oldStatus = payment.status;

        // Mismatch check / Idempotent return
        if (oldStatus === newStatus) {
          return { success: true, paymentId: payment.id, orderId: payment.orderId, noop: true };
        }

        // 2. Update payment status
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: { status: newStatus },
        });

        // 3. Log payment event
        await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            type: "WEBHOOK_RECONCILIATION",
            statusFrom: oldStatus,
            statusTo: newStatus,
            metadata: rawPayload || {},
          },
        });

        // 4. Update order payment status
        // Map PaymentStatus to Order paymentStatus
        let orderPaymentStatus = payment.order.paymentStatus;
        if (newStatus === "PAID") {
          orderPaymentStatus = "PAID";
        } else if (newStatus === "FAILED") {
          orderPaymentStatus = "FAILED";
        } else if (newStatus === "REFUNDED") {
          orderPaymentStatus = "REFUNDED";
        } else if (newStatus === "PARTIALLY_REFUNDED") {
          orderPaymentStatus = "PARTIALLY_REFUNDED";
        }

        // Determine if we should transition the OrderStatus enum
        let orderStatus = payment.order.status;
        if (orderPaymentStatus === "PAID" && payment.order.status === "pending") {
          orderStatus = "confirmed";
        }

        const updatedOrder = await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: orderPaymentStatus,
            status: orderStatus,
          },
        });

        // 5. Create Audit Log
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
              oldStatus,
              newStatus,
            },
          },
        });

        return {
          success: true,
          paymentId: updatedPayment.id,
          orderId: updatedOrder.id,
          orderNo: updatedOrder.orderNo,
          orderStatus: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
        };
      });

      return ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return fail(error);
      }
      console.error("Failed to reconcile payment:", error);
      return fail(new BusinessRuleError(error.message || "Failed to reconcile payment"));
    }
  }
}

export const paymentReconciliationService = new PaymentReconciliationService();
