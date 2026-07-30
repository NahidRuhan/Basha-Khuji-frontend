"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Building, FileText, CreditCard, Home, CheckCircle2 } from "lucide-react";
import { useTenantStats } from "@/hooks/use-tenant-stats";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function TenantOverviewClient() {
  const { user } = useAuthStore();
  const { data, isLoading } = useTenantStats();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-75 w-full" />
      </div>
    );
  }

  const { metrics, charts } = data;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.userName}</h1>
        <p className="text-muted-foreground mt-1">Manage your rental requests, payments, and profile.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Properties applied for</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{metrics.activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active or approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳ {metrics.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payment Success</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.paymentSuccessRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Successful checkout rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {charts.requestStatusData.length > 0 && (
        <Card className="md:w-1/2">
          <CardHeader>
            <CardTitle>My Request Statuses</CardTitle>
            <CardDescription>Breakdown of all your rental applications</CardDescription>
          </CardHeader>
          <CardContent className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {charts.requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Requests`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4 mt-8">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Find Properties</CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4 mt-2">
                Explore thousands of rental listings
              </p>
              <Link href="/properties" className={buttonVariants({ size: "sm", className: "w-full" })}>
                Start Searching <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">My Requests</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4 mt-2">
                View the status of your rental applications
              </p>
              <Link href="/dashboard/tenant/requests" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
                View Requests
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Payments</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4 mt-2">
                Check your past payments and receipts
              </p>
              <Link href="/dashboard/tenant/payments" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
                View Payments
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
