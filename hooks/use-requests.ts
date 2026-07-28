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
        data: { paymentUrl: string }; // Assuming backend returns Stripe Checkout URL
      }>("/api/payments/create-payment", { requestId });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to initiate payment.");
    },
  });
};
