import { apiClient } from "./api-client";
import { OrderResponse } from "./order.service";

export interface AdminResponse {
  email: string;
}

export const adminService = {
  /**
   * Authenticate administrator credentials
   */
  login: async (email: string, password: string): Promise<AdminResponse> => {
    return apiClient.post<AdminResponse>("/admin/login", { email, password });
  },

  /**
   * Logout and clear administrator session
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>("/admin/logout", {});
  },

  /**
   * Retrieve active admin session profile details
   */
  getMe: async () => {
    return apiClient.get<AdminResponse>("/admin/me");
  },

  /**
   * Fetch paginated and optionally status-filtered list of customer orders
   */
  getOrders: async (
    page = 1,
    limit = 10,
    status = "All"
  ): Promise<{ orders: OrderResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
    return apiClient.get(`/admin/orders?page=${page}&limit=${limit}&status=${status}`);
  },

  /**
   * Fetch a single order's deep details by ID
   */
  getOrder: async (orderId: string): Promise<OrderResponse> => {
    return apiClient.get(`/admin/orders/${orderId}`);
  },

  /**
   * Mutate administrative status flags on a customer order
   */
  updateOrderStatus: async (
    orderId: string,
    updates: { orderStatus?: string; paymentStatus?: string; rentalReturnStatus?: string }
  ): Promise<OrderResponse> => {
    return apiClient.patch(`/admin/orders/${orderId}/status`, updates);
  },
};

export default adminService;
