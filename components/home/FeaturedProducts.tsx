"use client";

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

  return (
    <section className="bg-[#faf9f6] py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-10 min-h-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6 border-b border-[#e8e4de] pb-4 sm:pb-5">
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">
          Featured Collection
        </h2>

        {/* Filter tabs — scrollable on mobile */}
        {!loading && !error && categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
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

      {/* Loading state */}
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

      {/* Responsive product grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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