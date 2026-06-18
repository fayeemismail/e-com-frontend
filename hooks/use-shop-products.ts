import { useState, useEffect, useMemo } from "react";
import { productService, BackendCategory } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";
import { SortOption } from "@/types/shop/types";
import { ApiError } from "@/lib/api/api-client";

export function useShopProducts(limit = 100) {
  const [rawProducts, setRawProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Filter & Sort States
  const [sort, setSort] = useState<SortOption>("featured");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Price range state
  const [maxPriceLimit, setMaxPriceLimit] = useState(1500);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [hasSetDefaultPrice, setHasSetDefaultPrice] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    async function loadData() {
      try {
        const [backendProducts, backendCategories] = await Promise.all([
          productService.getProducts(limit),
          productService.getCategories(),
        ]);

        if (!activeRequest) return;

        const categoryMap = new Map(backendCategories.map((c) => [c.id, c.name]));
        const mapped = ProductViewMapper.toDisplayProductList(backendProducts, categoryMap);

        setRawProducts(mapped);
        setCategories(backendCategories);
        setError(null);

        // Find max price dynamically from products
        if (mapped.length > 0) {
          const maxPrice = Math.max(...mapped.map((p) => p.price));
          const roundedMax = Math.ceil(maxPrice / 100) * 100 || 1500;
          setMaxPriceLimit(roundedMax);
          if (!hasSetDefaultPrice) {
            setPriceRange([0, roundedMax]);
            setHasSetDefaultPrice(true);
          }
        }
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
  }, [retryCount, limit]);

  const handleRetry = () => {
    setIsRetrying(true);
    setLoading(true);
    setRetryCount((prev) => prev + 1);
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const resetFilters = () => {
    setSelectedTags([]);
    setPriceRange([0, maxPriceLimit]);
    setSelectedCategory(null);
  };

  // Perform client-side filter and sort
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // 1. Filter by category
    if (selectedCategory) {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filter by tag
    if (selectedTags.length > 0) {
      list = list.filter((p) => p.tag && selectedTags.includes(p.tag));
    }

    // 3. Filter by price range
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // 4. Sort
    if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "featured": If products have tag "Featured", sort them first, else fallback to loaded order
      list.sort((a, b) => {
        const aFeat = a.tag === "Featured" ? 1 : 0;
        const bFeat = b.tag === "Featured" ? 1 : 0;
        return bFeat - aFeat;
      });
    }

    return list;
  }, [rawProducts, selectedCategory, selectedTags, priceRange, sort]);

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    isRetrying,
    handleRetry,

    // Filter & Sort States & Triggers
    sort,
    setSort,
    selectedTags,
    toggleTag,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    maxPriceLimit,
    resetFilters,
  };
}
