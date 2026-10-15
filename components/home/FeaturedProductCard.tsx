"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";
import { ShoppingCart } from "lucide-react";

interface FeaturedProductCardProps {
  product: DisplayProduct;
}

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

function isPlaceholderImage(src?: string) {
  if (!src) return true;
  // Category illustration SVGs / explicit placeholders — not real product photos
  if (src.includes("/images/categories/")) return true;
  if (src.includes("placeholder")) return true;
  // Mapper default book stock photo when API has no images
  if (src.includes("photo-1543002588-bfa74002ed7e")) return true;
  return false;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localQty, setLocalQty] = useState(1);
  const [selectedSku, setSelectedSku] = useState<BackendSku | undefined>(product.defaultSku);
  const [imgFailed, setImgFailed] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!selectedSku && product.defaultSku) {
      setSelectedSku(product.defaultSku);
    }
  }, [product.defaultSku, selectedSku]);

  useEffect(() => {
    setImgFailed(false);
  }, [product.id, product.image]);

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

  const cartItem = cart?.items.find((item) => item.sku === currentSku?.sku);
  const inCartQty = cartItem?.quantity || 0;

  const fallbackVisual = getCategoryVisualPath(product.category, product.name);
  const useProductPhoto = !imgFailed && !isPlaceholderImage(product.image);
  const imageSrc = useProductPhoto ? product.image : fallbackVisual;

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
    <Link href={`/shop/${product.id}`} className="cursor-pointer group no-underline block h-full">
      <article className="flex flex-col h-full bg-white border border-[#e2e8f0] hover:border-[#0a1f3d] transition-all duration-200 rounded-xl shadow-2xs hover:shadow-md overflow-hidden group">
        {/* Top Image Stage — edge-to-edge canvas with zero side gutters */}
        <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgFailed(true)}
            className={`select-none w-full h-full ${
              useProductPhoto
                ? "object-cover object-center"
                : "object-contain object-center p-6"
            }`}
          />
        </div>

        {/* Bottom Details Section */}
        <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-3 bg-white">
          <div className="flex flex-col gap-2">
            {/* Category & In-Stock Status Row */}
            <div className="flex items-center justify-between gap-2 h-4">
              <span className="text-[10px] sm:text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {product.category || "General"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-medium text-emerald-600 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                In stock
              </span>
            </div>

            {/* Title */}
            <h3
              title={product.name}
              className="text-[13px] sm:text-[13.5px] font-semibold text-[#0a1f3d] group-hover:text-[#00a6e0] transition-colors leading-snug line-clamp-2 min-h-[2.6em] m-0"
            >
              {product.name}
            </h3>

            {/* Specifications: SAP ID and Unit (Clean unboxed hairline row) */}
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">SAP:</span>
                <span className="font-mono font-semibold text-slate-800">#{skuString || "—"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Unit:</span>
                <span className="uppercase font-semibold text-slate-800">{unitLabel || "Each"}</span>
              </span>
            </div>

            {/* Unit Selector (if multiple options available) */}
            {availableUnits.length > 1 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5"
              >
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
                      className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 border cursor-pointer transition-colors rounded font-semibold whitespace-nowrap ${
                        isSel
                          ? "bg-[#0a1f3d] text-white border-[#0a1f3d]"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pricing & Requisition Action */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            {/* Price + Dispatch */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0a1f3d] tracking-tight">
                  {formatPrice(currentPrice)} SAR
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  /{unitLabel || "each"}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatPrice(product.compareAtPrice)} SAR
                  </span>
                )}
              </div>
              <div className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{dispatchDate}</span>
              </div>
            </div>

            {/* Action Bar (Prevent card navigation) */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="w-full"
            >
              {inCartQty > 0 ? (
                <div className="flex items-center gap-1.5 h-9 w-full">
                  <div className="flex items-center border border-[#0a1f3d] bg-white rounded-lg h-full shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleDecrementInCart}
                      disabled={isProcessing}
                      className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] font-semibold text-[#0a1f3d] hover:bg-slate-50 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 px-1 h-full flex items-center justify-center text-[12.5px] font-bold tabular-nums text-[#0a1f3d] select-none">
                      {inCartQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrementInCart}
                      disabled={isProcessing}
                      className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] font-semibold text-[#0a1f3d] hover:bg-slate-50 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1 h-full bg-[#f0f9ff] border border-[#00a6e0]/40 rounded-lg px-2 flex items-center justify-center min-w-0">
                    <span className="text-[11px] font-semibold text-[#0077b6] whitespace-nowrap select-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0]" />
                      In cart ({inCartQty})
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 h-9 w-full">
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg h-full shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleLocalDecrement}
                      disabled={localQty <= 1 || isProcessing}
                      className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 px-1 h-full flex items-center justify-center text-[12px] sm:text-[12.5px] font-semibold tabular-nums text-[#0a1f3d] select-none">
                      {localQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleLocalIncrement}
                      disabled={isProcessing}
                      className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] font-medium text-slate-600 hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={isProcessing}
                    className="flex-1 min-w-0 h-full bg-[#0a1f3d] hover:bg-[#00a6e0] active:scale-[0.98] text-white text-[11px] sm:text-[11.5px] font-semibold transition-all duration-150 flex items-center justify-center rounded-lg cursor-pointer border-none shadow-xs disabled:opacity-75 select-none px-2.5 gap-1.5"
                  >
                    {isProcessing ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <>
                        <ShoppingCart size={13} strokeWidth={2.2} />
                        <span className="whitespace-nowrap">Add to cart</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
