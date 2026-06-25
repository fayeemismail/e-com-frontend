"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types";
import type { BackendSku } from "@/lib/api/product.service";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, isAddingToCart } = useCart();

  // 1. Set the initial selected SKU
  const [selectedSku, setSelectedSku] = useState<BackendSku | null>(
    product.skus && product.skus.length > 0 ? product.skus[0] : null
  );

  // 2. Track rental duration
  const [selectedDuration, setSelectedDuration] = useState<"7_days" | "30_days" | "90_days">("7_days");

  const handleActionClick = () => {
    if (!selectedSku) return;
    
    const durationDays = selectedType === "rent" 
      ? (selectedDuration === "7_days" ? 7 : selectedDuration === "30_days" ? 30 : 90)
      : undefined;

    addToCart({
      sku: selectedSku.sku,
      quantity: 1,
      transactionType: selectedType,
      rentalDurationDays: durationDays,
    });
  };

  // 3. Derive current values based on selected SKU
  const selectedType = selectedSku?.type || "buy";
  const price = selectedSku
    ? (selectedType === "buy" ? selectedSku.price : selectedSku.rentPricePerDay)
    : product.price;

  const stock = selectedSku?.stock ?? product.stock;

  // Calculate transaction price based on selected period for rental
  const calculatedPrice = selectedType === "buy"
    ? price
    : selectedDuration === "7_days"
    ? (price || 0) * 7
    : selectedDuration === "30_days"
    ? (price || 0) * 30
    : (price || 0) * 90;

  return (
    <div className="space-y-6">
      {/* ── SKU SELECTION PANEL ── */}
      {product.skus && product.skus.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] font-serif font-medium">
            Select Option / Format
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {product.skus.map((s) => {
              const isSelected = selectedSku?.sku === s.sku;
              // Format labels cleanly based on attributes (e.g. Format, Color, Size, etc.)
              const attributesList = s.attributes
                ? Object.entries(s.attributes)
                    .map(([, v]) => v)
                    .filter(Boolean)
                : [];
              
              const label = attributesList.length > 0 
                ? attributesList.join(" / ") 
                : s.sku;

              return (
                <button
                  key={s.sku}
                  type="button"
                  onClick={() => setSelectedSku(s)}
                  className={`w-full text-left p-3.5 border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 rounded-sm ${
                    isSelected
                      ? "border-[#1a1a1a] bg-[#fafaf9] shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                      : "border-[#e8e6e2] bg-white hover:border-[#aaa]"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[12px] font-medium tracking-[0.04em] ${
                          isSelected ? "text-[#1a1a1a]" : "text-[#5a5a55]"
                        }`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded font-mono font-semibold ${
                          s.type === "buy"
                            ? "bg-[#edf7ed] text-[#1e4620]"
                            : "bg-[#e8f4fd] text-[#0d3c61]"
                        }`}
                      >
                        {s.type === "buy" ? "Buy" : "Rent"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {s.type === "buy" ? (
                      <span className="text-[13px] font-light tracking-[0.04em] text-[#1a1a1a]">
                        ${s.price}
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-[13px] font-light tracking-[0.04em] text-[#1a1a1a]">
                          ${s.rentPricePerDay} <span className="text-[10px] text-[#9a9a94] lowercase tracking-normal">/ day</span>
                        </span>
                        {s.securityDeposit && (
                          <span className="text-[9px] text-[#9a9a94] tracking-normal mt-0.5">
                            +${s.securityDeposit} deposit
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      <p
        className={`text-[11px] tracking-[0.06em] ${
          stock === 0 ? "text-red-600 font-medium" : stock < 10 ? "text-orange-600" : "text-[#9a9a94]"
        }`}
      >
        {stock === 0 ? "Out of Stock" : stock < 10 ? `Only ${stock} left` : "In Stock"}
      </p>

      {/* Rent Duration Selector (Pills) */}
      {selectedType === "rent" && (
        <div className="space-y-2">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] font-serif font-medium">
            Select Rental Period
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { duration: "7_days", label: "1 Week" },
              { duration: "30_days", label: "1 Month" },
              { duration: "90_days", label: "3 Months" },
            ].map((opt) => {
              const isSelected = selectedDuration === opt.duration;
              return (
                <button
                  key={opt.duration}
                  type="button"
                  onClick={() => setSelectedDuration(opt.duration as "7_days" | "30_days" | "90_days")}
                  className={`text-[11px] py-2.5 border bg-transparent cursor-pointer transition-all duration-150 rounded-sm font-light tracking-[0.06em] ${
                    isSelected
                      ? "border-[#1a1a1a] text-[#1a1a1a] bg-[#fafaf9] font-medium"
                      : "border-[#e8e6e2] text-[#9a9a94] hover:border-[#aaa] hover:text-[#1a1a1a]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ACTION SECTION ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled={stock === 0 || isAddingToCart}
            onClick={handleActionClick}
            className="flex-1 py-3.5 bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] 
            cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-35 
            disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a] disabled:hover:text-white font-light rounded-sm flex items-center justify-center gap-2"
          >
            {stock === 0 ? (
              "Out of Stock"
            ) : isAddingToCart ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </>
            ) : selectedType === "buy" ? (
              `Add to Cart — $${calculatedPrice}`
            ) : (
              `Add to Cart (Rent) — $${calculatedPrice}`
            )}
          </button>
          
          <button
            onClick={() => {}}
            aria-label="Toggle Wishlist"
            className="px-4 py-3.5 border border-[#e8e6e2] text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white 
            cursor-pointer transition-colors duration-200 bg-transparent flex items-center justify-center shrink-0 rounded-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Security deposit confirmation notice for rental */}
        {selectedType === "rent" && selectedSku?.securityDeposit && (
          <p className="text-[10px] text-[#9a9a94] text-center sm:text-left tracking-[0.02em]">
            * Price includes a refundable security deposit of{" "}
            <span className="text-[#1a1a1a] font-medium">${selectedSku.securityDeposit}</span>
          </p>
        )}
      </div>

      <div className="h-px bg-[#ebebeb]" />

      {/* Shipping / Returns info */}
      <div className="space-y-2">
        {product.shipping.freeShipping && (
          <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Free shipping · {product.shipping.estimatedDelivery}
          </div>
        )}
        <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
          </svg>
          {product.returnPolicy}
        </div>
        <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {product.warranty}
        </div>
      </div>
    </div>
  );
}