"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Briefcase, MapPin, Building, Calendar, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { useTenantRequestHistory } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TenantInfoModalProps {
  tenant: Partial<User>;
}

export function TenantInfoModal({ tenant }: TenantInfoModalProps) {
  const { data, isLoading } = useTenantRequestHistory(tenant.userId as string);
  const history = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Approved</Badge>;
      case "ACTIVE":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">Active</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive">Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full sm:w-auto" />}>
        <Info className="h-4 w-4 mr-2" />
        About Tenant
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Tenant Profile</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg border">
              <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                <AvatarImage src={tenant.profileImage || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {tenant.userName?.charAt(0).toUpperCase() || "T"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{tenant.userName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{tenant.email}</span>
                  </div>
                  {tenant.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{tenant.phoneNumber}</span>
                    </div>
                  )}
                  {tenant.occupation && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{tenant.occupation}</span>
                    </div>
                  )}
                  {tenant.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tenant.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Request History */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Platform Request History
              </h4>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground text-sm">No request history found for this tenant.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((req) => (
                    <div key={req.requestId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                      <div>
                        <div className="font-medium text-sm line-clamp-1">
                          {req.property?.propertyName || "Unknown Property"}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(req.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
