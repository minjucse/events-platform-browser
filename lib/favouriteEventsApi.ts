const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

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

export const favouriteEventsApi = {
  // Add event to favourites
  addToFavourites: async (eventId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/favourite-events`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
    });
    return response.json();
  },

  // Get user's favourite events
  getMyFavourites: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/favourite-events`, {
      method: "GET",
      credentials: "include",
    });
    return response.json();
  },

  // Remove event from favourites
  removeFromFavourites: async (eventId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/favourite-events/${eventId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },
};