"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function HeroCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer bg-[#f2f0ec]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
        <img
          src={hovered ? product.hoverImage : product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${hovered ? "scale-[1.04]" : "scale-100"}`}
        />
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-65"}`}
          style={{ background: "linear-gradient(to top, rgba(17,17,17,0.72) 0%, transparent 55%)" }}
        />
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-4 left-4 text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 font-medium bg-[#c8a98a] text-white z-10">
            {product.tag}
          </span>
        )}
        {/* Bottom info */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 ease-out ${hovered ? "translate-y-0" : "translate-y-2"}`}
        >
          <p className="text-white/60 text-[10px] tracking-[0.16em] uppercase mb-1">
            {product.category}
          </p>
          <div className="flex items-end justify-between">
            <h3 className="text-white text-[18px] font-light leading-tight tracking-tight">
              {product.name}
            </h3>
            <span className="text-white text-[15px] font-light ml-4">${product.price}</span>
          </div>
          <p
            className={`text-white/70 text-[11px] mt-2 leading-relaxed overflow-hidden transition-all duration-500 ${hovered ? "max-h-[60px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            {product.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

function SmallCard({ product }: { product: (typeof products)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex gap-3 cursor-pointer items-center border-b border-[#e8e4de] pb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden shrink-0 w-[72px] h-[72px] bg-[#f2f0ec]">
        <img
          src={hovered ? product.hoverImage : product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-[1.08]" : "scale-100"}`}
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] tracking-[0.14em] uppercase text-[#999] mb-0.5">
          {product.category}
        </p>
        <p className={`text-[13px] leading-snug truncate transition-colors duration-200 ${hovered ? "text-[#c8a98a]" : "text-[#111]"}`}>
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[12px] text-[#111]">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-[#bbb] line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
      {/* Arrow */}
      <span className={`text-[#c8a98a] text-base transition-transform duration-300 ${hovered ? "translate-x-1" : "translate-x-0"}`}>
        →
      </span>
    </div>
  );
}

export default function FeaturedProductOne() {
  const hero = products[4];
  const listed = [products[0], products[2], products[7], products[9]];

  return (
    <section className="bg-white px-10 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 border-b border-[#e8e4de] pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-[#c8a98a]" />
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#111] font-normal m-0">
            Featured Collection
          </h2>
        </div>
        <a
          href="#"
          className="text-[10px] tracking-[0.14em] uppercase text-[#c8a98a] no-underline border-b border-[#c8a98a] pb-px"
        >
          View All
        </a>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-2 gap-6">
        <HeroCard product={hero} />
        <div className="flex flex-col gap-4 justify-between">
          {listed.map((p) => (
            <SmallCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}