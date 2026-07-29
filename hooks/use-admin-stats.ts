import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User, RentalRequest, Property } from "@/types";

interface AdminUsersResponse {
  data: { user: User[] };
}

interface AdminRentalsResponse {
  data: { rentals: RentalRequest[] };
}

interface PropertiesResponse {
  data: Property[];
  meta: { total: number };
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Fetch all required data in parallel
      const [usersRes, rentalsRes, propertiesRes] = await Promise.all([
        api.get<AdminUsersResponse>("/api/admin/users"),
        api.get<AdminRentalsResponse>("/api/admin/rentals"),
        api.get<PropertiesResponse>("/api/properties?limit=1"),
      ]);

      const users = usersRes.data.data.user || [];
      const rentals = rentalsRes.data.data.rentals || [];
      const totalProperties = propertiesRes.data.meta?.total || 0;

      // Calculate User Stats
      const totalUsers = users.length;
      const totalTenants = users.filter((u) => u.role === "TENANT").length;
      const totalLandlords = users.filter((u) => u.role === "LANDLORD").length;
      const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
      const bannedUsers = users.filter((u) => u.status === "BANNED").length;

      // Calculate Rental Stats
      const totalRequests = rentals.length;
      const pendingRequests = rentals.filter((r) => r.status === "PENDING").length;
      const activeRentals = rentals.filter((r) => r.status === "ACTIVE" || r.status === "APPROVED").length;
      
      // Calculate Platform Volume (sum of prices of active/approved rentals)
      const platformVolume = rentals
        .filter((r) => r.status === "ACTIVE" || r.status === "APPROVED")
        .reduce((sum, req) => sum + (Number(req.property?.price) || 0), 0);

      // Prepare Chart Data
      const roleChartData = [
        { name: "Tenants", value: totalTenants, color: "#3b82f6" },
        { name: "Landlords", value: totalLandlords, color: "#10b981" },
      ];

      const requestStatusData = [
        { name: "Pending", value: pendingRequests, color: "#f59e0b" },
        { name: "Active/Approved", value: activeRentals, color: "#10b981" },
        { name: "Rejected", value: rentals.filter((r) => r.status === "REJECTED").length, color: "#ef4444" },
        { name: "Completed", value: rentals.filter((r) => r.status === "COMPLETED").length, color: "#6b7280" },
      ].filter(item => item.value > 0);

      return {
        metrics: {
          totalUsers,
          activeUsers,
          bannedUsers,
          totalProperties,
          totalRequests,
          pendingRequests,
          platformVolume,
        },
        charts: {
          roleChartData,
          requestStatusData,
        },
        recentActivity: {
          users: users.slice(0, 5),
          rentals: rentals.slice(0, 5),
        },
      };
    },
  });
};
