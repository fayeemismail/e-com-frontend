import { OrderResponse, OrderItem } from "../api/order.service";
import { AdminOrder } from "@/types/admin/types";

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export class AdminOrderMapper {
  static toAdminOrder(bo: OrderResponse): AdminOrder {
    const items = (bo.items || []).map((item: OrderItem) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
      transactionType: item.transactionType || "buy",
    }));

    const hasRental = items.some((item) => item.transactionType === "rent");

    return {
      id: bo.orderId,
      customer: bo.customerInfo?.name || "Guest",
      email: bo.email,
      date: formatDate(bo.createdAt),
      items,
      total: bo.pricingSummary?.totalAmount || 0,
      paymentMethod: (bo.paymentMethod || "cod").toUpperCase(),
      paymentStatus: bo.paymentStatus || "pending",
      orderStatus: bo.orderStatus || "pending",
      rentalReturnStatus: bo.rentalReturnStatus || "n/a",
      hasRental,
      address: bo.shippingAddress
        ? `${bo.shippingAddress.street}, ${bo.shippingAddress.city}, ${bo.shippingAddress.state} ${bo.shippingAddress.zipCode}, ${bo.shippingAddress.country}`
        : "No address",
    };
  }

  static toAdminOrderList(orders: OrderResponse[]): AdminOrder[] {
    return (orders || []).map((o) => this.toAdminOrder(o));
  }
}
