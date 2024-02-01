import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "src/global/staticData";

export default getRequestConfig(
  async ({ locale = "en" }: { locale: string }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as string)) notFound();

    return {
      messages: (
        await (locale === "en"
          ? // When using Turbopack, this will enable HMR for `en`
            import("./messages/en.json")
          : import(`./messages/${locale}.json`))
      ).default,
    };
  }
);
