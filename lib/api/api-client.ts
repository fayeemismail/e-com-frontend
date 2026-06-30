const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  title: string;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;

    // Determine user-friendly title based on HTTP status code / connection status
    const lowerMessage = message.toLowerCase();
    const isOffline =
      status === 0 ||
      lowerMessage.includes("fetch") ||
      lowerMessage.includes("network") ||
      lowerMessage.includes("connect") ||
      lowerMessage.includes("unable to connect");

    if (isOffline) {
      this.title = "Connection Failure";
    } else if (status === 404) {
      this.title = "Not Found";
    } else if (status === 401 || status === 403) {
      this.title = "Access Denied";
    } else if (status >= 500) {
      this.title = "Server Error";
    } else {
      this.title = "Something Went Wrong";
    }
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    let payload: ApiResponse<T>;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError(
        `Failed to parse response from ${url}`,
        response.status
      );
    }

    if (!response.ok || !payload.success) {
      throw new ApiError(
        payload.error || payload.message || "An unexpected error occurred",
        response.status
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    const rawMessage = error instanceof Error ? error.message : "";
    const isConnectionError = 
      rawMessage.toLowerCase().includes("fetch") || 
      rawMessage.toLowerCase().includes("network") ||
      rawMessage.toLowerCase().includes("failed to fetch") ||
      rawMessage.toLowerCase().includes("connection");

    const friendlyMessage = isConnectionError
      ? "Unable to connect to our servers. Please check your network connection or try again later."
      : (rawMessage || "An unexpected error occurred");

    throw new ApiError(friendlyMessage, isConnectionError ? 0 : 500);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
    
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
