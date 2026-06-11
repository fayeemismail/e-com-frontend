"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function FlatCard({ product, index }: { product: (typeof products)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f0ede8]" style={{ paddingBottom: "140%" }}>
        {/* Number */}
        <span className="absolute top-3 left-3 z-10 text-[9px] text-white/70 font-light tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        {product.tag && (
          <span className="absolute top-3 right-3 z-10 text-[7px] tracking-[0.16em] uppercase bg-white text-[#111] px-1.5 py-[2px]">
            {product.tag}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-[1.06]" : "scale-100"}`}
        />
        {/* Dim overlay on hover revealing hover image swap */}
        <img
          src={product.hoverImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        {/* Bottom CTA */}
        <div
          className={`absolute bottom-0 left-0 right-0 py-2.5 flex items-center justify-center gap-2 bg-[#111]/90 transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          <span className="text-[8px] tracking-[0.2em] uppercase text-white">Add to Cart</span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-2.5 border-b border-[#eee] pb-3">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p
            className={`text-[12px] leading-snug flex-1 transition-colors duration-200 ${hovered ? "text-[#c4a882]" : "text-[#111]"}`}
          >
            {product.name}
          </p>
          <span className="text-[12px] text-[#111] shrink-0">${product.price}</span>
        </div>
        <p className="text-[9px] tracking-[0.12em] uppercase text-[#bbb]">{product.category}</p>
      </div>
    </div>
  );
}

export default function FeaturedProductNine() {
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;
  const total = products.length;
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="bg-white py-14 px-10">
      {/* Header */}
      <div className="grid items-center border-b-2 border-[#111] pb-3 mb-8" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        <h2 className="text-[10px] tracking-[0.24em] uppercase text-[#111] font-normal m-0">Featured</h2>
        <p className="text-[9px] tracking-[0.16em] uppercase text-[#bbb] text-center">
          {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} of {total}
        </p>
        <div className="flex items-center justify-end gap-3">
          <a href="#" className="text-[9px] tracking-[0.14em] uppercase text-[#c4a882] no-underline border-b border-[#c4a882] pb-px">
            View All
          </a>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-[12px] text-[#111] disabled:opacity-25 bg-transparent border-none cursor-pointer px-1"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={() => setPage((p) => Math.min(Math.floor((total - 1) / PER_PAGE), p + 1))}
            disabled={(page + 1) * PER_PAGE >= total}
            className="text-[12px] text-[#111] disabled:opacity-25 bg-transparent border-none cursor-pointer px-1"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>

      {/* 5-col grid */}
      <div className="grid grid-cols-5 gap-5">
        {visible.map((p, i) => (
          <FlatCard key={p.id} product={p} index={page * PER_PAGE + i} />
        ))}
      </div>
    </section>
  );
}
