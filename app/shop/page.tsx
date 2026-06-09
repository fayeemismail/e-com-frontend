"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/products/data";
import { parsePrice, type SortOption } from "@/types/shop/types"; 
import ShopToolbar from "@/components/shop/ShopToolBar"; 
import FilterSidebar from "@/components/shop/FilterSidebar"; 
import ProductGrid from "@/components/shop/ProductGrid"; 

export default function Shop() {
  const [sort, setSort] = useState<SortOption>("featured");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const resetFilters = () => {
    setSelectedTags([]);
    setPriceRange([0, 1500]);
  };

  const filtered = useMemo(() => {
  let list = [...products];

  if (selectedTags.length > 0) {
    list = list.filter(
      (p) => p.tag && selectedTags.includes(p.tag)
    );
  }

  list = list.filter(
    (p) =>
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
  );

  if (sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sort === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}, [sort, selectedTags, priceRange]);

  const activeFilterCount = selectedTags.length + (priceRange[1] < 1500 ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Collection</p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          All Products
        </h1>
      </div>

      {/* Toolbar */}
      <ShopToolbar
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        resultCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onFilterOpen={() => setFilterOpen(true)}
      />

      {/* Body */}
      <div className="px-5 sm:px-8 md:px-12 py-6 flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-44 shrink-0">
          <FilterSidebar
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onReset={resetFilters}
          />
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} view={view} onReset={resetFilters} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a]">Filter</span>
              <button onClick={() => setFilterOpen(false)} className="bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              selectedTags={selectedTags}
              onTagToggle={toggleTag}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onReset={resetFilters}
            />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase border-none cursor-pointer"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}