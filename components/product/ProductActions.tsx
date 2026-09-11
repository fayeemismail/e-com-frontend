"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/shop/types";
import type { BackendSku } from "@/lib/api/product.service";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format.util";
import { getUnitLabel } from "@/lib/utils/unit.util";

export default function ProductActions({ product }: { product: Product }) {
  const { cart, addToCart, isAddingToCart, updateQuantity, removeFromCart, isSyncing } = useCart();

  // 1. Set the initial selected SKU
  const [selectedSku, setSelectedSku] = useState<BackendSku | null>(
    product.skus && product.skus.length > 0 ? product.skus[0] : null
  );

  // 2. Track rental duration
  const [selectedDuration, setSelectedDuration] = useState<"7_days" | "30_days" | "90_days">("7_days");

  // 3. Track local quantity before adding
  const [localQty, setLocalQty] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const busy = isProcessing || isAddingToCart || isSyncing;

  // 4. Derive current values based on selected SKU
  const currentSku = selectedSku || (product.skus && product.skus.length > 0 ? product.skus[0] : null);
  const currentSkuString = currentSku?.sku || product.sku || String(product.id);
  const selectedType = currentSku?.type || "buy";
  const basePrice = (currentSku
    ? (selectedType === "buy" ? currentSku.price : currentSku.rentPricePerDay)
    : product.price) || 0;

  const stock = currentSku?.stock ?? product.stock;
  const unitLabel = getUnitLabel(product as any, currentSku || undefined);

  // Calculate transaction price based on selected period for rental
  const calculatedPrice = selectedType === "buy"
    ? basePrice
    : selectedDuration === "7_days"
    ? basePrice * 7
    : selectedDuration === "30_days"
    ? basePrice * 30
    : basePrice * 90;

  // Check if current SKU & transaction configuration is already in the cart
  const cartItem = cart?.items.find((item) => {
    if (item.sku !== currentSkuString) return false;
    if (selectedType === "rent") {
      const days = selectedDuration === "7_days" ? 7 : selectedDuration === "30_days" ? 30 : 90;
      return item.transactionType === "rent" && item.rentalDurationDays === days;
    }
    return item.transactionType === "buy";
  });
  const inCartQty = cartItem?.quantity || 0;

  // Increment in-cart quantity
  const handleIncrementInCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentSkuString || busy) return;
    if (stock > 0 && inCartQty >= stock) return;

    try {
      setIsProcessing(true);
      await updateQuantity(currentSkuString, inCartQty + 1);
    } catch (err) {
      console.error("Failed to increment quantity in cart:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Decrement in-cart quantity or remove
  const handleDecrementInCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentSkuString || busy) return;

    try {
      setIsProcessing(true);
      if (inCartQty > 1) {
        await updateQuantity(currentSkuString, inCartQty - 1);
      } else {
        await removeFromCart(currentSkuString);
      }
    } catch (err) {
      console.error("Failed to decrement quantity in cart:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Local counter adjust when not in cart
  const handleLocalDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalQty((q) => Math.max(1, q - 1));
  };

  const handleLocalIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const maxStock = stock > 0 ? stock : 99;
    setLocalQty((q) => Math.min(maxStock, q + 1));
  };

  // Add to Cart
  const handleActionClick = async () => {
    if (!currentSkuString || busy || stock === 0) return;

    const durationDays = selectedType === "rent"
      ? (selectedDuration === "7_days" ? 7 : selectedDuration === "30_days" ? 30 : 90)
      : undefined;

    try {
      setIsProcessing(true);
      await addToCart({
        sku: currentSkuString,
        quantity: Math.max(1, localQty),
        transactionType: selectedType,
        rentalDurationDays: durationDays,
      });
      setLocalQty(1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

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
                  onClick={() => {
                    setSelectedSku(s);
                    setLocalQty(1);
                  }}
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
                        ₹{formatPrice(s.price)}
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="text-[13px] font-light tracking-[0.04em] text-[#1a1a1a]">
                          ₹{formatPrice(s.rentPricePerDay)} <span className="text-[10px] text-[#9a9a94] lowercase tracking-normal">/ day</span>
                        </span>
                        {s.securityDeposit && (
                          <span className="text-[9px] text-[#9a9a94] tracking-normal mt-0.5">
                            +₹{formatPrice(s.securityDeposit)} deposit
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

      {/* Stock status & In-Cart indicator */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p
          className={`text-[11px] tracking-[0.06em] m-0 ${
            stock === 0 ? "text-red-600 font-medium" : stock < 10 ? "text-orange-600" : "text-[#9a9a94]"
          }`}
        >
          {stock === 0 ? "Out of Stock" : stock < 10 ? `Only ${stock} left` : "In Stock"}
        </p>

        {inCartQty > 0 && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f5f4f0] text-[#1a1a1a] rounded-xs text-[10px] sm:text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4a882]" />
            <span>
              In Cart: <strong className="text-[#1a1a1a] font-semibold">{inCartQty}</strong>
              {unitLabel ? ` ${unitLabel}` : ""}
            </span>
          </div>
        )}
      </div>

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
                  onClick={() => {
                    setSelectedDuration(opt.duration as "7_days" | "30_days" | "90_days");
                    setLocalQty(1);
                  }}
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

      {/* ── ACTION SECTION (COUNTER + CTA + WISHLIST) ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          {/* Main Action Group: Counter + Primary CTA */}
          <div className="flex items-stretch gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Quantity Counter */}
            <div className="flex items-center justify-between border border-[#1a1a1a] rounded-sm bg-white h-12 px-1 w-28 sm:w-32 shrink-0 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <button
                type="button"
                onClick={inCartQty > 0 ? handleDecrementInCart : handleLocalDecrement}
                disabled={busy || (inCartQty > 0 ? false : localQty <= 1)}
                className="w-8 sm:w-9 h-10 flex items-center justify-center text-sm sm:text-base text-[#1a1a1a] hover:bg-[#f5f4f0] rounded-xs transition-colors cursor-pointer border-none bg-transparent select-none disabled:opacity-25"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="flex-1 text-center text-[12px] sm:text-[13px] font-mono font-medium text-[#1a1a1a] select-none">
                {inCartQty > 0 ? inCartQty : localQty}
              </span>
              <button
                type="button"
                onClick={inCartQty > 0 ? handleIncrementInCart : handleLocalIncrement}
                disabled={busy || (inCartQty > 0 ? (stock > 0 && inCartQty >= stock) : (stock > 0 && localQty >= stock))}
                className="w-8 sm:w-9 h-10 flex items-center justify-center text-sm sm:text-base text-[#1a1a1a] hover:bg-[#f5f4f0] rounded-xs transition-colors cursor-pointer border-none bg-transparent select-none disabled:opacity-25"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Primary Action Button (Direct Cart View if already in cart, or Add with counter) */}
            {inCartQty > 0 ? (
              <Link
                href="/cart"
                className="flex-1 min-w-0 h-12 bg-[#1a1a1a] hover:bg-black text-white text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.16em] uppercase border border-[#1a1a1a] font-light rounded-sm flex items-center justify-between px-3 sm:px-4.5 transition-colors no-underline select-none shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4a882] shrink-0 animate-pulse" />
                  <span className="truncate">In Cart · View Bag</span>
                </div>
                <span className="font-mono text-[#c4a882] font-semibold text-[11px] sm:text-[12px] shrink-0 ml-2">
                  ₹{formatPrice(calculatedPrice * inCartQty)}
                </span>
              </Link>
            ) : (
              <button
                disabled={stock === 0 || busy}
                onClick={handleActionClick}
                className="flex-1 min-w-0 h-12 bg-[#1a1a1a] text-white text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase border border-[#1a1a1a] 
                cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-35 
                disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a] disabled:hover:text-white font-light rounded-sm flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 select-none shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                {stock === 0 ? (
                  "Out of Stock"
                ) : busy ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Adding...</span>
                  </>
                ) : selectedType === "buy" ? (
                  <span className="truncate">
                    Add to Cart — ₹{formatPrice(calculatedPrice * localQty)}
                  </span>
                ) : (
                  <span className="truncate">
                    Add (Rent) — ₹{formatPrice(calculatedPrice * localQty)}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Desktop Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`hidden sm:flex h-12 w-12 border transition-colors duration-200 cursor-pointer items-center justify-center shrink-0 rounded-sm ${
              isWishlisted
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                : "border-[#e8e6e2] text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white bg-white"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Mobile Wishlist Button (Clean, full-width secondary action) */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`sm:hidden w-full h-11 border transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 rounded-sm text-[10px] tracking-[0.14em] uppercase font-light ${
              isWishlisted
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                : "border-[#e8e6e2] text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#fafaf9] bg-white"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
          </button>
        </div>

        {/* Security deposit confirmation notice for rental */}
        {selectedType === "rent" && selectedSku?.securityDeposit && (
          <p className="text-[10px] text-[#9a9a94] text-center sm:text-left tracking-[0.02em]">
            * Price includes a refundable security deposit of{" "}
            <span className="text-[#1a1a1a] font-medium">₹{formatPrice(selectedSku.securityDeposit)}</span>
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