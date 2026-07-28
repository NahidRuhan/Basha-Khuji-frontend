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
    <nav className="flex flex-col gap-2 p-4 md:w-64 border-r md:min-h-[calc(100vh-4rem)]">
      <div className="mb-4 px-2">
        <h2 className="text-lg font-semibold tracking-tight">Landlord Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your properties</p>
      </div>
      
      <div className="flex-1 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                "w-full justify-start font-normal",
                isActive ? "font-medium" : ""
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
