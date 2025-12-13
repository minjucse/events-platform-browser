const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const reviewApi = {
  // Create a new review
  createReview: async (reviewData: { rating: number; comment: string; eventId: string }) => {
    const response = await fetch(`${API_BASE_URL}/review`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    return response.json();
  },

  // Get all reviews
  getAllReviews: async (params?: URLSearchParams) => {
    const url = params ? `${API_BASE_URL}/review?${params.toString()}` : `${API_BASE_URL}/review`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get host review stats
  getHostReviewStats: async (hostId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/host/${hostId}/stats`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get review by ID
  getReviewById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Update review
  updateReview: async (id: string, reviewData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: reviewData,
    });
    return response.json();
  },

  // Delete review (Admin only)
  deleteReview: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },

  // Get host's own reviews (HOST only)
  getHostMyReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/review/host-my-reviews`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Get host reviews by event ID
  getHostReviewsByEventId: async (eventId: string) => {
    const response = await fetch(`${API_BASE_URL}/review/host-reviews/${eventId}`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },
};