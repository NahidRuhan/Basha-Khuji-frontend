import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  BedDouble, 
  Maximize, 
  Check, 
  Building, 
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverFetch } from "@/lib/api-server";
import { Property, ApiResponse } from "@/types";
import { RentRequestButton } from "@/components/properties/rent-request-button";

export const dynamic = "force-dynamic";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  let property: Property | null = null;
  
  try {
    const data = await serverFetch<ApiResponse<Property>>(`/api/properties/${id}`);
    if (data?.data) {
      property = data.data;
    }
  } catch (error) {
    console.error("Failed to fetch property details:", error);
  }

  if (!property) {
    return notFound();
  }

  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const primaryImage = property.images && property.images.length > 0 && getValidImageUrl(property.images[0])
    ? getValidImageUrl(property.images[0])!
    : "https://placehold.co/800x600/png?text=No+Image";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header section with back button */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/properties" className={buttonVariants({ variant: "ghost", className: "pl-0 text-muted-foreground hover:text-foreground" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={property.isAvailable ? "default" : "destructive"}>
                {property.isAvailable ? "AVAILABLE" : "RENTED"}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                {property.address}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {property.propertyName}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(property.price)}
            </div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-100 md:h-125">
          <div className="md:col-span-3 relative rounded-2xl overflow-hidden shadow-sm h-full group">
            <Image
              src={primaryImage}
              alt={property.propertyName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {property.images?.slice(1, 3).map((img, idx) => {
              const validImg = getValidImageUrl(img);
              if (!validImg) return null;
              
              return (
                <div key={idx} className="relative rounded-2xl overflow-hidden shadow-sm h-full group">
                  <Image
                    src={validImg}
                    alt={`${property.propertyName} - View ${idx + 2}`}
                    fill
                    sizes="(max-width: 768px) 0vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              );
            })}
            {(!property.images || property.images.length <= 1) && (
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-full bg-muted flex items-center justify-center border border-dashed">
                <Building className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10 p-6 bg-muted/40 rounded-2xl border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-background rounded-full shadow-sm">
                  <BedDouble className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{property.bedroomCount}</p>
                  <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-background rounded-full shadow-sm">
                  <Maximize className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{property.squarefoot} <span className="text-sm font-normal text-muted-foreground">sqft</span></p>
                  <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Area</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">About this property</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                {property.description}
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Amenities</h2>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded-full">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground/80">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific amenities listed.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Action Card */}
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
                <RentRequestButton propertyId={property.propertyId} isAvailable={property.isAvailable} />
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
        </div>
      </div>
    </div>
  );
}
