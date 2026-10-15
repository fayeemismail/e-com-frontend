"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";
import { Zap, ShoppingCart, Check } from "lucide-react";

interface FeaturedProductCardStructuredProps {
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

export default function FeaturedProductCardStructured({ product }: FeaturedProductCardStructuredProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localQty, setLocalQty] = useState(1);
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
      <article className="flex flex-col h-full bg-white border border-slate-300/80 hover:border-[#0a1f3d] transition-all duration-200 rounded-lg shadow-xs hover:shadow-md overflow-hidden">
        {/* Top Image Stage — Tinted top block with hairline divider */}
        <div className="relative w-full aspect-[4/3] bg-slate-100/70 border-b border-slate-200 overflow-hidden flex items-center justify-center">
          {/* Floating Dispatch Badge */}
          <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-[9.5px] font-semibold text-amber-800 border border-amber-200/80 shadow-2xs">
            <Zap size={11} className="text-amber-500 fill-amber-500" />
            <span>Ships Today</span>
          </span>

          {/* SAP ID Tag */}
          <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800/85 backdrop-blur-xs text-[9.5px] font-mono font-medium text-white shadow-2xs">
            #{skuString || "—"}
          </span>

          {/* Image */}
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

        {/* Bottom Details Section — Industrial / Catalog Spec Structure */}
        <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-3 bg-white">
          <div className="flex flex-col gap-2">
            {/* Category */}
            <p className="text-[9.5px] font-mono tracking-widest text-slate-500 uppercase truncate m-0">
              {product.category || "GENERAL"}
            </p>

            {/* Title */}
            <h3
              title={product.name}
              className="text-[13px] sm:text-[13.5px] font-bold text-[#0a1f3d] group-hover:text-[#00a6e0] transition-colors leading-snug line-clamp-2 min-h-[2.6em] m-0"
            >
              {product.name}
            </h3>

            {/* 2-column micro-spec grid */}
            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-md border border-slate-200/70 text-[11px] font-mono">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Unit</span>
                <span className="font-semibold text-slate-800 uppercase truncate">{unitLabel || "Each"}</span>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-2 min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Min Order</span>
                <span className="font-semibold text-slate-800 truncate">1</span>
              </div>
            </div>

            {/* Embedded unit selector pills directly on card (when product has variant units) */}
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
                        if (u.skuObj) setSelectedSku(u.skuObj);
                      }}
                      className={`text-[9.5px] uppercase font-mono px-2 py-0.5 border cursor-pointer transition-colors rounded-xs font-semibold whitespace-nowrap ${
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

          <div className="flex flex-col gap-2.5">
            {/* Distinct colored price tag bar */}
            <div className="px-2.5 py-1.5 rounded-md bg-[#0a1f3d]/5 border border-[#0a1f3d]/10 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[16px] sm:text-[17px] font-bold text-[#0a1f3d] tracking-tight">
                  {formatPrice(currentPrice)} SAR
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">
                  /{unitLabel || "unit"}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
                <Check size={10} strokeWidth={3} />
                Contract Rate
              </span>
            </div>

            {/* Stepper + Add button combined into a dual-action toolbar */}
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
                <div className="flex items-center h-9 w-full rounded-md border border-[#0a1f3d] bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrementInCart}
                    disabled={isProcessing}
                    className="w-9 h-full flex items-center justify-center text-[15px] font-semibold text-[#0a1f3d] hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <div className="flex-1 h-full bg-[#f0f9ff] flex items-center justify-center border-x border-[#0a1f3d]/20 text-[11.5px] font-bold text-[#0a1f3d]">
                    {inCartQty} in requisition
                  </div>
                  <button
                    type="button"
                    onClick={handleIncrementInCart}
                    disabled={isProcessing}
                    className="w-9 h-full flex items-center justify-center text-[15px] font-semibold text-[#0a1f3d] hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="flex items-stretch h-9 w-full rounded-md border border-slate-300 bg-white overflow-hidden shadow-2xs focus-within:border-[#0a1f3d]">
                  <div className="flex items-center bg-slate-50 border-r border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={handleLocalDecrement}
                      disabled={localQty <= 1 || isProcessing}
                      className="w-7 h-full flex items-center justify-center text-[15px] font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-30 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-7 h-full flex items-center justify-center text-[12px] font-bold font-mono tabular-nums text-[#0a1f3d] select-none">
                      {localQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleLocalIncrement}
                      disabled={isProcessing}
                      className="w-7 h-full flex items-center justify-center text-[15px] font-medium text-slate-600 hover:bg-slate-200 bg-transparent border-none cursor-pointer select-none transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={isProcessing}
                    className="flex-1 min-w-0 h-full bg-[#0a1f3d] hover:bg-[#00a6e0] active:bg-[#081930] text-white text-[11px] font-semibold tracking-wide uppercase transition-colors flex items-center justify-center cursor-pointer border-none disabled:opacity-75 select-none px-2.5 gap-1.5"
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
