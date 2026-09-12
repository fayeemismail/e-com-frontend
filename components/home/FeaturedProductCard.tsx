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

// Category visual helper (returns matching category illustration from public/images/categories)
function getCategoryVisualPath(cat: string, name?: string): string {
  const c = (cat || "").toLowerCase();
  const n = (name || "").toLowerCase();

  if (c.includes("paper") || c.includes("print") || n.includes("paper") || n.includes("copy") || n.includes("sheet")) {
    return "/images/categories/paper-print.svg";
  }
  if (c.includes("pen") || c.includes("writing") || n.includes("pen") || n.includes("marker") || n.includes("ballpoint") || n.includes("rollerball")) {
    return "/images/categories/writing-pen.svg";
  }
  if (c.includes("binding") || n.includes("binding") || n.includes("comb")) {
    return "/images/categories/binding.svg";
  }
  if (c.includes("adhesive") || c.includes("fastener") || n.includes("note") || n.includes("sticky") || n.includes("tape")) {
    return "/images/categories/adhesives.svg";
  }
  if (c.includes("desk") || c.includes("filing") || n.includes("file") || n.includes("folder") || n.includes("binder")) {
    return "/images/categories/desk-filing.svg";
  }
  if (c.includes("toner") || c.includes("cartridge") || c.includes("tech") || c.includes("computing") || c.includes("hardware") || c.includes("software") || c.includes("electronic") || c.includes("artificial")) {
    return "/images/categories/toner-cartridge.svg";
  }
  return "/images/categories/books.svg";
}

// Category dummy dispatch date helper
function getDispatchDate(cat: string, name?: string): string {
  const c = (cat || "").toLowerCase();
  const n = (name || "").toLowerCase();

  if (c.includes("paper") || c.includes("print") || n.includes("paper") || n.includes("pen") || c.includes("writing") || n.includes("marker")) {
    return "Next-day dispatch";
  }
  if (c.includes("desk") || c.includes("filing") || c.includes("folder") || c.includes("binding") || c.includes("adhesive") || c.includes("fastener") || c.includes("stationery") || c.includes("office")) {
    return "2-3 days dispatch";
  }
  if (c.includes("toner") || c.includes("cartridge") || c.includes("tech") || c.includes("computing") || c.includes("electronic") || c.includes("hardware")) {
    return "3-5 days dispatch";
  }
  return "2-3 days dispatch";
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
  const skuString =
    (product as any).rawProduct?.sapId ||
    (product as any).sapId ||
    currentSku?.sku ||
    (product as any).sku ||
    (product.skus && product.skus[0]?.sku) ||
    "";
  const dispatchDate = getDispatchDate(product.category, product.name);

  // Check if current SKU is already in the cart
  const cartItem = cart?.items.find((item) => item.sku === currentSku?.sku);
  const inCartQty = cartItem?.quantity || 0;

  // Single-click Add to Requisition
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
      console.error("Failed to add to requisition:", err);
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
      <div className="flex flex-col justify-between h-full bg-white border border-[#e2e8f0] hover:border-[#0f2e5a] transition-all duration-200 rounded-xs shadow-2xs hover:shadow-xs overflow-hidden">
        
        {/* 1. TOP SECTION: Category Illustration Box with Stock Badge */}
        <div className="relative bg-[#f0f4f9] h-28 sm:h-32 flex items-center justify-center p-3 border-b border-[#e2e8f0]/70">
          {/* Stock badge top right */}
          <div className="absolute top-2 right-2">
            <span className="text-[8px] sm:text-[8.5px] font-medium px-1.5 py-0.5 rounded-xs border border-blue-200 bg-white text-[#0f2e5a] tracking-wide shadow-2xs">
              In stock
            </span>
          </div>

          {/* Category Illustration */}
          <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src={getCategoryVisualPath(product.category, product.name)}
              alt={product.category}
              width={64}
              height={64}
              unoptimized
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain select-none"
            />
          </div>
        </div>

        {/* 2. BODY SECTION */}
        <div className="p-2.5 sm:p-3 md:p-3.5 flex flex-col flex-1">
          {/* Category Name in tertiary color */}
          <p className="text-[9px] sm:text-[9.5px] lg:text-[10px] uppercase tracking-[0.08em] text-[#64748b] font-medium mb-1 truncate">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-[12px] sm:text-[12.5px] lg:text-[13.5px] font-semibold text-[#0f172a] group-hover:text-[#0f2e5a] transition-colors leading-snug line-clamp-2 mb-1.5">
            {product.name}
          </h3>

          {/* Unit and SAP ID in 2 separate rows with increased text size */}
          <div className="flex flex-col gap-1 mb-2">
            {unitLabel && (
              <div className="text-[11px] sm:text-[11.5px] lg:text-[12px] font-medium text-[#475569]">
                <span className="text-[#64748b]">Unit:</span>{" "}
                <span className="uppercase text-[#0f172a] font-semibold">{unitLabel}</span>
              </div>
            )}
            {skuString && (
              <div className="text-[11px] sm:text-[11.5px] lg:text-[12px] font-medium text-[#475569]">
                <span className="text-[#64748b]">SAP ID:</span>{" "}
                <span className="font-mono text-[#0f172a] font-semibold">{skuString}</span>
              </div>
            )}
          </div>

          {/* Price in SAR */}
          <div className="flex items-baseline gap-1 my-1.5 mt-auto">
            <span className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#0f172a] font-bold tracking-tight">
              {formatPrice(currentPrice)} SAR
            </span>
            {unitLabel && (
              <span className="text-[9.5px] sm:text-[10.5px] text-[#64748b] font-normal uppercase">
                /{unitLabel}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-[9.5px] sm:text-[10.5px] text-[#94a3b8] line-through ml-1">
                {formatPrice(product.compareAtPrice)} SAR
              </span>
            )}
          </div>

          {/* Dispatch information: on the bottom and on top of counter */}
          <div className="text-[10px] sm:text-[10.5px] lg:text-[11px] text-[#64748b] font-medium flex items-center gap-1.5 pt-1.5 border-t border-[#e2e8f0]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="capitalize">{dispatchDate}</span>
          </div>

          {/* 3. Bottom Counter & Add to Requisition Button */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="pt-1.5 flex flex-col gap-1.5"
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
                      className={`text-[7.5px] sm:text-[8px] lg:text-[8.5px] uppercase tracking-wider px-1.5 py-0.5 border cursor-pointer transition-colors rounded-xs whitespace-nowrap ${
                        isSel
                          ? "bg-[#0f2e5a] text-white border-[#0f2e5a] font-medium"
                          : "bg-transparent text-[#64748b] border-[#cbd5e1] hover:border-[#94a3b8]"
                      }`}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Requisition Counter (if already added) */}
            {inCartQty > 0 ? (
              <div className="flex items-center gap-1.5 h-7 sm:h-7.5 lg:h-8 w-full">
                <div className="flex items-center border border-[#0f2e5a] bg-white rounded-xs h-full shrink-0">
                  <button
                    type="button"
                    onClick={handleDecrementInCart}
                    disabled={isProcessing}
                    className="w-5 sm:w-5.5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#0f2e5a] hover:bg-blue-50 bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-4 sm:w-4.5 lg:w-5 h-full flex items-center justify-center text-[10px] lg:text-[11.5px] font-mono font-semibold text-[#0f2e5a] select-none">
                    {inCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementInCart}
                    disabled={isProcessing}
                    className="w-5 sm:w-5.5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#0f2e5a] hover:bg-blue-50 bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 h-full bg-blue-50/70 border border-[#0f2e5a] rounded-xs px-2 flex items-center justify-center min-w-0">
                  <span className="text-[7.5px] sm:text-[8px] lg:text-[9px] uppercase tracking-wider font-semibold text-[#0f2e5a] flex items-center gap-1 whitespace-nowrap select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f2e5a] shrink-0" />
                    In Requisition
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 h-7 sm:h-7.5 lg:h-8 w-full">
                <div className="flex items-center border border-[#cbd5e1] bg-white rounded-xs h-full shrink-0">
                  <button
                    type="button"
                    onClick={handleLocalDecrement}
                    disabled={localQty <= 1 || isProcessing}
                    className="w-5 sm:w-5.5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#334155] hover:bg-slate-100 disabled:opacity-30 bg-transparent border-none cursor-pointer select-none"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-4 sm:w-4.5 lg:w-5 h-full flex items-center justify-center text-[10px] lg:text-[11.5px] font-mono text-[#334155] select-none">
                    {localQty}
                  </span>
                  <button
                    type="button"
                    onClick={handleLocalIncrement}
                    disabled={isProcessing}
                    className="w-5 sm:w-5.5 lg:w-6 h-full flex items-center justify-center text-xs lg:text-sm text-[#334155] hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={isProcessing}
                  className="flex-1 min-w-0 h-full bg-[#0f2e5a] hover:bg-[#0b2447] text-white text-[7.5px] sm:text-[8px] lg:text-[9.5px] tracking-wider uppercase font-semibold transition-colors flex items-center justify-center gap-1 rounded-xs cursor-pointer border-none disabled:opacity-75 select-none px-1 shadow-2xs"
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-2.5 w-2.5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <span className="whitespace-nowrap">+ Add to requisition</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
