"use client";

import { useEffect, useState, useMemo } from "react";
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

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat);
      }
      const s = params.get("search");
      if (s) {
        setSearchQuery(s);
      }
    }

    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail === "All Products" ? "All" : customEvent.detail);
      }
    };

    const handleSearchChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail || "");
      if (customEvent.detail) {
        const el = document.getElementById("featured-products");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      setActiveCategory(cat || "All");
      const s = params.get("search");
      setSearchQuery(s || "");
    };

    window.addEventListener("featuredCategoryChange", handleCategoryChange);
    window.addEventListener("featuredSearchChange", handleSearchChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("featuredCategoryChange", handleCategoryChange);
      window.removeEventListener("featuredSearchChange", handleSearchChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setActiveCategory]);

  const clearSearch = () => {
    setSearchQuery("");
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.pushState(
      {},
      "",
      url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
    );
  };

  const clearCategory = () => {
    setActiveCategory("All");
    window.dispatchEvent(new CustomEvent("featuredCategoryChange", { detail: "All" }));
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.pushState(
      {},
      "",
      url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
    );
  };

  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return filtered;
    const q = searchQuery.toLowerCase().trim();
    return filtered.filter((p) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sapId?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [filtered, searchQuery]);

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
              {searchQuery ? "Search Results" : "Featured Products"}
            </h2>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00a6e0] border border-blue-200 text-[11.5px] font-medium">
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="w-3.5 h-3.5 rounded-full hover:bg-blue-100 flex items-center justify-center text-[11px] leading-none cursor-pointer border-none bg-transparent text-[#00a6e0]"
                  aria-label="Clear search filter"
                  title="Clear search"
                >
                  ×
                </button>
              </span>
            )}
            {activeCategory && activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a1f3d]/10 text-[#0a1f3d] text-[11.5px] font-medium">
                <span>{activeCategory}</span>
                <button
                  type="button"
                  onClick={clearCategory}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[#0a1f3d]/20 flex items-center justify-center text-[11px] leading-none cursor-pointer border-none bg-transparent"
                  aria-label="Clear category filter"
                  title="Clear filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
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
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto category-card-enter">
            <div className="mb-4 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0f2e5a]">
              <PackageOpen className="w-6 h-6 text-[#0f2e5a]" />
            </div>
            <h3 className="text-[14px] font-semibold text-[#0a1f3d] mb-1.5">
              {searchQuery
                ? `No products matching "${searchQuery}"`
                : activeCategory && activeCategory !== "All"
                ? `No featured products in "${activeCategory}"`
                : "No products available"}
            </h3>
            <p className="text-[12px] leading-relaxed text-[#64748b] mb-5">
              {searchQuery
                ? "Try checking for typos or searching for a different keyword or category."
                : activeCategory && activeCategory !== "All"
                ? "Try viewing all featured items or browse other categories."
                : "We couldn't find any featured products at the moment."}
            </p>
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex items-center justify-center h-8.5 px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-medium hover:bg-[#0f2e5a] transition-colors border-none cursor-pointer shadow-xs"
                >
                  Clear Search
                </button>
              )}
              {activeCategory && activeCategory !== "All" && (
                <button
                  type="button"
                  onClick={clearCategory}
                  className="inline-flex items-center justify-center h-8.5 px-4 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-[12px] font-medium transition-colors cursor-pointer"
                >
                  View All Categories
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && displayedProducts.length > 0 && (
          <div className={gridClassName}>
            {displayedProducts.map((p, index) => (
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