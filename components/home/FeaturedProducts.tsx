"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageOpen, Briefcase, Sparkles, SlidersHorizontal, Zap, LayoutGrid, Aperture, Table, PanelLeft } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductCardMinimalist from "./FeaturedProductCardMinimalist";
import FeaturedProductCardStructured from "./FeaturedProductCardStructured";
import FeaturedProductCardFloating from "./FeaturedProductCardFloating";
import FeaturedProductCardArchitectural from "./FeaturedProductCardArchitectural";
import FeaturedProductCardStudio from "./FeaturedProductCardStudio";
import FeaturedProductQuickOrderMatrix from "./FeaturedProductQuickOrderMatrix";
import FeaturedProductCardClassic from "./FeaturedProductCardClassic";

export default function FeaturedProducts() {
  const [cardStyle, setCardStyle] = useState<"corporate" | "minimalist" | "structured" | "floating" | "architectural" | "studio" | "matrix" | "classic">("floating");
  const {
    products: filtered,
    loading,
    error,
    isRetrying,
    handleRetry,
  } = useFeaturedProducts(24);

  return (
    <section className="bg-[#f5f7fb] py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
              Featured Products
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Design Layout Switcher (Icon-only) */}
            <div
              className="h-8.5 inline-flex items-center p-0.5 bg-slate-200/80 rounded-full border border-slate-300/60 shadow-2xs gap-0.5"
              role="radiogroup"
              aria-label="Product card design switcher"
            >
              <button
                type="button"
                onClick={() => setCardStyle("corporate")}
                aria-checked={cardStyle === "corporate"}
                aria-label="Corporate Clean layout"
                title="Corporate Clean"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "corporate"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <Briefcase size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("minimalist")}
                aria-checked={cardStyle === "minimalist"}
                aria-label="Minimalist Retail layout"
                title="Minimalist Retail"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "minimalist"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <Sparkles size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("structured")}
                aria-checked={cardStyle === "structured"}
                aria-label="Structured Catalog layout"
                title="Structured Catalog"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "structured"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <SlidersHorizontal size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("floating")}
                aria-checked={cardStyle === "floating"}
                aria-label="Floating Action layout"
                title="Floating Action"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "floating"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <Zap size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("architectural")}
                aria-checked={cardStyle === "architectural"}
                aria-label="Hairline Architectural Grid layout (No cards)"
                title="Architectural Grid (No Cards)"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "architectural"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <LayoutGrid size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("studio")}
                aria-checked={cardStyle === "studio"}
                aria-label="Borderless Studio Canvas layout (Scandinavian)"
                title="Borderless Studio Canvas"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "studio"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <Aperture size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("matrix")}
                aria-checked={cardStyle === "matrix"}
                aria-label="Enterprise Quick-Order Matrix (McMaster-Carr / SAP Ariba)"
                title="Quick-Order Matrix (Dense Table)"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "matrix"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <Table size={14} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => setCardStyle("classic")}
                aria-checked={cardStyle === "classic"}
                aria-label="Original Horizontal Split Card (Classic)"
                title="Original Horizontal Split (Classic)"
                role="radio"
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shrink-0 ${
                  cardStyle === "classic"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-[#0a1f3d] hover:bg-slate-300/50"
                }`}
              >
                <PanelLeft size={14} strokeWidth={2.2} />
              </button>
            </div>

            <Link
              href="/shop"
              className="shrink-0 inline-flex items-center justify-center h-8.5 px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-semibold no-underline hover:bg-[#0f2e5a] transition-colors shadow-2xs"
            >
              View all
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5 items-stretch"
            aria-busy="true"
            aria-label="Loading products"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
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
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto category-card-enter">
            <div className="mb-4 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0f2e5a]">
              <PackageOpen className="w-6 h-6 text-[#0f2e5a]" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#0a1f3d] mb-1.5">
              No products available
            </h3>
            <p className="text-[12px] leading-relaxed text-[#64748b] mb-5">
              We couldn&apos;t find any featured products at the moment.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-8.5 px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-medium hover:bg-[#0f2e5a] transition-colors no-underline"
            >
              Go to Shop
            </Link>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          cardStyle === "matrix" ? (
            /* Enterprise Quick-Order Matrix (Dense procurement line items table) */
            <FeaturedProductQuickOrderMatrix products={filtered} />
          ) : cardStyle === "architectural" ? (
            /* Hairline Architectural Grid: continuous seamless catalog matrix with zero card gaps */
            <div className="bg-slate-200/80 border border-slate-200/90 rounded-xl overflow-hidden gap-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 shadow-2xs category-card-enter">
              {filtered.map((p) => (
                <FeaturedProductCardArchitectural key={`arch-${p.id}`} product={p} />
              ))}
            </div>
          ) : (
            /* Card & Studio canvas layout with clean spacing */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5 items-stretch">
              {filtered.map((p, index) => (
                <div
                  key={`${cardStyle}-${p.id}`}
                  className="category-card-enter h-full"
                  style={{
                    animationDelay: `${Math.min(index * 35, 280)}ms`,
                  }}
                >
                  {cardStyle === "corporate" ? (
                    <FeaturedProductCard product={p} />
                  ) : cardStyle === "minimalist" ? (
                    <FeaturedProductCardMinimalist product={p} />
                  ) : cardStyle === "structured" ? (
                    <FeaturedProductCardStructured product={p} />
                  ) : cardStyle === "floating" ? (
                    <FeaturedProductCardFloating product={p} />
                  ) : cardStyle === "studio" ? (
                    <FeaturedProductCardStudio product={p} />
                  ) : (
                    <FeaturedProductCardClassic product={p} />
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}