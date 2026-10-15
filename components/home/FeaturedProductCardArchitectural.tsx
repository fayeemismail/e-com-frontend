"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";
import { Plus } from "lucide-react";

interface FeaturedProductCardArchitecturalProps {
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

export default function FeaturedProductCardArchitectural({ product }: FeaturedProductCardArchitecturalProps) {
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
  const skuString =
    (product as any).rawProduct?.sapId ||
    (product as any).sapId ||
    currentSku?.sku ||
    (product as any).sku ||
    (product.skus && product.skus[0]?.sku) ||
    "";

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
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col justify-between bg-white hover:bg-slate-50/90 transition-colors duration-150 p-4 sm:p-5 no-underline h-full select-none"
    >
      {/* Top micro spec row: SAP + Stock status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider truncate">
          {skuString ? `#${skuString}` : (product.category || "General")}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>In stock</span>
        </span>
      </div>

      {/* Media container — clean frameless presentation */}
      <div className="relative w-full aspect-[4/3] my-1 bg-transparent flex items-center justify-center overflow-hidden">
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
              : "object-contain object-center p-4"
          }`}
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-between gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <p className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 m-0 truncate">
            {product.category || "Procurement"}
          </p>

          <h3
            title={product.name}
            className="text-[13px] sm:text-[13.5px] font-semibold text-[#0a1f3d] group-hover:text-[#00a6e0] transition-colors leading-snug line-clamp-2 min-h-[2.6em] m-0"
          >
            {product.name}
          </h3>

          {/* Inline unit pills if multi-unit */}
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
                      if (u.skuObj) setSelectedSku(u.skuObj);
                    }}
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 border cursor-pointer transition-colors rounded-xs font-semibold whitespace-nowrap ${
                      isSel
                        ? "bg-[#0a1f3d] text-white border-[#0a1f3d]"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom row: Price & Flush Action Toolbar */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] sm:text-[17px] font-bold text-[#0a1f3d] tabular-nums tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-[10px] font-bold text-[#0a1f3d]">SAR</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-medium truncate">
                /{unitLabel || "unit"}
              </span>
            </div>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <span className="text-[10.5px] text-slate-400 line-through leading-none mt-0.5">
                {formatPrice(product.compareAtPrice)} SAR
              </span>
            )}
          </div>

          {/* Action button */}
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
              <div className="flex items-center h-7.5 bg-slate-100 rounded border border-slate-200/90 px-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrementInCart}
                  disabled={isProcessing}
                  className="w-5.5 h-full flex items-center justify-center text-[13px] font-bold text-slate-700 hover:bg-white rounded-xs transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-1.5 text-[11px] font-mono font-bold text-[#0a1f3d] tabular-nums select-none">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrementInCart}
                  disabled={isProcessing}
                  className="w-5.5 h-full flex items-center justify-center text-[13px] font-bold text-slate-700 hover:bg-white rounded-xs transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40"
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
                className="h-7.5 px-3 rounded bg-slate-900 group-hover:bg-[#00a6e0] active:bg-[#081930] text-white text-[10.5px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer border-none shadow-2xs disabled:opacity-75"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <Plus size={12} strokeWidth={2.6} />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
