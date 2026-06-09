"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types"; 

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f0eeea] aspect-square">
        {product.tag && (
          <span className="absolute top-2 left-2 z-10 text-[9px] tracking-[0.12em] uppercase bg-white text-[#1a1a1a] px-2 py-0.5">
            {product.tag}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <img
          src={product.hoverImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-center py-2.5 bg-white/90 text-[10px] tracking-[0.16em] uppercase text-[#1a1a1a] transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          Quick Add
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between pt-2 gap-2">
        <p className="text-[12px] text-[#1a1a1a] truncate">{product.name}</p>
        <p className="text-[12px] text-[#1a1a1a] shrink-0">{product.price}</p>
      </div>
    </div>
  );
}