"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function MagazineCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex gap-4 cursor-pointer items-start py-4 border-b border-white/10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden shrink-0 bg-[#2a2520]" style={{ width: "80px", height: "100px" }}>
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-[1.08]" : "scale-100"}`}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-[8px] tracking-[0.2em] uppercase text-[#b8935a] mb-1.5">{product.category}</p>
        <h3
          className={`text-[13px] font-light leading-snug mb-1.5 transition-colors duration-200 ${hovered ? "text-[#b8935a]" : "text-[#f0ece4]"}`}
        >
          {product.name}
        </h3>
        <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 mb-2">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#b8935a]">${product.price}</span>
          <span className={`text-[10px] text-white/40 transition-transform duration-200 ${hovered ? "translate-x-1 text-[#b8935a]" : ""}`}>
            →
          </span>
        </div>
      </div>
    </div>
  );
}

function BigHero({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer h-full min-h-[520px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={product.image}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-[1.04]" : "scale-100"}`}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.1) 55%)" }} />

      {product.tag && (
        <span className="absolute top-5 left-5 text-[8px] tracking-[0.2em] uppercase bg-[#b8935a] text-white px-2.5 py-1">
          {product.tag}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[8px] tracking-[0.22em] uppercase text-[#b8935a] mb-2">{product.category}</p>
        <h3 className="text-[26px] font-light text-[#f0ece4] leading-tight mb-2">{product.name}</h3>
        <p className="text-white/55 text-[11px] leading-relaxed mb-5">{product.shortDescription}</p>
        <div className="flex items-center gap-4">
          <span className="text-[20px] text-[#b8935a]">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[13px] text-white/30 line-through">${product.compareAtPrice}</span>
          )}
          <button className="ml-auto text-[8px] tracking-[0.2em] uppercase border border-[#b8935a] text-[#b8935a] px-5 py-2.5 bg-transparent cursor-pointer hover:bg-[#b8935a] hover:text-[#111009] transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductTen() {
  return (
    <section className="bg-[#111009] px-10 py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-5 h-px bg-[#b8935a]" />
          <h2 className="text-[9px] tracking-[0.26em] uppercase text-white/40 font-normal m-0">Featured</h2>
        </div>
        <a href="#" className="text-[9px] tracking-[0.18em] uppercase text-[#b8935a] no-underline">
          Explore All →
        </a>
      </div>

      {/* Layout: 60/40 */}
      <div className="grid gap-8" style={{ gridTemplateColumns: "3fr 2fr" }}>
        {/* Hero */}
        <BigHero product={products[5]} />

        {/* Stack of cards */}
        <div>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/30 mb-0">Also Featured</p>
          {products.slice(0, 5).map((p) => (
            <MagazineCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
