import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Property, RentalRequest, PaginatedResponse } from "@/types";

interface LandlordPropertiesResponse {
  data: Property[];
}

export const useLandlordStats = () => {
  return useQuery({
    queryKey: ["landlord-stats"],
    queryFn: async () => {
      const [propertiesRes, requestsRes] = await Promise.all([
        api.get<LandlordPropertiesResponse>("/api/landlord/my-properties"),
        api.get<PaginatedResponse<RentalRequest>>("/api/landlord/requests?limit=1000"), // High limit to get all for stats
      ]);

      const properties = propertiesRes.data.data || [];
      const requests = requestsRes.data.data || [];

      // Calculate Property Stats
      const totalProperties = properties.length;
      
      // Calculate Request Stats
      const totalRequests = requests.length;
      const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
      const activeRentals = requests.filter((r) => r.status === "ACTIVE" || r.status === "APPROVED").length;
      
      // Calculate Total Earnings / Volume (sum of prices of active/approved/completed rentals)
      const totalEarnings = requests
        .filter((r) => r.status === "ACTIVE" || r.status === "APPROVED" || r.status === "COMPLETED")
        .reduce((sum, req) => sum + (Number(req.property?.price) || 0), 0);

      // Prepare Chart Data
      const requestStatusData = [
        { name: "Pending", value: pendingRequests, color: "#f59e0b" },
        { name: "Approved", value: requests.filter((r) => r.status === "APPROVED").length, color: "#10b981" },
        { name: "Active", value: requests.filter((r) => r.status === "ACTIVE").length, color: "#3b82f6" },
        { name: "Rejected", value: requests.filter((r) => r.status === "REJECTED").length, color: "#ef4444" },
        { name: "Completed", value: requests.filter((r) => r.status === "COMPLETED").length, color: "#6b7280" },
      ].filter(item => item.value > 0);

      return {
        metrics: {
          totalProperties,
          totalRequests,
          pendingRequests,
          activeRentals,
          totalEarnings,
        },
        charts: {
          requestStatusData,
        },
        recentRequests: requests.slice(0, 5),
      };
    },
  });
};
