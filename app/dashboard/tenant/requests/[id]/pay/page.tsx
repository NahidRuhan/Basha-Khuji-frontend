"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ArrowLeft,
  ShieldCheck,
  Info,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRequest, useInitiatePayment } from "@/hooks/use-requests";
import { toast } from "sonner";

export default function PaymentInitiationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data, isLoading, error } = useRequest(id);
  const initiatePayment = useInitiatePayment();
  
  const request = data?.data;
  const property = request?.property;

  useEffect(() => {
    // If request is loaded and not APPROVED, they shouldn't be here
    if (request && request.status !== "APPROVED") {
      toast.error("This request is not approved for payment.");
      router.replace("/dashboard/tenant/requests");
    }
  }, [request, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !request || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Request Not Found</h2>
        <p className="text-muted-foreground">The rental request you are trying to pay for could not be found or you don't have access to it.</p>
        <Button onClick={() => router.push("/dashboard/tenant/requests")}>
          Back to Requests
        </Button>
      </div>
    );
  }

  if (request.status !== "APPROVED") {
    return null; // Handle by useEffect redirect
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const propertyImage = property.images?.[0] ? getValidImageUrl(property.images[0]) : null;

  const handlePayment = () => {
    initiatePayment.mutate(request.requestId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complete Payment</h1>
          <p className="text-muted-foreground">Secure your rental by completing the initial payment.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rental Summary</CardTitle>
              <CardDescription>Review the details of your rental request before paying.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {propertyImage ? (
                  <div className="relative w-full sm:w-32 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image 
                      src={propertyImage} 
                      alt={property.propertyName} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-32 h-24 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <Building className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{property.propertyName}</h3>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {property.address}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Approved
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" /> Request Date
                  </div>
                  <div className="font-medium">
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1.5" /> Vacant From
                  </div>
                  <div className="font-medium">
                    {format(new Date(property.vacantFrom || new Date()), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Your Message to Landlord</h4>
                <p className="text-sm text-muted-foreground italic">
                  "{request.message}"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-emerald-700 mb-1">Secure Payment with Stripe</p>
                <p className="text-muted-foreground">Your payment is processed securely. Basha Khuji does not store your payment information. You can request a refund if the landlord cancels the agreement before move-in.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-medium">{formatCurrency(property.price)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Security Deposit</span>
                <span className="font-medium">{formatCurrency(property.price)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">Free</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold text-base">Total Due</span>
                <span className="font-bold text-2xl text-primary">{formatCurrency(property.price * 2)}</span>
              </div>
              
              <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2 bg-blue-50/50 p-2 rounded text-blue-800">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <p>Total includes first month's rent and 1-month equivalent security deposit.</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handlePayment}
                disabled={initiatePayment.isPending}
              >
                {initiatePayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
