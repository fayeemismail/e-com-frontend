import Link from "next/link";
import Image from "next/image";
import { DisplayProduct } from "@/lib/mappers/product.mapper"; 
import ProductCard from "./ProductCard"; 
import { formatPrice } from "@/lib/utils/format.util";

type Props = {
  products: DisplayProduct[];
  view: "grid" | "list";
  onReset: () => void;
};

// Category visual helper
function getCategoryVisualPath(cat: string, name?: string): string {
  const c = (cat || "").toLowerCase();
  const n = (name || "").toLowerCase();

  if (c.includes("paper") || c.includes("print") || n.includes("paper") || n.includes("copy") || n.includes("sheet")) {
    return "/images/categories/paper-print.svg";
  }
  if (c.includes("pen") || c.includes("writing") || n.includes("pen") || n.includes("marker") || n.includes("ballpoint") || n.includes("rollerball")) {
    return "/images/categories/writing-pen.svg";
  }
  if (c.includes("binding") || n.includes("binding") || n.includes("comb")) {
    return "/images/categories/binding.svg";
  }
  if (c.includes("adhesive") || c.includes("fastener") || n.includes("note") || n.includes("sticky") || n.includes("tape")) {
    return "/images/categories/adhesives.svg";
  }
  if (c.includes("desk") || c.includes("filing") || n.includes("file") || n.includes("folder") || n.includes("binder")) {
    return "/images/categories/desk-filing.svg";
  }
  if (c.includes("toner") || c.includes("cartridge") || c.includes("tech") || c.includes("computing") || c.includes("hardware") || c.includes("software") || c.includes("electronic") || c.includes("artificial")) {
    return "/images/categories/toner-cartridge.svg";
  }
  return "/images/categories/books.svg";
}

export default function ProductGrid({ products, view, onReset }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="mb-5 w-14 h-14 rounded-full bg-[#f0f4f9] flex items-center justify-center text-[#0f2e5a] text-lg select-none border border-[#e2e8f0]">
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

        <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#0f172a] font-semibold mb-2.5">
          No Results Found
        </h3>
        <p className="text-[11px] leading-relaxed text-[#64748b] font-light tracking-wide mb-6">
          We couldn&apos;t find any items matching your current filters. Try resetting them or selecting a different category.
        </p>

        <button
          onClick={onReset}
          className="text-[10px] tracking-[0.16em] uppercase bg-[#0f2e5a] hover:bg-[#0b2447] text-white px-6 py-3 border-none cursor-pointer transition-colors duration-200 rounded-xs font-semibold shadow-2xs"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="divide-y divide-[#e2e8f0]">
        {products.map((p) => {
          const skuString =
            (p as any).rawProduct?.sapId ||
            (p as any).sapId ||
            p.defaultSku?.sku ||
            (p as any).sku ||
            (p.skus && p.skus[0]?.sku) ||
            "";

          return (
            <Link
              key={p.id}
              href={`/shop/${p.id}`}
              className="flex items-center gap-4 py-4 cursor-pointer group no-underline text-inherit hover:bg-[#f8fafc] px-3 transition-colors rounded-xs"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#f0f4f9] border border-[#e2e8f0] overflow-hidden rounded-xs flex items-center justify-center p-2">
                <Image
                  src={getCategoryVisualPath(p.category, p.name)}
                  alt={p.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9.5px] uppercase tracking-wider text-[#64748b] font-medium mb-0.5">
                  {p.category}
                </p>
                <p className="text-[13px] sm:text-[14px] font-semibold text-[#0f172a] group-hover:text-[#0f2e5a] transition-colors truncate">
                  {p.name}
                </p>
                {skuString && (
                  <p className="text-[10.5px] text-[#475569] font-mono mt-0.5">
                    SAP ID: {skuString}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] sm:text-[15px] font-bold text-[#0f2e5a]">
                  {formatPrice(p.price)} SAR
                </p>
                {p.compareAtPrice && (
                  <p className="text-[10.5px] text-[#94a3b8] line-through">
                    {formatPrice(p.compareAtPrice)} SAR
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}