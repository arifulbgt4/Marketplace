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
  currency: CurrencyCode;
};

export class PricingCalculator {
  calculate(context: PricingContext): PricingSummary {
    const subtotal = context.subtotal;
    const discountAmount = context.discountAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    const shippingCost = context.shippingCost ?? Money.fromDecimal(0, subtotal.currencyCode);
    const total = subtotal.subtract(discountAmount).add(shippingCost);

    return {
      subtotal: subtotal.amount,
      discountAmount: discountAmount.amount,
      discountLabel: discountAmount.isPositive() ? "Discount" : undefined,
      shippingCost: shippingCost.amount,
      shippingLabel: shippingCost.isPositive() ? "Shipping" : undefined,
      total: total.amount,
      currency: subtotal.currencyCode,
    };
  }

  calculateLineItems(context: PricingContext): PricingLineItem[] {
    const lines: PricingLineItem[] = [];
    const subtotal = context.subtotal;
    lines.push({ label: "Subtotal", amount: subtotal.amount });

    const discountAmount = context.discountAmount ?? Money.fromDecimal(0, subtotal.currencyCode);
    if (discountAmount.isPositive()) {
      lines.push({ label: "Discount", amount: -discountAmount.amount });
    }

    const shippingCost = context.shippingCost ?? Money.fromDecimal(0, subtotal.currencyCode);
    if (shippingCost.isPositive()) {
      lines.push({ label: "Shipping", amount: shippingCost.amount });
    }

    const total = subtotal.subtract(discountAmount).add(shippingCost);
    lines.push({ label: "Total", amount: total.amount });

    return lines;
  }

  static calculateDiscount(
    subtotal: number,
    discountType: string,
    discountValue: number,
    maxDiscountAmount: number | null,
    currency: CurrencyCode = "USD"
  ): Result<{ amount: number; label: string }> {
    try {
      const sub = Money.fromDecimal(subtotal, currency);
      let discountAmount: Money;

      if (discountType === "percentage") {
        if (discountValue < 0 || discountValue > 100) {
          return fail(new ValidationError("Percentage discount must be between 0 and 100"));
        }
        discountAmount = sub.multiply(discountValue / 100);
      } else if (discountType === "fixed") {
        discountAmount = Money.fromDecimal(Math.min(discountValue, subtotal), currency);
      } else {
        return fail(new ValidationError(`Unknown discount type: ${discountType}`));
      }

      if (maxDiscountAmount != null) {
        const maxDiscount = Money.fromDecimal(maxDiscountAmount, currency);
        if (discountAmount.isGreaterThan(maxDiscount)) {
          discountAmount = maxDiscount;
        }
      }

      return ok({
        amount: discountAmount.amount,
        label: discountType === "percentage" ? `${discountValue}% off` : "Fixed discount",
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) return fail(error);
      throw error;
    }
  }
}

export const pricingCalculator = new PricingCalculator();
