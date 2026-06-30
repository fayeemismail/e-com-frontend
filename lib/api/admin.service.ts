import { apiClient } from "./api-client";

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
  getMe: async (): Promise<AdminResponse> => {
    return apiClient.get<AdminResponse>("/admin/me");
  },
};

export default adminService;
