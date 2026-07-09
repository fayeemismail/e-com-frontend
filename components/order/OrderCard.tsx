import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { OrderResponse } from "@/lib/api/order.service";
import { StatusIndicator } from "./StatusIndicator"; 
import { OrderTracker } from "./OrderTracker"; 

// One order = one card. Clicking the header row toggles the expanded details
// (items, shipping address, payment info, price breakdown).
export function OrderCard({ order }: { order: OrderResponse }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-[#e8e6e2]">
      <CardHeader
        order={order}
        date={date}
        expanded={expanded}
        onToggle={() => setExpanded((o) => !o)}
      />

      <div className="px-5 sm:px-7 pb-5 pt-1 border-t border-[#f2f0eb]">
        <OrderTracker status={order.orderStatus} />
      </div>

      {expanded && <CardDetails order={order} />}
    </div>
  );
}

// ── Collapsed row: order id / date / total / status / expand arrow ──────────
function CardHeader({
  order,
  date,
  expanded,
  onToggle,
}: {
  order: OrderResponse;
  date: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-7 py-5 bg-transparent border-none cursor-pointer text-left"
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 min-w-0">
        <div>
          <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1">Order</p>
          <p className="text-[13px] font-mono text-[#1a1a1a]">{order.orderId}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1">Placed</p>
          <p className="text-[13px] text-[#1a1a1a]">{date}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1">Total</p>
          <p className="text-[13px] text-[#1a1a1a]">
            ₹{order.pricingSummary.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <StatusIndicator status={order.orderStatus} />
        <span className="text-[#9a9a94]">
          {expanded ? <ChevronUp size={15} strokeWidth={1.4} /> : <ChevronDown size={15} strokeWidth={1.4} />}
        </span>
      </div>
    </button>
  );
}

// ── Expanded section: items list + shipping / payment / price summary ───────
function CardDetails({ order }: { order: OrderResponse }) {
  return (
    <div className="border-t border-[#e8e6e2] px-5 sm:px-7 py-6 space-y-7">
      <ItemsList order={order} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 pt-6 border-t border-[#f2f0eb]">
        <ShippingInfo order={order} />
        <PaymentInfo order={order} />
        <PriceSummary order={order} />
      </div>
    </div>
  );
}

function ItemsList({ order }: { order: OrderResponse }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-4">
        Items — {order.items.length}
      </p>
      <div className="divide-y divide-[#f2f0eb]">
        {order.items.map((item) => (
          <div key={item.sku} className="flex gap-4 py-4 first:pt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#f5f4f1] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[13px] text-[#1a1a1a] font-light font-serif leading-snug">
                {item.name}
              </p>
              <p className="text-[10px] text-[#9a9a94] uppercase tracking-wider mt-1.5">
                {item.transactionType === "rent"
                  ? `Rent · ${item.rentalDurationDays} days`
                  : "Purchase"}{" "}
                · Qty {item.quantity}
              </p>
            </div>

            <div className="text-right shrink-0 flex flex-col justify-center">
              <p className="text-[13px] text-[#1a1a1a]">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
              {item.securityDeposit && item.securityDeposit > 0 && (
                <p className="text-[10px] text-[#9a9a94] mt-0.5">
                  + ₹{item.securityDeposit} deposit
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShippingInfo({ order }: { order: OrderResponse }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">Shipped to</p>
      <p className="text-[12px] text-[#5a5a55] leading-relaxed font-light">
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
  );
}

function PaymentInfo({ order }: { order: OrderResponse }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">Payment</p>
      <p className="text-[12px] text-[#5a5a55] font-light">
        {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
      </p>
      <p
        className="text-[10px] tracking-wide uppercase mt-1.5"
        style={{ color: order.paymentStatus === "paid" ? "#3f7a4e" : "#b8863f" }}
      >
        {order.paymentStatus}
      </p>
    </div>
  );
}

function PriceSummary({ order }: { order: OrderResponse }) {
  const { subtotal, totalSecurityDeposits, totalAmount } = order.pricingSummary;

  return (
    <div>
      <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">Summary</p>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[12px] text-[#9a9a94]">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {totalSecurityDeposits > 0 && (
          <div className="flex justify-between text-[12px] text-[#9a9a94]">
            <span>Refundable deposits</span>
            <span>₹{totalSecurityDeposits.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[13px] text-[#1a1a1a] pt-1.5 mt-1.5 border-t border-[#f2f0eb]">
          <span className="font-serif font-light">Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}