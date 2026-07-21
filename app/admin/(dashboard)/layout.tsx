import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <div className="min-h-screen bg-[var(--bg-void)]">{children}</div>;
}
