import { ReactNode } from "react";
import { Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { siteConfig } from "src/global/config";
import NextAuthProvider from "src/layouts/NextAuthProvider";
import ThemeContextProvider from "src/theme";
import { locales } from "src/global/staticData";

interface Props {
  children: ReactNode;
  params: { locale: string };
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

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale });

  return {
    title: {
      default: t("Metatags.Landing.title"),
      template: `${t("Metatags.Landing.title")} - %s`,
    },
    description: t("Metatags.Landing.description"),
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.creator,
    manifest: `${siteConfig.url}manifest.json`,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: "/icon/favicon.ico",
      shortcut: "/icon/favicon-16x16.png",
      apple: "/apple-icon/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: siteConfig.localeUpperSpace,
      url: siteConfig.url,
      title: t("Metatags.Landing.title"),
      description: t("Metatags.Landing.description"),
      siteName: t("Metatags.Landing.title"),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: t("Metatags.Landing.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("Metatags.Landing.title"),
      description: t("Metatags.Landing.description"),
      images: [siteConfig.ogImage],
      creator: "@ArifulI60735491",
    },
  };
}

export default function RootLayout({ children, params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : ""}>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <ThemeContextProvider>
        <body suppressHydrationWarning={true}>
          <NextAuthProvider>{children}</NextAuthProvider>
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
