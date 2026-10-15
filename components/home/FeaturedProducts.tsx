"use client";

import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import ErrorState from "@/components/common/ErrorState";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import FeaturedProductCard from "./FeaturedProductCard";

export default function FeaturedProducts() {
  const {
    products: filtered,
    loading,
    error,
    isRetrying,
    handleRetry,
  } = useFeaturedProducts(24);

  return (
    <section className="bg-[#f5f7fb] py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 md:px-8 lg:px-10 min-h-100 font-nav">
      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-[#0a1f3d] m-0 leading-tight min-w-0">
            Featured Products
          </h2>
        </div>

        <Link
          href="/shop"
          className="shrink-0 inline-flex items-center justify-center h-9 px-3.5 sm:px-4 rounded-full bg-[#0a1f3d] text-white text-[12.5px] font-medium no-underline hover:bg-[#0f2e5a] transition-colors"
        >
          View all
        </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start">
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
    </section>
  );
}