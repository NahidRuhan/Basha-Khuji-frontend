import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { setTokens, clearTokens } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginValues, RegisterValues } from "@/lib/validations/auth";
import { User, ApiResponse } from "@/types";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginValues) => {
      // 1. Login to get tokens
      const loginResponse = await api.post<{
        success: boolean;
        message: string;
        data: { accessToken: string; refreshToken?: string };
      }>("/api/login", data);
      
      const tokens = loginResponse.data.data;
      
      // Temporarily set the token in the API client for the next request
      setTokens(tokens.accessToken, tokens.refreshToken);
      
      // 2. Fetch the current user profile
      const userResponse = await api.get<{
        success: boolean;
        data: User;
      }>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
      
      return {
        message: loginResponse.data.message,
        user: userResponse.data.data,
      };
    },
    onSuccess: (data) => {
      setUser(data.user);
      
      toast.success(data.message || "Logged in successfully!");
      
      // Clear all queries to prevent stale data leaking between accounts
      queryClient.clear();

      // Redirect based on role
      if (data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (data.user.role === "LANDLORD") {
        router.push("/dashboard/landlord");
      } else {
        router.push("/dashboard/tenant");
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      clearTokens(); // Cleanup just in case
      const message = error.response?.data?.message || "Failed to login. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterValues) => {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const response = await api.post<ApiResponse<User>>("/api/user/register", registerData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully! Please login.");
      router.push("/login");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || "Failed to register. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      clearTokens();
      clearUser();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      // Even if API fails, clear local state
      clearTokens();
      clearUser();
      queryClient.clear();
      router.push("/login");
    },
  });
};
