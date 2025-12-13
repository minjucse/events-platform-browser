const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const authApi = {
  async registration(data: {
    email: string;
    fullName: string;
    password: string;
    role: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async verifyEmail(data: {
    email: string;
    otp: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: { email: string; password: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getMe(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  async resendOTP(data: { email: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async forgotPassword(data: { email: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },
};
