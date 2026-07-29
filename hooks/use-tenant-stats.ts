import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { RentalRequest, PaginatedResponse, ApiResponse, Payment } from "@/types";

export const useTenantStats = () => {
  return useQuery({
    queryKey: ["tenant-stats"],
    queryFn: async () => {
      const [requestsRes, paymentsRes] = await Promise.all([
        api.get<PaginatedResponse<RentalRequest>>("/api/requests?limit=1000"),
        api.get<ApiResponse<Payment[]>>("/api/payments"),
      ]);

      const requests = requestsRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      // Calculate Request Stats
      const totalApplications = requests.length;
      const activeRentals = requests.filter((r) => r.status === "ACTIVE" || r.status === "APPROVED").length;
      
      // Calculate Total Spent (sum of all COMPLETED payment amounts)
      const totalSpent = payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + Number(p.amount), 0);
        
      // Calculate Success Rate
      const totalPaymentsAttempted = payments.length;
      const successfulPayments = payments.filter((p) => p.status === "COMPLETED").length;
      const paymentSuccessRate = totalPaymentsAttempted > 0 
        ? Math.round((successfulPayments / totalPaymentsAttempted) * 100) 
        : 0;

      // Prepare Chart Data
      const requestStatusData = [
        { name: "Pending", value: requests.filter((r) => r.status === "PENDING").length, color: "#f59e0b" },
        { name: "Approved", value: requests.filter((r) => r.status === "APPROVED").length, color: "#10b981" },
        { name: "Active", value: requests.filter((r) => r.status === "ACTIVE").length, color: "#3b82f6" },
        { name: "Rejected", value: requests.filter((r) => r.status === "REJECTED").length, color: "#ef4444" },
        { name: "Completed", value: requests.filter((r) => r.status === "COMPLETED").length, color: "#6b7280" },
      ].filter(item => item.value > 0);

      return {
        metrics: {
          totalApplications,
          activeRentals,
          totalSpent,
          paymentSuccessRate,
        },
        charts: {
          requestStatusData,
        },
        recentRequests: requests.slice(0, 5),
      };
    },
  });
};
