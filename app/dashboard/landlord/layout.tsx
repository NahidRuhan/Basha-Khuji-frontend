import { LandlordSidebar } from "@/components/dashboard/landlord-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { UserRole } from "@/types";

export default function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={UserRole.LANDLORD}>
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-auto shrink-0">
            <LandlordSidebar />
          </aside>
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
