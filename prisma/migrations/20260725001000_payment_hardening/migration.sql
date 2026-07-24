-- AlterTable
ALTER TABLE "Payment"
ADD COLUMN "refundedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Backfill previously recorded refunds without trusting malformed JSON.
WITH refund_totals AS (
    SELECT
        "paymentId",
        SUM(
            CASE
                WHEN jsonb_typeof("metadata"->'amountToRefund') = 'number'
                    THEN ("metadata"->>'amountToRefund')::DECIMAL
                WHEN jsonb_typeof("metadata"->'amountToRefund') = 'string'
                    AND ("metadata"->>'amountToRefund') ~ '^[0-9]+([.][0-9]+)?$'
                    THEN ("metadata"->>'amountToRefund')::DECIMAL
                ELSE 0
            END
        ) AS "refundedAmount"
    FROM "PaymentEvent"
    WHERE "type" = 'REFUND'
    GROUP BY "paymentId"
)
UPDATE "Payment" AS payment
SET "refundedAmount" = LEAST(
    payment."amount",
    CASE
        WHEN payment."status" = 'REFUNDED' THEN payment."amount"
        ELSE COALESCE(refund_totals."refundedAmount", 0)
    END
)
FROM refund_totals
WHERE payment."id" = refund_totals."paymentId";

UPDATE "Payment"
SET "refundedAmount" = "amount"
WHERE "status" = 'REFUNDED' AND "refundedAmount" = 0;

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_refunded_amount_check"
CHECK (
    "refundedAmount" >= 0
    AND "refundedAmount" <= "amount"
);

-- AlterTable
ALTER TABLE "PaymentEvent"
ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_idempotencyKey_key" ON "PaymentEvent"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PaymentEvent_paymentId_type_idx" ON "PaymentEvent"("paymentId", "type");
