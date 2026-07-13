import { prisma } from "src/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { ok, fail, type Result, BusinessRuleError, NotFoundError } from "src/lib/errors";

export interface CODCollectionInput {
  orderId: string;
  collectedAmount: number;
  currency: string;
  notes?: string;
  receiptRef?: string;
}

export class CODCollectionService {
  async collectPayment(
    actorId: string,
    data: CODCollectionInput
  ): Promise<Result<any>> {
    try {
      // 1. Verify actor exists and has correct permissions
      const actor = await prisma.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });

      if (!actor || !["admin", "support"].includes(actor.role)) {
        return fail(new BusinessRuleError("Actor is not authorized to collect payment"));
      }

      const result = await prisma.$transaction(async (tx) => {
        // 2. Find PENDING_COLLECTION cash on delivery payment for this order
        const payment = await tx.payment.findFirst({
          where: {
            orderId: data.orderId,
            provider: "CASH_ON_DELIVERY",
            status: "PENDING_COLLECTION",
          },
          include: { order: true },
        });

        if (!payment) {
          throw new NotFoundError("Pending COD Payment", data.orderId);
        }

        // Mismatch check (expected amount vs actual collected amount)
        const expectedAmount = Number(payment.amount);
        const collectedAmount = data.collectedAmount;
        const isAnomaly = expectedAmount !== collectedAmount;

        // 3. Update payment status to COLLECTED
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: { status: "COLLECTED" },
        });

        // 4. Log manual collection payment event
        await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            type: "MANUAL_COLLECTION",
            statusFrom: "PENDING_COLLECTION",
            statusTo: "COLLECTED",
            metadata: {
              actorId,
              expectedAmount,
              collectedAmount,
              isAnomaly,
              notes: data.notes || "",
              receiptRef: data.receiptRef || "",
            },
          },
        });

        // 5. Update order payment status
        const updatedOrder = await tx.order.update({
          where: { id: data.orderId },
          data: {
            paymentStatus: "COLLECTED",
          },
        });

        // 6. Log dynamic audit trails
        await tx.auditLog.create({
          data: {
            actorId,
            action: "payment.collect.cod",
            targetType: "payment",
            targetId: payment.id,
            metadata: {
              orderNo: payment.order.orderNo,
              collectedAmount,
              expectedAmount,
              isAnomaly,
              notes: data.notes,
            },
          },
        });

        return {
          success: true,
          paymentId: updatedPayment.id,
          orderId: updatedOrder.id,
          orderNo: updatedOrder.orderNo,
          expectedAmount,
          collectedAmount,
          isAnomaly,
        };
      });

      return ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return fail(error);
      }
      console.error("COD Collection failure:", error);
      return fail(new BusinessRuleError(error.message || "Failed to record COD collection"));
    }
  }
}

export const codCollectionService = new CODCollectionService();
