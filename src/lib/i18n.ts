export const rtlLocales = new Set(["ar"]);

export function isRtlLocale(locale: string) {
  return rtlLocales.has(locale.toLowerCase().split("-")[0]);
}

export function formatMoney(
  value: number | string,
  currency: string,
  locale: string,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export function formatDateTime(value: Date | string | number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
