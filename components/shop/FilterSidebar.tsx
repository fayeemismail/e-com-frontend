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
        className="w-full flex items-center justify-between gap-3 bg-transparent border-none cursor-pointer p-0 py-3 text-left"
      >
        <span className="text-[11px] tracking-[0.14em] uppercase text-[#0a1f3d] font-semibold">
          {label}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a1f3d"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
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
          className="text-[10px] tracking-[0.12em] uppercase text-[#94a3b8] hover:text-[#0a1f3d] transition-colors bg-transparent border-none cursor-pointer p-0 shrink-0"
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
        <div className="flex flex-col gap-0.5" aria-busy={isLoading || undefined}>
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
                    className={`w-full text-left py-2 px-0 bg-transparent border-none cursor-pointer transition-colors duration-150 flex items-center gap-2 ${
                      isSelected
                        ? "text-[#0a1f3d] font-semibold"
                        : "text-[#475569] hover:text-[#0a1f3d]"
                    }`}
                  >
                    <span className="text-[13px] leading-none whitespace-nowrap text-left">
                      {cat}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] text-[#94a3b8] shrink-0" aria-hidden>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
        </div>
      </Section>
    </aside>
  );
}
