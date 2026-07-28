import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category, Location, ApiResponse } from "@/types";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[]>>("/api/properties/category");
      return response.data;
    },
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Location[]>>("/api/properties/location");
      return response.data;
    },
  });
};
