import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Maximize, Check, Building } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Property, ApiResponse } from "@/types";
import { BackButton } from "./_components/back-button";
import { PropertySidebar } from "./_components/property-sidebar";

async function getProperty(id: string): Promise<Property | undefined> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return undefined;
    const data: ApiResponse<Property> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

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
          <BackButton />
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
          <PropertySidebar property={property} />
        </div>
      </div>
    </div>
  );
}
