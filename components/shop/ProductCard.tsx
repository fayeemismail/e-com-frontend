"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";

interface ProductCardProps {
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

export default function ProductCard({ product }: ProductCardProps) {
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
      <article className="flex flex-col h-full bg-white border border-[#e2e8f0] hover:border-[#0f2e5a] transition-all duration-200 rounded-md shadow-2xs hover:shadow-xs overflow-hidden">
        <div className="flex flex-col p-3 sm:p-3.5 gap-2.5">
          {/* First section — roomy reserved bands; image matches content height */}
          <div className="flex items-stretch gap-3">
            <div className="relative shrink-0 w-[7.5rem] sm:w-32 lg:w-36 min-h-[7.5rem] sm:min-h-32 self-stretch bg-[#f5f7fb] rounded-sm overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                unoptimized
                sizes="144px"
                onError={() => setImgFailed(true)}
                className={`select-none transition-transform duration-200 group-hover:scale-[1.03] ${
                  useProductPhoto
                    ? "object-cover object-center"
                    : "object-contain object-center p-3"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* 1 — Identity */}
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 h-4">
                  <p className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.08em] text-[#64748b] font-normal truncate m-0">
                    {product.category || "—"}
                  </p>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[8.5px] font-medium tracking-[0.04em] uppercase text-emerald-700 whitespace-nowrap">
                    <span className="w-1 h-1 rounded-[1px] bg-emerald-600 shrink-0" aria-hidden />
                    In stock
                  </span>
                </div>
                <h3
                  title={product.name}
                  className="text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-medium text-[#0f172a] group-hover:text-[#0f2e5a] transition-colors leading-snug m-0 line-clamp-2 min-h-[2.6em]"
                >
                  {product.name}
                </h3>
              </div>

              {/* 2 — Specs */}
              <div className="flex flex-col justify-center gap-0.5 h-[2.75rem] sm:h-[3rem]">
                <p className="text-[11px] sm:text-[12px] text-[#475569] m-0 leading-tight truncate">
                  <span className="text-[#64748b]">Unit:</span>{" "}
                  <span className="uppercase text-[#0f172a] font-semibold">
                    {unitLabel || "—"}
                  </span>
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#475569] m-0 leading-tight truncate">
                  <span className="text-[#64748b]">SAP ID:</span>{" "}
                  <span className="font-mono text-[#0f172a] font-semibold">
                    {skuString || "—"}
                  </span>
                </p>
              </div>

              {/* 3 — Price + dispatch */}
              <div className="flex flex-col justify-end min-h-[2.75rem] sm:min-h-[3rem]">
                <div className="flex items-baseline gap-1 flex-wrap min-h-[1.25rem]">
                  <span className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#0f172a] font-semibold tracking-tight">
                    {formatPrice(currentPrice)} SAR
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#64748b] uppercase font-normal">
                    /{unitLabel || "—"}
                  </span>
                  <span
                    className={`text-[9.5px] sm:text-[10px] text-[#94a3b8] line-through font-normal ${
                      product.compareAtPrice ? "" : "invisible"
                    }`}
                    aria-hidden={!product.compareAtPrice}
                  >
                    {product.compareAtPrice
                      ? `${formatPrice(product.compareAtPrice)} SAR`
                      : "0.00 SAR"}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[10.5px] text-[#64748b] font-normal flex items-center gap-1.5 mt-1 min-h-[1rem]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{dispatchDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section — sits directly under the first block */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="flex flex-col gap-1.5 font-nav"
          >
          {availableUnits.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
                    className={`text-[9px] sm:text-[9.5px] uppercase tracking-[0.06em] px-2 py-0.5 border cursor-pointer transition-colors rounded-xs whitespace-nowrap font-medium ${
                      isSel
                        ? "bg-[#0f2e5a] text-white border-[#0f2e5a]"
                        : "bg-transparent text-[#64748b] border-[#cbd5e1] hover:border-[#94a3b8]"
                    }`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          )}

          {inCartQty > 0 ? (
            <div className="flex items-center gap-1.5 h-8 sm:h-9 w-full">
              <div className="flex items-center border border-[#0f2e5a] bg-white rounded-xs h-full shrink-0">
                <button
                  type="button"
                  onClick={handleDecrementInCart}
                  disabled={isProcessing}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] sm:text-[16px] font-medium leading-none text-[#0f2e5a] hover:bg-blue-50 bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-6 px-0.5 h-full flex items-center justify-center text-[12px] sm:text-[13px] font-semibold tabular-nums text-[#0f2e5a] select-none">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrementInCart}
                  disabled={isProcessing}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] sm:text-[16px] font-medium leading-none text-[#0f2e5a] hover:bg-blue-50 bg-transparent border-none cursor-pointer select-none disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="flex-1 h-full bg-blue-50/70 border border-[#0f2e5a] rounded-xs px-2 flex items-center justify-center min-w-0">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.06em] font-semibold text-[#0f2e5a] whitespace-nowrap select-none">
                  In requisition
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 h-8 sm:h-9 w-full">
              <div className="flex items-center border border-[#cbd5e1] bg-white rounded-xs h-full shrink-0">
                <button
                  type="button"
                  onClick={handleLocalDecrement}
                  disabled={localQty <= 1 || isProcessing}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] sm:text-[16px] font-medium leading-none text-[#334155] hover:bg-slate-100 disabled:opacity-30 bg-transparent border-none cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-6 px-0.5 h-full flex items-center justify-center text-[12px] sm:text-[13px] font-semibold tabular-nums text-[#0f2e5a] select-none">
                  {localQty}
                </span>
                <button
                  type="button"
                  onClick={handleLocalIncrement}
                  disabled={isProcessing}
                  className="w-7 sm:w-8 h-full flex items-center justify-center text-[15px] sm:text-[16px] font-medium leading-none text-[#334155] hover:bg-slate-100 bg-transparent border-none cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isProcessing}
                className="flex-1 min-w-0 h-full bg-[#0f2e5a] hover:bg-[#0b2447] text-white text-[10px] sm:text-[11px] tracking-[0.05em] uppercase font-semibold transition-colors flex items-center justify-center rounded-xs cursor-pointer border-none disabled:opacity-75 select-none px-2"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span className="whitespace-nowrap leading-none">Add to requisition</span>
                )}
              </button>
            </div>
          )}
          </div>
        </div>
      </article>
    </Link>
  );
}
