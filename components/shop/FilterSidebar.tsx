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
    <div className="border-t border-[#ebebeb]">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3.5 bg-transparent border-none cursor-pointer p-0"
      >
        <span className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a]">{label}</span>
        <span className={`text-[#1a1a1a] text-sm leading-none transition-transform duration-200 inline-block ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-4" : "max-h-0"}`}>
        {children}
      </div>
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

  const hasActive = selectedTags.length > 0 || priceRange[1] < 1500;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <span className="text-[11px] tracking-[0.16em] uppercase text-[#1a1a1a]">Filter</span>
        {hasActive && (
          <button
            onClick={onReset}
            className="text-[10px] tracking-[0.08em] uppercase text-[#aaa] hover:text-[#1a1a1a] transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Label */}
      <Section label="Label" id="tag" open={openSections.includes("tag")} onToggle={toggle}>
        <div className="space-y-1">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`w-full text-left text-[12px] py-1 bg-transparent border-none cursor-pointer transition-colors duration-150 ${
                selectedTags.includes(tag)
                  ? "text-[#1a1a1a]"
                  : "text-[#aaa] hover:text-[#1a1a1a]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full shrink-0 transition-colors duration-150 ${selectedTags.includes(tag) ? "bg-[#1a1a1a]" : "bg-transparent"}`} />
                {tag}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section label="Price" id="price" open={openSections.includes("price")} onToggle={toggle}>
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] text-[#aaa]">
            <span>$10</span>
            <span className={priceRange[1] < 1500 ? "text-[#1a1a1a]" : "text-[#aaa]"}>
              ${priceRange[1]}
            </span>
          </div>
          <input
            type="range"
            min={0} max={1500} step={50}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([0, Number(e.target.value)])}
            className="w-full accent-[#1a1a1a] cursor-pointer h-px"
          />
        </div>
      </Section>

      <div className="border-t border-[#ebebeb]" />
    </aside>
  );
}