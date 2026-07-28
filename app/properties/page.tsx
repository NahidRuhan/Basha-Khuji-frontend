"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Building, BedDouble, ArrowRight, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/loading-skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProperties } from "@/hooks/use-properties";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  
  // Derived active filters object
  const activeFilters = {
    searchTerm: searchParams.get("searchTerm") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    limit: 12, // Show more on the browse page
  };

  const { data, isLoading } = useProperties(activeFilters);
  const properties = data?.data || [];

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    
    router.push(`/properties?${params.toString()}`);
  };

  const FilterContent = () => (
    <form onSubmit={handleApplyFilters} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search"
            placeholder="City, neighborhood..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Price Range (BDT)</Label>
        <div className="flex items-center gap-3">
          <div className="space-y-1 w-full">
            <Input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="space-y-1 w-full">
            <Input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">Apply Filters</Button>
    </form>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-16rem)]">
      
      {/* Desktop Sidebar Filters */}
      <aside className="hidden md:block w-64 shrink-0 space-y-6">
        <div className="sticky top-24 bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </h2>
          <FilterContent />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Properties</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Searching..." : `Found ${properties.length} results`}
            </p>
          </div>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "outline", className: "md:hidden flex items-center gap-2" })}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-xl border border-dashed">
              <div className="bg-background p-4 rounded-full shadow-sm border mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any properties matching your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchTerm("");
                  setMinPrice("");
                  setMaxPrice("");
                  router.push("/properties");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
