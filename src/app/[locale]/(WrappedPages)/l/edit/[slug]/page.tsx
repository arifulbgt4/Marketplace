import { permanentRedirect } from "next/navigation";

export default async function RetiredListingEditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products`);
}
