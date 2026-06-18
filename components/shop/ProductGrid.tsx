import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper"; 
import ProductCard from "./ProductCard"; 

type Props = {
  products: DisplayProduct[];
  view: "grid" | "list";
  onReset: () => void;
};

export default function ProductGrid({ products, view, onReset }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="mb-5 w-14 h-14 rounded-full bg-[#f5f4f0] flex items-center justify-center text-[#9a9a94] text-lg select-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
          No Results Found
        </h3>
        <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
          We couldn&apos;t find any matches for your current filter combination. Try resetting them or adjusting the price range.
        </p>

        <button
          onClick={onReset}
          className="group relative text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 border-none cursor-pointer transition-all duration-300 hover:bg-[#c27c5a] overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Clear Filters
          </span>
        </button>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="divide-y divide-[#e8e6e2]">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-4 cursor-pointer group">
            <div className="relative w-16 h-16 shrink-0 bg-[#f0eeea] overflow-hidden rounded">
              <Image fill sizes="64px" src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300" />
              <Image fill sizes="64px" src={p.hoverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#1a1a1a] truncate">{p.name}</p>
              {p.tag && <span className="text-[10px] tracking-widest uppercase text-[#9a9a94]">{p.tag}</span>}
            </div>
            <p className="text-[13px] text-[#1a1a1a] shrink-0">${p.price}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}