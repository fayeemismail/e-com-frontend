"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/lib/products/data";

function GridCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop/${product.slug}`}
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

        {/* Wishlist */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-7 sm:h-7 bg-white flex items-center justify-center text-[#aaa] hover:text-[#c4a882] transition-colors duration-200 cursor-pointer border-none opacity-0 group-hover:opacity-100 text-xs sm:text-sm"
        >
          ♡
        </button>

        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        <img
          src={product.hoverImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
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

export default function FeaturedProducts() {
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? products.slice(0, 8)
      : products.filter((p) => p.category === active).slice(0, 8);

  return (
    <section className="bg-[#faf9f6] py-8 sm:py-10 md:py-14 px-4 sm:px-6 md:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6 border-b border-[#e8e4de] pb-4 sm:pb-5">
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">
          Featured
        </h2>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2.5 text-[11px] tracking-[0.08em] uppercase whitespace-nowrap shrink-0
              transition-all duration-300 ease-out cursor-pointer
              ${
                active === cat
                  ? "border border-black text-black scale-105 shadow-sm"
                  : "border border-transparent text-neutral-500 hover:border-neutral-300 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Link
          href="/shop"
          className="text-[10px] tracking-[0.12em] uppercase text-[#c4a882] no-underline border-b border-[#c4a882] pb-px self-start sm:self-auto"
        >
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {filtered.map((p) => (
          <GridCard key={p.id} product={p} />
        ))}
      </div>

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