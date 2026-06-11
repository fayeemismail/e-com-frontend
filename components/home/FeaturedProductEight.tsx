"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function SideCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f2f0eb]" style={{ paddingBottom: "130%" }}>
        {product.tag && (
          <span className="absolute top-2 left-2 z-10 text-[7px] tracking-[0.16em] uppercase bg-[#c4a882] text-white px-1.5 py-[2px]">
            {product.tag}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-600 ${hovered ? "scale-[1.06]" : "scale-100"}`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white/88 py-2 text-center text-[8px] tracking-[0.18em] uppercase text-[#111] transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
        >
          Add to Cart
        </div>
      </div>
      <div className="pt-2.5">
        <p className={`text-[12px] leading-snug mb-0.5 transition-colors duration-200 ${hovered ? "text-[#c4a882]" : "text-[#111]"}`}>
          {product.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-[#111]">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[10px] text-[#ccc] line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroPanel({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer h-full min-h-[480px] bg-[#1a1714]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={product.image}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-[1.04] opacity-80" : "scale-100 opacity-90"}`}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
      {product.tag && (
        <span className="absolute top-5 left-5 text-[8px] tracking-[0.2em] uppercase bg-[#c4a882] text-white px-2.5 py-1 z-10">
          {product.tag}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[9px] tracking-[0.2em] uppercase text-[#c4a882] mb-1">{product.category}</p>
        <h3 className="text-[22px] font-light text-white leading-tight mb-1">{product.name}</h3>
        <p className="text-white/60 text-[11px] mb-4 leading-relaxed">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-[18px] text-white">${product.price}</span>
          <button className="text-[8px] tracking-[0.2em] uppercase border border-white/60 text-white px-4 py-2 bg-transparent cursor-pointer hover:bg-white hover:text-[#111] transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductEight() {
  return (
    <section className="bg-white py-14 px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-5 h-px bg-[#c4a882]" />
          <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#111] font-normal m-0">Featured Collection</h2>
        </div>
        <a href="#" className="text-[9px] tracking-[0.14em] uppercase text-[#c4a882] no-underline border-b border-[#c4a882] pb-px">
          View All
        </a>
      </div>

      {/* Layout: 2/5 hero + 3/5 grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "2fr 3fr" }}>
        {/* Hero */}
        <HeroPanel product={products[3]} />

        {/* 3-col grid */}
        <div className="grid grid-cols-3 gap-4 content-start">
          {products.slice(0, 6).map((p) => (
            <SideCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
