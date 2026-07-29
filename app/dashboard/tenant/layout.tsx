import { redirect } from "next/navigation";
import { UserRole, User, ApiResponse } from "@/types";
import { serverFetch } from "@/lib/api-server";
import { TenantSidebar } from "@/components/dashboard/tenant-sidebar";

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await serverFetch<ApiResponse<User>>("/api/auth/me");
    const user = response?.data;

    // We allow tenants, but also probably let other users view the tenant dashboard if they have tenant requests?
    // Let's assume strictly TENANT for now.
    if (!user || user.role !== UserRole.TENANT) {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-16rem)]">
      <div className="flex flex-col md:flex-row gap-8">
        <TenantSidebar />
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
