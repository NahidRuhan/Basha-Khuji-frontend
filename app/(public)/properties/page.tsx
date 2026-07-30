import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PropertiesClient } from "./_components/properties-client";
import { Property, PaginatedResponse, Category, Location, ApiResponse } from "@/types";

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedResponse<Property> | undefined> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    if (!params.has("limit")) {
      params.append("limit", "12");
    }

    const res = await fetch(`${API_URL}/api/properties?${params.toString()}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return undefined;
    const data = await res.json();
    return data;
  } catch {
    return undefined;
  }
}

async function getCategories(): Promise<ApiResponse<Category[]> | undefined> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${API_URL}/api/properties/category`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

async function getLocations(): Promise<ApiResponse<Location[]> | undefined> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${API_URL}/api/properties/location`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  
  const [initialProperties, initialCategories, initialLocations] = await Promise.all([
    getProperties(resolvedSearchParams),
    getCategories(),
    getLocations()
  ]);

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PropertiesClient 
        initialProperties={initialProperties}
        initialCategories={initialCategories}
        initialLocations={initialLocations}
      />
    </Suspense>
  );
}
