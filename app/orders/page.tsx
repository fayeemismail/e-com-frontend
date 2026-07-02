"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { orderService, type OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";

const ACCENT = "#c27c5a";

// ── Status dot ────────────────────────────────────────────────────
function statusTone(status: string) {
  const s = status.toLowerCase();
  if (s === "cancelled") return { color: "#c94f4f", label: "Cancelled" };
  if (s === "delivered") return { color: "#3f7a4e", label: "Delivered" };
  if (s === "shipped") return { color: ACCENT, label: "Shipped" };
  if (s === "confirmed") return { color: "#1a1a1a", label: "Confirmed" };
  return { color: "#9a9a94", label: "Pending" };
}

function StatusIndicator({ status }: { status: string }) {
  const { color, label } = statusTone(status);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-[10px] tracking-[0.14em] uppercase"
        style={{ color: status.toLowerCase() === "pending" ? "#9a9a94" : "#1a1a1a" }}
      >
        {label}
      </span>
    </span>
  );
}

// ── Timeline tracker ──────────────────────────────────────────────
const TRACK_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

function getTrackIndex(status: string) {
  const s = status.toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped") return 2;
  if (s === "confirmed") return 1;
  if (s === "cancelled") return -1;
  return 0;
}

function OrderTracker({ status }: { status: string }) {
  const idx = getTrackIndex(status);
  if (idx === -1) {
    return (
      <p className="text-[11px] text-[#c94f4f] tracking-wide">
        This order was cancelled.
      </p>
    );
  }
  return (
    <div className="flex items-center">
      {TRACK_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-1.75 h-1.75 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: i <= idx ? ACCENT : "#e2e0db",
              }}
            />
            <span
              className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${
                i <= idx ? "text-[#1a1a1a]" : "text-[#c4c2bc]"
              }`}
            >
              {step}
            </span>
          </div>
          {i < TRACK_STEPS.length - 1 && (
            <div
              className="flex-1 h-px mx-2 mb-4.5 transition-colors duration-300"
              style={{ backgroundColor: i < idx ? ACCENT : "#eeece7" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Single order card ───────────────────────────────────────────
function OrderCard({ order }: { order: OrderResponse }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-[#e8e6e2]">
      {/* Header */}
      <button
        onClick={() => setExpanded((o) => !o)}
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

      {/* Tracker */}
      <div className="px-5 sm:px-7 pb-5 pt-1 border-t border-[#f2f0eb]">
        <OrderTracker status={order.orderStatus} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#e8e6e2] px-5 sm:px-7 py-6 space-y-7">
          {/* Items */}
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

          {/* Shipping + Payment + Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 pt-6 border-t border-[#f2f0eb]">
            <div>
              <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">
                Shipped to
              </p>
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

            <div>
              <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">
                Payment
              </p>
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

            <div>
              <p className="text-[9px] tracking-[0.16em] uppercase text-[#9a9a94] mb-2">
                Summary
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[12px] text-[#9a9a94]">
                  <span>Subtotal</span>
                  <span>₹{order.pricingSummary.subtotal.toFixed(2)}</span>
                </div>
                {order.pricingSummary.totalSecurityDeposits > 0 && (
                  <div className="flex justify-between text-[12px] text-[#9a9a94]">
                    <span>Refundable deposits</span>
                    <span>₹{order.pricingSummary.totalSecurityDeposits.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px] text-[#1a1a1a] pt-1.5 mt-1.5 border-t border-[#f2f0eb]">
                  <span className="font-serif font-light">Total</span>
                  <span>₹{order.pricingSummary.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-10 pb-6 border-b border-[#e8e6e2] flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1.5">
            Account
          </p>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
            My Orders
          </h1>
        </div>
        {!loading && !error && orders.length > 0 && (
          <p className="text-[11px] tracking-[0.08em] text-[#9a9a94]">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="px-5 sm:px-8 md:px-12 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin h-4 w-4 text-[#9a9a94]" strokeWidth={1.5} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[13px] text-[#5a5a55] font-light mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] bg-transparent cursor-pointer pb-px"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={30} strokeWidth={1} className="text-[#d8d5cf] mb-5" />
            <h2 className="text-lg font-light font-serif text-[#1a1a1a] mb-2">
              No orders yet
            </h2>
            <p className="text-[12px] text-[#9a9a94] tracking-wide mb-8 max-w-xs">
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

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="max-w-4xl space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}