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
import {
  ProductCardSkeleton,
  ProductListRowSkeleton,
} from "@/components/common/Skeleton";

function SkeletonGrid({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div
        className="divide-y divide-[#e2e8f0] bg-white border border-[#e2e8f0] rounded-md"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductListRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4 items-start"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
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
    isFetching,
    error,
    isRetrying,
    handleRetry,
    catalogIsEmpty,

    // Pagination
    page,
    totalPages,
    totalItems,

    // Filter & Sort
    sort,
    selectedCategory,
    search,
  } = useShopProducts();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);

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

  const title = search
    ? `“${search}”`
    : selectedCategory
      ? selectedCategory
      : "All Products";

  return (
    <>
      {/* Page title — mobile always; desktop when panel is closed */}
      <div
        className={`px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] overflow-hidden transition-[max-height,opacity,padding,border-color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          filtersVisible
            ? "md:max-h-0 md:opacity-0 md:pt-0 md:pb-0 md:border-transparent"
            : "md:max-h-32 md:opacity-100"
        }`}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-[#0a1f3d] break-words m-0">
          {title}
        </h1>
      </div>

      <ShopToolbar
        sort={sort}
        onSortChange={handleSortChange}
        view={view}
        onViewChange={setView}
        resultCount={loading ? 0 : totalItems}
        activeFilterCount={activeFilterCount}
        onFilterOpen={() => setFilterOpen(true)}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((v) => !v)}
      />

      <div className="px-5 sm:px-8 md:px-12 py-6 flex">
        <div
          id="shop-filter-rail"
          className={`hidden md:block shrink-0 overflow-hidden transition-[width,margin,opacity] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width,margin,opacity] ${
            filtersVisible
              ? "w-64 lg:w-72 mr-8 lg:mr-10 opacity-100"
              : "w-0 mr-0 opacity-0 pointer-events-none"
          }`}
          aria-hidden={!filtersVisible}
        >
          <div className="w-64 lg:w-72">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onReset={resetFilters}
              dynamicCategories={categories}
              isLoading={loading && categories.length === 0}
            />
          </div>
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
              <div className={isFetching ? "opacity-60 pointer-events-none transition-opacity duration-150" : "transition-opacity duration-150"}>
                <ProductGrid products={filtered} view={view} onReset={resetFilters} />
              </div>
              {totalPages > 1 && filtered.length > 0 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 pt-8 border-t border-[#e2e8f0] font-nav">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="h-9 px-3.5 rounded-full border border-[#dbe3ef] bg-white text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0a1f3d] disabled:opacity-35 disabled:pointer-events-none hover:border-[#0a1f3d] hover:bg-[#f5f7fb] transition-colors duration-200 cursor-pointer"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pNum = index + 1;
                    const active = page === pNum;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => handlePageChange(pNum)}
                        aria-current={active ? "page" : undefined}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border text-[12px] font-semibold tabular-nums transition-colors duration-200 cursor-pointer ${
                          active
                            ? "bg-[#0a1f3d] text-white border-[#0a1f3d]"
                            : "bg-white border-[#dbe3ef] text-[#475569] hover:border-[#0a1f3d] hover:text-[#0a1f3d] hover:bg-[#f5f7fb]"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="h-9 px-3.5 rounded-full border border-[#dbe3ef] bg-white text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0a1f3d] disabled:opacity-35 disabled:pointer-events-none hover:border-[#0a1f3d] hover:bg-[#f5f7fb] transition-colors duration-200 cursor-pointer"
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
              isLoading={loading && categories.length === 0}
            />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase border-none 
              cursor-pointer"
            >
              Show {totalItems} Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
