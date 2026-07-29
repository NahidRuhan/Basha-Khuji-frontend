"use client";

import { useAllRentals } from "@/hooks/use-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ClipboardList, CheckCircle2, XCircle, Clock, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminRentalsPage() {
  const { data, isLoading } = useAllRentals();

  const rentals = data?.data?.rentals || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "ACTIVE":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <h1 className="text-3xl font-bold tracking-tight">Rental Management</h1>
        <p className="text-muted-foreground mt-1">View all rental transactions across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            All Rentals ({rentals.length})
          </CardTitle>
          <CardDescription>
            Monitoring all tenant requests and active leases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Tenant</th>
                    <th className="px-6 py-3 font-medium">Property Details</th>
                    <th className="px-6 py-3 font-medium">Message</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No rentals found
                      </td>
                    </tr>
                  ) : (
                    rentals.map((rental) => (
                      <tr key={rental.requestId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 align-top">
                          {rental.user ? (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={rental.user.profileImage || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {rental.user.userName?.charAt(0).toUpperCase() || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{rental.user.userName}</div>
                                <div className="text-xs text-muted-foreground">{rental.user.email}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic">Unknown User</div>
                          )}
                        </td>
                        <td className="px-6 py-4 align-top">
                          {rental.property ? (
                            <div>
                              <Link href={`/properties/${rental.property.propertyId}`} className="font-medium text-primary hover:underline line-clamp-2 mb-1">
                                {rental.property.propertyName}
                              </Link>
                              <div className="text-xs font-bold bg-muted inline-block px-2 py-1 rounded">
                                ৳{Number(rental.property.price).toLocaleString()} /mo
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic">Unknown Property</div>
                          )}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-xs text-muted-foreground max-w-xs line-clamp-3 bg-muted/30 p-2 rounded border-l-2 border-primary/20 italic mb-2">
                            &quot;{rental.message}&quot;
                          </div>
                          {rental.review && (
                            <div className="text-xs text-amber-900/80 max-w-xs bg-amber-50/50 p-2 rounded border-l-2 border-amber-400/50 italic">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-800">Review:</span>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-2.5 w-2.5 ${i < rental.review!.rating ? "fill-amber-400 text-amber-400" : "text-amber-200"}`} />
                                ))}
                              </div>
                              &quot;{rental.review.review}&quot;
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 align-top">
                          {getStatusBadge(rental.status)}
                        </td>
                        <td className="px-6 py-4 align-top text-muted-foreground text-xs whitespace-nowrap">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(rental.createdAt || new Date()), "MMM d, yyyy")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
