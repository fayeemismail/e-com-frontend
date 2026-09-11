"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";

interface FeaturedProductCardProps {
  product: DisplayProduct;
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
      className="cursor-pointer group no-underline block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-[#f4f1ec]"
        style={{ paddingBottom: "100%" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-0" : "opacity-100"
            }`}
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* In-Cart Active Badge (medium/large screen indicator when not hovered) */}
        {inCartQty > 0 && !hovered && (
          <div className="hidden sm:flex absolute bottom-2 left-2 z-10 bg-[#111] text-white text-[7.5px] sm:text-[8px] md:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-xs font-mono items-center gap-1 shadow-sm">
            <span>In Cart:</span>
            <span className="font-semibold text-[#c4a882]">{inCartQty}</span>
            {unitLabel && <span className="uppercase text-[7px] sm:text-[8px]">{unitLabel}</span>}
          </div>
        )}

        {/* Counter Overlay: visible on small screen without hover; on hover shows on medium and large screen */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className={`absolute inset-x-0 bottom-0 bg-[#111]/95 backdrop-blur-xs text-white p-1.5 sm:p-1.5 md:p-2 lg:p-2.5 z-20 flex flex-col gap-1 transition-all duration-300 shadow-lg 
            translate-y-0 opacity-100 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${
              hovered ? "sm:translate-y-0 sm:opacity-100" : ""
            }`}
        >
          {/* Optional Unit Selector (e.g. PC vs DZ) */}
          {availableUnits.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {availableUnits.map((u) => {
                const isSel =
                  selectedSku?.sku === u.sku || (!selectedSku && u.sku === currentSku?.sku);
                return (
                  <button
                    key={u.sku}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSku(u.skuObj);
                    }}
                    className={`text-[7px] sm:text-[7.5px] md:text-[8px] uppercase tracking-wider px-1 sm:px-1.5 py-0.5 border cursor-pointer transition-colors whitespace-nowrap ${
                      isSel
                        ? "bg-white text-black border-white font-medium"
                        : "bg-transparent text-[#aaa] border-[#444] hover:border-[#888]"
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
            <div className="flex items-center justify-between gap-1 sm:gap-1.5">
              <div className="flex items-center border border-[#444] bg-[#222] rounded-xs shrink-0">
                <button
                  type="button"
                  onClick={handleDecrementInCart}
                  disabled={isProcessing}
                  className="w-5 sm:w-5 md:w-6 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] bg-transparent border-none cursor-pointer select-none disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-5 sm:w-5.5 md:w-6 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-[9px] sm:text-[9.5px] md:text-[11px] font-mono text-white font-semibold select-none">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrementInCart}
                  disabled={isProcessing}
                  className="w-5 sm:w-5 md:w-6 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] bg-transparent border-none cursor-pointer select-none disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-end leading-tight text-right select-none min-w-0">
                <span className="text-[9px] sm:text-[9.5px] md:text-[11px] font-semibold text-[#c4a882] truncate">
                  ₹{formatPrice(currentPrice * inCartQty)}
                </span>
                <span className="text-[7px] sm:text-[7.5px] md:text-[8px] text-[#aaa] uppercase truncate">
                  In Cart{unitLabel ? ` (${unitLabel})` : ""}
                </span>
              </div>
            </div>
          ) : (
            /* Direct Counter & Add to Bag (0 extra modal clicks) */
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="flex items-center border border-[#444] bg-[#222] rounded-xs shrink-0">
                <button
                  type="button"
                  onClick={handleLocalDecrement}
                  disabled={localQty <= 1 || isProcessing}
                  className="w-5 sm:w-5 md:w-5.5 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] disabled:opacity-30 bg-transparent border-none cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-5 sm:w-5 md:w-5.5 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-[9px] sm:text-[9.5px] md:text-[11px] font-mono text-white select-none">
                  {localQty}
                </span>
                <button
                  type="button"
                  onClick={handleLocalIncrement}
                  disabled={isProcessing}
                  className="w-5 sm:w-5 md:w-5.5 h-5.5 sm:h-6 md:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] bg-transparent border-none cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isProcessing}
                className="flex-1 min-w-0 h-5.5 sm:h-6 md:h-7 bg-[#c4a882] hover:bg-[#b5966d] text-[#111] text-[7.5px] sm:text-[8px] md:text-[9px] tracking-[0.05em] sm:tracking-[0.1em] uppercase font-semibold transition-colors flex items-center justify-center gap-1 rounded-xs cursor-pointer border-none disabled:opacity-75 select-none px-1"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-2.5 w-2.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span className="truncate">Add · ₹{formatPrice(currentPrice * localQty)}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-2 sm:pt-2.5 md:pt-3 pb-1">
        {/* Category */}
        <p className="text-[8.5px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[#999] mb-0.5 sm:mb-1 leading-relaxed truncate">
          {product.category}
        </p>

        {/* Product Name */}
        <p
          className={`text-[11px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13px] leading-snug mb-1 transition-colors duration-200 truncate ${
            hovered ? "text-[#c4a882]" : "text-[#111]"
          }`}
        >
          {product.name}
        </p>

        {/* Price & Unit */}
        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
          <span className="text-[11px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13px] text-[#111] font-medium">
            ₹{formatPrice(currentPrice)}
            {unitLabel && (
              <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#555] font-medium ml-0.5 sm:ml-1 uppercase">
                / {unitLabel}
              </span>
            )}
          </span>

          {product.compareAtPrice && (
            <span className="text-[9px] sm:text-[9.5px] md:text-[10.5px] text-[#ccc] line-through">
              ₹{formatPrice(product.compareAtPrice)}
              {unitLabel && (
                <span className="text-[8px] sm:text-[8.5px] md:text-[9px] text-[#aaa] ml-0.5 uppercase">
                  /{unitLabel}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
