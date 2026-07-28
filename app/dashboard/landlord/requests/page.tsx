"use client";

import { useLandlordRequests, useUpdateLandlordRequest } from "@/hooks/use-requests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, ClipboardList, CheckCircle2, XCircle, Clock, Building, User, Phone, Mail, Star } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function LandlordRequestsPage() {
  const { data, isLoading } = useLandlordRequests();
  const { mutate: updateRequest, isPending: isUpdating } = useUpdateLandlordRequest();
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const requests = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "ACTIVE":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string | null) => {
    if (!newStatus) return;
    setUpdatingId(id);
    updateRequest(
      { id, status: newStatus },
      { onSettled: () => setUpdatingId(null) }
    );
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
        <h1 className="text-3xl font-bold tracking-tight">Rental Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage tenant applications for your properties.</p>
      </div>

      {requests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="mb-2">No Requests Found</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            You don't have any rental requests yet. They will appear here when tenants apply for your properties.
          </CardDescription>
          <Link href="/dashboard/landlord/properties" className={buttonVariants({ variant: "outline" })}>
            View My Properties
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.requestId} className="overflow-hidden">
              <div className="md:flex">
                <div className="bg-muted/30 p-6 md:w-72 flex flex-col justify-between border-r md:border-b-0 border-b">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex justify-between items-center">
                      <span>Status</span>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="mt-6">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Property</div>
                      <Link 
                        href={`/properties/${request.propertyId}`}
                        className="font-semibold text-primary hover:underline line-clamp-2"
                      >
                        {request.property?.propertyName || "Unknown Property"}
                      </Link>
                      <div className="text-sm font-bold mt-1">৳{Number(request.property?.price).toLocaleString()} /mo</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Applied:</span>
                      <span className="font-medium text-foreground">{format(new Date(request.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium text-foreground">{format(new Date(request.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.user?.profileImage || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {request.user?.userName?.charAt(0).toUpperCase() || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {request.user?.userName || "Unknown Tenant"}
                        </h3>
                        <div className="flex gap-3 text-sm text-muted-foreground mt-0.5">
                          <span className="flex items-center"><Mail className="h-3 w-3 mr-1"/> {request.user?.email}</span>
                          {request.user?.phoneNumber && <span className="flex items-center"><Phone className="h-3 w-3 mr-1"/> {request.user.phoneNumber}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/40 rounded-lg p-4 mb-6 flex-1 text-sm">
                    <div className="font-medium mb-1 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" /> Message from Applicant:
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground mt-2 italic border-l-2 border-primary/20 pl-3">
                      "{request.message}"
                    </p>
                  </div>
                  
                  {request.review && (
                    <div className="bg-amber-50/50 rounded-lg p-4 mb-6 text-sm border border-amber-200">
                      <div className="font-medium mb-2 flex items-center justify-between">
                        <span className="text-amber-800 flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> Tenant Review:</span>
                        <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-3 w-3 ${i < request.review!.rating ? "fill-amber-400 text-amber-400" : "text-amber-200"}`} />
                           ))}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-amber-900/80 mt-2 italic border-l-2 border-amber-400/50 pl-3">
                        "{request.review.review}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3 items-center justify-between border-t pt-4">
                    <div className="text-sm font-medium">Update Status:</div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={request.status} 
                        onValueChange={(val) => handleStatusUpdate(request.requestId, val)}
                        disabled={updatingId === request.requestId || request.status === "COMPLETED"}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING" disabled={request.status === "ACTIVE"}>Pending</SelectItem>
                          <SelectItem value="APPROVED" disabled={request.status === "ACTIVE"}>Approved</SelectItem>
                          <SelectItem value="REJECTED" disabled={request.status === "ACTIVE"}>Rejected</SelectItem>
                          <SelectItem value="ACTIVE" disabled>Active</SelectItem>
                          <SelectItem value="COMPLETED" disabled={request.status !== "ACTIVE"}>Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingId === request.requestId && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
