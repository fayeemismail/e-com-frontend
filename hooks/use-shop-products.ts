import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { productService, BackendCategory } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";
import { SortOption } from "@/types/shop/types";
import { ApiError } from "@/lib/api/api-client";

const backendSortMap: Record<SortOption, string> = {
  featured: "createdAt:desc",
  "name-asc": "title:asc",
  "name-desc": "title:desc",
};

export function useShopProducts(limit = 20) {
  const searchParams = useSearchParams();

  const pageParam = searchParams ? searchParams.get("page") : null;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const selectedCategory = searchParams ? searchParams.get("category") : null;
  const searchQuery = searchParams ? searchParams.get("search") : null;

  const sortParam = searchParams ? searchParams.get("sort") : null;
  const sort = (sortParam as SortOption) || "featured";

  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  /** True only until the first successful catalog load (skeletons). */
  const [loading, setLoading] = useState(true);
  /** True while refetching after filters/page change (no full-page skeleton). */
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const hasLoadedOnce = useRef(false);
  const categoriesRef = useRef<BackendCategory[]>([]);

  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  useEffect(() => {
    let activeRequest = true;

    async function loadData() {
      const isInitial = !hasLoadedOnce.current;

      try {
        if (isInitial || isRetrying) {
          setLoading(true);
        } else {
          setIsFetching(true);
        }

        let cats = categoriesRef.current;
        if (cats.length === 0) {
          cats = await productService.getCategories();
          if (activeRequest) {
            setCategories(cats);
            categoriesRef.current = cats;
          }
        }

        const matchedCat = cats.find(
          (c) => c.name.toLowerCase() === selectedCategory?.toLowerCase()
        );
        const categoryId = matchedCat ? matchedCat.id : null;

        const response = await productService.getProducts({
          page,
          limit,
          categoryId,
          sort: backendSortMap[sort],
          search: searchQuery || undefined,
        });

        if (!activeRequest) return;

        const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
        const mapped = ProductViewMapper.toDisplayProductList(response.products, categoryMap);

        setProducts(mapped);
        setTotalItems(response.total);
        setError(null);
        hasLoadedOnce.current = true;
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
          setIsFetching(false);
          setIsRetrying(false);
        }
      }
    }

    loadData();

    return () => {
      activeRequest = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, sort, limit, retryCount, searchQuery]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
  };

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    products,
    categories,
    /** Initial load only — use for skeletons (sidebar + grid). */
    loading,
    /** Background refetch after category/sort/page — keep existing UI. */
    isFetching,
    error,
    isRetrying,
    handleRetry,
    catalogIsEmpty: totalItems === 0 && selectedCategory === null && searchQuery === null,

    page,
    totalPages,
    totalItems,

    sort,
    selectedCategory,
    search: searchQuery,
  };
}
