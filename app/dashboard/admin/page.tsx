"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Users, ClipboardList, Tags, ArrowRight } from "lucide-react";

export default function AdminDashboardOverview() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.userName}. Manage the Basha Khuji platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Users</div>
            <p className="text-xs text-muted-foreground mb-4">
              View all users, landlords, and tenants. Ban or unban accounts.
            </p>
            <Link href="/dashboard/admin/users" className={buttonVariants({ size: "sm", className: "w-full" })}>
              Manage Users <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rental Management</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Rentals</div>
            <p className="text-xs text-muted-foreground mb-4">
              Monitor all rental applications and their current statuses.
            </p>
            <Link href="/dashboard/admin/rentals" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              View Rentals
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Category Management</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Categories</div>
            <p className="text-xs text-muted-foreground mb-4">
              Create and manage property categories.
            </p>
            <Link href="/dashboard/admin/categories" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              Manage Categories
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
