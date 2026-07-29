"use client";

import { useMyRequests } from "@/hooks/use-requests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Building, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ReviewModal } from "@/components/review-modal";

export default function TenantRequestsPage() {
  const { data, isLoading } = useMyRequests();
  const requests = data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "REJECTED": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "ACTIVE": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "COMPLETED": return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default: return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
        <p className="text-muted-foreground mt-1">Track your rental applications and make payments.</p>
      </div>

      {requests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="mb-2">No Requests Found</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            You haven&apos;t requested to rent any properties yet. Browse our listings and find your next home.
          </CardDescription>
          <Link href="/properties" className={buttonVariants()}>Browse Properties</Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((request) => (
            <Card key={request.requestId} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl line-clamp-1">
                    {request.property?.propertyName || "Unknown Property"}
                  </CardTitle>
                  <Badge variant="outline" className={`font-semibold shrink-0 ${getStatusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </div>
                {request.property && (
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{request.property.address}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="bg-muted/40 p-4 rounded-lg text-sm italic border">
                  &quot;{request.message}&quot;
                </div>
                
                {request.review && (
                  <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-800/70 mr-1">Your Review:</span>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < request.review!.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-sm italic text-amber-900/80">&quot;{request.review.review}&quot;</p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Applied on {format(new Date(request.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t mt-4 p-4 flex justify-between items-center bg-muted/10">
                <div className="font-semibold text-lg">
                  ৳{request.property?.price?.toLocaleString() || "N/A"} <span className="text-xs text-muted-foreground font-normal">/mo</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/properties/${request.propertyId}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    View Property
                  </Link>
                  
                  {request.status === "APPROVED" && (
                    <Link href={`/dashboard/tenant/requests/${request.requestId}/pay`} className={buttonVariants({ size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white" })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay & Rent
                    </Link>
                  )}
                  
                  {(request.status === "ACTIVE" || request.status === "COMPLETED") && !request.review && (
                    <ReviewModal requestId={request.requestId} />
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
