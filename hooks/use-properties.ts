import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Property, PaginatedResponse, ApiResponse } from "@/types";

export interface PropertyFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  locationId?: string;
  categoryId?: string;
  bedroomCount?: number;
  page?: number;
  limit?: number;
}

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get<PaginatedResponse<Property>>(`/api/properties?${params.toString()}`);
      return response.data;
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Property>>(`/api/properties/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
