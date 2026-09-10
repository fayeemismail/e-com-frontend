"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import ErrorState from "@/components/common/ErrorState";
import { useCart } from "@/context/CartContext";
import { productService, BackendSku } from "@/lib/api/product.service";

function getUnitLabel(product: DisplayProduct, currentSku?: BackendSku): string | null {
  const checkValue = (val: any): string | null => {
    if (typeof val === "string" && val.trim()) {
      const clean = val.trim();
      const lower = clean.toLowerCase();

      // If unit is "-" or dash or indicates single piece/none, no need to add any name
      if (
        clean === "-" ||
        clean === "--" ||
        clean === "—" ||
        clean === "–" ||
        lower === "single" ||
        lower === "single piece" ||
        lower === "1 piece" ||
        lower === "1 pc" ||
        lower === "1" ||
        lower === "none" ||
        lower === "n/a"
      ) {
        return null;
      }

      // Dozen in capital letters
      if (lower === "dz" || lower === "dozen" || lower === "doz") return "DZ";
      // Pack / pac in capital letters
      if (lower === "pac" || lower === "pack") return "PAC";
      // Piece / pc in capital letters
      if (lower === "pc" || lower === "pcs" || lower === "piece") return "PC";

      // Show name in capital letters, excluding "-"
      const formatted = clean.replace(/^\/+\s*/, "").toUpperCase();
      if (formatted === "-" || formatted === "--") return null;
      return formatted;
    }
    return null;
  };

  // 1. Check currentSku direct properties and attributes
  if (currentSku) {
    const s = currentSku as any;
    const fromSku =
      checkValue(s.unitName) ||
      checkValue(s.unit_name) ||
      checkValue(s.unit) ||
      checkValue(s.pricingUnit) ||
      checkValue(s.priceUnit) ||
      checkValue(s.uom) ||
      checkValue(s.attributes?.unitName) ||
      checkValue(s.attributes?.['Unit Name']) ||
      checkValue(s.attributes?.unit_name) ||
      checkValue(s.attributes?.unit) ||
      checkValue(s.attributes?.Unit) ||
      checkValue(s.attributes?.pricingUnit) ||
      checkValue(s.attributes?.format) ||
      checkValue(s.attributes?.Format);
    if (fromSku !== null) return fromSku;
  }

  // 2. Check product direct properties and attributes
  const p = product as any;
  const fromProduct =
    checkValue(p.unitName) ||
    checkValue(p.unit_name) ||
    checkValue(p.unit) ||
    checkValue(p.pricingUnit) ||
    checkValue(p.priceUnit) ||
    checkValue(p.uom) ||
    checkValue(p.attributes?.unitName) ||
    checkValue(p.attributes?.['Unit Name']) ||
    checkValue(p.attributes?.unit_name) ||
    checkValue(p.attributes?.unit) ||
    checkValue(p.attributes?.Unit) ||
    checkValue(p.attributes?.pricingUnit) ||
    checkValue(p.attributes?.uom) ||
    checkValue(p.attributes?.package) ||
    checkValue(p.attributes?.packaging);
  if (fromProduct !== null) return fromProduct;

  // 3. Check defaultSku
  if (p.defaultSku) {
    const ds = p.defaultSku as any;
    const fromDefault =
      checkValue(ds.unitName) ||
      checkValue(ds.unit_name) ||
      checkValue(ds.unit) ||
      checkValue(ds.attributes?.unitName) ||
      checkValue(ds.attributes?.['Unit Name']) ||
      checkValue(ds.attributes?.unit_name) ||
      checkValue(ds.attributes?.unit) ||
      checkValue(ds.attributes?.Unit) ||
      checkValue(ds.attributes?.format);
    if (fromDefault !== null) return fromDefault;
  }

  // 4. Check rawProduct if available
  if (p.rawProduct) {
    const raw = p.rawProduct;
    const fromRaw =
      checkValue(raw.unitName) ||
      checkValue(raw.unit_name) ||
      checkValue(raw.unit) ||
      checkValue(raw.pricingUnit) ||
      checkValue(raw.priceUnit) ||
      checkValue(raw.uom) ||
      checkValue(raw.attributes?.unitName) ||
      checkValue(raw.attributes?.['Unit Name']) ||
      checkValue(raw.attributes?.unit_name) ||
      checkValue(raw.attributes?.unit) ||
      checkValue(raw.attributes?.Unit);
    if (fromRaw !== null) return fromRaw;

    // Search any key containing 'unit' in rawProduct
    for (const [k, v] of Object.entries(raw)) {
      if (/unit/i.test(k) && typeof v === "string") {
        const res = checkValue(v);
        if (res !== null) return res;
      }
    }
  }

  // 5. Search any key containing 'unit' in attributes
  if (p.attributes && typeof p.attributes === "object") {
    for (const [k, v] of Object.entries(p.attributes)) {
      if (/unit/i.test(k) && typeof v === "string") {
        const res = checkValue(v);
        if (res !== null) return res;
      }
    }
  }

  // 6. Check product title/name for unit indicators
  const title = product.name?.toLowerCase() || "";
  if (/\b(dz|dozen|doz)\b/i.test(title)) return "DZ";
  if (/\b(pac|pack)\b/i.test(title)) return "PAC";
  if (/\b(pc|pcs)\b/i.test(title)) return "PC";
  const packMatch = title.match(/\b(box|set|bundle|pkt|packet|carton|pair)\b/i);
  if (packMatch) return packMatch[1].toUpperCase();

  return null;
}

function getAvailableUnits(product: DisplayProduct): { sku: string; label: string; skuObj: BackendSku }[] {
  if (!product.skus || product.skus.length <= 1) return [];

  const list: { sku: string; label: string; skuObj: BackendSku }[] = [];
  const seen = new Set<string>();

  for (const s of product.skus) {
    const raw =
      (s as any).unitName ||
      (s as any).unit_name ||
      (s as any).unit ||
      s.attributes?.unitName ||
      s.attributes?.['Unit Name'] ||
      s.attributes?.unit_name ||
      s.attributes?.unit ||
      s.attributes?.Unit ||
      s.attributes?.format ||
      s.attributes?.Format ||
      s.sku;

    let label = String(raw).trim();
    if (label === "-" || label === "--" || label === "—") continue;

    const lower = label.toLowerCase();
    if (lower === "dz" || lower === "dozen" || lower === "doz") label = "DZ";
    else if (lower === "pac" || lower === "pack") label = "PAC";
    else if (lower === "pc" || lower === "piece" || lower === "pcs") label = "PC";
    else label = label.toUpperCase().replace(/^\/+\s*/, "");

    if (label === "-" || label === "--") continue;

    if (!seen.has(label)) {
      seen.add(label);
      list.push({ sku: s.sku, label, skuObj: s });
    }
  }

  return list.length > 1 ? list : [];
}

function GridCard({ product }: { product: DisplayProduct }) {
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSelectingQty, setIsSelectingQty] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [selectedSku, setSelectedSku] = useState<BackendSku | undefined>(product.defaultSku);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!selectedSku && product.defaultSku) {
      setSelectedSku(product.defaultSku);
    }
  }, [product.defaultSku, selectedSku]);

  const currentSku = selectedSku || product.defaultSku;
  const unitLabel = getUnitLabel(product, currentSku);
  const currentPrice = (currentSku?.type === "buy" ? currentSku.price : currentSku?.rentPricePerDay) ?? product.price;
  const availableUnits = getAvailableUnits(product);

  const handleOpenQtySelector = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelectingQty(true);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => q + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setQuantity(Math.min(val, 999));
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    try {
      setIsAdding(true);
      let targetSku = currentSku;

      if (!targetSku) {
        const detail = await productService.getProductById(String(product.id));
        if (detail?.skus && detail.skus.length > 0) {
          targetSku = detail.skus.find((s) => s.type === "buy") || detail.skus[0];
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
        quantity: Math.max(1, quantity),
        transactionType: selectedType,
        rentalDurationDays: durationDays,
      });

      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        setIsSelectingQty(false);
        setQuantity(1);
      }, 1500);
    } catch (err) {
      console.error("Failed to add to cart from home product section:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      className="cursor-pointer group no-underline block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#f4f1ec]"
        style={{ paddingBottom: "100%" }}
      >
        {product.tag && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[8px] tracking-[0.16em] uppercase bg-white text-[#111] px-1.5 sm:px-2 py-0.5 sm:py-0.75">
            {product.tag}
          </span>
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Add to cart / Quantity Selector overlay */}
        {!isSelectingQty ? (
          <div
            onClick={handleOpenQtySelector}
            className={`absolute bottom-0 left-0 right-0 bg-[#111] hover:bg-[#222] text-center py-2 sm:py-3 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-white transition-transform duration-300 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
              hovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            Add to Cart
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute inset-x-0 bottom-0 bg-[#111]/95 backdrop-blur-xs text-white p-2 sm:p-2.5 z-20 flex flex-col gap-1.5 shadow-lg"
          >
            {addedSuccess ? (
              <div className="py-2.5 flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-[#7cd387] font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Added ({quantity}{unitLabel ? ` ${unitLabel}` : ""})</span>
              </div>
            ) : (
              <>
                {/* Header row: Qty label and cancel button */}
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] tracking-[0.14em] uppercase text-[#aaa]">
                  <span>
                    Select Qty{unitLabel ? ` (${unitLabel})` : ""}:
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsSelectingQty(false);
                    }}
                    className="text-[#888] hover:text-white p-0.5 text-[11px] leading-none cursor-pointer bg-transparent border-none"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Available Unit Switcher (if product offers both pc and dz) */}
                {availableUnits.length > 1 && (
                  <div className="flex items-center gap-1">
                    {availableUnits.map((u) => {
                      const isSel = (selectedSku?.sku === u.sku) || (!selectedSku && u.sku === currentSku?.sku);
                      return (
                        <button
                          key={u.sku}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSku(u.skuObj);
                          }}
                          className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 border cursor-pointer transition-colors ${
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

                {/* Counter & Confirm Add */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center border border-[#444] bg-[#222] rounded-xs shrink-0">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-5 sm:w-6 h-6 sm:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer select-none"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={handleQuantityChange}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-6 sm:w-8 h-6 sm:h-7 text-center text-[10px] sm:text-[11px] font-mono bg-transparent text-white border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-5 sm:w-6 h-6 sm:h-7 flex items-center justify-center text-xs text-white hover:bg-[#333] bg-transparent border-none cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 h-6 sm:h-7 bg-[#c4a882] hover:bg-[#b5966d] text-[#111] text-[8px] sm:text-[9px] tracking-[0.14em] uppercase font-semibold transition-colors flex items-center justify-center gap-1 rounded-xs cursor-pointer border-none disabled:opacity-75 select-none"
                  >
                    {isAdding ? (
                      <svg className="animate-spin h-2.5 w-2.5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <span>Add · ₹{currentPrice * quantity}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-2 sm:pt-3 pb-1">
        {/* Improved Category */}
        <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#999] mb-1 leading-relaxed">
          {product.category}
        </p>

        {/* Product Name */}
        <p
          className={`text-[12px] sm:text-[13px] leading-snug mb-1 transition-colors duration-200 truncate ${
            hovered ? "text-[#c4a882]" : "text-[#111]"
          }`}
        >
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[12px] sm:text-[13px] text-[#111] font-medium">
            ₹{currentPrice}
            {unitLabel && (
              <span className="text-[11px] sm:text-[12px] text-[#555] font-medium ml-1 uppercase">
                / {unitLabel}
              </span>
            )}
          </span>

          {product.compareAtPrice && (
            <span className="text-[10px] sm:text-[11px] text-[#ccc] line-through">
              ₹{product.compareAtPrice}
              {unitLabel && (
                <span className="text-[9px] text-[#aaa] ml-0.5 uppercase">
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

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#f0eeea] w-full relative overflow-hidden mb-2" style={{ paddingBottom: "100%" }} />
      <div className="pt-1 pb-1">
        <div className="h-2 bg-[#e8e6e2] w-1/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-3/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-1/2 rounded" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const {
    products: filtered,
    loading,
    error,
    isRetrying,
    activeCategory: active,
    setActiveCategory: setActive,
    categories,
    handleRetry,
  } = useFeaturedProducts(8);

  return (
    <section className="bg-[#faf9f6] py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-10 min-h-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6 border-b border-[#e8e4de] pb-4 sm:pb-5">
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">
          Shop by Category 
        </h2>

        {/* Filter tabs — scrollable on mobile */}
        {!loading && !error && categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`text-[9px] tracking-[0.14em] uppercase px-2.5 sm:px-3 py-1.5 border bg-transparent cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0 ${
                  active === cat
                    ? "border-[#111] text-[#111]"
                    : "border-transparent text-[#888] hover:text-[#111] hover:border-[#ddd]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <Link
          href="/shop"
          className="text-[10px] tracking-[0.12em] uppercase text-[#c4a882] no-underline border-b border-[#c4a882] pb-px self-start sm:self-auto"
        >
          View All
        </Link>
      </div>

      {/* Loading view */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorState
          error={error}
          isRetrying={isRetrying}
          handleRetry={handleRetry}
        />
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
          <div className="mb-5 w-14 h-14 rounded-full bg-[#f3efe6] flex items-center justify-center text-[#c4a882] text-lg select-none">
            📚
          </div>
          <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
            Curating Our Bookshelf
          </h3>
          <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
            We are currently refreshing our collection with new literary gems. Check back shortly or view the catalog.
          </p>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 hover:bg-[#333] transition-all duration-300 no-underline font-light inline-block"
          >
            Explore the Shop
          </Link>
        </div>
      )}

      {/* Responsive grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filtered.map((p) => (
            <GridCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}