export const SUPPORTED_CURRENCIES = {
  USD: { code: "USD", symbol: "$", decimalPlaces: 2, name: "US Dollar" },
  EUR: { code: "EUR", symbol: "\u20AC", decimalPlaces: 2, name: "Euro" },
  GBP: {
    code: "GBP",
    symbol: "\u00A3",
    decimalPlaces: 2,
    name: "British Pound",
  },
  BDT: {
    code: "BDT",
    symbol: "\u09F3",
    decimalPlaces: 2,
    name: "Bangladeshi Taka",
  },
  INR: {
    code: "INR",
    symbol: "\u20B9",
    decimalPlaces: 2,
    name: "Indian Rupee",
  },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  decimalPlaces: number;
  name: string;
};

export class Money {
  private readonly _minorUnits: number;
  private readonly _currency: CurrencyInfo;

  private constructor(minorUnits: number, currency: CurrencyInfo) {
    if (!Number.isSafeInteger(minorUnits)) {
      throw new Error("Amount exceeds the safe minor-unit range");
    }
    this._minorUnits = minorUnits;
    this._currency = currency;
  }

  static fromDecimal(
    amount: number | string,
    currencyCode: CurrencyCode = "USD",
  ): Money {
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    if (!currency) throw new Error(`Unsupported currency: ${currencyCode}`);
    const decimal = typeof amount === "string" ? Number(amount) : amount;
    if (!Number.isFinite(decimal))
      throw new Error("Amount must be a finite number");
    const scale = 10 ** currency.decimalPlaces;
    const adjusted = decimal + Math.sign(decimal || 1) * Number.EPSILON;
    return new Money(Math.round(adjusted * scale), currency);
  }

  static fromMinorUnits(
    amount: number,
    currencyCode: CurrencyCode = "USD",
  ): Money {
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    if (!currency) throw new Error(`Unsupported currency: ${currencyCode}`);
    return new Money(amount, currency);
  }

  get amount(): number {
    return this._minorUnits / 10 ** this._currency.decimalPlaces;
  }

  get currency(): CurrencyInfo {
    return { ...this._currency };
  }

  get currencyCode(): CurrencyCode {
    return this._currency.code;
  }

  toMinorUnits(): number {
    return this._minorUnits;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._minorUnits + other._minorUnits, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._minorUnits - other._minorUnits, this._currency);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) throw new Error("Factor must be finite");
    return new Money(Math.round(this._minorUnits * factor), this._currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) throw new Error("Cannot divide by zero");
    return new Money(Math.round(this._minorUnits / divisor), this._currency);
  }

  isZero(): boolean {
    return this._minorUnits === 0;
  }

  isPositive(): boolean {
    return this._minorUnits > 0;
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._minorUnits > other._minorUnits;
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._minorUnits < other._minorUnits;
  }

  equals(other: Money): boolean {
    return (
      this._currency.code === other._currency.code &&
      this._minorUnits === other._minorUnits
    );
  }

  format(locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this._currency.code,
      minimumFractionDigits: this._currency.decimalPlaces,
      maximumFractionDigits: this._currency.decimalPlaces,
    }).format(this.amount);
  }

  toJSON() {
    return {
      amount: this.amount,
      minorUnits: this._minorUnits,
      currency: this._currency.code,
      formatted: this.format(),
    };
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency.code !== other._currency.code) {
      throw new Error(
        `Currency mismatch: ${this._currency.code} vs ${other._currency.code}`,
      );
    }
  }
}
