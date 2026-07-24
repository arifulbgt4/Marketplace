import { FulfillmentStatus, OrderStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  evaluateFulfillmentTransition,
  evaluateOrderTransition,
} from "src/modules/order";

const ORDER_STATUSES = Object.values(OrderStatus);
const FULFILLMENT_STATUSES = Object.values(FulfillmentStatus);

const EXPECTED_ORDER_EDGES = new Set([
  "pending->confirmed",
  "pending->cancelled",
  "confirmed->completed",
  "confirmed->cancelled",
]);

const EXPECTED_FULFILLMENT_EDGES = new Set([
  "UNFULFILLED->PROCESSING",
  "PROCESSING->SHIPPED",
  "SHIPPED->DELIVERED",
  "DELIVERED->RETURNED",
]);

describe("order state machine", () => {
  it.each(
    ORDER_STATUSES.flatMap((from) =>
      ORDER_STATUSES.map((to) => ({
        from,
        to,
        expectedAllowed: EXPECTED_ORDER_EDGES.has(`${from}->${to}`),
      })),
    ),
  )(
    "$from -> $to allowed=$expectedAllowed",
    ({ from, to, expectedAllowed }) => {
      const decision = evaluateOrderTransition(from, to);

      expect(decision.allowed).toBe(expectedAllowed);
      expect(decision.from).toBe(from);
      expect(decision.to).toBe(to);

      if (!decision.allowed) {
        expect(decision.reason.message).toContain(from);
      }
    },
  );

  it("rejects same-state requests distinctly", () => {
    expect(evaluateOrderTransition("pending", "pending")).toMatchObject({
      allowed: false,
      reason: { code: "SAME_STATE" },
    });
  });

  it.each([
    ["cancelled", "pending"],
    ["cancelled", "confirmed"],
    ["cancelled", "completed"],
    ["completed", "pending"],
    ["completed", "confirmed"],
    ["completed", "cancelled"],
  ] as const)("does not reopen terminal order state %s as %s", (from, to) => {
    expect(evaluateOrderTransition(from, to)).toMatchObject({
      allowed: false,
      reason: {
        code: "TERMINAL_STATE",
        message: expect.stringContaining("terminal"),
      },
    });
  });

  it.each([
    ["pending", "completed"],
    ["confirmed", "pending"],
  ] as const)("rejects illegal order edge %s -> %s", (from, to) => {
    expect(evaluateOrderTransition(from, to)).toMatchObject({
      allowed: false,
      reason: { code: "ILLEGAL_TRANSITION" },
    });
  });
});

describe("fulfillment state machine", () => {
  it.each(
    FULFILLMENT_STATUSES.flatMap((from) =>
      FULFILLMENT_STATUSES.map((to) => ({
        from,
        to,
        expectedAllowed: EXPECTED_FULFILLMENT_EDGES.has(`${from}->${to}`),
      })),
    ),
  )(
    "$from -> $to allowed=$expectedAllowed",
    ({ from, to, expectedAllowed }) => {
      const decision = evaluateFulfillmentTransition(from, to);

      expect(decision.allowed).toBe(expectedAllowed);
      expect(decision.from).toBe(from);
      expect(decision.to).toBe(to);

      if (!decision.allowed) {
        expect(decision.reason.message).toContain(from);
      }
    },
  );

  it("rejects same-state requests distinctly", () => {
    expect(
      evaluateFulfillmentTransition("PROCESSING", "PROCESSING"),
    ).toMatchObject({
      allowed: false,
      reason: { code: "SAME_STATE" },
    });
  });

  it.each(["UNFULFILLED", "PROCESSING", "SHIPPED", "DELIVERED"] as const)(
    "does not reopen terminal fulfillment state RETURNED as %s",
    (to) => {
      expect(evaluateFulfillmentTransition("RETURNED", to)).toMatchObject({
        allowed: false,
        reason: {
          code: "TERMINAL_STATE",
          message: expect.stringContaining("terminal"),
        },
      });
    },
  );

  it.each([
    ["UNFULFILLED", "SHIPPED"],
    ["UNFULFILLED", "DELIVERED"],
    ["UNFULFILLED", "RETURNED"],
    ["PROCESSING", "UNFULFILLED"],
    ["PROCESSING", "DELIVERED"],
    ["PROCESSING", "RETURNED"],
    ["SHIPPED", "UNFULFILLED"],
    ["SHIPPED", "PROCESSING"],
    ["SHIPPED", "RETURNED"],
    ["DELIVERED", "UNFULFILLED"],
    ["DELIVERED", "PROCESSING"],
    ["DELIVERED", "SHIPPED"],
  ] as const)("rejects illegal fulfillment edge %s -> %s", (from, to) => {
    expect(evaluateFulfillmentTransition(from, to)).toMatchObject({
      allowed: false,
      reason: { code: "ILLEGAL_TRANSITION" },
    });
  });
});
