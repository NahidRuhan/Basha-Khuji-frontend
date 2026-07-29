import { redirect } from "next/navigation";
import { UserRole, User, ApiResponse } from "@/types";
import { serverFetch } from "@/lib/api-server";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await serverFetch<ApiResponse<User>>("/api/auth/me");
    const user = response?.data;

    if (!user || user.role !== UserRole.ADMIN) {
      redirect("/login");
    }
  } catch {
    // If unauthorized or error, redirect to login
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-auto shrink-0">
          <AdminSidebar />
        </aside>
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
