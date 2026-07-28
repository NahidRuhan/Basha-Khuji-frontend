import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { User, ApiResponse } from "@/types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.patch<ApiResponse<{ user: User }>>("/api/user/my-profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully!");
      // Invalidate the "me" query so auth store updates if we refetch, 
      // or we can just invalidate any profile-related queries
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};
