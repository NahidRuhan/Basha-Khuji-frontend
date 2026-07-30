"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Building, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/loading-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch latest properties (limit to 6 for the home page)
  const { data, isLoading } = useProperties({ limit: 6 });
  const properties = data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/properties?searchTerm=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push(`/properties`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-muted overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-background">
          <Image 
            src="/hero_banner.jpg" 
            alt="Modern apartment building" 
            fill 
            sizes="100vw"
            className="object-cover opacity-30 dark:opacity-20" 
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-background z-10" />
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-primary/5 blur-3xl rounded-full z-10" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-primary/10 blur-3xl rounded-full z-10" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-20 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find your perfect <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">Basha</span>
            </h1>
            <p className="mx-auto max-w-175 text-muted-foreground md:text-xl leading-relaxed">
              The smartest way to find, rent, and manage properties in Bangladesh. Discover thousands of rental options tailored to your needs.
            </p>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl mx-auto mt-8 bg-background/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-primary/10">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Search by city, neighborhood, or property name..." 
                    className="w-full pl-12 h-14 bg-transparent border-none shadow-none focus-visible:ring-0 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 rounded-xl shrink-0 text-base font-semibold shadow-md">
                  Search
                </Button>
              </form>
            </div>
            
            {/* Quick Stats/Tags */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-background/50 px-4 py-2 rounded-full border">
                <Building className="h-4 w-4 text-primary" />
                <span>10,000+ Properties</span>
              </div>
              <div className="flex items-center gap-1.5 bg-background/50 px-4 py-2 rounded-full border">
                <MapPin className="h-4 w-4 text-primary" />
                <span>All over Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Explore the latest and most popular rentals.</p>
          </div>
          <Link href="/properties" className={buttonVariants({ variant: "outline", className: "group" })}>
            View all properties
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          ) : properties.length > 0 ? (
            properties.map((property, idx) => (
              <PropertyCard key={property.propertyId} property={property} priority={idx < 2} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl border border-dashed">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No properties found</h3>
              <p className="text-muted-foreground">Check back later for new listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action for Landlords */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Are you a Landlord?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
            List your property on Basha Khuji and reach thousands of verified tenants looking for their next home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className={buttonVariants({ size: "lg", variant: "secondary", className: "font-semibold px-8" })}>
              List Your Property
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground font-semibold">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
