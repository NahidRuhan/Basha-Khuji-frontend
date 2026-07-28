"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCreateRequest } from "@/hooks/use-requests";
import { useProperty } from "@/hooks/use-properties";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, MapPin, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function NewRequestForm() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const router = useRouter();
  
  const [message, setMessage] = useState("Hi, I am interested in renting this property. Please let me know the next steps.");
  
  const { data: propertyData, isLoading: isLoadingProperty } = useProperty(propertyId || "");
  const { mutate: createRequest, isPending: isSubmitting } = useCreateRequest();
  
  const property = propertyData?.data;

  if (!propertyId) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <CardTitle className="mb-2 text-destructive">Invalid Request</CardTitle>
        <CardDescription className="max-w-md mx-auto mb-6">
          No property selected for the rental request.
        </CardDescription>
        <Link href="/properties" className={buttonVariants()}>Browse Properties</Link>
      </Card>
    );
  }

  if (isLoadingProperty) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <CardTitle className="mb-2 text-destructive">Property Not Found</CardTitle>
        <CardDescription className="max-w-md mx-auto mb-6">
          The property you are trying to request does not exist or has been removed.
        </CardDescription>
        <Link href="/properties" className={buttonVariants()}>Browse Properties</Link>
      </Card>
    );
  }

  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const primaryImage = property.images && property.images.length > 0 ? getValidImageUrl(property.images[0]) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({ propertyId, message });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Request to Rent</h1>
          <p className="text-muted-foreground text-sm">Submit your application to the landlord.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="overflow-hidden h-full">
            <div className="relative h-40 w-full bg-muted">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={property.propertyName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
                  No image available
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-2 mb-1">{property.propertyName}</h3>
              <div className="flex items-start text-xs text-muted-foreground mb-4">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{property.address}</span>
              </div>
              <div className="font-bold text-lg text-primary">
                ৳{property.price.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">/mo</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-lg">Application Details</CardTitle>
                <CardDescription>
                  Write a brief message to the landlord explaining why you are a good fit for this property.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message to Landlord</Label>
                  <Textarea 
                    id="message" 
                    rows={5}
                    placeholder="Tell the landlord about yourself..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-sm border">
                  <BadgeCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-muted-foreground">
                    Your profile information (email, phone, occupation) will be shared with the landlord to help them make a decision. Make sure your profile is up to date!
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t p-4 bg-muted/10">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewRequestForm />
    </Suspense>
  );
}
