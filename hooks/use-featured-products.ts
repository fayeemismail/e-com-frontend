import { useState, useEffect } from "react";
import { productService } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";
import { ApiError } from "@/lib/api/api-client";

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
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

        // Pre-fetch product details in the background to resolve SKUs for instant Add to Cart
        Promise.all(
          backendProducts.map(async (p) => {
            try {
              const detail = await productService.getProductById(p.id);
              return { id: p.id, skus: detail.skus };
            } catch {
              return null;
            }
          })
        ).then((skuResults) => {
          if (!activeRequest) return;
          const skuMap = new Map(
            skuResults.filter(Boolean).map((r) => [r!.id, r!.skus])
          );
          setProducts((prev) =>
            prev.map((prod) => {
              const skus = skuMap.get(String(prod.id));
              if (!skus || skus.length === 0) return prod;
              const defaultSku = skus.find((s) => s.type === "buy") || skus[0];
              const skuUnit =
                (defaultSku as any)?.unitName ||
                (defaultSku as any)?.unit_name ||
                (defaultSku as any)?.unit ||
                defaultSku?.attributes?.unitName ||
                defaultSku?.attributes?.['Unit Name'] ||
                defaultSku?.attributes?.unit ||
                defaultSku?.attributes?.Unit;
              let unit = prod.unit;
              if (skuUnit) {
                const u = String(skuUnit).trim();
                const lower = u.toLowerCase();
                if (u === "-" || u === "--" || u === "—" || u === "–" || lower === "none" || lower === "n/a" || lower === "single") {
                  unit = undefined;
                } else if (lower === "dz" || lower === "dozen" || lower === "doz") {
                  unit = "DZ";
                } else if (lower === "pac" || lower === "pack") {
                  unit = "PAC";
                } else if (lower === "pc" || lower === "piece" || lower === "pcs") {
                  unit = "PC";
                } else {
                  unit = u.toUpperCase().replace(/^\/+\s*/, "");
                }
              }
              const unitName = unit;
              return { ...prod, skus, defaultSku, unit, unitName };
            })
          );
        });
      } catch (err) {
        if (!activeRequest) return;
        console.error("Failed to load featured products:", err);
        if (err instanceof ApiError) {
          setError({ title: err.title, message: err.message });
        } else {
          setError({
            title: "Something Went Wrong",
            message: err instanceof Error ? err.message : "Failed to load featured products",
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
