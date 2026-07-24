import { describe, expect, it } from "vitest";

import { Money } from "src/lib/money";
import { PricingCalculator } from "src/lib/services/pricing";

const calculator = new PricingCalculator();

describe("pricing calculation matrix", () => {
  it.each([
    {
      title: "base subtotal",
      subtotal: 100,
      discount: 0,
      shipping: 0,
      tax: 0,
      expected: 100,
    },
    {
      title: "discount, shipping and tax",
      subtotal: 100,
      discount: 10,
      shipping: 5,
      tax: 7.5,
      expected: 102.5,
    },
    {
      title: "discount capped at subtotal",
      subtotal: 20,
      discount: 50,
      shipping: 5,
      tax: 0,
      expected: 5,
    },
    {
      title: "minor-unit rounding",
      subtotal: 10.005,
      discount: 0.004,
      shipping: 0.005,
      tax: 0.005,
      expected: 10.03,
    },
  ])(
    "$title",
    ({ subtotal, discount, shipping, tax, expected }) => {
      const result = calculator.calculate({
        subtotal: Money.fromDecimal(subtotal),
        discountAmount: Money.fromDecimal(discount),
        shippingCost: Money.fromDecimal(shipping),
        taxAmount: Money.fromDecimal(tax),
        currency: "USD",
      });

      expect(result.total).toBe(expected);
      expect(result.currency).toBe("USD");
    },
  );

  it("keeps line-item order and signs deterministic", () => {
    expect(
      calculator.calculateLineItems({
        subtotal: Money.fromDecimal(100),
        discountAmount: Money.fromDecimal(10),
        shippingCost: Money.fromDecimal(5),
        taxAmount: Money.fromDecimal(7.5),
        currency: "USD",
      }),
    ).toEqual([
      { label: "Subtotal", amount: 100 },
      { label: "Discount", amount: -10 },
      { label: "Shipping", amount: 5 },
      { label: "Tax", amount: 7.5 },
      { label: "Total", amount: 102.5 },
    ]);
  });

  it.each([
    ["subtotal", -1, 0, 0, 0],
    ["discount", 10, -1, 0, 0],
    ["shipping", 10, 0, -1, 0],
    ["tax", 10, 0, 0, -1],
  ])(
    "rejects a negative %s input",
    (_label, subtotal, discount, shipping, tax) => {
      expect(() =>
        calculator.calculate({
          subtotal: Money.fromDecimal(subtotal),
          discountAmount: Money.fromDecimal(discount),
          shippingCost: Money.fromDecimal(shipping),
          taxAmount: Money.fromDecimal(tax),
          currency: "USD",
        }),
      ).toThrow(/cannot be negative/);
    },
  );

  it.each([
    ["percentage", 15, null, 30],
    ["percentage", 80, 50, 50],
    ["fixed", 25, null, 25],
    ["fixed", 250, null, 200],
  ])(
    "calculates %s discount value=%s cap=%s",
    (type, value, cap, expected) => {
      const result = PricingCalculator.calculateDiscount(
        200,
        type,
        value,
        cap,
      );
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.amount).toBe(expected);
    },
  );

  it.each([
    [-1, "fixed", 10, null],
    [100, "fixed", -1, null],
    [100, "percentage", 101, null],
    [100, "fixed", 10, -1],
  ])(
    "rejects invalid discount inputs",
    (subtotal, type, value, cap) => {
      expect(
        PricingCalculator.calculateDiscount(subtotal, type, value, cap)
          .success,
      ).toBe(false);
    },
  );
});
