import { ReactNode } from "react";
import { Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { siteConfig } from "src/global/config";
import NextAuthProvider from "src/layouts/NextAuthProvider";
import ThemeContextProvider from "src/theme";
import { locales } from "src/global/staticData";
import { getStorefrontSettings } from "src/lib/storefront-settings";
import { StorefrontSettingsProvider } from "src/contexts/StorefrontSettings";
import { getLocaleMessages } from "src/lib/i18n-messages";
import { isRtlLocale } from "src/lib/i18n";

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getStorefrontSettings();
  const title =
    settings.branding.seoTitle ||
    settings.business.displayName ||
    t("Metatags.Landing.title");
  const description =
    settings.branding.seoDescription || t("Metatags.Landing.description");

  return {
    title: {
      default: title,
      template: `${title} - %s`,
    },
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.creator,
    manifest: `${siteConfig.url}manifest.json`,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: settings.branding.faviconUrl || "/icon/favicon.ico",
      shortcut: "/icon/favicon-16x16.png",
      apple: "/apple-icon/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.localeUpperSpace,
      url: siteConfig.url,
      title,
      description,
      siteName: settings.business.displayName,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const settings = await getStorefrontSettings();
  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the locale
  const messages = getLocaleMessages(locale);

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <ThemeContextProvider
        primaryColor={settings.branding.primaryColor}
        secondaryColor={settings.branding.secondaryColor}
      >
        <body suppressHydrationWarning={true}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StorefrontSettingsProvider
              value={{
                business: settings.business,
                branding: settings.branding,
              }}
            >
              <NextAuthProvider>{children}</NextAuthProvider>
            </StorefrontSettingsProvider>
          </NextIntlClientProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </ThemeContextProvider>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
