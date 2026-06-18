"use client";

import { useState } from "react";
import { BackendCategory } from "@/lib/api/product.service";

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
  return (
    <div className="mb-4">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0 pb-3"
      >
        <span className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a]">
          {label}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="#1a1a1a" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
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

  const categoriesList = dynamicCategories.length > 0
    ? dynamicCategories.map((c) => c.name)
    : [];

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] tracking-[0.16em] uppercase text-[#1a1a1a]">Filters</span>
        <button
          onClick={onReset}
          className="text-[10px] tracking-widest uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors duration-200 
          bg-transparent border-none cursor-pointer p-0"
        >
          Clear all
        </button>
      </div>
      <div className="h-px bg-[#e8e6e2] mb-4" />

      {/* Category Accordion */}
      <Section label="Category" id="category" open={openSections.includes("category")} onToggle={toggle}>
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="py-1 animate-pulse flex items-center justify-between">
                <div className="h-3 bg-[#f0eeea] rounded w-2/3" />
              </div>
            ))
          ) : (
            categoriesList.map((cat) => {
              const isSelected = selectedCategory?.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(isSelected ? null : cat)}
                  className={`w-full text-left py-1 text-[12px] bg-transparent border-none cursor-pointer transition-colors 
                    duration-150 flex items-center justify-between group ${
                    isSelected ? "text-[#1a1a1a] font-medium" : "text-[#5a5a55] hover:text-[#1a1a1a]"
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && (
                    <span className="text-[9px] text-[#9a9a94]">✓</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </Section>
    </aside>
  );
}