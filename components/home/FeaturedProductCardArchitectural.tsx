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
      className="group flex flex-col justify-between bg-transparent no-underline h-full select-none"
    >
      <div className="flex flex-col flex-1">
        {/* Amazon-style Floating Image on Canvas (No Card Borders) */}
        <div className="relative w-full aspect-[16/10] flex items-center justify-center overflow-hidden rounded-lg bg-slate-100/75 border border-slate-200/50 mb-1.5">
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
        </div>

        {/* Category / Brand */}
        <span className="text-[11px] text-[#565959] font-normal truncate block mb-0.5 capitalize">
          {product.category || "General"}
        </span>

        {/* Title */}
        <h3
          title={product.name}
          className="text-[13px] sm:text-[13.5px] font-normal text-[#0f1111] group-hover:text-[#007185] transition-colors leading-[1.3] line-clamp-2 min-h-[2.6em] m-0"
        >
          {product.name}
        </h3>

        {/* Specifications: SAP ID & Unit grouped */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#565959] mt-0.5">
          <span>SAP: <span className="font-medium text-slate-700">#{skuString || "—"}</span></span>
          <span className="text-slate-300">•</span>
          <span>Unit: <span className="font-medium text-slate-700 capitalize">{unitLabel || "Each"}</span></span>
        </div>

        {/* Unit Selector if multi-unit */}
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
                    if (u.skuObj) setSelectedSku(u.skuObj);
                  }}
                  className={`text-[10.5px] capitalize px-2 py-0.5 border cursor-pointer transition-colors rounded-md font-medium whitespace-nowrap ${
                    isSel
                      ? "bg-[#0f1111] text-white border-[#0f1111]"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Price (Amazon style: SAR first, then number, then /unit) */}
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-[11px] font-medium text-[#0f1111]">SAR</span>
          <span className="text-[17px] sm:text-[18px] font-bold text-[#0f1111] tracking-tight">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-[11px] text-[#565959] font-normal">
            /{unitLabel ? unitLabel.toLowerCase() : "each"}
          </span>
          {product.compareAtPrice && product.compareAtPrice > currentPrice && (
            <span className="text-[11px] text-[#565959] line-through ml-1.5">
              SAR {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Action: Add to Cart / In-Cart Stepper */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="w-full mt-2"
      >
        {inCartQty > 0 ? (
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center border border-[#0a1f3d] bg-white rounded-lg h-8 shadow-2xs shrink-0">
              <button
                type="button"
                onClick={handleDecrementInCart}
                disabled={isProcessing}
                className="w-7 h-full flex items-center justify-center text-[14px] font-semibold text-[#0a1f3d] hover:bg-slate-50 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-6 px-1 h-full flex items-center justify-center text-[12px] font-bold tabular-nums text-[#0a1f3d] select-none">
                {inCartQty}
              </span>
              <button
                type="button"
                onClick={handleIncrementInCart}
                disabled={isProcessing}
                className="w-7 h-full flex items-center justify-center text-[14px] font-semibold text-[#0a1f3d] hover:bg-slate-50 bg-transparent border-none cursor-pointer select-none transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Link
              href="/cart"
              className="flex-1 h-8 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#00a6e0]/35 rounded-lg flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-[#0077b6] no-underline select-none transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0]" />
              <span>In cart ({inCartQty})</span>
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isProcessing}
            className="w-full h-8 sm:h-8.5 bg-[#0a1f3d] hover:bg-[#00a6e0] active:scale-[0.98] text-white text-[11.5px] font-semibold transition-all duration-150 flex items-center justify-center rounded-lg cursor-pointer border-none shadow-xs disabled:opacity-75 select-none px-3 gap-1.5"
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
    </Link>
  );
}
