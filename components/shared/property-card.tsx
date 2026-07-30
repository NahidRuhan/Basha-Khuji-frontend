import Image from "next/image";
import Link from "next/link";
import { BedDouble, Maximize, MapPin } from "lucide-react";
import { Property } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const primaryImage = property.images && property.images.length > 0 ? getValidImageUrl(property.images[0]) : null;

  return (
    <Link href={`/properties/${property.propertyId}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      <Card className="overflow-hidden flex flex-col group h-full transition-all hover:shadow-md hover:border-primary/50">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={property.propertyName}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            No image available
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {property.category && (
            <Badge variant="secondary" className="shadow-sm font-medium bg-background/90 backdrop-blur-sm">
              {property.category.categoryName}
            </Badge>
          )}
          {!property.isAvailable && (
            <Badge variant="destructive" className="shadow-sm font-medium">
              Rented
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 grow flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1" title={property.propertyName}>
            {property.propertyName}
          </h3>
          <div className="text-lg font-bold text-primary whitespace-nowrap">
            ৳{property.price.toLocaleString()}
            <span className="text-xs text-muted-foreground font-normal">/mo</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
          <span className="line-clamp-1" title={property.address}>
            {property.location?.locationName ? `${property.address}, ${property.location.locationName}` : property.address}
          </span>
        </div>
        
        {/* Amenities preview */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {property.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-auto flex justify-between items-center bg-muted/20 text-sm text-muted-foreground h-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedroomCount} Beds</span>
          </div>
          <div className="flex items-center gap-1.5" title="Square Footage">
            <Maximize className="h-4 w-4" />
            <span>{property.squarefoot} sqft</span>
          </div>
        </div>
      </CardFooter>
      </Card>
    </Link>
  );
}
