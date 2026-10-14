"use client";

import { useState } from "react";
import { BackendCategory } from "@/lib/api/product.service";
import { CategoryRowSkeleton } from "@/components/common/Skeleton";

type Props = {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onReset: () => void;
  dynamicCategories?: BackendCategory[];
  isLoading?: boolean;
};

function Section({
  label,
  id,
  open,
  onToggle,
  children,
}: {
  label: string;
  id: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const panelId = `${id}-panel`;

  return (
    <div>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between gap-3 bg-transparent border-none cursor-pointer p-0 py-3 text-left group"
      >
        <span className="text-[11px] tracking-[0.14em] uppercase text-[#0a1f3d] font-semibold group-hover:text-[#1e6bb8] transition-colors">
          {label}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a1f3d"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="pb-3">{children}</div>
        </div>
      </div>
      <div className="h-px bg-[#e8e6e2]" />
    </div>
  );
}

export default function FilterSidebar({
  selectedCategory,
  onCategorySelect,
  onReset,
  dynamicCategories = [],
  isLoading = false,
}: Props) {
  const [openSections, setOpenSections] = useState(["category"]);

  const toggle = (id: string) =>
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const categoriesList =
    dynamicCategories.length > 0 ? dynamicCategories.map((c) => c.name) : [];

  return (
    <aside className="w-full font-nav">
      <div className="flex items-center justify-between gap-3 py-3">
        <span className="text-[11px] tracking-[0.14em] uppercase text-[#0a1f3d] font-semibold">
          Filters
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={!selectedCategory}
          className={`text-[10px] tracking-[0.12em] uppercase transition-all duration-200 bg-transparent border-none p-0 shrink-0 ${
            selectedCategory
              ? "text-[#1e6bb8] hover:text-[#0a1f3d] font-semibold cursor-pointer opacity-100"
              : "text-[#94a3b8] opacity-40 cursor-default"
          }`}
        >
          Clear all
        </button>
      </div>
      <div className="h-px bg-[#e8e6e2]" />

      <Section
        label="Category"
        id="category"
        open={openSections.includes("category")}
        onToggle={toggle}
      >
        <div className="flex flex-col gap-1" aria-busy={isLoading || undefined}>
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => (
                <CategoryRowSkeleton key={index} />
              ))
            : categoriesList.map((cat) => {
                const isSelected =
                  selectedCategory?.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    title={cat}
                    onClick={() => onCategorySelect(isSelected ? null : cat)}
                    className={`w-full text-left py-2 px-2.5 rounded-md border-none cursor-pointer transition-all duration-200 flex items-center justify-between group active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#0a1f3d] text-white font-medium shadow-2xs"
                        : "bg-transparent text-[#475569] hover:bg-[#f0f4f9] hover:text-[#0a1f3d] hover:translate-x-0.5"
                    }`}
                  >
                    <span className="text-[12.5px] sm:text-[13px] leading-snug truncate pr-2">
                      {cat}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[10px] transition-all duration-200 ${
                        isSelected
                          ? "bg-white text-[#0a1f3d] scale-100 opacity-100 font-bold"
                          : "border border-[#cbd5e1] group-hover:border-[#0a1f3d] opacity-0 group-hover:opacity-60 scale-75 group-hover:scale-100 text-transparent"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
        </div>
      </Section>
    </aside>
  );
}
