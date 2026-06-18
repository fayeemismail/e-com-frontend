import { useState, useEffect } from "react";
import { productService } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState("All");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    async function loadData() {
      try {
        const [backendProducts, backendCategories] = await Promise.all([
          productService.getFeaturedProducts(limit),
          productService.getCategories(),
        ]);

        if (!activeRequest) return;

        const categoryMap = new Map(backendCategories.map((c) => [c.id, c.name]));
        const mapped = ProductViewMapper.toDisplayProductList(backendProducts, categoryMap);

        setProducts(mapped);
        setError(null);
      } catch (err) {
        if (!activeRequest) return;
        console.error("Failed to load featured products:", err);
        setError(err instanceof Error ? err.message : "Failed to load featured products");
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
  }, [retryCount, limit]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
  };

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered =
    active === "All"
      ? products
      : products.filter((p) => p.category === active);

  return {
    products: filtered,
    loading,
    error,
    isRetrying,
    activeCategory: active,
    setActiveCategory: setActive,
    categories,
    handleRetry,
  };
}
