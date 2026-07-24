import { Prisma, type PrismaClient } from "@prisma/client";

import {
  asAppError,
  BusinessRuleError,
  ConflictError,
  fail,
  NotFoundError,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";

export interface CODCollectionInput {
  orderId: string;
  collectedAmount: number;
  currency: string;
  notes?: string;
  receiptRef?: string;
  idempotencyKey: string;
}

export type CODCollectionResult = {
  success: true;
  paymentId: string;
  orderId: string;
  orderNo: string;
  expectedAmount: number;
  collectedAmount: number;
  isAnomaly: boolean;
  noop?: boolean;
};

export class CODCollectionService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async collectPayment(
    actorId: string,
    data: CODCollectionInput,
  ): Promise<Result<CODCollectionResult>> {
    try {
      if (
        !Number.isFinite(data.collectedAmount) ||
        data.collectedAmount <= 0 ||
        data.collectedAmount > 999_999_999.99
      ) {
        throw new BusinessRuleError(
          "Collected amount must be a positive finite amount",
        );
      }
      const currency = data.currency.trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(currency)) {
        throw new BusinessRuleError("Currency must be a 3-letter ISO code");
      }
      if (data.idempotencyKey.length < 8 || data.idempotencyKey.length > 200) {
        throw new BusinessRuleError("Invalid idempotency key");
      }

      const collectedDecimal = new Prisma.Decimal(
        data.collectedAmount.toString(),
      );
      if (collectedDecimal.decimalPlaces() > 2) {
        throw new BusinessRuleError(
          "Collected amount exceeds the supported currency precision",
        );
      }

      const actor = await this.db.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });

      if (!actor || !["admin", "support"].includes(actor.role)) {
        throw new BusinessRuleError(
          "Actor is not authorized to collect payment",
        );
      }

      const result = await this.withSerializableRetry(async (tx) => {
        const prior = await this.findPriorCollection(
          tx,
          data.idempotencyKey,
          data.orderId,
        );
        if (prior) return prior;

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

        if (payment.currency.toUpperCase() !== currency) {
          throw new BusinessRuleError(
            "Collection currency does not match the payment currency",
          );
        }

        const expectedAmount = payment.amount;
        const isAnomaly = !expectedAmount.equals(collectedDecimal);
        if (isAnomaly && actor.role !== "admin") {
          throw new BusinessRuleError(
            "Only an admin can record a COD amount mismatch",
          );
        }
        if (isAnomaly && (!data.notes || data.notes.trim().length < 3)) {
          throw new BusinessRuleError(
            "A reason is required for a COD amount mismatch",
          );
        }

        const reservedPayment = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: "PENDING_COLLECTION",
          },
          data: { status: "COLLECTED" },
        });
        if (reservedPayment.count !== 1) {
          throw new ConflictError("COD payment was collected concurrently");
        }

        await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            idempotencyKey: data.idempotencyKey,
            type: "MANUAL_COLLECTION",
            statusFrom: "PENDING_COLLECTION",
            statusTo: "COLLECTED",
            metadata: {
              actorId,
              expectedAmount: expectedAmount.toFixed(2),
              collectedAmount: collectedDecimal.toFixed(2),
              currency,
              isAnomaly,
              notes: data.notes || "",
              receiptRef: data.receiptRef || "",
            },
          },
        });

        const updatedOrder = await tx.order.update({
          where: { id: data.orderId },
          data: {
            paymentStatus: "COLLECTED",
          },
        });

        await tx.auditLog.create({
          data: {
            actorId,
            action: "payment.collect.cod",
            targetType: "payment",
            targetId: payment.id,
            metadata: {
              orderNo: payment.order.orderNo,
              collectedAmount: collectedDecimal.toFixed(2),
              expectedAmount: expectedAmount.toFixed(2),
              currency,
              isAnomaly,
              notes: data.notes,
              idempotencyKey: data.idempotencyKey,
            },
          },
        });

        return {
          success: true as const,
          paymentId: payment.id,
          orderId: updatedOrder.id,
          orderNo: updatedOrder.orderNo,
          expectedAmount: expectedAmount.toNumber(),
          collectedAmount: collectedDecimal.toNumber(),
          isAnomaly,
        };
      });

      return ok(result);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        try {
          const prior = await this.findPriorCollection(
            this.db,
            data.idempotencyKey,
            data.orderId,
          );
          if (prior) return ok({ ...prior, noop: true });
        } catch (replayError: unknown) {
          return fail(asAppError(replayError));
        }
      }
      return fail(asAppError(error));
    }
  }

  private async findPriorCollection(
    db: Pick<PrismaClient, "paymentEvent"> | Prisma.TransactionClient,
    idempotencyKey: string,
    orderId: string,
  ): Promise<CODCollectionResult | null> {
    const event = await db.paymentEvent.findUnique({
      where: { idempotencyKey },
      include: {
        payment: {
          include: { order: { select: { id: true, orderNo: true } } },
        },
      },
    });
    if (!event) return null;
    if (
      event.type !== "MANUAL_COLLECTION" ||
      event.payment.order.id !== orderId
    ) {
      throw new ConflictError("Idempotency key was already used");
    }
    const metadata = event.metadata as Record<string, unknown>;
    return {
      success: true,
      paymentId: event.paymentId,
      orderId: event.payment.order.id,
      orderNo: event.payment.order.orderNo,
      expectedAmount: Number(
        metadata.expectedAmount ?? event.payment.amount.toString(),
      ),
      collectedAmount: Number(
        metadata.collectedAmount ?? event.payment.amount.toString(),
      ),
      isAnomaly: metadata.isAnomaly === true,
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
    throw new ConflictError("COD collection could not be serialized");
  }
}

export const codCollectionService = new CODCollectionService();
