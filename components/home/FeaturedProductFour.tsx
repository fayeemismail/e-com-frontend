"use client";

import { useState, useRef } from "react";
import { products } from "@/lib/products/data";

function CinemaCard({
  product,
  active,
  onClick,
}: {
  product: (typeof products)[0];
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 h-[460px] overflow-hidden cursor-pointer bg-[#1a1a1a] transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ width: active ? "340px" : "200px" }}
    >
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-700 ${
          active || hovered ? "scale-[1.04]" : "scale-100"
        } ${active ? "opacity-90" : "opacity-60"}`}
      />

      {/* Gradient */}
      <div
        className="absolute inset-0 transition-[background] duration-[400ms]"
        style={{
          background: active
            ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)"
            : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 70%)",
        }}
      />

      {/* Tag */}
      {product.tag && (
        <span className="absolute top-3.5 left-3.5 text-[8px] tracking-[0.2em] uppercase bg-white/[0.12] backdrop-blur-md text-white px-2 py-0.5 border border-white/20">
          {product.tag}
        </span>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-5 transition-opacity duration-[400ms]">
        <p className={`text-[8px] tracking-[0.2em] uppercase text-white/55 mb-1 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
          {product.category}
        </p>
        <h3
          className={`font-light text-white leading-[1.2] m-0 overflow-hidden transition-[font-size] duration-[400ms] ${
            active ? "text-[17px] tracking-[-0.01em] whitespace-normal" : "text-[12px] tracking-normal whitespace-nowrap text-ellipsis"
          }`}
        >
          {product.name}
        </h3>
        <div
          className={`flex justify-between items-center mt-2.5 transition-[opacity,transform] duration-[400ms] delay-100 ${
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
          }`}
        >
          <span className="text-[15px] text-white tabular-nums">${product.price}</span>
          <button className="text-[8px] tracking-[0.18em] uppercase bg-white text-[#111] border-none px-3.5 py-[7px] cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductFour() {
  const [activeId, setActiveId] = useState(products[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = products.slice(0, 6);

  return (
    <section className="bg-[#0f0f0f] py-12">
      {/* Header */}
      <div className="flex items-center justify-between px-10 mb-6">
        <h2 className="text-[9px] tracking-[0.28em] uppercase text-[#666] font-normal m-0">
          Featured Products
        </h2>
        <a href="#" className="text-[9px] tracking-[0.2em] uppercase text-[#888] no-underline">
          All →
        </a>
      </div>

      {/* Scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-px px-10 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {featured.map((product) => (
          <CinemaCard
            key={product.id}
            product={product}
            active={activeId === product.id}
            onClick={() => setActiveId(product.id)}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-1.5 justify-center mt-5">
        {featured.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveId(product.id)}
            className={`h-1 border-none cursor-pointer p-0 transition-all duration-300 ${
              activeId === product.id ? "w-5 bg-white" : "w-1.5 bg-[#444]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
