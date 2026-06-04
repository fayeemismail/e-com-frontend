"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Hee Lounge Chair",
    price: "$420",
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    tag: "New",
  },
  {
    id: 2,
    name: "Arc Floor Lamp",
    price: "$185",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
    tag: null,
  },
  {
    id: 3,
    name: "Marble Side Table",
    price: "$310",
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1619372773893-1d72b0e3cfc3?w=800&q=80",
    tag: null,
  },
  {
    id: 4,
    name: "Woven Pendant Light",
    price: "$260",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1513506003901-1e6a35f0a89c?w=800&q=80",
    tag: "Bestseller",
  },
  {
    id: 5,
    name: "Linen Sofa",
    price: "$1,290",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    tag: null,
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cursor-pointer"
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
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
        />
        <img
          src={product.hoverImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-center py-2.5 bg-white/90 text-[10px] tracking-[0.16em] uppercase text-[#1a1a1a] transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          Quick Add
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between pt-2 gap-2">
        <p className="text-[12px] tracking-[0.01em] text-[#1a1a1a] truncate">{product.name}</p>
        <p className="text-[12px] text-[#1a1a1a] shrink-0">{product.price}</p>
      </div>
    </div>
  );
}

export default function Featured() {
  const row1 = products.slice(0, 3);
  const row2 = products.slice(3, 5);

  return (
    <section className="px-5 sm:px-8 md:px-12 py-8 md:py-10 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-light tracking-[0.12em] uppercase text-[#1a1a1a]">
          Featured Products
        </h2>
        <a href="#" className="text-[10px] tracking-[0.14em] uppercase text-[#1a1a1a] no-underline border-b border-[#1a1a1a] pb-px hover:opacity-50 transition-opacity duration-200">
          View All
        </a>
      </div>

      {/* Row 1 — 3 columns */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
        {row1.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Row 2 — 2 wider columns */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {row2.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}