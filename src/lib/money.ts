export const SUPPORTED_CURRENCIES = {
  USD: { code: "USD", symbol: "$", decimalPlaces: 2, name: "US Dollar" },
  EUR: { code: "EUR", symbol: "\u20AC", decimalPlaces: 2, name: "Euro" },
  GBP: { code: "GBP", symbol: "\u00A3", decimalPlaces: 2, name: "British Pound" },
  BDT: { code: "BDT", symbol: "\u09F3", decimalPlaces: 2, name: "Bangladeshi Taka" },
  INR: { code: "INR", symbol: "\u20B9", decimalPlaces: 2, name: "Indian Rupee" },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  decimalPlaces: number;
  name: string;
};

export class Money {
  private readonly _amount: number;
  private readonly _currency: CurrencyInfo;

  private constructor(amount: number, currency: CurrencyInfo) {
    const rounded = Money.roundToDecimal(amount, currency.decimalPlaces);
    if (!Number.isFinite(rounded)) {
      throw new Error("Amount must be a finite number");
    }
    this._amount = rounded;
    this._currency = currency;
  }

  static fromDecimal(amount: number, currencyCode: CurrencyCode = "USD"): Money {
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    if (!currency) throw new Error(`Unsupported currency: ${currencyCode}`);
    return new Money(amount, currency);
  }

  static fromMinorUnits(amount: number, currencyCode: CurrencyCode = "USD"): Money {
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    if (!currency) throw new Error(`Unsupported currency: ${currencyCode}`);
    return new Money(amount / 10 ** currency.decimalPlaces, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): CurrencyInfo {
    return { ...this._currency };
  }

  get currencyCode(): CurrencyCode {
    return this._currency.code;
  }

  toMinorUnits(): number {
    return Math.round(this._amount * 10 ** this._currency.decimalPlaces);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) throw new Error("Cannot divide by zero");
    return new Money(this._amount / divisor, this._currency);
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount < other._amount;
  }

  equals(other: Money): boolean {
    return this._currency.code === other._currency.code && this._amount === other._amount;
  }

  format(locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this._currency.code,
      minimumFractionDigits: this._currency.decimalPlaces,
      maximumFractionDigits: this._currency.decimalPlaces,
    }).format(this._amount);
  }

  toJSON() {
    return {
      amount: this._amount,
      currency: this._currency.code,
      formatted: this.format(),
    };
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency.code !== other._currency.code) {
      throw new Error(
        `Currency mismatch: ${this._currency.code} vs ${other._currency.code}`
      );
    }
  }

  private static roundToDecimal(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
}
