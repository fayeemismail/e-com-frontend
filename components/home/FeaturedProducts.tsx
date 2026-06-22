"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFeaturedProducts } from "@/hooks/use-featured-products";
import { DisplayProduct } from "@/lib/mappers/product.mapper";
import ErrorState from "@/components/common/ErrorState";

function GridCard({ product }: { product: DisplayProduct }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop/${product.id}`}
      className="cursor-pointer group no-underline block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#f4f1ec]"
        style={{ paddingBottom: "125%" }}
      >
        {product.tag && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[8px] tracking-[0.16em] uppercase bg-white text-[#111] px-1.5 sm:px-2 py-0.5 sm:py-0.75">
            {product.tag}
          </span>
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Add to cart */}
        <div
          onClick={(e) => e.preventDefault()}
          className={`absolute bottom-0 left-0 right-0 bg-[#111] text-center py-2 sm:py-3 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-white transition-transform duration-300 ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          Add to Cart
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-2 sm:pt-3 pb-1">
        {/* Improved Category */}
        <p className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#999] mb-1 leading-relaxed">
          {product.category}
        </p>

        {/* Product Name */}
        <p
          className={`text-[12px] sm:text-[13px] leading-snug mb-1 transition-colors duration-200 truncate ${
            hovered ? "text-[#c4a882]" : "text-[#111]"
          }`}
        >
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] sm:text-[13px] text-[#111]">
            ${product.price}
          </span>

          {product.compareAtPrice && (
            <span className="text-[10px] sm:text-[11px] text-[#ccc] line-through">
              ${product.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#f0eeea] w-full relative overflow-hidden mb-2" style={{ paddingBottom: "125%" }} />
      <div className="pt-1 pb-1">
        <div className="h-2 bg-[#e8e6e2] w-1/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-3/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-1/2 rounded" />
      </div>
    </div>
  );
}

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6 border-b border-[#e8e4de] pb-4 sm:pb-5">
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">
          Featured
        </h2>

        {/* Filter tabs — scrollable on mobile */}
        {!loading && !error && categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
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

      {/* Loading view */}
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
            Curating Our Bookshelf
          </h3>
          <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
            We are currently refreshing our collection with new literary gems. Check back shortly or view the catalog.
          </p>
          <Link
            href="/shop"
            className="text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 hover:bg-[#333] transition-all duration-300 no-underline font-light inline-block"
          >
            Explore the Shop
          </Link>
        </div>
      )}

      {/* Responsive grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filtered.map((p) => (
            <GridCard key={p.id} product={p} />
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