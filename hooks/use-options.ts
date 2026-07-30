import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category, Location, ApiResponse } from "@/types";

export const useCategories = (initialData?: ApiResponse<Category[]>) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[]>>("/api/properties/category");
      return response.data;
    },
    initialData,
  });
};

export const useLocations = (initialData?: ApiResponse<Location[]>) => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location[]>>("/api/properties/location");
      return response.data;
    },
    initialData,
  });
};
