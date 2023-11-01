import AuthPagesLayout from "src/layouts/AuthPagesLayout";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <AuthPagesLayout>{children}</AuthPagesLayout>
    </main>
  );
}
