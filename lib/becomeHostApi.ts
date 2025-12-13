const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const becomeHostApi = {
  // Create become host request (USER only)
  createBecomeHostRequest: async (requestData: { 
    hostExperience: string;
    typeOfEvents: string;
    whyHost: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/become-host`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostExperience: requestData.hostExperience,
        typeOfEvents: requestData.typeOfEvents,
        whyHost: requestData.whyHost,
      }),
    });
    return response.json();
  },

  // Create become host by admin (ADMIN only)
  createBecomeHostByAdmin: async (adminData: { userId: string; reason?: string }) => {
    const response = await fetch(`${API_BASE_URL}/become-host/admin/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
    return response.json();
  },

  // Get all become host requests (ADMIN only)
  getAllBecomeHostRequests: async (params?: URLSearchParams): Promise<ApiResponse> => {
    const url = params ? `${API_BASE_URL}/become-host?${params.toString()}` : `${API_BASE_URL}/become-host`;
    const response = await fetch(url, {
      credentials: "include",
    });
    return response.json();
  },

  // Get become host request by ID (ADMIN only)
  getBecomeHostById: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/become-host/${id}`, {
      credentials: "include",
    });
    return response.json();
  },

  // Update become host request (ADMIN only)
  updateBecomeHostRequest: async (id: string, updateData: { status?: string; adminNotes?: string; approveHost?: boolean }) => {
    const response = await fetch(`${API_BASE_URL}/become-host/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    return response.json();
  },

  // Delete become host request (ADMIN only)
  deleteBecomeHostRequest: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/become-host/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },
};