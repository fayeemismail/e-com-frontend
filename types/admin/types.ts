export interface AdminOrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  transactionType: "buy" | "rent";
  image?: string;
  rentalDurationDays?: number;
  securityDeposit?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PricingSummary {
  subtotal: number;
  totalSecurityDeposits: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  date: string;
  items: AdminOrderItem[];
  pricingSummary: PricingSummary;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  rentalReturnStatus: string;
  hasRental: boolean;
  address: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  transactionId?: string;
}
