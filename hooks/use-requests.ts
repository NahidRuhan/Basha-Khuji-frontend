import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { RentalRequest, PaginatedResponse, ApiResponse } from "@/types";
import { useRouter } from "next/navigation";

export const useMyRequests = () => {
  return useQuery({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<RentalRequest>>("/api/requests");
      return response.data;
    },
  });
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<RentalRequest>>(`/api/requests/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { propertyId: string; message: string }) => {
      const response = await api.post<ApiResponse<RentalRequest>>("/api/requests", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      router.push("/dashboard/tenant/requests");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit request.");
    },
  });
};

// Hook for initiating payment for an APPROVED request
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { checkoutUrl: string }; 
      }>("/api/payments/create", { requestId });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate payment.");
    },
  });
};

export const useLandlordRequests = () => {
  return useQuery({
    queryKey: ["landlord-requests"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<RentalRequest>>("/api/landlord/requests");
      return response.data;
    },
  });
};

export const useUpdateLandlordRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch<ApiResponse<RentalRequest>>(`/api/landlord/requests/${id}`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Request updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update request.");
    },
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async (data: { requestId: string; rating: number; review: string }) => {
      const response = await api.post<ApiResponse<any>>("/api/reviews", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    },
  });
};
