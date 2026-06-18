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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[13px] text-[#5a5a55] mb-3">No products match your filters.</p>
        <button
          onClick={onReset}
          className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] bg-transparent cursor-pointer pb-px"
        >
          Clear Filters
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