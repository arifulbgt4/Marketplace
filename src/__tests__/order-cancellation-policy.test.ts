import { describe, expect, it } from "vitest";

import { evaluateCancellation } from "src/modules/order";

const placedAt = new Date("2026-07-24T10:00:00.000Z");
const base = {
  actorId: "customer-1",
  actorRole: "user" as const,
  customerId: "customer-1",
  orderStatus: "pending" as const,
  fulfillmentStatus: "UNFULFILLED" as const,
  placedAt,
  now: new Date("2026-07-24T10:20:00.000Z"),
};

describe("order cancellation policy", () => {
  it("allows an owner inside the configured window", () => {
    expect(evaluateCancellation(base)).toEqual({ allowed: true });
  });

  it("blocks cross-customer cancellation", () => {
    expect(
      evaluateCancellation({ ...base, actorId: "customer-2" }),
    ).toMatchObject({ allowed: false, code: "NOT_OWNER" });
  });

  it("blocks a customer after the cancellation window", () => {
    expect(
      evaluateCancellation({
        ...base,
        now: new Date("2026-07-24T10:31:00.000Z"),
      }),
    ).toMatchObject({
      allowed: false,
      code: "CUSTOMER_WINDOW_EXPIRED",
    });
  });

  it("allows an operator after the customer window", () => {
    expect(
      evaluateCancellation({
        ...base,
        actorId: "admin-1",
        actorRole: "admin",
        now: new Date("2026-07-25T10:00:00.000Z"),
      }),
    ).toEqual({ allowed: true });
  });

  it.each(["SHIPPED", "DELIVERED", "RETURNED"] as const)(
    "blocks cancellation once fulfillment is %s",
    (fulfillmentStatus) => {
      expect(
        evaluateCancellation({ ...base, fulfillmentStatus }),
      ).toMatchObject({ allowed: false, code: "FULFILLMENT_STARTED" });
    },
  );

  it.each(["cancelled", "completed"] as const)(
    "blocks terminal order status %s",
    (orderStatus) => {
      expect(evaluateCancellation({ ...base, orderStatus })).toMatchObject({
        allowed: false,
        code: "ORDER_TERMINAL",
      });
    },
  );

  it("can allow customer cancellation after confirmation by configuration", () => {
    expect(
      evaluateCancellation({
        ...base,
        orderStatus: "confirmed",
        policy: { allowCustomerAfterConfirmed: true },
      }),
    ).toEqual({ allowed: true });
  });
});
