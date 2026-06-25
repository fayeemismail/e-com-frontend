import Link from "next/link";
import type { OrderResponse } from "@/lib/api/order.service";

type Props = { order: OrderResponse };

export default function OrderSuccess({ order }: Props) {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top bar */}
      <div className="border-b border-[#e8e6e2] px-5 sm:px-8 md:px-12 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-light font-serif tracking-widest text-[#1a1a1a] no-underline"
        >
          E-com
        </Link>
        <Link
          href="/"
          className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors no-underline"
        >
          Return to shop
        </Link>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-16 max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#faf9f7] border border-[#e8e6e2] mb-6">
          <svg
            className="w-8 h-8 text-[#c4a882]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <p className="text-[10px] tracking-[0.25em] uppercase text-[#9a9a94] mb-2">
          Thank you for your order
        </p>
        <h1 className="text-3xl font-light font-serif text-[#1a1a1a] tracking-tight mb-3">
          Order Confirmed
        </h1>
        <p className="text-xs text-[#6b6b65] tracking-wide max-w-md mx-auto mb-8 leading-relaxed">
          A confirmation has been sent to{" "}
          <span className="font-medium text-[#1a1a1a]">{order.email}</span>.
        </p>

        {/* Order card */}
        <div className="border border-[#e8e6e2] text-left mb-10 overflow-hidden">
          {/* Card header */}
          <div className="bg-[#faf9f7] px-6 py-4 border-b border-[#e8e6e2] flex flex-wrap justify-between items-center gap-2">
            <div>
              <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">
                Order Reference
              </p>
              <p className="text-sm font-mono font-medium text-[#1a1a1a] mt-0.5">
                {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">
                Status
              </p>
              <span className="inline-block text-[9px] tracking-[0.14em] uppercase bg-[#e8e6e2] text-[#1a1a1a] px-2 py-0.5 mt-0.5 font-medium">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Items */}
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-3 pb-1 border-b border-[#f0eeea] font-semibold">
                Items Purchased
              </p>
              <div className="divide-y divide-[#e8e6e2]/50">
                {order.items.map((item) => {
                  const lineTotal =
                    item.price *
                    item.quantity *
                    (item.transactionType === "rent"
                      ? item.rentalDurationDays || 1
                      : 1);
                  return (
                    <div
                      key={item.sku}
                      className="py-3 flex justify-between items-center gap-4 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-light font-serif text-[#1a1a1a] truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-[#9a9a94] uppercase tracking-wider mt-0.5">
                          {item.transactionType === "rent"
                            ? `Rent / ${item.rentalDurationDays} days`
                            : "Buy"}{" "}
                          · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#1a1a1a] font-medium shrink-0">
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping + Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e8e6e2]/60">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-2 font-semibold">
                  Shipping Address
                </p>
                <p className="text-xs text-[#6b6b65] leading-relaxed font-light">
                  {order.customerInfo.name}
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-2 font-semibold">
                  Payment
                </p>
                <p className="text-xs text-[#6b6b65] font-light">
                  Method:{" "}
                  <span className="uppercase font-medium text-[#1a1a1a]">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </p>
                <p className="text-xs text-[#6b6b65] font-light mt-1">
                  Status:{" "}
                  <span className="capitalize font-medium text-[#1a1a1a]">
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="pt-4 border-t border-[#e8e6e2]/60 space-y-2">
              <div className="flex justify-between text-xs text-[#6b6b65]">
                <span>Subtotal</span>
                <span>${order.pricingSummary.subtotal.toFixed(2)}</span>
              </div>
              {order.pricingSummary.totalSecurityDeposits > 0 && (
                <div className="flex justify-between text-xs text-[#6b6b65]">
                  <span>Refundable Deposits</span>
                  <span>
                    ${order.pricingSummary.totalSecurityDeposits.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#1a1a1a] font-medium pt-2 border-t border-[#e8e6e2]/30">
                <span className="font-serif font-light">Total Paid</span>
                <span>${order.pricingSummary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/orders"
            className="border border-[#1a1a1a] text-[#1a1a1a] text-[11px] tracking-[0.16em] uppercase px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors text-center no-underline"
          >
            View All Orders
          </Link>
          <Link
            href="/"
            className="bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-4 hover:bg-[#333] transition-colors text-center no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}