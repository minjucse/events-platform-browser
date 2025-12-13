const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const paymentApi = {
  // Create payment
  createPayment: async (paymentData: { eventId: string }) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  // Verify payment
  verifyPayment: async (verificationData: { paymentIntentId: string }) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationData),
    });
    return response.json();
  },

  // Get all payments (Admin/Host only)
  getAllPayments: async (params?: URLSearchParams) => {
    const url = params ? `${API_BASE_URL}/payments?${params.toString()}` : `${API_BASE_URL}/payments`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get payment by ID
  getPaymentById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Update payment status (Admin only)
  updatePaymentStatus: async (id: string, statusData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      body: statusData,
    });
    return response.json();
  },

  // Delete payment (Admin only)
  deletePayment: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },
};