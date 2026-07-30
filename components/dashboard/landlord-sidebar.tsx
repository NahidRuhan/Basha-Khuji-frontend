"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building, 
  LayoutDashboard, 
  ClipboardList, 
  UserCircle,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const sidebarLinks = [
  {
    title: "Overview",
    href: "/dashboard/landlord",
    icon: LayoutDashboard,
  },
  {
    title: "My Properties",
    href: "/dashboard/landlord/properties",
    icon: Building,
  },
  {
    title: "Add Property",
    href: "/dashboard/landlord/properties/new",
    icon: PlusCircle,
  },
  {
    title: "Rental Requests",
    href: "/dashboard/landlord/requests",
    icon: ClipboardList,
  },
  {
    title: "Profile Settings",
    href: "/dashboard/landlord/profile",
    icon: UserCircle,
  },
];

export function LandlordSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-2">
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold px-4 mb-4 text-muted-foreground uppercase tracking-wider text-xs">
          Landlord Menu
        </h2>
        <nav className="flex flex-wrap md:flex-col gap-2 md:gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
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
                <link.icon className="h-5 w-5 shrink-0" />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
