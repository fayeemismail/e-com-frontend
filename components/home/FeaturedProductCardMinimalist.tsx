"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";
import { Eye, Plus } from "lucide-react";

interface FeaturedProductCardMinimalistProps {
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

function isPlaceholderImage(src?: string) {
  if (!src) return true;
  if (src.includes("/images/categories/")) return true;
  if (src.includes("placeholder")) return true;
  if (src.includes("photo-1543002588-bfa74002ed7e")) return true;
  return false;
}

export default function FeaturedProductCardMinimalist({ product }: FeaturedProductCardMinimalistProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<BackendSku | undefined>(product.defaultSku);
  const [imgFailed, setImgFailed] = useState(false);

  const { cart, addToCart, updateQuantity } = useCart();

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
        quantity: 1,
        transactionType: selectedType,
        rentalDurationDays: durationDays,
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
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
      await updateQuantity(currentSku.sku, inCartQty - 1);
    } catch (err) {
      console.error("Failed to decrement quantity:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="cursor-pointer group no-underline block h-full">
      <article className="flex flex-col h-full bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
        {/* Top Image Stage — clean edge-to-edge canvas with subtle rounded corners */}
        <div className="relative w-full aspect-[4/3] bg-[#fbfbfd] border-b border-slate-100/90 overflow-hidden">
          {/* Minimal Floating Quick-View Icon that fades in on hover */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/shop/${product.id}`;
              }}
              aria-label="Quick view"
              className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 hover:text-[#0a1f3d] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Eye size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* Product image */}
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

        {/* Bottom Details Section — Airy, minimal visual noise */}
        <div className="flex-1 p-4 flex flex-col justify-between gap-3 bg-white">
          <div className="flex flex-col gap-1.5">
            {/* Muted uppercase micro-heading */}
            <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase truncate m-0">
              {product.category || "General"}
            </p>

            {/* Clean product name with smooth hover color transition */}
            <h3
              title={product.name}
              className="text-[13.5px] sm:text-[14px] font-semibold text-[#0a1f3d] group-hover:text-[#00a6e0] transition-colors duration-200 leading-snug line-clamp-2 min-h-[2.5em] m-0"
            >
              {product.name}
            </h3>

            {/* Unit selector revealed under title */}
            {availableUnits.length > 1 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1"
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
                      className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 border cursor-pointer transition-all rounded-full font-medium ${
                        isSel
                          ? "bg-[#0a1f3d] text-white border-[#0a1f3d]"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom row: Price on left and circular/pill + add button on right */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100/90">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-[16px] sm:text-[17px] font-bold text-[#0a1f3d] tracking-tight">
                  {formatPrice(currentPrice)} SAR
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">
                  /{unitLabel || "each"}
                </span>
              </div>
              {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                <span className="text-[11px] text-slate-400 line-through leading-none mt-0.5">
                  {formatPrice(product.compareAtPrice)} SAR
                </span>
              )}
            </div>

            {/* Circular / Pill + Add icon button */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="shrink-0"
            >
              {inCartQty > 0 ? (
                <div className="flex items-center h-8 bg-slate-100/90 rounded-full border border-slate-200/80 px-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrementInCart}
                    disabled={isProcessing}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-white transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 text-[12px] font-bold tabular-nums text-[#0a1f3d] select-none">
                    {inCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementInCart}
                    disabled={isProcessing}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-white transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={isProcessing}
                  className="w-9 h-9 rounded-full bg-[#0a1f3d] hover:bg-[#00a6e0] active:scale-95 text-white flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer border-none disabled:opacity-75"
                  aria-label="Add to cart"
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <Plus size={16} strokeWidth={2.4} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
