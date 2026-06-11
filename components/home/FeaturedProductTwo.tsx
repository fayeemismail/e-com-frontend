"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function LuxuryCard({
  product,
  size = "normal",
}: {
  product: (typeof products)[0];
  size?: "normal" | "large";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`cursor-pointer relative overflow-hidden bg-[#1a1714] ${size === "large" ? "aspect-[3/4]" : "aspect-[2/3]"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-[0.15] scale-[1.06] grayscale-[20%]" : "opacity-[0.85] scale-100 grayscale-0"}`}
      />

      {/* Tag */}
      {product.tag && (
        <span className="absolute top-3 right-3 text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 z-10 bg-[#b8935a] text-white">
          {product.tag}
        </span>
      )}

      {/* Default: name + price */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
        <div className="border-t border-[#b8935a]/40 pt-2.5">
          <p className="text-[9px] tracking-[0.2em] uppercase text-[#b8935a] mb-1">{product.category}</p>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-light text-[#f0ece4]">{product.name}</span>
            <span className="text-[13px] text-[#b8935a]">${product.price}</span>
          </div>
        </div>
      </div>

      {/* Hover: full details */}
      <div className={`absolute inset-0 flex flex-col justify-center p-5 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <p className="text-[9px] tracking-[0.22em] uppercase text-[#b8935a] mb-3">{product.category}</p>
        <h3 className="text-[18px] font-light text-[#f0ece4] leading-tight mb-2">{product.name}</h3>
        <p className="text-[11px] text-[#888] leading-relaxed mb-4 line-clamp-3">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[#b8935a]">${product.price}</span>
          <button className="text-[8px] tracking-[0.2em] uppercase px-4 py-2 border border-[#b8935a] text-[#b8935a] bg-transparent cursor-pointer hover:bg-[#b8935a] hover:text-[#1a1714] transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductTwo() {
  const featured = [products[9], products[4], products[7], products[2], products[0]];

  return (
    <section className="bg-[#111009] px-10 py-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[9px] tracking-[0.24em] uppercase text-[#b8935a] mb-2">Curated Selection</p>
          <h2 className="text-[28px] font-light text-[#f0ece4] tracking-[0.02em] leading-none m-0">
            Featured Products
          </h2>
        </div>
        <a href="#" className="text-[9px] tracking-[0.2em] uppercase text-[#b8935a] no-underline">
          Explore All →
        </a>
      </div>

      {/* Grid: large left, 2×2 right */}
      <div className="grid grid-cols-2 gap-px">
        <LuxuryCard product={featured[0]} size="large" />
        <div className="grid grid-rows-2 gap-px">
          <div className="grid grid-cols-2 gap-px">
            <LuxuryCard product={featured[1]} />
            <LuxuryCard product={featured[2]} />
          </div>
          <div className="grid grid-cols-2 gap-px">
            <LuxuryCard product={featured[3]} />
            <LuxuryCard product={featured[4]} />
          </div>
        </div>
      </div>
    </section>
  );
}