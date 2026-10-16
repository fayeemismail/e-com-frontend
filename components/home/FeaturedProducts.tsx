"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import FeaturedProductCard from "./FeaturedProductCard";
import FeaturedProductCardArchitectural from "./FeaturedProductCardArchitectural";

export default function FeaturedProducts() {
  const [columns, setColumns] = useState<4 | 5>(5);
  const [layoutStyle, setLayoutStyle] = useState<"card" | "cardless">("card");

  const {
    products: filtered,
    loading,
    error,
    isRetrying,
    handleRetry,
    activeCategory,
    setActiveCategory,
  } = useFeaturedProducts(24);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCols = localStorage.getItem("officecare_feat_cols");
      if (savedCols === "4" || savedCols === "5") {
        setColumns(Number(savedCols) as 4 | 5);
      }

      const savedLayout = localStorage.getItem("officecare_feat_layout");
      if (savedLayout === "card" || savedLayout === "cardless") {
        setLayoutStyle(savedLayout as "card" | "cardless");
      }

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

  const handleToggleColumns = (val: 4 | 5) => {
    setColumns(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("officecare_feat_cols", String(val));
    }
  };

  const handleToggleLayoutStyle = (val: "card" | "cardless") => {
    setLayoutStyle(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("officecare_feat_layout", val);
    }
  };

  const colClass =
    columns === 5
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const cardGridClassName = `grid ${colClass} ${
    columns === 5
      ? "gap-3.5 sm:gap-4 lg:gap-4.5"
      : "gap-4 sm:gap-4.5 lg:gap-5"
  } items-stretch`;

  const cardlessGridClassName = `grid ${colClass} gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-7 sm:gap-y-9 items-stretch`;

  return (
    <section
      id="featured-products"
      className={`${
        layoutStyle === "cardless" ? "bg-white border-t border-b border-slate-100" : "bg-[#f5f7fb]"
      } py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav scroll-mt-36 transition-colors duration-200`}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
              Featured Products
            </h2>
            {activeCategory && activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a1f3d]/10 text-[#0a1f3d] text-[11.5px] font-medium animate-fadeIn">
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

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Layout Style Switcher: Card vs Cardless */}
            <div
              className="inline-flex items-center p-0.5 bg-white rounded-full border border-slate-200/90 shadow-2xs"
              role="radiogroup"
              aria-label="Layout style"
            >
              <button
                type="button"
                onClick={() => handleToggleLayoutStyle("card")}
                aria-checked={layoutStyle === "card"}
                title="Card Layout (Individual recessed cards)"
                className={`h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border-none flex items-center gap-1 select-none ${
                  layoutStyle === "card"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleLayoutStyle("cardless")}
                aria-checked={layoutStyle === "cardless"}
                title="Cardless Architectural Grid (Continuous 1px matrix)"
                className={`h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border-none flex items-center gap-1 select-none ${
                  layoutStyle === "cardless"
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Cardless</span>
              </button>
            </div>

            {/* 4 vs 5 Products per Row Switcher */}
            <div
              className="inline-flex items-center p-0.5 bg-white rounded-full border border-slate-200/90 shadow-2xs"
              role="radiogroup"
              aria-label="Products per row"
            >
              <button
                type="button"
                onClick={() => handleToggleColumns(4)}
                aria-checked={columns === 4}
                title="4 products per row"
                className={`w-7 h-7 rounded-full text-[12px] font-semibold transition-all cursor-pointer border-none flex items-center justify-center select-none ${
                  columns === 4
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>4</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleColumns(5)}
                aria-checked={columns === 5}
                title="5 products per row"
                className={`w-7 h-7 rounded-full text-[12px] font-semibold transition-all cursor-pointer border-none flex items-center justify-center select-none ${
                  columns === 5
                    ? "bg-[#0a1f3d] text-white shadow-xs"
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>5</span>
              </button>
            </div>

            <Link
              href="/shop"
              className="shrink-0 inline-flex items-center justify-center h-8 sm:h-8.5 px-3.5 sm:px-4 rounded-full bg-[#0a1f3d] text-white text-[12px] font-semibold no-underline hover:bg-[#0f2e5a] transition-colors shadow-2xs"
            >
              View all
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className={cardGridClassName}
            aria-busy="true"
            aria-label="Loading products"
          >
            {Array.from({ length: columns }).map((_, index) => (
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
          layoutStyle === "cardless" ? (
            /* Amazon / Retail Canvas: completely cardless, floating products on page canvas */
            <div className={cardlessGridClassName}>
              {filtered.map((p, index) => (
                <div
                  key={`cardless-${p.id}`}
                  className="category-card-enter h-full"
                  style={{
                    animationDelay: `${Math.min(index * 30, 240)}ms`,
                  }}
                >
                  <FeaturedProductCardArchitectural product={p} />
                </div>
              ))}
            </div>
          ) : (
            /* Card layout with clean spacing */
            <div className={cardGridClassName}>
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
          )
        )}
      </div>
    </section>
  );
}