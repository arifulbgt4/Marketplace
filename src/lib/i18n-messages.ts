import af from "../../messages/af.json";
import am from "../../messages/am.json";
import ar from "../../messages/ar.json";
import as from "../../messages/as.json";
import az from "../../messages/az.json";
import bn from "../../messages/bn.json";
import en from "../../messages/en.json";
import hy from "../../messages/hy.json";

type Messages = Record<string, unknown>;

const overrides: Record<string, Messages> = { af, am, ar, as, az, bn, en, hy };

function mergeMessages(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = mergeMessages(result[key] as Messages, value as Messages);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function getLocaleMessages(locale: string): Messages {
  return mergeMessages(en as Messages, overrides[locale] ?? {});
}
