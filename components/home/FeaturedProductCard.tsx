"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";

interface FeaturedProductCardProps {
  product: DisplayProduct;
}

// Category icon helper (larger crisp icons)
function getCategoryIcon(cat: string) {
  const c = (cat || "").toLowerCase();
  if (c.includes("office") || c.includes("stationery") || c.includes("pen") || c.includes("paper") || c.includes("supply")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }
  if (c.includes("collectible") || c.includes("rare") || c.includes("edition") || c.includes("first")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <path d="M2 9h20" />
        <path d="M10 21l-4-12 4-6" />
        <path d="M14 21l4-12-4-6" />
      </svg>
    );
  }
  if (c.includes("fiction") || c.includes("book") || c.includes("literature") || c.includes("novel") || c.includes("story")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (c.includes("art") || c.includes("design") || c.includes("print")) {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <circle cx="13.5" cy="6.5" r=".7" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".7" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".7" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".7" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    );
  }
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localQty, setLocalQty] = useState(1);
  const [selectedSku, setSelectedSku] = useState<BackendSku | undefined>(product.defaultSku);

  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!selectedSku && product.defaultSku) {
      setSelectedSku(product.defaultSku);
    }
  }, [product.defaultSku, selectedSku]);

  const currentSku = selectedSku || product.defaultSku;
  const unitLabel = getUnitLabel(product, currentSku);
  const currentPrice =
    (currentSku?.type === "buy" ? currentSku.price : currentSku?.rentPricePerDay) ?? product.price;
  const availableUnits = getAvailableUnits(product);
  const skuString = currentSku?.sku || (product as any).sku || (product.skus && product.skus[0]?.sku) || "";

  // Check if current SKU is already in the cart
  const cartItem = cart?.items.find((item) => item.sku === currentSku?.sku);
  const inCartQty = cartItem?.quantity || 0;

  // Single-click Add to Cart (uses localQty or 1)
  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      let targetSku = currentSku;

      if (!targetSku) {
        const detail = await productService.getProductById(String(product.id));
        if (detail?.skus && detail.skus.length > 0) {
          targetSku = detail.skus.find((s) => s.type === "buy") || detail.skus[0];
          setSelectedSku(targetSku);
        }
      }

      if (!targetSku) {
        window.location.href = `/shop/${product.id}`;
        return;
      }

      const selectedType = targetSku.type || "buy";
      const durationDays = selectedType === "rent" ? 7 : undefined;

      await addToCart({
        sku: targetSku.sku,
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

  // Increment in-cart quantity
  const handleIncrementInCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentSku || isProcessing) return;

    try {
      setIsProcessing(true);
      await updateQuantity(currentSku.sku, inCartQty + 1);
    } catch (err) {
      console.error("Failed to increment quantity:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Decrement in-cart quantity or remove
  const handleDecrementInCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentSku || isProcessing) return;

    try {
      setIsProcessing(true);
      if (inCartQty > 1) {
        await updateQuantity(currentSku.sku, inCartQty - 1);
      } else {
        await removeFromCart(currentSku.sku);
      }
    } catch (err) {
      console.error("Failed to decrement quantity:", err);
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
    setLocalQty((q) => q + 1);
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      className="cursor-pointer group no-underline block h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── UNIFIED NO-IMAGE PRODUCT CARD (ALL SCREENS) ── */}
      <div className="flex flex-col justify-between h-full bg-white border border-[#e8e4de] hover:border-[#111] transition-all duration-200 p-2.5 sm:p-3 md:p-3.5 lg:p-4 rounded-xs shadow-xs hover:shadow-sm">
        <div>
          {/* 1. Category Icon & Category Name on Top */}
          <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9px] lg:text-[10px] tracking-[0.08em] uppercase text-[#c4a882] font-semibold mb-1.5">
            <span className="shrink-0 text-[#c4a882] flex items-center justify-center">
              {getCategoryIcon(product.category)}
            </span>
            <span className="truncate">{product.category}</span>
          </div>

          {/* 2. Product Name on bottom of Category */}
          <h3 className="text-[11.5px] sm:text-[12px] lg:text-[13.5px] font-medium text-[#111] group-hover:text-[#c4a882] transition-colors leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* 3. Unit Name on top, and 4. SKU on bottom of Unit Name (in tertiary color #888) */}
          {(unitLabel || skuString) && (
            <div className="flex flex-col gap-0.5 text-[8px] sm:text-[8.5px] lg:text-[9.5px] text-[#888] font-mono mb-2">
              {unitLabel && (
                <div className="flex items-center">
                  <span className="uppercase font-medium text-[#666] bg-[#f5f4f0] px-1.5 py-0.5 rounded-xs tracking-wider border border-[#eae6de]">
                    Unit: {unitLabel}
                  </span>
                </div>
              )}
              {skuString && (
                <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] text-[#888] tracking-wider truncate">
                  SKU: {skuString}
                </div>
              )}
            </div>
          )}

          {/* 5. Price - Single prominent big price with larger text on lg screens */}
          <div className="flex items-baseline gap-1.5 my-2 lg:my-2.5">
            <span className="text-[17px] sm:text-[19px] lg:text-[23px] text-[#111] font-bold tracking-tight">
              ₹{formatPrice(currentPrice)}
            </span>
            {unitLabel && (
              <span className="text-[10px] sm:text-[11px] lg:text-[12.5px] text-[#777] font-normal uppercase">
                /{unitLabel}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-[10.5px] sm:text-[11.5px] lg:text-[13px] text-[#bbb] line-through ml-1">
                ₹{formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* 6. Bottom: Counter and Add to Cart Button (Only One Price on card, no increment price) */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="mt-auto pt-2 border-t border-[#f0ece4] flex flex-col gap-1.5"
        >
          {/* Multiple Unit Selector if available */}
          {availableUnits.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
              {availableUnits.map((u) => {
                const isSel = selectedSku?.sku === u.sku || (!selectedSku && u.sku === currentSku?.sku);
                return (
                  <button
                    key={u.sku}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSku(u.skuObj);
                    }}
                    className={`text-[7px] sm:text-[7.5px] lg:text-[8.5px] uppercase tracking-wider px-1.5 py-0.5 border cursor-pointer transition-colors rounded-xs whitespace-nowrap ${
                      isSel
                        ? "bg-[#111] text-white border-[#111] font-medium"
                        : "bg-transparent text-[#777] border-[#ddd] hover:border-[#999]"
                    }`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Cart Counter (if already added to cart) */}
          {inCartQty > 0 ? (
            <div className="flex items-center gap-1.5 h-7 sm:h-7.5 lg:h-8 w-full">
              <div className="flex items-center border border-[#111] bg-white rounded-xs h-full shrink-0">
                <button
                  type="button"
                  onClick={handleDecrementInCart}
                  disabled={isProcessing}
                  className="w-4.5 sm:w-5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#111] hover:bg-[#f5f4f0] bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-4 sm:w-4.5 lg:w-5 h-full flex items-center justify-center text-[10px] lg:text-[11.5px] font-mono font-semibold text-[#111] select-none">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrementInCart}
                  disabled={isProcessing}
                  className="w-4.5 sm:w-5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#111] hover:bg-[#f5f4f0] bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="flex-1 h-full bg-[#faf9f6] border border-[#111] rounded-xs px-2 flex items-center justify-center min-w-0">
                <span className="text-[7.5px] sm:text-[8px] lg:text-[9.5px] uppercase tracking-wider font-semibold text-[#111] flex items-center gap-1 whitespace-nowrap select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4a882] shrink-0" />
                  In Cart
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 h-7 sm:h-7.5 lg:h-8 w-full">
              <div className="flex items-center border border-[#ddd] bg-white rounded-xs h-full shrink-0">
                <button
                  type="button"
                  onClick={handleLocalDecrement}
                  disabled={localQty <= 1 || isProcessing}
                  className="w-4.5 sm:w-5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#111] hover:bg-[#f5f4f0] disabled:opacity-30 bg-transparent border-none cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-4 sm:w-4.5 lg:w-5 h-full flex items-center justify-center text-[10px] lg:text-[11.5px] font-mono text-[#111] select-none">
                  {localQty}
                </span>
                <button
                  type="button"
                  onClick={handleLocalIncrement}
                  disabled={isProcessing}
                  className="w-4.5 sm:w-5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#111] hover:bg-[#f5f4f0] bg-transparent border-none cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isProcessing}
                className="flex-1 min-w-0 h-full bg-[#111] hover:bg-[#333] text-white text-[7.5px] sm:text-[8px] lg:text-[9.5px] tracking-wider uppercase font-semibold transition-colors flex items-center justify-center gap-1 rounded-xs cursor-pointer border-none disabled:opacity-75 select-none px-1"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-2.5 w-2.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span className="whitespace-nowrap">Add to Cart</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
