import { permanentRedirect } from "next/navigation";

export default async function RetiredListingDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products`);
}
