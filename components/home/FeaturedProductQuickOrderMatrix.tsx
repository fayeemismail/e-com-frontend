"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";
import { getUnitLabel, getAvailableUnits } from "@/lib/utils/unit.util";
import { formatPrice } from "@/lib/utils/format.util";
import { ShoppingCart, Check, Zap, Plus, Minus } from "lucide-react";

interface FeaturedProductQuickOrderMatrixProps {
  products: DisplayProduct[];
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

function QuickOrderRow({ product }: { product: DisplayProduct }) {
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
    <div className="group relative flex flex-col lg:grid lg:grid-cols-12 gap-3 px-3.5 sm:px-4 py-3 bg-white hover:bg-slate-50/90 transition-colors border-b border-slate-200/70 items-center select-none">
      {/* 1. Item Thumbnail (Col 1 on desktop) */}
      <div className="flex items-center gap-3 w-full lg:w-auto lg:col-span-1 shrink-0">
        <Link
          href={`/shop/${product.id}`}
          className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-lg border border-slate-200/90 bg-white overflow-hidden shrink-0 block"
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            sizes="64px"
            onError={() => setImgFailed(true)}
            className={`w-full h-full ${
              useProductPhoto ? "object-cover object-center" : "object-contain object-center p-1.5"
            }`}
          />
        </Link>

        {/* Mobile/Tablet title section */}
        <div className="flex-1 min-w-0 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              #{skuString || "—"}
            </span>
            <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
          </div>
          <Link
            href={`/shop/${product.id}`}
            className="text-[13px] font-semibold text-[#0a1f3d] hover:text-[#00a6e0] transition-colors leading-tight line-clamp-1 no-underline block"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[14px] font-bold text-[#0a1f3d]">
              {formatPrice(currentPrice)} SAR
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              /{unitLabel || "unit"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SAP ID (Desktop Col 2) */}
      <div className="hidden lg:flex col-span-2 items-center min-w-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-[11px] font-mono font-medium text-slate-700 truncate">
          #{skuString || "—"}
        </span>
      </div>

      {/* 3. Product Title & Category (Desktop Col 4) */}
      <div className="hidden lg:flex flex-col col-span-4 min-w-0 pr-3">
        <Link
          href={`/shop/${product.id}`}
          title={product.name}
          className="text-[13px] font-semibold text-[#0a1f3d] hover:text-[#00a6e0] transition-colors leading-snug truncate no-underline"
        >
          {product.name}
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 truncate mt-0.5">
          {product.category || "General Procurement"}
        </span>
      </div>

      {/* 4. Unit of Measure (UOM) (Desktop Col 1) */}
      <div className="hidden lg:flex col-span-1 items-center">
        {availableUnits.length > 1 ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-1"
          >
            {availableUnits.map((u) => {
              const isSel = selectedSku?.sku === u.sku || (!selectedSku && u.sku === currentSku?.sku);
              return (
                <button
                  key={u.sku}
                  type="button"
                  onClick={() => setSelectedSku(u.skuObj)}
                  className={`text-[9.5px] uppercase font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer font-semibold ${
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
        ) : (
          <span className="text-[11px] font-mono uppercase font-medium text-slate-700">
            {unitLabel || "Each"}
          </span>
        )}
      </div>

      {/* 5. Inventory Status (Desktop Col 1) */}
      <div className="hidden lg:flex col-span-1 items-center justify-center">
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          In stock
        </span>
      </div>

      {/* 6. Contract Price (Desktop Col 1) */}
      <div className="hidden lg:flex flex-col col-span-1 items-end min-w-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[14px] font-bold text-[#0a1f3d] tabular-nums tracking-tight">
            {formatPrice(currentPrice)}
          </span>
          <span className="text-[9.5px] font-bold text-[#0a1f3d]">SAR</span>
        </div>
        <span className="text-[9px] text-slate-400 uppercase font-mono">
          /{unitLabel || "unit"}
        </span>
      </div>

      {/* 7. In-Row Stepper + Add Action (Desktop Col 2, Mobile Full Width) */}
      <div className="w-full lg:w-auto lg:col-span-2 flex items-center justify-end">
        {inCartQty > 0 ? (
          <div className="flex items-center h-8 w-full sm:w-auto rounded-lg border border-[#0a1f3d] bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={handleDecrementInCart}
              disabled={isProcessing}
              className="w-7 h-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-slate-100 bg-transparent border-none cursor-pointer transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={11} strokeWidth={2.4} />
            </button>
            <span className="px-2.5 text-[11px] font-bold font-mono text-[#0a1f3d] bg-[#f0f9ff] h-full flex items-center justify-center border-x border-[#0a1f3d]/20 whitespace-nowrap">
              {inCartQty} in req
            </span>
            <button
              type="button"
              onClick={handleIncrementInCart}
              disabled={isProcessing}
              className="w-7 h-full flex items-center justify-center text-[13px] font-semibold text-[#0a1f3d] hover:bg-slate-100 bg-transparent border-none cursor-pointer transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={11} strokeWidth={2.4} />
            </button>
          </div>
        ) : (
          <div className="flex items-stretch h-8 w-full sm:w-auto rounded-lg border border-slate-300 bg-white overflow-hidden shadow-2xs focus-within:border-[#0a1f3d]">
            <div className="flex items-center bg-slate-50 border-r border-slate-200 shrink-0">
              <button
                type="button"
                onClick={handleLocalDecrement}
                disabled={localQty <= 1 || isProcessing}
                className="w-6 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-30 bg-transparent border-none cursor-pointer transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={10} strokeWidth={2.4} />
              </button>
              <span className="w-6 h-full flex items-center justify-center text-[11px] font-bold font-mono tabular-nums text-[#0a1f3d] select-none">
                {localQty}
              </span>
              <button
                type="button"
                onClick={handleLocalIncrement}
                disabled={isProcessing}
                className="w-6 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 bg-transparent border-none cursor-pointer transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={10} strokeWidth={2.4} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isProcessing}
              className="px-3 h-full bg-[#0a1f3d] hover:bg-[#00a6e0] active:bg-[#081930] text-white text-[10.5px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer border-none disabled:opacity-75 whitespace-nowrap"
            >
              {isProcessing ? (
                <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <ShoppingCart size={11} strokeWidth={2.2} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeaturedProductQuickOrderMatrix({ products }: FeaturedProductQuickOrderMatrixProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden category-card-enter">
      {/* Table Header (Desktop) */}
      <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold items-center select-none">
        <div className="col-span-1">Item</div>
        <div className="col-span-2">SAP ID</div>
        <div className="col-span-4">Product Name & Category</div>
        <div className="col-span-1">UOM</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">Contract Price</div>
        <div className="col-span-2 text-right">Requisition</div>
      </div>

      {/* Table Body / Line Items */}
      <div className="divide-y divide-slate-100">
        {products.map((p) => (
          <QuickOrderRow key={`matrix-${p.id}`} product={p} />
        ))}
      </div>
    </div>
  );
}
