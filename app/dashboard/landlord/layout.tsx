"use client";

import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LandlordSidebar } from "@/components/dashboard/landlord-sidebar";

export default function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== UserRole.LANDLORD)) {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== UserRole.LANDLORD) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
  );
}
