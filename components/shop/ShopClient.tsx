"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ShopToolbar from "@/components/shop/ShopToolBar";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { useShopProducts } from "@/hooks/use-shop-products";
import { SortOption } from "@/types/shop/types";
import ErrorState from "@/components/common/ErrorState";

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

function CatalogEmptyState({
  search,
  onReset,
}: {
  search: string | null;
  onReset: () => void;
}) {
  if (search) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="mb-5 w-14 h-14 rounded-full bg-[#f3efe6] flex items-center justify-center text-[#c4a882] text-xl select-none">
          🔍
        </div>
        <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
          No Results Found
        </h3>
        <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
          We couldn&apos;t find any products matching “{search}”. Try checking your spelling or using different keywords.
        </p>
        <button
          onClick={onReset}
          className="group relative text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 border-none cursor-pointer transition-all duration-300 hover:bg-[#c27c5a] no-underline font-light inline-block font-sans"
        >
          Clear Search
        </button>
      </div>
    );
  }

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
  const {
    products: filtered,
    categories,
    loading,
    error,
    isRetrying,
    handleRetry,
    catalogIsEmpty,

    // Pagination
    page,
    totalPages,

    // Filter & Sort
    sort,
    selectedCategory,
    search,
  } = useShopProducts();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const handleCategorySelect = (categoryName: string | null) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (pageNum: number) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    router.push(`/shop?${params.toString()}`, { scroll: true });
  };

  const handleSortChange = (newSort: SortOption) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("/shop", { scroll: false });
  };

  const handleClearSearch = () => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const activeFilterCount = (selectedCategory ? 1 : 0) + (search ? 1 : 0);

  // Render Dynamic Header Info
  const getHeaderInfo = () => {
    if (search) {
      return {
        label: "Search Results",
        title: `“${search}”`,
      };
    }
    if (selectedCategory) {
      return {
        label: "Category",
        title: selectedCategory,
      };
    }
    return {
      label: "Collection",
      title: "All Products",
    };
  };

  const { label, title } = getHeaderInfo();

  return (
    <>
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          {label}
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          {title}
        </h1>
      </div>

      <ShopToolbar
        sort={sort}
        onSortChange={handleSortChange}
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
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onReset={resetFilters}
            dynamicCategories={categories}
            isLoading={loading}
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
          {!loading && !error && catalogIsEmpty && (
            <CatalogEmptyState search={search} onReset={handleClearSearch} />
          )}
          {!loading && !error && !catalogIsEmpty && (
            <>
              <ProductGrid products={filtered} view={view} onReset={resetFilters} />
              {totalPages > 1 && filtered.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#e8e6e2]">
                  <button 
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 border border-[#e8e6e2] text-[10px] text-[#1a1a1a] tracking-widest uppercase disabled:opacity-35 hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pNum = index + 1;
                    return (
                      <button
                        key={pNum}
                        onClick={() => handlePageChange(pNum)}
                        className={`w-9 h-9 flex items-center justify-center border text-[11px] transition-colors duration-200 ${
                          page === pNum
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                            : "border-[#e8e6e2] text-[#1a1a1a] hover:bg-[#f5f4f0]"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button 
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 border border-[#e8e6e2] text-[10px] text-[#1a1a1a] tracking-widest uppercase disabled:opacity-35 hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onReset={resetFilters}
              dynamicCategories={categories}
              isLoading={loading}
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
