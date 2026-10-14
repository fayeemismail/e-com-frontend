"use client";

import { useRef } from "react";
import Link from "next/link";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import {
  CategoryPillSkeleton,
  ProductCardSkeleton,
} from "@/components/common/Skeleton";
import FeaturedProductCard from "./FeaturedProductCard";

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
  } = useFeaturedProducts(24);

  const tabsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftRef.current = tabsRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !tabsRef.current) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    tabsRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="bg-[#f5f7fb] py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav">
      {/* Section header + category filters */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
            Categories
          </h2>

          <Link
            href="/shop"
            className="shrink-0 inline-flex items-center justify-center h-9 px-3.5 sm:px-4 rounded-full bg-[#0a1f3d] text-white text-[12.5px] font-medium no-underline hover:bg-[#0f2e5a] transition-colors"
          >
            View all
          </Link>
        </div>

        {loading && (
          <div
            className="flex items-center gap-2 overflow-hidden pb-1"
            aria-hidden
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <CategoryPillSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && categories.length > 1 && (
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Product categories"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-1 no-scrollbar select-none cursor-grab active:cursor-grabbing"
          >
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    setActive(cat);
                  }}
                  className={`min-h-8 px-3 sm:px-3.5 rounded-full text-[12px] sm:text-[12.5px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e6bb8] ${
                    isActive
                      ? "bg-[#0a1f3d] border-[#0a1f3d] text-white shadow-sm"
                      : "bg-white border-[#d7dee8] text-[#334155] hover:border-[#1e6bb8] hover:text-[#0a1f3d]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start"
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
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
          <div className="mb-5 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#0f2e5a] text-lg select-none">
            📚
          </div>
          <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
            Curating Our Collection
          </h3>
          <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
            We are currently refreshing our collection with new items. Check back shortly or view the catalog.
          </p>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 hover:bg-[#333] transition-all duration-300 no-underline font-light inline-block"
          >
            Explore the Shop
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start">
          {filtered.map((p) => (
            <FeaturedProductCard key={p.id} product={p} />
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