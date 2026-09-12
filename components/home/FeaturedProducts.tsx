"use client";

import { useRef } from "react";
import Link from "next/link";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import FeaturedProductCard from "./FeaturedProductCard";
import CardSkeleton from "./CardSkeleton";

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
    <section className="bg-[#faf9f6] py-6 sm:py-8 md:py-12 lg:py-14 px-3 sm:px-4 md:px-8 lg:px-10 min-h-100">
      {/* Section Header: On reduced screens (< xl), heading is top-left, View All is top-right, tabs are below and swipeable */}
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-2.5 sm:gap-3 xl:gap-4 mb-4 sm:mb-5 md:mb-6 border-b border-[#e8e4de] pb-3 sm:pb-4 md:pb-5">
        {/* On < xl, this renders Heading on top-left and View All on top-right */}
        <div className="flex items-center justify-between w-full xl:w-auto">
          <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0 shrink-0">
            Shop By category
          </h2>

          <Link
            href="/shop"
            className="xl:hidden text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#0f2e5a] hover:text-[#0b2447] no-underline border-b border-[#0f2e5a] hover:border-[#0b2447] pb-0.5 transition-colors shrink-0"
          >
            View All
          </Link>
        </div>

        {/* Category tabs: below on < xl across full width; horizontally swipeable without scrollbar */}
        {!loading && !error && categories.length > 1 && (
          <div
            ref={tabsRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex items-center gap-1.5 overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4 md:-mx-8 md:px-8 xl:mx-0 xl:px-0 py-0.5 no-scrollbar select-none cursor-grab active:cursor-grabbing w-full xl:w-auto xl:flex-1 xl:justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  setActive(cat);
                }}
                className={`text-[8.5px] sm:text-[9px] tracking-[0.12em] uppercase px-2.5 sm:px-3 py-1.5 border bg-transparent cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0 rounded-xs ${
                  active === cat
                    ? "border-[#0f2e5a] text-[#0f2e5a] bg-blue-50/50 font-semibold"
                    : "border-transparent text-[#64748b] hover:text-[#0f2e5a] hover:border-[#cbd5e1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* View All button on wide desktop (xl: and above) on the far right */}
        <Link
          href="/shop"
          className="hidden xl:inline-block text-[10px] tracking-[0.12em] uppercase text-[#0f2e5a] hover:text-[#0b2447] no-underline border-b border-[#0f2e5a] hover:border-[#0b2447] pb-0.5 transition-colors shrink-0"
        >
          View All
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
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

      {/* Responsive product grid: 2 cols on mobile (< 600px), 4 cols on half-screen/55% and desktop (>= 600px) */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
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