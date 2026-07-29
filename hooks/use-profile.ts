import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { User, ApiResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.patch<ApiResponse<{ user: User }>>("/api/user/my-profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully!");
      if (data.data?.user) {
        useAuthStore.getState().setUser(data.data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};
