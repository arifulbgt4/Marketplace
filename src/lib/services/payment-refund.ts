import { prisma } from "src/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { ok, fail, type Result, BusinessRuleError, NotFoundError } from "src/lib/errors";
import { paymentRegistry } from "src/lib/services/payment-adapter";

export class PaymentRefundService {
  async refundPayment(
    actorId: string,
    orderId: string,
    amountToRefund: number,
    reason: string
  ): Promise<Result<any>> {
    try {
      // 1. Verify actor role
      const actor = await prisma.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });

      if (!actor || !["admin", "support"].includes(actor.role)) {
        return fail(new BusinessRuleError("Actor is not authorized to refund payments"));
      }

      const result = await prisma.$transaction(async (tx) => {
        // 2. Find successful payments for this order
        const payment = await tx.payment.findFirst({
          where: {
            orderId,
            status: { in: ["PAID", "COLLECTED", "PARTIALLY_REFUNDED"] },
          },
        });

        if (!payment) {
          throw new NotFoundError("Successful Payment", orderId);
        }

        const originalAmount = Number(payment.amount);
        const alreadyRefunded = await tx.paymentEvent.findMany({
          where: {
            paymentId: payment.id,
            type: "REFUND",
          },
        });

        const totalRefundedSoFar = alreadyRefunded.reduce((sum, evt) => {
          const meta = evt.metadata as any;
          return sum + (meta?.amountToRefund || 0);
        }, 0);

        if (totalRefundedSoFar + amountToRefund > originalAmount) {
          throw new BusinessRuleError("Total refund amount exceeds original payment amount");
        }

        // 3. gateway refund logic if payment was online
        let refundRef = `manual_refund_${Date.now()}`;
        if (payment.provider !== "CASH_ON_DELIVERY" && payment.providerRef) {
          const adapter = paymentRegistry.getAdapter(payment.provider);
          const refundResult = await adapter.processRefund(payment.providerRef, amountToRefund);
          if (!refundResult.success) {
            throw new BusinessRuleError("Payment gateway refund request failed");
          }
          refundRef = refundResult.data.refundRef;
        }

        // 4. Update payment status
        const isFullRefund = totalRefundedSoFar + amountToRefund === originalAmount;
        const newStatus: PaymentStatus = isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED";

        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: { status: newStatus },
        });

        // 5. Log payment event
        await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            type: "REFUND",
            statusFrom: payment.status,
            statusTo: newStatus,
            metadata: {
              actorId,
              amountToRefund,
              reason,
              refundRef,
              isFullRefund,
            },
          },
        });

        // 6. Update order status
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: newStatus,
          },
        });

        // 7. Audit log
        await tx.auditLog.create({
          data: {
            actorId,
            action: isFullRefund ? "payment.refund.full" : "payment.refund.partial",
            targetType: "payment",
            targetId: payment.id,
            metadata: {
              orderNo: updatedOrder.orderNo,
              amountToRefund,
              reason,
              refundRef,
            },
          },
        });

        return {
          success: true,
          paymentId: updatedPayment.id,
          orderId: updatedOrder.id,
          orderNo: updatedOrder.orderNo,
          refundedAmount: amountToRefund,
          newStatus,
          refundRef,
        };
      });

      return ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return fail(error);
      }
      console.error("Refund execution failure:", error);
      return fail(new BusinessRuleError(error.message || "Failed to execute refund"));
    }
  }
}

export const paymentRefundService = new PaymentRefundService();
