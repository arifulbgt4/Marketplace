import { describe, it, expect } from "vitest";
import { Money } from "src/lib/money";

describe("Money", () => {
  it("creates from decimal", () => {
    const m = Money.fromDecimal(29.99, "USD");
    expect(m.amount).toBe(29.99);
    expect(m.currencyCode).toBe("USD");
  });

  it("converts to minor units", () => {
    const m = Money.fromDecimal(29.99, "USD");
    expect(m.toMinorUnits()).toBe(2999);
  });

  it("creates from minor units", () => {
    const m = Money.fromMinorUnits(2999, "USD");
    expect(m.amount).toBe(29.99);
  });

  it("adds money", () => {
    const a = Money.fromDecimal(10, "USD");
    const b = Money.fromDecimal(20, "USD");
    expect(a.add(b).amount).toBe(30);
  });

  it("subtracts money", () => {
    const a = Money.fromDecimal(30, "USD");
    const b = Money.fromDecimal(10, "USD");
    expect(a.subtract(b).amount).toBe(20);
  });

  it("multiplies money", () => {
    const m = Money.fromDecimal(10, "USD");
    expect(m.multiply(3).amount).toBe(30);
  });

  it("divides money", () => {
    const m = Money.fromDecimal(10, "USD");
    expect(m.divide(3).amount).toBe(3.33);
  });

  it("throws on division by zero", () => {
    const m = Money.fromDecimal(10, "USD");
    expect(() => m.divide(0)).toThrow("Cannot divide by zero");
  });

  it("throws on currency mismatch", () => {
    const usd = Money.fromDecimal(10, "USD");
    const eur = Money.fromDecimal(10, "EUR");
    expect(() => usd.add(eur)).toThrow("Currency mismatch");
  });

  it("formats correctly", () => {
    const m = Money.fromDecimal(1234.56, "USD");
    expect(m.format("en-US")).toBe("$1,234.56");
  });

  it("handles zero", () => {
    const m = Money.fromDecimal(0, "USD");
    expect(m.isZero()).toBe(true);
    expect(m.isPositive()).toBe(false);
  });

  it("compares amounts", () => {
    const a = Money.fromDecimal(10, "USD");
    const b = Money.fromDecimal(20, "USD");
    expect(a.isLessThan(b)).toBe(true);
    expect(b.isGreaterThan(a)).toBe(true);
    expect(a.equals(a)).toBe(true);
  });
});
