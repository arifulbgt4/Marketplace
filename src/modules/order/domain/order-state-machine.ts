import type { FulfillmentStatus, OrderStatus } from "@prisma/client";

export const ORDER_ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
} as const satisfies Record<OrderStatus, readonly OrderStatus[]>;

export const FULFILLMENT_ALLOWED_TRANSITIONS = {
  UNFULFILLED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
} as const satisfies Record<FulfillmentStatus, readonly FulfillmentStatus[]>;

export type TransitionRejectionCode =
  "SAME_STATE" | "TERMINAL_STATE" | "ILLEGAL_TRANSITION";

export type TransitionAllowed<State extends string> = Readonly<{
  allowed: true;
  from: State;
  to: State;
}>;

export type TransitionRejected<State extends string> = Readonly<{
  allowed: false;
  from: State;
  to: State;
  reason: Readonly<{
    code: TransitionRejectionCode;
    message: string;
  }>;
}>;

export type TransitionDecision<State extends string> =
  TransitionAllowed<State> | TransitionRejected<State>;

const TERMINAL_ORDER_STATES = new Set<OrderStatus>(["cancelled", "completed"]);
const TERMINAL_FULFILLMENT_STATES = new Set<FulfillmentStatus>(["RETURNED"]);

function evaluateTransition<State extends string>(
  subject: string,
  from: State,
  to: State,
  allowedTransitions: Readonly<Record<State, readonly State[]>>,
  terminalStates: ReadonlySet<State>,
): TransitionDecision<State> {
  if (from === to) {
    return {
      allowed: false,
      from,
      to,
      reason: {
        code: "SAME_STATE",
        message: `${subject} is already "${from}".`,
      },
    };
  }

  if (terminalStates.has(from)) {
    return {
      allowed: false,
      from,
      to,
      reason: {
        code: "TERMINAL_STATE",
        message: `${subject} "${from}" is terminal and cannot transition to "${to}".`,
      },
    };
  }

  if (!allowedTransitions[from].includes(to)) {
    return {
      allowed: false,
      from,
      to,
      reason: {
        code: "ILLEGAL_TRANSITION",
        message: `${subject} transition from "${from}" to "${to}" is not allowed.`,
      },
    };
  }

  return { allowed: true, from, to };
}

export function evaluateOrderTransition(
  from: OrderStatus,
  to: OrderStatus,
): TransitionDecision<OrderStatus> {
  return evaluateTransition(
    "Order status",
    from,
    to,
    ORDER_ALLOWED_TRANSITIONS,
    TERMINAL_ORDER_STATES,
  );
}

export function evaluateFulfillmentTransition(
  from: FulfillmentStatus,
  to: FulfillmentStatus,
): TransitionDecision<FulfillmentStatus> {
  return evaluateTransition(
    "Fulfillment status",
    from,
    to,
    FULFILLMENT_ALLOWED_TRANSITIONS,
    TERMINAL_FULFILLMENT_STATES,
  );
}
