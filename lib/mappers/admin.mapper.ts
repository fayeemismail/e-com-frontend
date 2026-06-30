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
    const items = (bo.items || []).map((item: OrderItem & { image?: string; sku?: string; rentalDurationDays?: number; securityDeposit?: number }) => ({
      sku: item.sku || "N/A",
      name: item.name,
      qty: item.quantity,
      price: item.price,
      transactionType: item.transactionType || "buy",
      image: item.image,
      rentalDurationDays: item.rentalDurationDays,
      securityDeposit: item.securityDeposit,
    }));

    const hasRental = items.some((item) => item.transactionType === "rent");

    let computedSubtotal = 0;
    let computedDeposits = 0;
    items.forEach((item) => {
      computedSubtotal += item.price * (item.transactionType === "rent" ? (item.rentalDurationDays || 1) : 1) * item.qty;
      if (item.transactionType === "rent" && item.securityDeposit) {
        computedDeposits += item.securityDeposit * item.qty;
      }
    });

    const fallbackPricingSummary = {
      subtotal: computedSubtotal,
      totalSecurityDeposits: computedDeposits,
      tax: 0,
      shippingCost: 0,
      totalAmount: computedSubtotal + computedDeposits,
    };

    const isMissingPricing = !bo.pricingSummary || (bo.pricingSummary.subtotal === 0 && bo.pricingSummary.totalAmount === 0 && bo.pricingSummary.totalSecurityDeposits === 0);

    return {
      id: bo.orderId,
      customer: bo.customerInfo?.name || "Guest",
      email: bo.email,
      phone: bo.customerInfo?.phone,
      date: formatDate(bo.createdAt),
      items,
      pricingSummary: isMissingPricing ? fallbackPricingSummary : bo.pricingSummary,
      total: bo.pricingSummary?.totalAmount || (computedSubtotal + computedDeposits),
      paymentMethod: (bo.paymentMethod || "cod").toUpperCase(),
      paymentStatus: bo.paymentStatus || "pending",
      orderStatus: bo.orderStatus || "pending",
      rentalReturnStatus: bo.rentalReturnStatus || "n/a",
      hasRental,
      address: bo.shippingAddress
        ? `${bo.shippingAddress.street}, ${bo.shippingAddress.city}, ${bo.shippingAddress.state} ${bo.shippingAddress.zipCode}, ${bo.shippingAddress.country}`
        : "No address",
      shippingAddress: bo.shippingAddress
        ? {
            street: bo.shippingAddress.street,
            city: bo.shippingAddress.city,
            state: bo.shippingAddress.state,
            zipCode: bo.shippingAddress.zipCode,
            country: bo.shippingAddress.country,
          }
        : undefined,
      billingAddress: bo.billingAddress
        ? {
            street: bo.billingAddress.street,
            city: bo.billingAddress.city,
            state: bo.billingAddress.state,
            zipCode: bo.billingAddress.zipCode,
            country: bo.billingAddress.country,
          }
        : undefined,
      transactionId: bo.transactionId,
    };
  }

  static toAdminOrderList(orders: OrderResponse[]): AdminOrder[] {
    return (orders || []).map((o) => this.toAdminOrder(o));
  }
}
