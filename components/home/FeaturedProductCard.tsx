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
    <div className="cursor-pointer group no-underline block h-full">
      <article className="flex flex-col h-full bg-white border border-[#e2e8f0] hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(10,31,61,0.08),0_2px_6px_-1px_rgba(10,31,61,0.03)] transition-all duration-200 ease-out rounded-xl shadow-2xs overflow-hidden group">
        {/* Top Image Stage — Recessed Inset Tray */}
        <Link href={`/shop/${product.id}`} className="block p-2.5 sm:p-3 pb-0 no-underline">
          <div className="relative w-full aspect-[16/10] bg-slate-100/75 rounded-lg overflow-hidden border border-slate-200/60">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              onError={() => setImgFailed(true)}
              className={
                useProductPhoto
                  ? "select-none w-full h-full object-cover object-center"
                  : "select-none w-full h-full object-contain object-center p-4"
              }
            />
            {/* Inner shadow overlay so the carved bevel effect casts over the image stage */}
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_2px_5px_rgba(10,31,61,0.08),inset_0_1px_2px_rgba(10,31,61,0.03)]" />
          </div>
        </Link>

        {/* Bottom Details Section */}
        <div className="flex-1 p-3 sm:p-3.5 pt-2 sm:pt-2.5 flex flex-col justify-between gap-2 bg-white">
          <div className="flex flex-col">
            {/* Category Row */}
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[11px] text-[#565959] font-normal capitalize truncate leading-none">
                {product.category || "General"}
              </span>
            </div>

            {/* Title */}
            <Link href={`/shop/${product.id}`} className="no-underline">
              <h3
                title={product.name}
                className="text-[13px] sm:text-[13.5px] font-normal text-[#0f1111] group-hover:text-[#007185] transition-colors leading-[1.3] line-clamp-2 min-h-[2.6em] m-0"
              >
                {product.name}
              </h3>
            </Link>

            {/* Specifications: SAP ID and Unit grouped side-by-side */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#565959] mt-0.5">
              <span>SAP: <span className="font-medium text-slate-700">#{skuString || "—"}</span></span>
              <span className="text-slate-300">•</span>
              <span>Unit: <span className="font-medium text-slate-700 capitalize">{unitLabel || "Each"}</span></span>
            </div>

            {/* Unit Selector (if multiple options available) */}
            {availableUnits.length > 1 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar mt-1"
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
                      className={`text-[10px] capitalize px-2 py-0.5 border cursor-pointer transition-colors rounded-md font-medium whitespace-nowrap ${
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
          <div className="flex flex-col gap-2 pt-1.5 border-t border-slate-100/70">
            {/* Price + Quantity Counter (replaces dispatch date) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-[11px] font-medium text-[#0f1111]">SAR</span>
                <span className="text-[16px] sm:text-[17px] font-bold text-[#0f1111] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-[11px] text-[#565959] font-normal">
                  /{unitLabel ? unitLabel.toLowerCase() : "each"}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-[11px] text-[#565959] line-through ml-1">
                    SAR {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Quantity Counter */}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="shrink-0"
              >
                {inCartQty > 0 ? (
                  <div className="flex items-center border border-[#0a1f3d] bg-white rounded-lg h-7 sm:h-7.5 shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecrementInCart}
                      disabled={isProcessing}
                      className="w-6 sm:w-7 h-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-[#0a1f3d]/8 active:bg-[#0a1f3d]/15 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-5 sm:min-w-6 px-1 h-full flex items-center justify-center text-[11.5px] sm:text-[12px] font-bold tabular-nums text-[#0a1f3d] select-none border-x border-[#0a1f3d]/15">
                      {inCartQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrementInCart}
                      disabled={isProcessing}
                      className="w-6 sm:w-7 h-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-[#0a1f3d]/8 active:bg-[#0a1f3d]/15 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg h-7 sm:h-7.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleLocalDecrement}
                      disabled={localQty <= 1 || isProcessing}
                      className="w-6 sm:w-7 h-full flex items-center justify-center text-[13px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-5 sm:min-w-6 px-1 h-full flex items-center justify-center text-[11.5px] sm:text-[12px] font-semibold tabular-nums text-[#0a1f3d] select-none">
                      {localQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleLocalIncrement}
                      disabled={isProcessing}
                      className="w-6 sm:w-7 h-full flex items-center justify-center text-[13px] font-medium text-slate-600 hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar (Full-width Requisition Button) */}
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
                <Link
                  href="/cart"
                  className="w-full h-8 sm:h-8.5 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#00a6e0]/35 rounded-lg flex items-center justify-center gap-1.5 text-[11px] sm:text-[11.5px] font-semibold text-[#0077b6] no-underline select-none transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0]" />
                  <span>In cart ({inCartQty})</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={isProcessing}
                  className="w-full h-8 sm:h-8.5 bg-[#0a1f3d] hover:bg-[#00a6e0] active:scale-[0.98] text-white text-[11px] sm:text-[11.5px] font-semibold transition-all duration-150 flex items-center justify-center rounded-lg cursor-pointer border-none shadow-xs disabled:opacity-75 select-none px-3 gap-1.5"
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      <ShoppingCart size={13} strokeWidth={2.2} />
                      <span>Add to cart</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
