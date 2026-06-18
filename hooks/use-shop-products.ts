import { useState, useEffect } from "react";
import { productService, BackendCategory } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";
import { SortOption } from "@/types/shop/types";
import { ApiError } from "@/lib/api/api-client";

const backendSortMap: Record<SortOption, string> = {
  featured: "createdAt:desc",
  "name-asc": "title:asc",
  "name-desc": "title:desc",
};

export function useShopProducts(limit = 12) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortOption>("featured");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync category or sorting change to reset page back to 1
  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSortChange = (s: SortOption) => {
    setSort(s);
    setPage(1);
  };

  useEffect(() => {
    let activeRequest = true;

    async function loadData() {
      try {
        setLoading(true);
        
        // 1. Fetch categories if not loaded yet
        let cats = categories;
        if (categories.length === 0) {
          cats = await productService.getCategories();
          if (activeRequest) {
            setCategories(cats);
          }
        }

        // 2. Map category name to database ID
        const matchedCat = cats.find(
          (c) => c.name.toLowerCase() === selectedCategory?.toLowerCase()
        );
        const categoryId = matchedCat ? matchedCat.id : null;

        // 3. Query paginated products from backend
        const response = await productService.getProducts({
          page,
          limit,
          categoryId,
          sort: backendSortMap[sort],
        });

        if (!activeRequest) return;

        const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
        const mapped = ProductViewMapper.toDisplayProductList(response.products, categoryMap);

        setProducts(mapped);
        setTotalItems(response.total);
        setError(null);
      } catch (err) {
        if (!activeRequest) return;
        console.error("Failed to load shop products:", err);
        if (err instanceof ApiError) {
          setError({ title: err.title, message: err.message });
        } else {
          setError({
            title: "Something Went Wrong",
            message: err instanceof Error ? err.message : "Failed to load shop products",
          });
        }
      } finally {
        if (activeRequest) {
          setLoading(false);
          setIsRetrying(false);
        }
      }
    }

    loadData();

    return () => {
      activeRequest = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, sort, limit, retryCount]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    products,
    categories,
    loading,
    error,
    isRetrying,
    handleRetry,
    catalogIsEmpty: totalItems === 0 && selectedCategory === null,

    // Pagination
    page,
    setPage,
    totalPages,
    totalItems,

    // Filter & Sort States & Triggers
    sort,
    setSort: handleSortChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    resetFilters,
  };
}
