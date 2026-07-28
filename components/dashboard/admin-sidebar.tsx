"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Tags,
  MapPin,
  LogOut 
} from "lucide-react";
import { useLogout } from "@/hooks/use-auth";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "All Rentals",
    href: "/dashboard/admin/rentals",
    icon: ClipboardList,
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: Tags,
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  return (
    <div className="flex flex-col h-full w-full md:w-64 space-y-4 py-4 border-r pr-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Admin Area
        </h2>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== "/dashboard/admin"
                  ? "bg-muted hover:bg-muted font-medium"
                  : "hover:bg-transparent hover:underline",
                "w-full justify-start"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-auto px-3">
        <button
          onClick={() => logout()}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start text-muted-foreground hover:text-foreground"
          )}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
