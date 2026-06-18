"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ShopToolbar from "@/components/shop/ShopToolBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { useShopProducts } from "@/hooks/use-shop-products";

function SkeletonGrid({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="divide-y divide-[#e8e6e2]">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 py-4 animate-pulse">
            <div className="w-16 h-16 shrink-0 bg-[#f0eeea] rounded" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3 bg-[#e8e6e2] w-1/3 rounded" />
              <div className="h-2.5 bg-[#e8e6e2] w-1/4 rounded" />
            </div>
            <div className="w-10 h-3 bg-[#e8e6e2] shrink-0 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-[#f0eeea] w-full relative overflow-hidden mb-2 aspect-square rounded" style={{ paddingBottom: "100%" }} />
          <div className="flex items-center justify-between pt-2 gap-2">
            <div className="h-3 bg-[#e8e6e2] w-1/2 rounded" />
            <div className="h-3 bg-[#e8e6e2] w-1/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  error,
  isRetrying,
  handleRetry,
}: {
  error: { title: string; message: string };
  isRetrying: boolean;
  handleRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="mb-5 w-14 h-14 rounded-full bg-[#fdf0ec] flex items-center justify-center text-lg select-none relative">
        <span className="absolute inset-0 rounded-full bg-[#fdf0ec] animate-ping opacity-20" />
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c27c5a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
        {error.title}
      </h3>
      <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
        {error.message}
      </p>

      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="group relative text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 border-none cursor-pointer transition-all duration-300 hover:bg-[#c27c5a] overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-500 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"}`}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {isRetrying ? "Retrying..." : "Try Again"}
        </span>
      </button>
    </div>
  );
}

function CatalogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="mb-5 w-14 h-14 rounded-full bg-[#f3efe6] flex items-center justify-center text-[#c4a882] text-xl select-none">
        📦
      </div>
      <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
        Catalog is Empty
      </h3>
      <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
        We are currently curating new collections. Please check back shortly or return to the home page.
      </p>
      <Link
        href="/"
        className="group relative text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 border-none cursor-pointer transition-all duration-300 hover:bg-[#c27c5a] no-underline font-light inline-block"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get("category") : null;

  const {
    products: filtered,
    categories,
    loading,
    error,
    isRetrying,
    handleRetry,
    catalogIsEmpty,

    // Filter & Sort
    sort,
    setSort,
    selectedTags,
    toggleTag,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    maxPriceLimit,
    resetFilters: resetHookFilters,
  } = useShopProducts();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync category state with query parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam, setSelectedCategory]);

  const handleCategorySelect = (categoryName: string | null) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    resetHookFilters();
    handleCategorySelect(null);
  };

  const activeFilterCount =
    selectedTags.length +
    (priceRange[1] < maxPriceLimit ? 1 : 0) +
    (selectedCategory ? 1 : 0);

  return (
    <>
      <ShopToolbar
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        resultCount={loading ? 0 : filtered.length}
        activeFilterCount={activeFilterCount}
        onFilterOpen={() => setFilterOpen(true)}
      />

      <div className="px-5 sm:px-8 md:px-12 py-6 flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-44 shrink-0">
          <FilterSidebar
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onReset={resetFilters}
            maxPrice={maxPriceLimit}
            dynamicCategories={categories}
          />
        </div>

        <div className="flex-1 min-w-0">
          {loading && <SkeletonGrid view={view} />}
          {error && (
            <ErrorState
              error={error}
              isRetrying={isRetrying}
              handleRetry={handleRetry}
            />
          )}
          {!loading && !error && catalogIsEmpty && <CatalogEmptyState />}
          {!loading && !error && !catalogIsEmpty && (
            <ProductGrid products={filtered} view={view} onReset={resetFilters} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a]">
                Filter
              </span>
              <button
                onClick={() => setFilterOpen(false)}
                className="bg-transparent border-none cursor-pointer p-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              selectedTags={selectedTags}
              onTagToggle={toggleTag}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onReset={resetFilters}
              maxPrice={maxPriceLimit}
              dynamicCategories={categories}
            />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase border-none 
              cursor-pointer"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
