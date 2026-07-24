import type { ReactNode } from "react";

import { AdminShell } from "src/components/Admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
