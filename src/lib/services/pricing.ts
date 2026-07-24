import { Money } from "src/lib/money";
import type { CurrencyCode } from "src/lib/money";
import { ValidationError, ok, fail, type Result } from "src/lib/errors";
import type { PricingLineItem, PricingSummary } from "src/lib/checkout";

export type PricingRule = {
  label: string;
  apply: (subtotal: Money) => { amount: Money; applied: boolean };
};

export type PricingContext = {
  subtotal: Money;
  discountAmount?: Money;
  shippingCost?: Money;
  taxAmount?: Money;
  currency: CurrencyCode;
};

export class PricingCalculator {
  calculate(context: PricingContext): PricingSummary {
    const subtotal = context.subtotal;
    const requestedDiscount =
      context.discountAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    const discountAmount = requestedDiscount.isGreaterThan(subtotal)
      ? subtotal
      : requestedDiscount;
    const shippingCost =
      context.shippingCost ?? Money.fromDecimal(0, subtotal.currencyCode);
    const taxAmount =
      context.taxAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    this.assertNonNegative([
      ["subtotal", subtotal],
      ["discount", requestedDiscount],
      ["shipping", shippingCost],
      ["tax", taxAmount],
    ]);
    const total = subtotal
      .subtract(discountAmount)
      .add(taxAmount)
      .add(shippingCost);

    return {
      subtotal: subtotal.amount,
      discountAmount: discountAmount.amount,
      discountLabel: discountAmount.isPositive() ? "Discount" : undefined,
      shippingCost: shippingCost.amount,
      shippingLabel: shippingCost.isPositive() ? "Shipping" : undefined,
      taxAmount: taxAmount.amount,
      total: total.amount,
      currency: subtotal.currencyCode,
    };
  }

  calculateLineItems(context: PricingContext): PricingLineItem[] {
    const lines: PricingLineItem[] = [];
    const subtotal = context.subtotal;
    lines.push({ label: "Subtotal", amount: subtotal.amount });

    const requestedDiscount =
      context.discountAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    const discountAmount = requestedDiscount.isGreaterThan(subtotal)
      ? subtotal
      : requestedDiscount;
    if (discountAmount.isPositive()) {
      lines.push({ label: "Discount", amount: -discountAmount.amount });
    }

    const shippingCost =
      context.shippingCost ?? Money.fromDecimal(0, subtotal.currencyCode);
    if (shippingCost.isPositive()) {
      lines.push({ label: "Shipping", amount: shippingCost.amount });
    }

    const taxAmount =
      context.taxAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    this.assertNonNegative([
      ["subtotal", subtotal],
      ["discount", requestedDiscount],
      ["shipping", shippingCost],
      ["tax", taxAmount],
    ]);
    if (taxAmount.isPositive())
      lines.push({ label: "Tax", amount: taxAmount.amount });
    const total = subtotal
      .subtract(discountAmount)
      .add(taxAmount)
      .add(shippingCost);
    lines.push({ label: "Total", amount: total.amount });

    return lines;
  }

  static calculateDiscount(
    subtotal: number,
    discountType: string,
    discountValue: number,
    maxDiscountAmount: number | null,
    currency: CurrencyCode = "USD",
  ): Result<{ amount: number; label: string }> {
    try {
      const sub = Money.fromDecimal(subtotal, currency);
      let discountAmount: Money;

      if (subtotal < 0) {
        return fail(new ValidationError("Subtotal cannot be negative"));
      }
      if (discountValue < 0) {
        return fail(new ValidationError("Discount value cannot be negative"));
      }
      if (maxDiscountAmount !== null && maxDiscountAmount < 0) {
        return fail(
          new ValidationError("Maximum discount amount cannot be negative"),
        );
      }

      if (discountType === "percentage") {
        if (discountValue < 0 || discountValue > 100) {
          return fail(
            new ValidationError(
              "Percentage discount must be between 0 and 100",
            ),
          );
        }
        discountAmount = sub.multiply(discountValue / 100);
      } else if (discountType === "fixed") {
        discountAmount = Money.fromDecimal(
          Math.min(discountValue, subtotal),
          currency,
        );
      } else {
        return fail(
          new ValidationError(`Unknown discount type: ${discountType}`),
        );
      }

      if (maxDiscountAmount != null) {
        const maxDiscount = Money.fromDecimal(maxDiscountAmount, currency);
        if (discountAmount.isGreaterThan(maxDiscount)) {
          discountAmount = maxDiscount;
        }
      }

      return ok({
        amount: discountAmount.amount,
        label:
          discountType === "percentage"
            ? `${discountValue}% off`
            : "Fixed discount",
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) return fail(error);
      throw error;
    }
  }

  private assertNonNegative(
    values: ReadonlyArray<readonly [label: string, value: Money]>,
  ) {
    for (const [label, value] of values) {
      if (value.toMinorUnits() < 0) {
        throw new ValidationError(`${label} cannot be negative`);
      }
    }
  }
}

export const pricingCalculator = new PricingCalculator();
