"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Mail, Phone, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { Property } from "@/types";

export function PropertySidebar({ property }: { property: Property }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleRentRequest = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/properties/${property.propertyId}`);
      return;
    }
    router.push(`/dashboard/tenant/requests/new?propertyId=${property.propertyId}`);
  };

  return (
    <div className="space-y-6 sticky top-24">
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl">Interested in renting?</CardTitle>
          <CardDescription>Request to rent this property from the landlord.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>Secure platform matching</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>Flexible move-in dates</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            size="lg" 
            className="w-full text-base font-semibold"
            disabled={!property.isAvailable || user?.role === "LANDLORD" || user?.role === "ADMIN"}
            onClick={handleRentRequest}
          >
            {!property.isAvailable 
              ? "Currently Unavailable" 
              : user?.role === "LANDLORD" || user?.role === "ADMIN"
                ? "Tenants Only"
                : "Request to Rent"}
          </Button>
        </CardFooter>
      </Card>

      {/* Landlord Info Card */}
      {property.user && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg">Listed by</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={property.user.profileImage || ""} alt={property.user.userName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {property.user.userName?.charAt(0).toUpperCase() || "L"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{property.user.userName}</p>
                <p className="text-sm text-muted-foreground">Property Landlord</p>
              </div>
            </div>

            {(property.user.email || property.user.phoneNumber || property.user.occupation || property.user.address) && (
              <>
                <Separator />
                <div className="space-y-3 text-sm">
                  {property.user.email && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate" title={property.user.email}>{property.user.email}</span>
                    </div>
                  )}
                  {property.user.phoneNumber && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <span>{property.user.phoneNumber}</span>
                    </div>
                  )}
                  {property.user.occupation && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate" title={property.user.occupation}>{property.user.occupation}</span>
                    </div>
                  )}
                  {property.user.address && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate" title={property.user.address}>{property.user.address}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
