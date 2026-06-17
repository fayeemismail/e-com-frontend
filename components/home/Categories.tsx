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
    Icon: CATEGORY_ICONS[catName] || Sparkles,
  }));

  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 py-4 sm:py-5 border-b border-[#f0eeea]">
        <hr className="mb-4 border-t border-[#e7e3dc]" />
      <div className="flex gap-5 sm:gap-7 items-center justify-center md:gap-9 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center gap-1.5 shrink-0 no-underline cursor-pointer group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#f4f1ec] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#1a1a1a]">
              <cat.Icon
                size={18}
                strokeWidth={1.5}
                className="text-[#1a1a1a] transition-colors duration-200 group-hover:text-white"
              />
            </div>
            <span className="text-[10px] text-[#5a5a55] tracking-[0.01em] whitespace-nowrap group-hover:text-[#1a1a1a] transition-colors duration-200">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
        <hr className="mt-4 border-t border-[#e7e3dc]" />
    </section>
  );
}