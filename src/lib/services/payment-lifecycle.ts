import { PaymentStatus } from "@prisma/client";

export const PAYMENT_ALLOWED_TRANSITIONS = {
  UNPAID: ["PENDING", "PENDING_COLLECTION", "CANCELLED"],
  PENDING: ["PAID", "FAILED", "CANCELLED"],
  PENDING_COLLECTION: ["COLLECTED", "CANCELLED"],
  PAID: ["PARTIALLY_REFUNDED", "REFUNDED"],
  COLLECTED: ["PARTIALLY_REFUNDED", "REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  PARTIALLY_REFUNDED: ["PARTIALLY_REFUNDED", "REFUNDED"],
  REFUNDED: [],
} as const satisfies Record<PaymentStatus, readonly PaymentStatus[]>;

export type PaymentTransitionDecision =
  | { kind: "apply"; from: PaymentStatus; to: PaymentStatus }
  | { kind: "duplicate"; from: PaymentStatus; to: PaymentStatus }
  | {
      kind: "ignore";
      from: PaymentStatus;
      to: PaymentStatus;
      reason: "TERMINAL_STATE" | "OUT_OF_ORDER" | "ILLEGAL_TRANSITION";
    };

const TERMINAL = new Set<PaymentStatus>([
  PaymentStatus.FAILED,
  PaymentStatus.CANCELLED,
  PaymentStatus.REFUNDED,
]);

export function evaluatePaymentTransition(
  from: PaymentStatus,
  to: PaymentStatus,
): PaymentTransitionDecision {
  if (from === to && from !== PaymentStatus.PARTIALLY_REFUNDED) {
    return { kind: "duplicate", from, to };
  }
  if (
    (from === PaymentStatus.PAID ||
      from === PaymentStatus.COLLECTED ||
      from === PaymentStatus.PARTIALLY_REFUNDED) &&
    (to === PaymentStatus.PENDING ||
      to === PaymentStatus.FAILED ||
      to === PaymentStatus.CANCELLED)
  ) {
    return { kind: "ignore", from, to, reason: "OUT_OF_ORDER" };
  }
  if (TERMINAL.has(from)) {
    return { kind: "ignore", from, to, reason: "TERMINAL_STATE" };
  }
  if (
    !(PAYMENT_ALLOWED_TRANSITIONS[from] as readonly PaymentStatus[]).includes(
      to,
    )
  ) {
    return { kind: "ignore", from, to, reason: "ILLEGAL_TRANSITION" };
  }
  return { kind: "apply", from, to };
}
