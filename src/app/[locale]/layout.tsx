import { Metadata, Viewport } from "next";
// import { useLocale } from "next-intl";
// import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { siteConfig } from "src/global/config";
import NextAuthProvider from "src/layouts/NextAuthProvider";
import ThemeContextProvider from "src/theme";
import { locales } from "src/global/staticData";
import { ReactNode } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// export const metadata: Metadata = {
//   title: { default: siteConfig.name, template: `${siteConfig.name} - %s` },
//   description: siteConfig.description,
//   keywords: siteConfig.keywords,
//   authors: [{ name: siteConfig.author, url: siteConfig.url }],
//   creator: siteConfig.creator,
//   manifest: `${siteConfig.url}manifest.json`,
//   metadataBase: new URL(siteConfig.url),
//   icons: {
//     icon: "/icon/favicon.ico",
//     shortcut: "/icon/favicon-16x16.png",
//     apple: "/apple-icon/apple-touch-icon.png",
//   },
//   openGraph: {
//     type: "website",
//     locale: siteConfig.localeUpperSpace,
//     url: siteConfig.url,
//     title: siteConfig.shortName,
//     description: siteConfig.description,
//     siteName: siteConfig.name,
//     images: [
//       {
//         url: siteConfig.ogImage,
//         width: 1200,
//         height: 630,
//         alt: siteConfig.name,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: siteConfig.shortName,
//     description: siteConfig.description,
//     images: [siteConfig.ogImage],
//     creator: "@ArifulI60735491",
//   },
// };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export default function RootLayout({ children, params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
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
