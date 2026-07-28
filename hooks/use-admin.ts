import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { User, RentalRequest, ApiResponse, PaginatedResponse } from "@/types";

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // The API returns { data: { user: User[] } }
      const response = await api.get<ApiResponse<{ user: User[] }>>("/api/admin/users");
      return response.data;
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: "ACTIVE" | "BANNED" }) => {
      const response = await api.patch<ApiResponse<{ user: User }>>(`/api/admin/users/${userId}`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status.");
    },
  });
};

export const useAllRentals = () => {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: async () => {
      // The API returns { data: { rentals: RentalRequest[] } }
      const response = await api.get<ApiResponse<{ rentals: RentalRequest[] }>>("/api/admin/rentals");
      return response.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryName }: { categoryName: string }) => {
      const response = await api.post<ApiResponse<any>>("/api/admin/categories", { categoryName });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category.");
    },
  });
};
