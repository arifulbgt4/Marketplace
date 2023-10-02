import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import AppLayout from "src/layouts/AppLayout";
import NextAuthProvider from "src/layouts/NextAuthProvider";
import ThemeContextProvider from "src/theme";

export const metadata = {
  title: "Next.js & Mui",
  description: "Generated by create next app",
  viewport: "initial-scale=1, width=device-width",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    locale?: string;
  };
}) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }
  return (
    <html lang={locale}>
      <ThemeContextProvider>
        <body suppressHydrationWarning={true}>
          <NextAuthProvider>
            <AppLayout>{children}</AppLayout>
          </NextAuthProvider>
        </body>
      </ThemeContextProvider>
    </html>
  );
}
