"use client";

import Image from "next/image";
import { Loader2, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import type { ShippingData } from "./ShippingStep";

type CartItem = {
  sku: string;
  name: string;
  quantity: number;
  transactionType: "buy" | "rent";
  price: number;
  rentalDurationDays?: number;
  itemTotal: number;
  itemDepositTotal: number;
  image?: string;
};

type Props = {
  items: CartItem[];
  shipping: ShippingData;
  paymentMethod: string;
  subtotal: number;
  securityDeposits: number;
  total: number;
  isPlacing: boolean;
  orderError: string | null;
  onBack: () => void;
  onEditShipping: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";

const TRUST_BADGES = [
  { label: "SSL encrypted", Icon: ShieldCheck },
  { label: "Free 30-day returns", Icon: RefreshCw },
  { label: "Authenticity guaranteed", Icon: Truck },
];

export default function ReviewStep({
  items,
  shipping,
  paymentMethod,
  total,
  isPlacing,
  orderError,
  onBack,
  onEditShipping,
  onEditPayment,
  onPlaceOrder,
}: Props) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
        Step 3 of 3
      </p>
      <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">
        Review Order
      </h2>

      {/* Items */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">
          Items ({items.length})
        </p>
        <div className="divide-y divide-[#e8e6e2]">
          {items.map((item) => (
            <div key={item.sku} className="py-5 flex items-center gap-4">
              <div className="w-14 h-16 bg-[#f5f4f1] border border-[#e8e6e2] overflow-hidden shrink-0 relative">
                <Image
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-light font-serif text-[#1a1a1a] tracking-wide">
                  {item.name}
                </p>
                <p className="text-[10px] text-[#9a9a94] tracking-wider uppercase mt-1">
                  {item.transactionType === "rent"
                    ? `Rent / ${item.rentalDurationDays} days`
                    : "Buy"}{" "}
                  · Qty {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#1a1a1a] font-medium">
                  ${item.itemTotal.toFixed(2)}
                </p>
                {item.transactionType === "rent" && item.itemDepositTotal > 0 && (
                  <p className="text-[9px] text-[#9a9a94] mt-0.5">
                    ${item.itemDepositTotal.toFixed(2)} dep.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping + Payment summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">
              Ships to
            </p>
            <button
              onClick={onEditShipping}
              className="text-[10px] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors bg-transparent border-none cursor-pointer"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#1a1a1a] leading-relaxed tracking-wide font-light">
            {shipping.firstName} {shipping.lastName}
            <br />
            {shipping.addressLine1}
            {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}
            <br />
            {shipping.city}, {shipping.state} {shipping.postalCode},{" "}
            {shipping.country}
          </p>
        </div>
        <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">
              Payment
            </p>
            <button
              onClick={onEditPayment}
              className="text-[10px] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors bg-transparent border-none cursor-pointer"
            >
              Edit
            </button>
          </div>
          <p className="text-xs text-[#1a1a1a] tracking-wide font-light">
            {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          disabled={isPlacing}
          className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors bg-transparent cursor-pointer disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isPlacing}
          className="grow sm:grow-0 bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors cursor-pointer disabled:bg-[#9a9a94] disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPlacing ? (
            <>
              <Loader2 className="animate-spin h-3.5 w-3.5" />
              Processing...
            </>
          ) : (
            `Place Order · $${total.toFixed(2)}`
          )}
        </button>
      </div>

      {orderError && (
        <div className="mt-4 p-4 border border-[#d32f2f]/20 bg-[#d32f2f]/5 text-[#d32f2f] text-xs font-light tracking-wide">
          {orderError}
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {TRUST_BADGES.map(({ label, Icon }) => (
          <p
            key={label}
            className="text-[10px] tracking-widest text-[#9a9a94] flex items-center gap-1.5 uppercase font-light"
          >
            <Icon className="w-3.5 h-3.5 text-[#1a1a1a]" />
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}