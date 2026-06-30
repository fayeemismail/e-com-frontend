export interface AdminOrderItem {
  name: string;
  qty: number;
  price: number;
  transactionType: "buy" | "rent";
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: AdminOrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  rentalReturnStatus: string;
  hasRental: boolean;
  address: string;
}
