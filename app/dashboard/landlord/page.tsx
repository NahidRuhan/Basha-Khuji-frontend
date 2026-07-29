import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Building, ClipboardList, PlusCircle, ArrowRight } from "lucide-react";
import { serverFetch } from "@/lib/api-server";
import { User, ApiResponse } from "@/types";

export default async function LandlordDashboardOverview() {
  let user: User | null = null;
  try {
    const response = await serverFetch<ApiResponse<User>>("/api/auth/me");
    user = response?.data || null;
  } catch (error) {
    console.error("Failed to fetch user on landlord overview", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.userName || "Landlord"}</h1>
        <p className="text-muted-foreground mt-1">Manage your properties and review tenant applications.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Manage</div>
            <p className="text-xs text-muted-foreground mb-4">
              View and edit your property listings
            </p>
            <Link href="/dashboard/landlord/properties" className={buttonVariants({ size: "sm", className: "w-full" })}>
              View Properties <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rental Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">Applications</div>
            <p className="text-xs text-muted-foreground mb-4">
              Review and approve tenant requests
            </p>
            <Link href="/dashboard/landlord/requests" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              View Requests
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Add Property</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">New Listing</div>
            <p className="text-xs text-muted-foreground mb-4">
              Create a new property for rent
            </p>
            <Link href="/dashboard/landlord/properties/new" className={buttonVariants({ size: "sm", variant: "outline", className: "w-full" })}>
              Add Property
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
