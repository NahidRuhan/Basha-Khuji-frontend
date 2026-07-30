"use client";

import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function RoleGuard({ 
  children, 
  expectedRole 
}: { 
  children: React.ReactNode; 
  expectedRole: UserRole;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && (!isAuthenticated || user?.role !== expectedRole)) {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router, expectedRole, isMounted]);

  if (!isMounted || isLoading || !isAuthenticated || user?.role !== expectedRole) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
