"use client";

import { useState } from "react";
import { products } from "@/lib/products/data";

function TypeRow({ product, index }: { product: (typeof products)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`cursor-pointer border-b border-[#ddd8d0] py-[18px] grid items-center gap-5 transition-all duration-200 ${
        hovered ? "bg-[#f4f1eb] -mx-4 px-4" : "bg-transparent mx-0 px-0"
      }`}
      style={{ gridTemplateColumns: "32px 1fr auto auto" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index */}
      <span className="text-[9px] text-[#aaa9a5] tracking-[0.1em] tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Name + category */}
      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#9e9c97] mb-0.5">{product.category}</p>
        <h3
          className={`text-[clamp(17px,2vw,22px)] font-light text-[#1a1916] tracking-[-0.01em] leading-[1.1] m-0 inline border-b pb-px transition-colors duration-200 ${
            hovered ? "border-[#7d9e6e]" : "border-transparent"
          }`}
        >
          {product.name}
        </h3>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="text-[13px] text-[#1a1916] block tabular-nums">${product.price}</span>
        {product.compareAtPrice && (
          <span className="text-[10px] text-[#bbb] line-through">${product.compareAtPrice}</span>
        )}
      </div>

      {/* Thumbnail */}
      <div className={`w-[52px] h-[52px] overflow-hidden bg-[#ede9e1] shrink-0 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-60"}`}>
        <img
          src={product.image}
          alt=""
          className={`w-full h-full object-cover transition-transform duration-[400ms] ${hovered ? "scale-[1.08]" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

export default function FeaturedProductThree() {
  const listed = products.slice(0, 8);

  return (
    <section className="bg-[#faf9f6] px-10 py-14">
      {/* Header */}
      <div className="grid items-baseline border-b-2 border-[#1a1916] pb-3.5 mb-0" style={{ gridTemplateColumns: "1fr auto" }}>
        <h2 className="text-[10px] tracking-[0.22em] uppercase text-[#1a1916] font-normal m-0">Featured</h2>
        <a href="#" className="text-[10px] tracking-[0.14em] uppercase text-[#7d9e6e] no-underline">
          All Products →
        </a>
      </div>

      <div>
        {listed.map((product, i) => (
          <TypeRow key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
