"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CreditCard, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tenantLinks = [
  { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tenant/requests", label: "My Requests", icon: FileText },
  { href: "/dashboard/tenant/payments", label: "Payment History", icon: CreditCard },
  { href: "/dashboard/tenant/profile", label: "Profile", icon: UserCircle },
];

export function TenantSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-2">
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold px-4 mb-4 text-muted-foreground uppercase tracking-wider text-xs">
          Tenant Menu
        </h2>
        <nav className="flex flex-wrap md:flex-col gap-2 md:gap-1">
          {tenantLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
