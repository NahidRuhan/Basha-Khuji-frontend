import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { Property, PaginatedResponse, ApiResponse } from "@/types";

export interface PropertyFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  locationId?: string;
  categoryId?: string; // Kept for backwards compatibility if needed, but backend expects categoryName
  categoryName?: string;
  locationName?: string;
  minBedrooms?: number;
  minSquarefoot?: number;
  maxSquarefoot?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const useProperties = (filters?: PropertyFilters, initialData?: PaginatedResponse<Property>) => {
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
    initialData,
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

export const useMyProperties = () => {
  return useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Property[]>>("/api/landlord/my-properties");
      return response.data;
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const response = await api.post<ApiResponse<Property>>("/api/landlord/properties", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create property.");
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      const response = await api.put<ApiResponse<Property>>(`/api/landlord/properties/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", data.data?.propertyId] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update property.");
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<Property>>(`/api/landlord/properties/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Property deleted/archived successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete property.");
    },
  });
};
