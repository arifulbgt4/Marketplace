import UserLayout from "src/layouts/UserLayout";

export const metadata = {
  title: "Customer account",
  description: "Manage your marketplace profile, orders and wishlist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
