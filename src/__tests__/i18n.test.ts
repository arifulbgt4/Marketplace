import { describe, expect, it } from "vitest";

import { locales } from "src/global/staticData/config";
import { getLocaleMessages } from "src/lib/i18n-messages";
import { formatDateTime, formatMoney, isRtlLocale } from "src/lib/i18n";

function leafKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("locale message contract", () => {
  it("resolves every supported locale to the complete English key contract", () => {
    const expected = leafKeys(getLocaleMessages("en")).sort();

    for (const locale of locales) {
      expect(leafKeys(getLocaleMessages(locale)).sort()).toEqual(expected);
    }
  });

  it("uses meaningful Bengali and Arabic messages and safe fallback elsewhere", () => {
    const english = getLocaleMessages("en");
    const bengali = getLocaleMessages("bn");
    const arabic = getLocaleMessages("ar");
    const afrikaans = getLocaleMessages("af");

    expect(bengali.Cart).not.toEqual(english.Cart);
    expect(arabic.Checkout).not.toEqual(english.Checkout);
    expect(afrikaans.Cart).toEqual(english.Cart);
  });
});

describe("locale direction and formatting", () => {
  it("marks Arabic as RTL without changing LTR locales", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("ar-SA")).toBe(true);
    expect(isRtlLocale("bn")).toBe(false);
    expect(isRtlLocale("en")).toBe(false);
  });

  it("formats money and date-time with the requested locale", () => {
    const date = "2026-07-25T12:30:00.000Z";

    expect(formatMoney(1234.5, "USD", "en-US")).toContain("1,234.50");
    expect(formatMoney(1234.5, "USD", "bn-BD")).not.toBe(
      formatMoney(1234.5, "USD", "en-US"),
    );
    expect(formatDateTime(date, "ar")).not.toBe(formatDateTime(date, "en"));
  });
});
