"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
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
    allProducts,
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: allProducts.length,
    };
    for (const prod of allProducts) {
      if (prod.category) {
        counts[prod.category] = (counts[prod.category] || 0) + 1;
      }
    }
    return counts;
  }, [allProducts]);

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

  const handleCategorySelect = (cat: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasDraggedRef.current) return;
    setActive(cat);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <section className="bg-[#f5f7fb] py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav">
      {/* Section header + category filters */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
              Categories
            </h2>
            <p className="text-[12px] sm:text-[12.5px] text-[#64748b] mt-1 m-0">
              Select a category to filter contract stationery and office essentials
            </p>
          </div>

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
            className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-1.5 pt-0.5 no-scrollbar select-none cursor-grab active:cursor-grabbing"
          >
            {categories.map((cat) => {
              const isActive = active === cat;
              const count = categoryCounts[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleCategorySelect(cat, e)}
                  className={`group relative min-h-8.5 px-3 sm:px-3.5 py-1 rounded-full text-[12px] sm:text-[12.5px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e6bb8] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0a1f3d] border-[#0a1f3d] text-white"
                      : "bg-white border-[#d7dee8] text-[#334155] hover:border-[#1e6bb8] hover:text-[#0a1f3d] hover:bg-[#f8fafc]"
                  }`}
                >
                  <span>{cat}</span>
                  {typeof count === "number" && (
                    <span
                      className={`text-[10px] sm:text-[10.5px] px-1.5 py-0.2 rounded-full font-semibold transition-colors tabular-nums ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#eef2f7] text-[#64748b] group-hover:bg-[#e2e8f0] group-hover:text-[#0a1f3d]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
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
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto category-card-enter">
          <div className="mb-4 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0f2e5a]">
            <PackageOpen className="w-6 h-6 text-[#0f2e5a]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[#0a1f3d] mb-1.5">
            No items in {active}
          </h3>
          <p className="text-[12px] leading-relaxed text-[#64748b] mb-5">
            We couldn't find any contract products under this category in the current featured selection.
          </p>
          <button
            type="button"
            onClick={() => setActive("All")}
            className="inline-flex items-center justify-center h-8.5 px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-medium hover:bg-[#0f2e5a] transition-colors cursor-pointer border-none"
          >
            Show all categories
          </button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div
          key={active}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start"
        >
          {filtered.map((p, index) => (
            <div
              key={p.id}
              className="category-card-enter h-full"
              style={{
                animationDelay: `${Math.min(index * 35, 280)}ms`,
              }}
            >
              <FeaturedProductCard product={p} />
            </div>
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