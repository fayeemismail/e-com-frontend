"use client";

import Link from "next/link";
import {
  Armchair,
  Lamp,
  Table2,
  Archive,
  Briefcase,
  BookOpen,
  TreePalm,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { products } from "@/lib/products/data";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Seating: Armchair,
  Lighting: Lamp,
  Tables: Table2,
  Storage: Archive,
  Office: Briefcase,
  Books: BookOpen,
  Outdoor: TreePalm,
  Decor: Sparkles,
};

export default function Categories() {
  const categoriesList = Array.from(new Set(products.map((p) => p.category)));
  const categories = categoriesList.map((catName) => ({
    name: catName,
    Icon: CATEGORY_ICONS[catName] ?? Sparkles,
  }));

  return (
    <section className="bg-[#ffffff] border-y border-[#e8e4de] py-6 sm:py-8 px-4 sm:px-6 md:px-10">
      {/* Label */}
      <p className="text-[9px] tracking-[0.22em] uppercase text-black shadow-4xl mb-4 sm:mb-5">
        Shop by Category
      </p>

      {/* Strip */}
      <div className="flex gap-2 justify-center items-center sm:gap-3 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#f7f5f1] border border-[#e8e4de] hover:border-[#1a1a1a] transition-colors duration-200 no-underline shrink-0"
          >
            <cat.Icon
              size={13}
              strokeWidth={1.5}
              className="text-[#aaa] group-hover:text-[#1a1a1a] transition-colors duration-200 shrink-0"
            />
            <span className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#5a5a55] group-hover:text-[#1a1a1a] transition-colors duration-200 whitespace-nowrap">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
      {/* <hr className="mt-4 border-t border-[#e7e3dc]" /> */}
    </section>
  );
}