"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";
import { orderService, type OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";

// ── Status badge ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-amber-50   text-amber-700  border-amber-200",
  confirmed:  "bg-blue-50    text-blue-700   border-blue-200",
  shipped:    "bg-indigo-50  text-indigo-700 border-indigo-200",
  delivered:  "bg-green-50   text-green-700  border-green-200",
  cancelled:  "bg-red-50     text-red-600    border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = STATUS_STYLES[s] ?? "bg-[#f4f1ec] text-[#5a5a55] border-[#e8e4de]";
  return (
    <span className={`inline-block text-[9px] tracking-[0.14em] uppercase border px-2 py-0.5 font-medium ${cls}`}>
      {status}
    </span>
  );
}

// ── Timeline tracker ──────────────────────────────────────────────
const TRACK_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

function getTrackIndex(status: string) {
  const s = status.toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped")   return 2;
  if (s === "confirmed") return 1;
  if (s === "cancelled") return -1;
  return 0; // pending
}

function OrderTracker({ status }: { status: string }) {
  const idx = getTrackIndex(status);
  if (idx === -1) {
    return (
      <p className="text-xs text-red-500 tracking-wide mt-3">
        This order was cancelled.
      </p>
    );
  }
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {TRACK_STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                  i <= idx
                    ? "border-[#1a1a1a] bg-[#1a1a1a]"
                    : "border-[#ddd] bg-white"
                }`}
              >
                {i <= idx && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 6 4.5 10 11 2" />
                  </svg>
                )}
              </div>
              <span className={`text-[9px] tracking-[0.08em] uppercase mt-1 whitespace-nowrap ${i <= idx ? "text-[#1a1a1a]" : "text-[#bbb]"}`}>
                {step}
              </span>
            </div>
            {i < TRACK_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-3.5 transition-colors duration-300 ${i < idx ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single order card ─────────────────────────────────────────────
function OrderCard({ order }: { order: OrderResponse }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-[#e8e6e2] overflow-hidden">
      {/* Header */}
      <div className="bg-[#faf9f7] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
          <div>
            <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">Order</p>
            <p className="text-xs font-mono text-[#1a1a1a] mt-0.5 font-medium">{order.orderId}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">Placed</p>
            <p className="text-xs text-[#1a1a1a] mt-0.5">{date}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">Total</p>
            <p className="text-xs text-[#1a1a1a] mt-0.5 font-medium">
              ${order.pricingSummary.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} />
          <button
            onClick={() => setExpanded((o) => !o)}
            className="bg-transparent border-none cursor-pointer p-0 text-[#9a9a94] hover:text-[#1a1a1a] transition-colors"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Tracker — always visible */}
      <div className="px-5 sm:px-6 pb-4 border-t border-[#f0eeea]">
        <OrderTracker status={order.orderStatus} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#e8e6e2] px-5 sm:px-6 py-5 space-y-6">
          {/* Items */}
          <div>
            <p className="text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-3">
              Items
            </p>
            <div className="divide-y divide-[#f0eeea]">
              {order.items.map((item) => (
                <div key={item.sku} className="py-3 flex justify-between items-start gap-4 text-xs">
                  <div className="min-w-0">
                    <p className="text-[#1a1a1a] font-light font-serif truncate">{item.name}</p>
                    <p className="text-[9px] text-[#9a9a94] uppercase tracking-wider mt-1">
                      {item.transactionType === "rent"
                        ? `Rent · ${item.rentalDurationDays}d`
                        : "Buy"}{" "}
                      · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#1a1a1a] shrink-0 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#f0eeea]">
            <div>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] mb-1.5">
                Shipped to
              </p>
              <p className="text-xs text-[#5a5a55] leading-relaxed font-light">
                {order.customerInfo.name}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] mb-1.5">
                Payment
              </p>
              <p className="text-xs text-[#5a5a55] font-light">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
              </p>
              <p className={`text-[10px] tracking-wide uppercase mt-1 font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="pt-3 border-t border-[#f0eeea] space-y-1.5">
            <div className="flex justify-between text-xs text-[#9a9a94]">
              <span>Subtotal</span>
              <span>${order.pricingSummary.subtotal.toFixed(2)}</span>
            </div>
            {order.pricingSummary.totalSecurityDeposits > 0 && (
              <div className="flex justify-between text-xs text-[#9a9a94]">
                <span>Refundable deposits</span>
                <span>${order.pricingSummary.totalSecurityDeposits.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#1a1a1a] font-medium pt-2 border-t border-[#f0eeea]">
              <span className="font-serif font-light">Total</span>
              <span>${order.pricingSummary.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .getOrders()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof ApiError || err instanceof Error
            ? err.message
            : "Failed to load orders."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          Account
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          My Orders
        </h1>
      </div>

      <div className="px-5 sm:px-8 md:px-12 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin h-5 w-5 text-[#1a1a1a]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-[#5a5a55] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] bg-transparent cursor-pointer pb-px"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={36} strokeWidth={1.2} className="text-[#ddd] mb-4" />
            <h2 className="text-lg font-light font-serif text-[#1a1a1a] mb-2">
              No orders yet
            </h2>
            <p className="text-xs text-[#9a9a94] tracking-wide mb-8">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              href="/shop"
              className="bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-[#333] transition-colors no-underline"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="max-w-3xl space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}