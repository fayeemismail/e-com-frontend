import { apiClient } from "./api-client";

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CheckoutPayload {
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: "cod" | "card" | "upi" | "paypal";
}

export interface OrderItem {
  sku: string;
  image:string;
  name: string;
  quantity: number;
  transactionType: "buy" | "rent";
  price: number;
  rentalDurationDays?: number;
  securityDeposit?: number;
}

export interface OrderResponse {
  orderId: string;
  email: string;
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  pricingSummary: {
    subtotal: number;
    totalSecurityDeposits: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
  };
  orderStatus: string;
  paymentStatus: string;
  rentalReturnStatus: string;
  paymentMethod: "cod" | "card" | "upi" | "paypal";
  transactionId?: string;
  createdAt: string;
}

export const orderService = {
  /**
   * Place an order from the active cart session
   */
  createOrder: async (payload: CheckoutPayload): Promise<OrderResponse> => {
    return apiClient.post<OrderResponse>("/orders", payload);
  },

  /**
   * Fetch all orders for the current guest email session
   */
  getOrders: async (): Promise<OrderResponse[]> => {
    return apiClient.get<OrderResponse[]>("/orders");
  },

  /**
   * Fetch a specific order details by ID
   */
  getOrder: async (orderId: string): Promise<OrderResponse> => {
    return apiClient.get<OrderResponse>(`/orders/${orderId}`);
  },
};

export default orderService;
