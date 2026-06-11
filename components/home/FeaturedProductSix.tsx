"use client";

import { useState, useRef } from "react";
import { products } from "@/lib/products/data";

function CarouselCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="shrink-0 w-[220px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f2f0eb]" style={{ height: "280px" }}>
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 text-[8px] tracking-[0.18em] uppercase bg-[#c4a882] text-white px-2 py-[3px]">
            {product.tag}
          </span>
        )}
        <img
          src={hovered ? product.hoverImage : product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-600 ease-out ${hovered ? "scale-[1.05]" : "scale-100"}`}
        />
        {/* Quick add */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white/90 text-center py-2.5 text-[9px] tracking-[0.18em] uppercase text-[#111] transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          Quick Add
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] mb-1">{product.category}</p>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-[13px] font-light leading-snug transition-colors duration-200 ${hovered ? "text-[#c4a882]" : "text-[#111]"}`}
          >
            {product.name}
          </h3>
          <div className="shrink-0 text-right">
            <span className="text-[13px] text-[#111] block">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-[#bbb] line-through">${product.compareAtPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductSix() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const CARD_W = 220 + 16; // width + gap
  const MAX_OFFSET = (products.length - 4) * CARD_W;

  const slide = (dir: "prev" | "next") => {
    setOffset((prev) => {
      const next = dir === "next" ? prev + CARD_W * 2 : prev - CARD_W * 2;
      return Math.max(0, Math.min(next, MAX_OFFSET));
    });
  };

  return (
    <section className="bg-white py-14">
      {/* Header */}
      <div className="flex items-center justify-between px-10 mb-8">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#c4a882] mb-1">New Arrivals</p>
          <h2 className="text-[22px] font-light text-[#111] tracking-tight m-0">Featured Products</h2>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-[9px] tracking-[0.16em] uppercase text-[#111] border-b border-[#111] pb-px mr-2">
            View All
          </a>
          <button
            onClick={() => slide("prev")}
            disabled={offset === 0}
            className="w-9 h-9 border border-[#ddd] flex items-center justify-center text-[#111] disabled:opacity-25 hover:border-[#111] transition-colors duration-200 cursor-pointer bg-transparent"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={() => slide("next")}
            disabled={offset >= MAX_OFFSET}
            className="w-9 h-9 border border-[#ddd] flex items-center justify-center text-[#111] disabled:opacity-25 hover:border-[#111] transition-colors duration-200 cursor-pointer bg-transparent"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="overflow-hidden px-10">
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {products.map((p) => (
            <CarouselCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-10 mt-6">
        <div className="h-px bg-[#eee] relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#c4a882] transition-all duration-500"
            style={{ width: `${((offset / MAX_OFFSET) * 100) || 10}%` }}
          />
        </div>
      </div>
    </section>
  );
}
