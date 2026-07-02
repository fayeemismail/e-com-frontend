"use client";

import { useState } from "react";
import { SORT_LABELS, type SortOption } from "@/types/shop/types"; 

type Props = {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  resultCount: number;
  activeFilterCount: number;
  onFilterOpen: () => void;
};

export default function ShopToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  activeFilterCount,
  onFilterOpen,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="px-5 sm:px-8 md:px-12 py-3 border-b border-[#e8e6e2] flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile filter button */}
        <button
          onClick={onFilterOpen}
          className="flex items-center gap-1.5 md:hidden bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          <span className="text-[11px] tracking-[0.12em] uppercase">
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </span>
        </button>

        <span className="text-[11px] text-[#9a9a94] tracking-[0.04em]">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Grid / List toggle */}
        <div className="hidden sm:flex items-center gap-2">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              aria-label={`${v} view`}
              className={`bg-transparent border-none cursor-pointer p-0 transition-opacity duration-150 ${view === v ? "opacity-100" : "opacity-30"}`}
            >
              {v === "grid" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a]"
          >
            <span className="text-[11px] tracking-[0.12em] uppercase">{SORT_LABELS[sort]}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#e8e6e2] min-w-45 py-1 shadow-md rounded-sm">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { onSortChange(key); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] tracking-widest uppercase bg-transparent border-none cursor-pointer transition-colors duration-150 flex items-center justify-between group ${
                      sort === key 
                        ? "text-[#1a1a1a] bg-[#f5f4f0] font-medium" 
                        : "text-[#5a5a55] hover:bg-[#f5f4f0] hover:text-[#1a1a1a]"
                    }`}
                  >
                    <span>{SORT_LABELS[key]}</span>
                    {sort === key && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a1a1a]">
                        <polyline points="2.5 6 5 8.5 10 3" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}