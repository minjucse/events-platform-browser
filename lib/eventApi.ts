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

export const eventApi = {
  async createEvent(formData: FormData): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return response.json();
  },

  async getAllEvents(
    params?:
      | URLSearchParams
      | {
          page?: number;
          limit?: number;
          searchTerm?: string;
          category?: string;
          status?: string;
        }
  ): Promise<ApiResponse> {
    let queryParams: URLSearchParams;

    if (params instanceof URLSearchParams) {
      queryParams = params;
    } else {
      queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.status) queryParams.append("status", params.status);
    }

    const response = await fetch(`${API_BASE_URL}/event?${queryParams}`, {
      credentials: "include",
    });
    return response.json();
  },

  async getEventStats(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/stats`, {
      credentials: "include",
    });
    return response.json();
  },

  async getUpcomingEvents(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/upcoming`, {
      credentials: "include",
    });
    return response.json();
  },

  async getOngoingEvents(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/ongoing`, {
      credentials: "include",
    });
    return response.json();
  },

  async getCompletedEvents(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/completed`, {
      credentials: "include",
    });
    return response.json();
  },

  async getEventById(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      credentials: "include",
    });
    return response.json();
  },

  async getMyPerticipatedEvents(): Promise<ApiResponse> {
    const response = await fetch(
      `${API_BASE_URL}/event/my-participated-events`,
      {
        credentials: "include",
      }
    );
    return response.json();
  },

  // Check if user has participated in an event
  checkUserParticipation: async (eventId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/event/my-participated-events/${eventId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // If 404, user hasn't participated
      if (response.status === 404) {
        return {
          success: false,
          message: "Not participated",
          data: { hasJoined: false },
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get user's participated event by ID
  getMyParticipatedEventById: async (eventId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/event/my-participated-events/${eventId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return response.json();
  },

  async updateEvent(id: string, formData: FormData): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });
    return response.json();
  },

  async deleteEvent(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json();
  },

  async participateInEvent(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/event/${id}/participate`, {
      method: "POST",
      credentials: "include",
    });
    return response.json();
  },
};
