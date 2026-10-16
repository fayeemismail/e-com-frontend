"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import FeaturedProductCardArchitectural from "./FeaturedProductCardArchitectural";

export default function FeaturedProducts() {
  const {
    products: filtered,
    loading,
    error,
    isRetrying,
    handleRetry,
    activeCategory,
    setActiveCategory,
  } = useFeaturedProducts(100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat);
      }
    }

    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail === "All Products" ? "All" : customEvent.detail);
      }
    };

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      setActiveCategory(cat || "All");
    };

    window.addEventListener("featuredCategoryChange", handleCategoryChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("featuredCategoryChange", handleCategoryChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setActiveCategory]);

  const gridClassName =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 sm:gap-x-4.5 lg:gap-x-5 gap-y-6 sm:gap-y-7 items-stretch";

  return (
    <section
      id="featured-products"
      className="bg-white border-t border-b border-slate-100 py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav scroll-mt-36"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
              Featured Products
            </h2>
            {activeCategory && activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a1f3d]/10 text-[#0a1f3d] text-[11.5px] font-medium">
                <span>{activeCategory}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    window.dispatchEvent(new CustomEvent("featuredCategoryChange", { detail: "All" }));
                    window.history.pushState({}, "", "/");
                  }}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[#0a1f3d]/20 flex items-center justify-center text-[11px] leading-none cursor-pointer border-none bg-transparent"
                  aria-label="Clear category filter"
                  title="Clear filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <Link
              href="/shop"
              className="shrink-0 inline-flex items-center justify-center h-8 sm:h-8.5 px-3.5 sm:px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-semibold no-underline hover:bg-[#00a6e0] transition-colors shadow-2xs"
            >
              View all
            </Link>
          </div> */}
        </div>

        {/* Loading state */}
        {loading && (
          <div className={gridClassName} aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 10 }).map((_, index) => (
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
              {activeCategory && activeCategory !== "All"
                ? `No featured products in "${activeCategory}"`
                : "No products available"}
            </h3>
            <p className="text-[12px] leading-relaxed text-[#64748b] mb-5">
              {activeCategory && activeCategory !== "All"
                ? "Try viewing all featured items or browse the complete store inventory in the shop."
                : "We couldn't find any featured products at the moment."}
            </p>
            <div className="flex items-center gap-2.5">
              {activeCategory && activeCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    window.dispatchEvent(new CustomEvent("featuredCategoryChange", { detail: "All" }));
                    window.history.pushState({}, "", "/");
                  }}
                  className="inline-flex items-center justify-center h-8.5 px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-medium hover:bg-[#0f2e5a] transition-colors border-none cursor-pointer shadow-xs"
                >
                  View All Featured
                </button>
              )}
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-8.5 px-4 rounded-full border border-slate-300 text-slate-700 hover:bg-white text-[12px] font-medium transition-colors no-underline"
              >
                Go to Shop
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={gridClassName}>
            {filtered.map((p, index) => (
              <div
                key={p.id}
                className="category-card-enter h-full w-full"
                style={{
                  animationDelay: `${Math.min(index * 30, 240)}ms`,
                }}
              >
                <FeaturedProductCardArchitectural product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}