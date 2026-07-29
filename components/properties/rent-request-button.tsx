"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

interface RentRequestButtonProps {
  propertyId: string;
  isAvailable: boolean;
}

export function RentRequestButton({ propertyId, isAvailable }: RentRequestButtonProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleRentRequest = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/properties/${propertyId}`);
      return;
    }
    router.push(`/dashboard/tenant/requests/new?propertyId=${propertyId}`);
  };

  const isLandlordOrAdmin = user?.role === "LANDLORD" || user?.role === "ADMIN";

  return (
    <Button 
      size="lg" 
      className="w-full text-base font-semibold"
      disabled={!isAvailable || isLandlordOrAdmin}
      onClick={handleRentRequest}
    >
      {!isAvailable 
        ? "Currently Unavailable" 
        : isLandlordOrAdmin
          ? "Tenants Only"
          : "Request to Rent"}
    </Button>
  );
}
