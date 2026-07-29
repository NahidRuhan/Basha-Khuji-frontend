import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { serverFetch } from "@/lib/api-server";
import { PaginatedResponse, Property } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Build query string from searchParams
  const queryParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  // Ensure limit is set
  if (!queryParams.has("limit")) {
    queryParams.append("limit", "12");
  }

  let data: PaginatedResponse<Property> | null = null;
  let properties: Property[] = [];
  
  try {
    data = await serverFetch<PaginatedResponse<Property>>(`/api/properties?${queryParams.toString()}`);
    properties = data?.data || [];
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }

  const currentPage = searchParams.page ? Number(searchParams.page) : 1;
  const totalPages = data?.meta?.totalPages || 0;

  // Helper to build pagination links
  const getPageUrl = (page: number) => {
    const newParams = new URLSearchParams(queryParams.toString());
    newParams.set("page", page.toString());
    return `/properties?${newParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-16rem)]">
      
      {/* Filters (Client Component) */}
      <Suspense fallback={<div className="w-64 shrink-0"><div className="h-96 bg-muted animate-pulse rounded-xl" /></div>}>
        <PropertyFilters />
      </Suspense>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Browse Properties</h1>
            <p className="text-muted-foreground mt-1">
              Found {properties.length} results
            </p>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
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
                We couldn&apos;t find any properties matching your current filters. Try adjusting your search criteria.
              </p>
              <Link href="/properties" className="mt-6">
                <Button variant="outline">Clear all filters</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {(() => {
                const pages: (number | "ellipsis")[] = [];

                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 3) pages.push("ellipsis");
                  
                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);
                  for (let i = start; i <= end; i++) pages.push(i);

                  if (currentPage < totalPages - 2) pages.push("ellipsis");
                  pages.push(totalPages);
                }

                return pages.map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={getPageUrl(p)}
                        isActive={p === currentPage}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
