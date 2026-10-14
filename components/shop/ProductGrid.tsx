"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import ProductCard from "./ProductCard";
import { formatPrice } from "@/lib/utils/format.util";

type Props = {
  products: DisplayProduct[];
  view: "grid" | "list";
  onReset: () => void;
};

// Category visual helper
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

function ProductListRow({ product, index }: { product: DisplayProduct; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const fallbackVisual = getCategoryVisualPath(product.category, product.name);
  const useProductPhoto = !imgFailed && !isPlaceholderImage(product.image);
  const imageSrc = useProductPhoto ? product.image : fallbackVisual;

  const skuString =
    (product as any).rawProduct?.sapId ||
    (product as any).sapId ||
    product.defaultSku?.sku ||
    (product as any).sku ||
    (product.skus && product.skus[0]?.sku) ||
    "";

  return (
    <div
      key={product.id}
      className="category-card-enter"
      style={{ animationDelay: `${Math.min(index * 24, 200)}ms` }}
    >
      <Link
        href={`/shop/${product.id}`}
        className="flex items-center gap-4 py-3.5 sm:py-4 cursor-pointer group no-underline text-inherit hover:bg-[#f8fafc] px-3 sm:px-4 transition-colors rounded-xs"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#f5f7fb] border border-[#e2e8f0] overflow-hidden rounded-md flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            sizes="80px"
            onError={() => setImgFailed(true)}
            className={`select-none transition-transform duration-200 group-hover:scale-105 ${
              useProductPhoto
                ? "object-cover object-center"
                : "object-contain object-center p-2.5"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9.5px] uppercase tracking-wider text-[#64748b] font-medium">
              {product.category || "—"}
            </span>
            <span className="text-[8.5px] font-medium tracking-[0.04em] uppercase text-emerald-700 whitespace-nowrap">
              In stock
            </span>
          </div>
          <p className="text-[13px] sm:text-[14px] font-medium text-[#0f172a] group-hover:text-[#0f2e5a] transition-colors truncate m-0">
            {product.name}
          </p>
          {skuString && (
            <p className="text-[10.5px] text-[#64748b] font-mono mt-0.5 m-0">
              SAP ID: <span className="text-[#0f172a] font-semibold">{skuString}</span>
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[14px] sm:text-[16px] font-semibold text-[#0a1f3d] m-0">
            {formatPrice(product.price)} SAR
          </p>
          {product.compareAtPrice && (
            <p className="text-[11px] text-[#94a3b8] line-through m-0 mt-0.5">
              {formatPrice(product.compareAtPrice)} SAR
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function ProductGrid({ products, view, onReset }: Props) {
  const gridKey = products.map((p) => p.id).slice(0, 4).join("-") || "empty";

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto category-card-enter">
        <div className="mb-5 w-14 h-14 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#0f2e5a] text-lg select-none border border-[#e2e8f0]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#0f172a] font-semibold mb-2.5">
          No Results Found
        </h3>
        <p className="text-[11px] leading-relaxed text-[#64748b] font-light tracking-wide mb-6">
          We couldn&apos;t find any items matching your current filters. Try resetting them or selecting a different category.
        </p>

        <button
          onClick={onReset}
          className="text-[10px] tracking-[0.16em] uppercase bg-[#0f2e5a] hover:bg-[#0b2447] text-white px-6 py-3 border-none cursor-pointer transition-colors duration-200 rounded-xs font-semibold shadow-2xs"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div key={`list-${gridKey}`} className="divide-y divide-[#e2e8f0] bg-white border border-[#e2e8f0] rounded-md overflow-hidden">
        {products.map((p, index) => (
          <ProductListRow key={p.id} product={p} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      key={`grid-${gridKey}`}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start"
    >
      {products.map((p, index) => (
        <div
          key={p.id}
          className="category-card-enter h-full"
          style={{ animationDelay: `${Math.min(index * 28, 220)}ms` }}
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}