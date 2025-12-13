const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const reportsApi = {
  // Get admin dashboard stats (Admin only)
  getAdminDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/admin/dashboard`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get host stats (Host/Admin only)
  getHostStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/host/stats`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get user stats (User/Admin only)
  getUserStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/user/stats`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get public host stats (No auth required)
  getHostStatsPublic: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/host/public-stats`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get payment stats (Admin only)
  getPaymentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/payments/stats`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },
};