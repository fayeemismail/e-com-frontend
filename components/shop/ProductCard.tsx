"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper";

export default function ProductCard({ product }: { product: DisplayProduct }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="cursor-pointer no-underline block group"
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
        {/* Wishlist and Cart Overlay Icons */}
        <div
          className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 
        transition-opacity duration-300"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-7 h-7 bg-white text-[#1a1a1a] hover:text-[#c4a882] flex items-center justify-center 
            transition-colors duration-200 cursor-pointer border-none shadow-xs rounded-full"
            title="Add to Wishlist"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 
              21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-7 h-7 bg-white text-[#1a1a1a] hover:text-[#c4a882] flex items-center justify-center 
            transition-colors duration-200 cursor-pointer border-none shadow-xs rounded-full"
            title="Add to Cart"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 
            ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 
            ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center justify-center py-2.5 bg-white/90 text-[10px] 
          tracking-[0.16em] uppercase text-[#1a1a1a] transition-all duration-300 
          ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          View Product
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between pt-2 gap-2">
        <p className="text-[12px] text-[#1a1a1a] truncate">{product.name}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          {product.compareAtPrice && (
            <p className="text-[11px] text-[#aaa] line-through">
              ${product.compareAtPrice}
            </p>
          )}
          <p className="text-[12px] text-[#1a1a1a]">${product.price}</p>
        </div>
      </div>
    </Link>
  );
}
