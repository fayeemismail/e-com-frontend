"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function GridCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f4f1ec]" style={{ paddingBottom: "125%" }}>
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 text-[8px] tracking-[0.16em] uppercase bg-white text-[#111] px-2 py-[3px]">
            {product.tag}
          </span>
        )}
        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 w-7 h-7 bg-white flex items-center justify-center text-[#aaa] hover:text-[#c4a882] transition-colors duration-200 cursor-pointer border-none opacity-0 group-hover:opacity-100">
          ♡
        </button>
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <img
          src={product.hoverImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        {/* Add to cart */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#111] text-center py-3 text-[9px] tracking-[0.2em] uppercase text-white transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          Add to Cart
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <p className="text-[9px] tracking-[0.14em] uppercase text-[#bbb] mb-1">{product.category}</p>
        <p className={`text-[13px] leading-snug mb-1 transition-colors duration-200 ${hovered ? "text-[#c4a882]" : "text-[#111]"}`}>
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#111]">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-[#ccc] line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductSeven() {
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products.slice(0, 8) : products.filter((p) => p.category === active).slice(0, 8);

  return (
    <section className="bg-[#faf9f6] py-14 px-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 border-b border-[#e8e4de] pb-5">
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">Featured</h2>
        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border-none cursor-pointer transition-all duration-200 ${
                active === cat
                  ? "bg-[#111] text-white"
                  : "bg-transparent text-[#888] hover:text-[#111]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <a href="#" className="text-[9px] tracking-[0.14em] uppercase text-[#c4a882] no-underline border-b border-[#c4a882] pb-px">
          View All
        </a>
      </div>

      {/* 4-col grid */}
      <div className="grid grid-cols-4 gap-5">
        {filtered.map((p) => (
          <GridCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
