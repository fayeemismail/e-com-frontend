import { apiClient } from "./api-client";

export interface CartItemInput {
  sku: string;
  quantity: number;
  transactionType: "buy" | "rent";
  rentalDurationDays?: number;
}

export interface CartValidationItem {
  sku: string;
  name: string;
  quantity: number;
  transactionType: "buy" | "rent";
  price: number;
  rentalDurationDays?: number;
  securityDeposit?: number;
  itemTotal: number;
  itemDepositTotal: number;
  inStock: boolean;
  availableStock: number;
}

export interface CartValidationSummary {
  subtotal: number;
  totalSecurityDeposits: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
}

export interface CartValidationResponse {
  items: CartValidationItem[];
  summary: CartValidationSummary;
  isValid: boolean;
  errors: string[];
}

export const cartService = {
  createSession: async (email: string): Promise<{ email: string }> => {
    return apiClient.post<{ email: string }>("/cart/session", { email });
  },

  clearSession: async (): Promise<null> => {
    return apiClient.post<null>("/cart/session/clear", {});
  },

  validateCart: async (): Promise<CartValidationResponse> => {
    return apiClient.get<CartValidationResponse>("/cart/validate");
  },

  addToCart: async (item: CartItemInput): Promise<{ email: string; itemCount: number }> => {
    return apiClient.post<{ email: string; itemCount: number }>("/cart", { item });
  },

  removeFromCart: async (sku: string): Promise<{ email: string; itemCount: number }> => {
    return apiClient.delete<{ email: string; itemCount: number }>("/cart", {
      body: JSON.stringify({ sku }),
    });
  },
};

export default cartService;
