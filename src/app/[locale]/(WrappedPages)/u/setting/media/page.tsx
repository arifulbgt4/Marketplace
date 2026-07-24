import { permanentRedirect } from "next/navigation";

export default async function RetiredMediaSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/u/setting`);
}
