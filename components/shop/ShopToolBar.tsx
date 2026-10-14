"use client";

import { useState, useRef, useEffect } from "react";
import { SORT_LABELS, type SortOption } from "@/types/shop/types";

type Props = {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  resultCount: number;
  activeFilterCount: number;
  onFilterOpen: () => void;
  /** Desktop: whole filter rail visible */
  filtersVisible: boolean;
  onToggleFilters: () => void;
};

export default function ShopToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
  activeFilterCount,
  onFilterOpen,
  filtersVisible,
  onToggleFilters,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-3 border-b border-[#e8e6e2] bg-white flex items-center justify-between gap-3 font-nav">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile: open filter drawer */}
        <button
          type="button"
          onClick={onFilterOpen}
          className="md:hidden inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#dbe3ef] bg-[#f5f7fb] text-[#0a1f3d] text-[11px] font-medium tracking-[0.04em] uppercase cursor-pointer hover:border-[#1e6bb8] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        {/* Desktop: rotating arrow — points left when open (collapse), right when closed (expand) */}
        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersVisible}
          aria-controls="shop-filter-rail"
          aria-label={filtersVisible ? "Collapse sidebar" : "Expand sidebar"}
          title={filtersVisible ? "Collapse sidebar" : "Expand sidebar"}
          className={`relative hidden md:inline-flex items-center justify-center h-8 w-8 rounded-full border cursor-pointer transition-all duration-200 ${
            filtersVisible
              ? "border-[#0a1f3d] bg-[#0a1f3d] text-white"
              : "border-[#dbe3ef] bg-[#f5f7fb] text-[#64748b] hover:border-[#0a1f3d] hover:text-[#0a1f3d]"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              filtersVisible ? "" : "rotate-180"
            }`}
            aria-hidden
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#1e6bb8] text-white text-[8px] font-bold tabular-nums leading-none flex items-center justify-center ring-2 ring-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <span className="tabular-nums text-[11px] sm:text-[12px] font-medium text-[#64748b] shrink-0">
          <span className="text-[#0a1f3d] font-semibold">{resultCount}</span>
          {" "}
          {resultCount === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div
          className="inline-flex items-center p-0.5 rounded-full border border-[#dbe3ef] bg-[#f5f7fb]"
          role="group"
          aria-label="View mode"
        >
          {(["grid", "list"] as const).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                aria-label={`${v} view`}
                aria-pressed={active}
                className={`h-7 w-8 inline-flex items-center justify-center rounded-full border-none cursor-pointer transition-all duration-150 ${
                  active
                    ? "bg-[#0a1f3d] text-white shadow-sm"
                    : "bg-transparent text-[#94a3b8] hover:text-[#0a1f3d]"
                }`}
              >
                {v === "grid" ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full border transition-all duration-200 cursor-pointer select-none ${
              sortOpen
                ? "border-[#0a1f3d] bg-[#f5f7fb] text-[#0a1f3d] ring-2 ring-[#0a1f3d]/10"
                : "border-[#dbe3ef] bg-white text-[#0a1f3d] hover:border-[#1e6bb8]"
            }`}
          >
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.08em] uppercase">
              {SORT_LABELS[sort]}
            </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-[#64748b] transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                sortOpen ? "rotate-180 text-[#0a1f3d]" : ""
              }`}
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div
            role="listbox"
            aria-label="Sort products"
            className={`absolute right-0 top-[calc(100%+6px)] z-30 min-w-[210px] bg-white border border-[#dbe3ef] rounded-xl shadow-[0_12px_32px_rgba(15,46,90,0.12),0_2px_6px_rgba(15,46,90,0.04)] py-1.5 overflow-hidden origin-top-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              sortOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
            }`}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => {
              const active = sort === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onSortChange(key);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-[12px] border-none cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 ${
                    active
                      ? "text-[#0a1f3d] bg-[#f0f4f9] font-semibold pl-4 border-l-2 border-l-[#0a1f3d]"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0a1f3d] hover:pl-4 font-medium border-l-2 border-l-transparent"
                  }`}
                >
                  <span>{SORT_LABELS[key]}</span>
                  {active && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0a1f3d] shrink-0"
                      aria-hidden
                    >
                      <polyline points="2.5 6 5 8.5 10 3" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
