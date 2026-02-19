/**
 * API Client Configuration
 */

// Get backend API URL from environment or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Match type from backend
 */
export interface Match {
  id: string;
  sourcePostId?: string;
  hostUserId?: string;
  courtId?: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  areaText?: string;
  levelMin?: number;
  levelMax?: number;
  totalSlots?: number;
  currentJoined?: number;
  status?: string;
  pricePerPlayer?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Court type from backend
 */
export interface Court {
  id: string;
  name: string;
  addressText?: string;
  district?: string;
  city?: string;
  geoLat?: number;
  geoLng?: number;
  indoor?: boolean;
  note?: string;
  contactName?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch helper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

/**
 * Match API Client
 */
export const matchApi = {
  /**
   * Get all matches
   */
  getAll: async () => {
    return apiFetch<Match[]>("/api/matches");
  },

  /**
   * Get match by ID
   */
  getById: async (id: string) => {
    return apiFetch<Match>(`/api/matches/${id}`);
  },

  /**
   * Search matches with filters
   */
  search: async (params: {
    district?: string;
    skillLevel?: string;
    date?: string;
    priceMin?: number;
    priceMax?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    return apiFetch<Match[]>(`/api/matches?${queryParams.toString()}`);
  },
};

/**
 * Court API Client
 */
export const courtApi = {
  /**
   * Get all courts
   */
  getAll: async () => {
    return apiFetch<Court[]>("/api/courts");
  },

  /**
   * Get court by ID
   */
  getById: async (id: string) => {
    return apiFetch<Court>(`/api/courts/${id}`);
  },
};

/**
 * Source Post API (for crawling)
 */
export const sourcePostApi = {
  /**
   * Save single crawled post
   */
  saveCrawled: async (data: {
    fbPostId?: string;
    fbGroupId?: string;
    postUrl: string;
    authorFbId?: string;
    rawText: string;
    rawCreatedAt?: string;
    language?: string;
  }) => {
    return apiFetch("/api/source-posts/crawl", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Bulk save crawled posts
   */
  bulkSaveCrawled: async (posts: Array<{
    fbPostId?: string;
    fbGroupId?: string;
    postUrl: string;
    authorFbId?: string;
    rawText: string;
    rawCreatedAt?: string;
    language?: string;
  }>) => {
    return apiFetch("/api/source-posts/crawl/bulk", {
      method: "POST",
      body: JSON.stringify({ posts }),
    });
  },
};

/**
 * AI API (for processing)
 */
export const aiApi = {
  /**
   * Trigger bot to process pending posts
   */
  processPendingPosts: async (limit: number = 10) => {
    return apiFetch(`/api/ai/process-pending-posts?limit=${limit}`, {
      method: "POST",
    });
  },

  /**
   * Parse single post (test endpoint)
   */
  parsePost: async (rawText: string, sourcePostId?: string) => {
    return apiFetch("/api/ai/parse-post", {
      method: "POST",
      body: JSON.stringify({ rawText, sourcePostId }),
    });
  },
};
