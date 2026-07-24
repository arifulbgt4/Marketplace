import { permanentRedirect } from "next/navigation";

export default async function RetiredMerchantProfilePage({
  params,
}: {
  params: Promise<{ locale: string; userID: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products`);
}
