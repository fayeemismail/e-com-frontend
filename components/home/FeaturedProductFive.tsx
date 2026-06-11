"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

type CardSize = "tall" | "medium" | "short";

function StaggerCard({ product, size = "medium" }: { product: (typeof products)[0]; size?: CardSize }) {
  const [hovered, setHovered] = useState(false);

  const heightClass: Record<CardSize, string> = {
    tall: "h-[480px]",
    medium: "h-[340px]",
    short: "h-[260px]",
  };

  return (
    <div
      className={`relative overflow-hidden cursor-pointer bg-[#ede9e2] ${heightClass[size]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          hovered ? "scale-[1.05] opacity-100" : "scale-100 opacity-[0.88]"
        }`}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-[background] duration-500"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(25,20,16,0.78) 0%, rgba(25,20,16,0.1) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(25,20,16,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Tag */}
      {product.tag && (
        <span className="absolute top-3 left-3 text-[7px] tracking-[0.22em] uppercase text-white bg-[#c4a99a] px-[7px] py-[3px] z-10">
          {product.tag}
        </span>
      )}

      {/* Resting: name only */}
      <div className={`absolute bottom-0 left-0 right-0 p-3.5 transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
        <p className="text-[12px] text-white font-light m-0 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
          {product.name}
        </p>
      </div>

      {/* Hover: full info */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 py-5 z-10 transition-[opacity,transform] duration-[400ms] ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
        }`}
      >
        <p className="text-[8px] tracking-[0.2em] uppercase text-[#c4a99a] mb-[5px]">{product.category}</p>
        <h3 className="text-[16px] font-light text-[#faf8f5] m-0 mb-1 leading-[1.2]">{product.name}</h3>
        <p className="text-[11px] text-white/65 m-0 mb-3 leading-[1.5]">{product.shortDescription}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[15px] text-[#faf8f5]">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-[11px] text-[#999] line-through ml-1.5">${product.compareAtPrice}</span>
            )}
          </div>
          <span className="text-base text-[#c4a99a]">→</span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductFive() {
  const p = products;

  return (
    <section className="bg-[#faf8f5] px-10 py-14">
      {/* Header */}
      <div className="flex items-baseline gap-5 mb-7">
        <h2 className="text-[9px] tracking-[0.26em] uppercase text-[#1a1714] font-normal m-0 shrink-0">
          Featured
        </h2>
        <div className="flex-1 h-px bg-[#ddd7ce]" />
        <a href="#" className="text-[9px] tracking-[0.16em] uppercase text-[#c4a99a] no-underline shrink-0">
          View All
        </a>
      </div>

      {/* Staggered 3-col grid */}
      <div className="grid grid-cols-3 gap-[6px] items-start">
        {/* Col 1 */}
        <div className="flex flex-col gap-[6px]">
          <StaggerCard product={p[4]} size="tall" />
          <StaggerCard product={p[6]} size="short" />
        </div>
        {/* Col 2 — offset down */}
        <div className="flex flex-col gap-[6px] mt-10">
          <StaggerCard product={p[9]} size="medium" />
          <StaggerCard product={p[2]} size="medium" />
        </div>
        {/* Col 3 */}
        <div className="flex flex-col gap-[6px]">
          <StaggerCard product={p[7]} size="short" />
          <StaggerCard product={p[0]} size="tall" />
        </div>
      </div>
    </section>
  );
}
