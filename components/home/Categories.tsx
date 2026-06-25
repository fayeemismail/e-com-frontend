"use client";

import Link from "next/link";
import {
  BookOpen,
  Eye,
  Sparkles,
  Code,
  User,
  Rocket,
  Layout,
  type LucideIcon,
} from "lucide-react";
import { useFeaturedCategories } from "@/hooks/use-featured-categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Classic Fiction": BookOpen,
  "Dystopian Fiction": Eye,
  "Fantasy": Sparkles,
  "Software Engineering": Code,
  "Biography": User,
  "Science Fiction": Rocket,
  "Web Development": Layout,
};

export default function Categories() {
  const { categories, loading, error } = useFeaturedCategories();

  if (loading) {
    return (
      <section className="bg-[#ffffff] border-y border-[#e8e4de] py-6 sm:py-8 px-4 sm:px-6 md:px-10">
        <p className="text-[9px] tracking-[0.22em] uppercase text-black mb-4 sm:mb-5">
          Shop by Category
        </p>
        <div className="flex gap-2 justify-center items-center sm:gap-3 overflow-x-auto no-scrollbar pb-0.5 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-32 bg-[#f4f2ee] border border-[#e8e4de] shrink-0 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#ffffff] border-y border-[#e8e4de] py-6 sm:py-8 px-4 sm:px-6 md:px-10">
      {/* Label */}
      <p className="text-[9px] tracking-[0.22em] uppercase text-black shadow-4xl mb-4 sm:mb-5">
        Shop by Category
      </p>

      {/* Strip */}
      <div className="flex gap-2 justify-center items-center sm:gap-3 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.name] ?? Sparkles;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#f7f5f1] border border-[#e8e4de] hover:border-[#1a1a1a] transition-colors duration-200 no-underline shrink-0"
            >
              <Icon
                size={13}
                strokeWidth={1.5}
                className="text-[#aaa] group-hover:text-[#1a1a1a] transition-colors duration-200 shrink-0"
              />
              <span className="text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#5a5a55] group-hover:text-[#1a1a1a] transition-colors duration-200 whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}