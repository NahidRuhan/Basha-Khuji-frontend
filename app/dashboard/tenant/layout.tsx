import { TenantSidebar } from "@/components/dashboard/tenant-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types";

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={UserRole.TENANT}>
      <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col md:flex-row gap-8">
          <TenantSidebar />
          <main className="flex-1 w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
