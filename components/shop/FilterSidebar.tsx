"use client";

import { useState } from "react";
import { ALL_TAGS } from "@/types/shop/types";

type Props = {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
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
  selectedTags,
  onTagToggle,
  priceRange,
  onPriceChange,
  onReset,
}: Props) {
  const [openSections, setOpenSections] = useState(["tag", "price"]);

  const toggle = (id: string) =>
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] tracking-[0.16em] uppercase text-[#1a1a1a]">Filters</span>
        <button
          onClick={onReset}
          className="text-[10px] tracking-widest uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
        >
          Clear all
        </button>
      </div>
      <div className="h-px bg-[#e8e6e2] mb-4" />

      {/* Label */}
      <Section label="Label" id="tag" open={openSections.includes("tag")} onToggle={toggle}>
        <div className="space-y-2.5">
          {ALL_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2.5 cursor-pointer group/check">
              <div
                onClick={() => onTagToggle(tag)}
                className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-[#1a1a1a] border-[#1a1a1a]"
                    : "border-[#ccc] group-hover/check:border-[#1a1a1a]"
                }`}
              >
                {selectedTags.includes(tag) && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 6 4.5 10 11 2" />
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-[#5a5a55]">{tag}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section label="Price" id="price" open={openSections.includes("price")} onToggle={toggle}>
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] text-[#5a5a55]">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0} max={1500} step={50}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-[#1a1a1a] cursor-pointer"
          />
        </div>
      </Section>
    </aside>
  );
}