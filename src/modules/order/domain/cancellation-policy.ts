import type {
  FulfillmentStatus,
  OrderStatus,
  UserRole,
} from "@prisma/client";

export type CancellationPolicyConfig = Readonly<{
  customerWindowMinutes: number;
  allowCustomerAfterConfirmed: boolean;
}>;

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicyConfig = {
  customerWindowMinutes: 30,
  allowCustomerAfterConfirmed: false,
};

export type CancellationDecision =
  | Readonly<{ allowed: true }>
  | Readonly<{
      allowed: false;
      code:
        | "NOT_OWNER"
        | "ORDER_TERMINAL"
        | "FULFILLMENT_STARTED"
        | "CUSTOMER_WINDOW_EXPIRED"
        | "CUSTOMER_CONFIRMED_BLOCKED"
        | "ROLE_NOT_ALLOWED";
      message: string;
    }>;

type CancellationContext = Readonly<{
  actorId: string;
  actorRole: UserRole;
  customerId: string;
  orderStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  placedAt: Date | null;
  now?: Date;
  policy?: Partial<CancellationPolicyConfig>;
}>;

export function evaluateCancellation(
  context: CancellationContext,
): CancellationDecision {
  const policy = {
    ...DEFAULT_CANCELLATION_POLICY,
    ...context.policy,
  };
  const isOperator =
    context.actorRole === "admin" || context.actorRole === "support";

  if (!isOperator && context.actorRole !== "user") {
    return {
      allowed: false,
      code: "ROLE_NOT_ALLOWED",
      message: "This role cannot cancel orders.",
    };
  }
  if (!isOperator && context.actorId !== context.customerId) {
    return {
      allowed: false,
      code: "NOT_OWNER",
      message: "Customers can cancel only their own orders.",
    };
  }
  if (
    context.orderStatus === "cancelled" ||
    context.orderStatus === "completed"
  ) {
    return {
      allowed: false,
      code: "ORDER_TERMINAL",
      message: `Order status "${context.orderStatus}" is terminal.`,
    };
  }
  if (
    context.fulfillmentStatus === "SHIPPED" ||
    context.fulfillmentStatus === "DELIVERED" ||
    context.fulfillmentStatus === "RETURNED"
  ) {
    return {
      allowed: false,
      code: "FULFILLMENT_STARTED",
      message: "A shipped or delivered order cannot use cancellation.",
    };
  }
  if (isOperator) return { allowed: true };

  if (
    context.orderStatus === "confirmed" &&
    !policy.allowCustomerAfterConfirmed
  ) {
    return {
      allowed: false,
      code: "CUSTOMER_CONFIRMED_BLOCKED",
      message: "Customer cancellation is disabled after confirmation.",
    };
  }

  const placedAt = context.placedAt;
  if (!placedAt) {
    return {
      allowed: false,
      code: "CUSTOMER_WINDOW_EXPIRED",
      message: "This order does not have a customer cancellation window.",
    };
  }
  const now = context.now ?? new Date();
  const deadline =
    placedAt.getTime() + policy.customerWindowMinutes * 60 * 1000;
  if (now.getTime() > deadline) {
    return {
      allowed: false,
      code: "CUSTOMER_WINDOW_EXPIRED",
      message: "The customer cancellation window has expired.",
    };
  }

  return { allowed: true };
}
