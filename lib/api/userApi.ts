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

export const userApi = {
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params?.role && params.role !== "all")
      queryParams.append("role", params.role);

    const response = await fetch(`${API_BASE_URL}/user?${queryParams}`, {
      credentials: "include",
    });
    return response.json();
  },

  async getUserById(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      credentials: "include",
    });
    return response.json();
  },

  async updateUserStatus(id: string, status: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/user/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  async updateMyProfile(formData: FormData): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/user/update-my-profile`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    return response.json();
  },
};
