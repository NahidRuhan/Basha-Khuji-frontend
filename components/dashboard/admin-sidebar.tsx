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
  LogOut,
  UserCircle
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
  },
  {
    title: "Profile Settings",
    href: "/dashboard/admin/profile",
    icon: UserCircle,
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-2">
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold px-4 mb-4 text-muted-foreground uppercase tracking-wider text-xs">
          Admin Area
        </h2>
        <nav className="flex flex-wrap md:flex-col gap-2 md:gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== "/dashboard/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10 whitespace-nowrap font-medium"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
