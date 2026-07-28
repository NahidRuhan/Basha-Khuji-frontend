"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Building, FileText, CreditCard } from "lucide-react";

export default function TenantOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.userName}</h1>
        <p className="text-muted-foreground mt-1">Manage your rental requests and profile.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Find Properties</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Browse</div>
            <p className="text-xs text-muted-foreground mb-4">
              Explore thousands of rental listings
            </p>
            <Link href="/properties" className={buttonVariants({ size: "sm", className: "w-full" })}>
              Start Searching <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">My Requests</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Applications</div>
            <p className="text-xs text-muted-foreground mb-4">
              View the status of your rental applications
            </p>
            <Link href="/dashboard/tenant/requests" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              View Requests
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">History</div>
            <p className="text-xs text-muted-foreground mb-4">
              Check your past payments and receipts
            </p>
            <Link href="/dashboard/tenant/payments" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              View Payments
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
