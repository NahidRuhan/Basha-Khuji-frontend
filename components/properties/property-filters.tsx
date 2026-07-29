"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCategories, useLocations } from "@/hooks/use-options";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const { data: categoriesData } = useCategories();
  const { data: locationsData } = useLocations();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, minPrice, maxPrice, categoryName, locationName, minBedrooms, minSquarefoot, maxSquarefoot, sortBy, sortOrder, router]);

  const handleClear = () => {
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
        <div className="flex flex-col gap-2">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "createdAt")}>
            <SelectTrigger className="w-full text-left font-normal">
              <span className="truncate">
                {sortBy === "createdAt" && "Newest"}
                {sortBy === "price" && "Price"}
                {sortBy === "bedroomCount" && "Bedrooms"}
                {sortBy === "squarefoot" && "Squarefoot"}
                {!sortBy && "Sort By"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="bedroomCount">Bedrooms</SelectItem>
              <SelectItem value="squarefoot">Squarefoot</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(val) => setSortOrder((val as "asc" | "desc") || "desc")}>
            <SelectTrigger className="w-full text-left font-normal">
              <span className="truncate">
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleClear}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 space-y-6">
        <div className="sticky top-24 bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </h2>
          {filterForm}
        </div>
      </aside>

      <Sheet>
        <SheetTrigger className={buttonVariants({ variant: "outline", className: "md:hidden flex items-center gap-2" })}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </SheetTrigger>
        <SheetContent side="left" className="w-75 sm:w-100">
          <SheetHeader className="mb-6">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          {filterForm}
        </SheetContent>
      </Sheet>
    </>
  );
}
