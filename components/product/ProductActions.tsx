"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types";

export default function ProductActions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? null);
  const [rentOpen, setRentOpen] = useState(false);

  return (
    <div className="space-y-6">

      {/* Price */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-xl text-[#1a1a1a] font-light">${product.price}</span>
        {product.compareAtPrice && (
          <span className="text-[13px] text-[#aaa] line-through">${product.compareAtPrice}</span>
        )}
        {product.compareAtPrice && (
          <span className="text-[11px] tracking-[0.08em] text-green-700 uppercase">
            Save ${product.compareAtPrice - product.price}
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1,2,3,4,5].map((s) => (
            <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? "#1a1a1a" : "none"} 
            stroke="#1a1a1a" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <span className="text-[11px] text-[#9a9a94]">{product.rating} ({product.reviews} reviews)</span>
      </div>

      <div className="h-px bg-[#ebebeb]" />

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-2.5">
            Colour — <span className="text-[#5a5a55] normal-case tracking-normal">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`text-[11px] px-3 py-1.5 border bg-transparent cursor-pointer transition-colors duration-150 ${
                  selectedColor === color
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-[#ddd] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <p className={`text-[11px] tracking-[0.06em] ${product.stock < 10 ? "text-orange-600" : "text-[#9a9a94]"}`}>
        {product.stock < 10 ? `Only ${product.stock} left` : "In Stock"}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {}}
          className="flex-1 py-3.5 bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] 
          cursor-pointer hover:bg-white hover:text-black transition-colors duration-200"
        >
          Add to Cart — ${product.price}
        </button>
        <button
          onClick={() => setRentOpen((o) => !o)}
          className="flex-1 py-3.5 bg-transparent text-[#1a1a1a] text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] 
          cursor-pointer hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
        >
          Rent This
        </button>
        <button
          onClick={() => {}}
          aria-label="Toggle Wishlist"
          className="px-4 py-3.5 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white 
          cursor-pointer transition-colors duration-200 bg-transparent flex items-center justify-center shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" 
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
            1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Rent info panel */}
      {rentOpen && (
        <div className="border border-[#ebebeb] p-4 space-y-2">
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-3">Rental Options</p>
          {[
            { period: "1 Week", price: Math.round(product.price * 0.06) },
            { period: "1 Month", price: Math.round(product.price * 0.15) },
            { period: "3 Months", price: Math.round(product.price * 0.35) },
          ].map((opt) => (
            <div key={opt.period} className="flex items-center justify-between py-2 border-b border-[#f5f5f5] last:border-0">
              <span className="text-[12px] text-[#5a5a55]">{opt.period}</span>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-[#1a1a1a]">${opt.price}</span>
                <button className="text-[10px] tracking-[0.12em] uppercase text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1 
                      bg-transparent cursor-pointer hover:bg-[#1a1a1a] hover:text-white transition-colors duration-150">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-[#ebebeb]" />

      {/* Shipping / Returns */}
      <div className="space-y-2">
        {product.shipping.freeShipping && (
          <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" 
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Free shipping · {product.shipping.estimatedDelivery}
          </div>
        )}
        <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" 
          strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" />
          </svg>
          {product.returnPolicy}
        </div>
        <div className="flex items-center gap-2.5 text-[12px] text-[#5a5a55]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" 
          strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {product.warranty}
        </div>
      </div>
    </div>
  );
}