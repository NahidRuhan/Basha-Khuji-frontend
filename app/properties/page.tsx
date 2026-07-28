"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Building, BedDouble, ArrowRight, Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/loading-skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProperties } from "@/hooks/use-properties";
import { useCategories, useLocations } from "@/hooks/use-options";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  
  const [categoryName, setCategoryName] = useState(searchParams.get("categoryName") || "all");
  const [locationName, setLocationName] = useState(searchParams.get("locationName") || "all");
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get("minBedrooms") || "");
  const [minSquarefoot, setMinSquarefoot] = useState(searchParams.get("minSquarefoot") || "");
  const [maxSquarefoot, setMaxSquarefoot] = useState(searchParams.get("maxSquarefoot") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  const { data: categoriesData } = useCategories();
  const { data: locationsData } = useLocations();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page to 1 when other filters change
  useEffect(() => {
    setPage(1);
  }, [minPrice, maxPrice, categoryName, locationName, minBedrooms, minSquarefoot, maxSquarefoot, sortBy, sortOrder]);
  
  // Derived active filters object
  const activeFilters = {
    searchTerm: debouncedSearchTerm || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    categoryName: categoryName && categoryName !== "all" ? categoryName : undefined,
    locationName: locationName && locationName !== "all" ? locationName : undefined,
    minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
    minSquarefoot: minSquarefoot ? Number(minSquarefoot) : undefined,
    maxSquarefoot: maxSquarefoot ? Number(maxSquarefoot) : undefined,
    sortBy: sortBy || "createdAt",
    sortOrder: (sortOrder as "asc" | "desc") || "desc",
    limit: 12,
    page,
  };

  const { data, isLoading } = useProperties(activeFilters);
  const properties = data?.data || [];

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchTerm) params.set("searchTerm", debouncedSearchTerm);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryName && categoryName !== "all") params.set("categoryName", categoryName);
    if (locationName && locationName !== "all") params.set("locationName", locationName);
    if (minBedrooms) params.set("minBedrooms", minBedrooms);
    if (minSquarefoot) params.set("minSquarefoot", minSquarefoot);
    if (maxSquarefoot) params.set("maxSquarefoot", maxSquarefoot);
    if (sortBy && sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder && sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (page > 1) params.set("page", page.toString());
    
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, minPrice, maxPrice, categoryName, locationName, minBedrooms, minSquarefoot, maxSquarefoot, sortBy, sortOrder, page, router]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterForm = (
    <div className="space-y-6">
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

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryName} onValueChange={(val) => setCategoryName(val || "all")}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData?.data?.map((cat) => (
              <SelectItem key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Select value={locationName} onValueChange={(val) => setLocationName(val || "all")}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locationsData?.data?.map((loc) => (
              <SelectItem key={loc.locationId} value={loc.locationName}>
                {loc.locationName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Min Bedrooms</Label>
        <Input 
          type="number" 
          placeholder="Any" 
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label>Square Footage</Label>
        <div className="flex items-center gap-3">
          <div className="space-y-1 w-full">
            <Input 
              type="number" 
              placeholder="Min" 
              value={minSquarefoot}
              onChange={(e) => setMinSquarefoot(e.target.value)}
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="space-y-1 w-full">
            <Input 
              type="number" 
              placeholder="Max" 
              value={maxSquarefoot}
              onChange={(e) => setMaxSquarefoot(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Sort Options</Label>
        <div className="grid grid-cols-2 gap-3">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "createdAt")}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="bedroomCount">Bedrooms</SelectItem>
              <SelectItem value="squarefoot">Squarefoot</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(val) => setSortOrder((val as "asc" | "desc") || "desc")}>
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
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
          {filterForm}
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
              {filterForm}
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
                  setCategoryName("all");
                  setLocationName("all");
                  setMinBedrooms("");
                  setMinSquarefoot("");
                  setMaxSquarefoot("");
                  setSortBy("createdAt");
                  setSortOrder("desc");
                  router.push("/properties");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 mx-4 text-sm font-medium">
              Page {page} of {data.meta.totalPages}
            </div>
            <Button
              variant="outline"
              disabled={page >= data.meta.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
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
