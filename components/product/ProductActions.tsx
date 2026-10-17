"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
import type { Product } from "@/types/shop/types";
import type { BackendSku } from "@/lib/api/product.service";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format.util";
import { getUnitLabel } from "@/lib/utils/unit.util";

export default function ProductActions({ product }: { product: Product }) {
  const { cart, addToCart, isAddingToCart, updateQuantity, removeFromCart, isSyncing } = useCart();

  // 1. Initial selected SKU
  const [selectedSku, setSelectedSku] = useState<BackendSku | null>(
    product.skus && product.skus.length > 0 ? product.skus[0] : null
  );

  // 2. Rental duration
  const [selectedDuration, setSelectedDuration] = useState<"7_days" | "30_days" | "90_days">("7_days");

  // 3. Local quantity counter
  const [localQty, setLocalQty] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const busy = isProcessing || isAddingToCart || isSyncing;

  // 4. Derived values based on selected SKU
  const currentSku = selectedSku || (product.skus && product.skus.length > 0 ? product.skus[0] : null);
  const currentSkuString = currentSku?.sku || product.sku || String(product.id);
  const selectedType = currentSku?.type || "buy";
  const basePrice = (currentSku
    ? (selectedType === "buy" ? currentSku.price : currentSku.rentPricePerDay)
    : product.price) || 0;

  const stock = currentSku?.stock ?? product.stock ?? 50;
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

  // Stepper handlers
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

  const hasComparePrice = product.compareAtPrice && product.compareAtPrice > calculatedPrice;
  const discountPercent = hasComparePrice
    ? Math.round(((product.compareAtPrice! - calculatedPrice) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="space-y-6 font-nav">
      {/* ── PRICING CARD ── */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-[13px] font-bold text-[#0a1f3d]">SAR</span>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0a1f3d] tracking-tight tabular-nums">
            {formatPrice(calculatedPrice)}
          </span>
          <span className="text-[13px] text-slate-500 font-medium">
            /{unitLabel ? unitLabel.toLowerCase() : "unit"}
          </span>

          {hasComparePrice && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-slate-400 line-through tabular-nums">
                SAR {formatPrice(product.compareAtPrice!)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── SKU / TRANSACTION VARIANT SELECTION ── */}
      {product.skus && product.skus.length > 1 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#0a1f3d]">
              Select Supply Option
            </span>
            <span className="text-[11px] text-slate-500">
              {product.skus.length} options available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.skus.map((s) => {
              const isSelected = selectedSku?.sku === s.sku;
              const sPrice = s.type === "buy" ? s.price : s.rentPricePerDay;
              const sLabel = s.attributes
                ? Object.values(s.attributes).filter(Boolean).join(" · ")
                : s.sku;

              return (
                <button
                  key={s.sku}
                  type="button"
                  onClick={() => {
                    setSelectedSku(s);
                    setLocalQty(1);
                  }}
                  className={`text-left p-3.5 border rounded-xl transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "border-[#0a1f3d] bg-white ring-2 ring-[#0a1f3d]/10 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-[#0a1f3d] truncate">
                      {sLabel || "Standard Supply"}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        s.type === "buy"
                          ? "bg-blue-50 text-[#0f2e5a] border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {s.type === "buy" ? "Direct Buy" : "Rental"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[13px] font-bold text-[#0a1f3d]">
                      SAR {formatPrice(sPrice || 0)}
                      {s.type === "rent" && <span className="text-[10px] text-slate-500 font-normal">/day</span>}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#0a1f3d] text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RENTAL DURATION SELECTOR (IF RENTAL) ── */}
      {selectedType === "rent" && (
        <div className="space-y-2 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#0a1f3d]">
              Choose Consignment Duration
            </span>
            <span className="text-[11px] text-[#00a6e0] font-medium">
              Flexible extension available
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { duration: "7_days", label: "1 Week", days: 7 },
              { duration: "30_days", label: "1 Month", days: 30 },
              { duration: "90_days", label: "3 Months", days: 90 },
            ].map((opt) => {
              const isSelected = selectedDuration === opt.duration;
              return (
                <button
                  key={opt.duration}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(opt.duration as any);
                    setLocalQty(1);
                  }}
                  className={`text-center py-2.5 px-2 rounded-lg border text-[11.5px] font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#0a1f3d] text-white border-[#0a1f3d] shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className={`text-[10px] font-normal ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                    SAR {formatPrice(basePrice * opt.days)}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedSku?.securityDeposit && (
            <p className="text-[11px] text-slate-600 m-0 pt-1">
              * Includes refundable corporate deposit of{" "}
              <strong className="text-[#0a1f3d]">SAR {formatPrice(selectedSku.securityDeposit)}</strong> per unit.
            </p>
          )}
        </div>
      )}

      {/* ── QUANTITY STEPPER & PRIMARY REQUISITION ACTION ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#0a1f3d] bg-white rounded-xl h-11.5 shadow-2xs shrink-0 overflow-hidden">
            <button
              type="button"
              onClick={inCartQty > 0 ? handleDecrementInCart : handleLocalDecrement}
              disabled={busy || (inCartQty > 0 ? false : localQty <= 1)}
              className="w-10 h-full flex items-center justify-center text-[16px] font-semibold text-[#0a1f3d] hover:bg-[#0a1f3d]/8 active:bg-[#0a1f3d]/15 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-10 px-2 h-full flex items-center justify-center text-[13.5px] font-bold tabular-nums text-[#0a1f3d] select-none border-x border-[#0a1f3d]/15 bg-white">
              {inCartQty > 0 ? inCartQty : localQty}
            </span>
            <button
              type="button"
              onClick={inCartQty > 0 ? handleIncrementInCart : handleLocalIncrement}
              disabled={busy || (inCartQty > 0 ? (stock > 0 && inCartQty >= stock) : (stock > 0 && localQty >= stock))}
              className="w-10 h-full flex items-center justify-center text-[16px] font-semibold text-[#0a1f3d] hover:bg-[#0a1f3d]/8 active:bg-[#0a1f3d]/15 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Primary CTA Button */}
          {inCartQty > 0 ? (
            <Link
              href="/cart"
              className="flex-1 min-w-0 h-11.5 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#00a6e0]/40 text-[#0077b6] rounded-xl flex items-center justify-between px-4 sm:px-5 transition-colors no-underline font-semibold shadow-2xs select-none"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-[#00a6e0] shrink-0 animate-pulse" />
                <span className="text-[12.5px] sm:text-[13px] truncate">In requisition ({inCartQty}) · View Cart</span>
              </div>
              <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0a1f3d] shrink-0">
                SAR {formatPrice(calculatedPrice * inCartQty)} →
              </span>
            </Link>
          ) : (
            <button
              type="button"
              disabled={stock === 0 || busy}
              onClick={handleActionClick}
              className="flex-1 min-w-0 h-11.5 bg-[#0a1f3d] hover:bg-[#00a6e0] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2 px-4 transition-all duration-200 font-semibold cursor-pointer border-none shadow-xs disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
              {busy ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <ShoppingCart size={16} strokeWidth={2.2} />
              )}
              <span className="text-[12.5px] sm:text-[13px] truncate">
                Add to requisition cart — SAR {formatPrice(calculatedPrice * localQty)}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlisted((prev) => !prev)}
            aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            className={`w-11.5 h-11.5 rounded-xl border flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs ${
              isWishlisted
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-[#0a1f3d]"
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        </div>

      </div>
    </div>
  );
}