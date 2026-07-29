"use client";

import { useMyProperties, useDeleteProperty } from "@/hooks/use-properties";
import { Card, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building, MapPin, Edit, Trash2, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function LandlordPropertiesPage() {
  const { data, isLoading } = useMyProperties();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const properties = data?.data || [];

  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const handleDelete = (id: string) => {
    deleteProperty(id, {
      onSuccess: () => setPropertyToDelete(null)
    });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your rental listings</p>
        </div>
        <Link href="/dashboard/landlord/properties/new" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" /> Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="mb-2">No Properties Found</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            You haven&apos;t added any properties yet. Create your first listing to start receiving rental requests.
          </CardDescription>
          <Link href="/dashboard/landlord/properties/new" className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" /> Add Your First Property
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => {
            const primaryImage = property.images && property.images.length > 0 ? getValidImageUrl(property.images[0]) : null;
            
            return (
              <Card key={property.propertyId} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-muted">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={property.propertyName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={property.isAvailable ? "default" : "secondary"}>
                      {property.isAvailable ? "Available" : "Rented"}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">{property.propertyName}</h3>
                  <div className="flex items-start text-sm text-muted-foreground mb-4 h-10">
                    <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{property.address}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</div>
                      <div className="font-bold text-lg text-primary">৳{property.price.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Category</div>
                      <div className="font-medium text-sm">{property.category?.categoryName || "N/A"}</div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 border-t bg-muted/20 flex gap-2">
                  <Link 
                    href={`/dashboard/landlord/properties/${property.propertyId}/edit`} 
                    className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1" })}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                  
                  <Dialog open={propertyToDelete === property.propertyId} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
                    <DialogTrigger 
                      render={
                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => setPropertyToDelete(property.propertyId)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Archive
                        </Button>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Archive Property
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to archive <strong>{property.propertyName}</strong>? 
                          This action will hide the property from public listings. You cannot archive a property if it has pending or active rental requests.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setPropertyToDelete(null)}>Cancel</Button>
                        <Button 
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(property.propertyId);
                          }}
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Archive
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
