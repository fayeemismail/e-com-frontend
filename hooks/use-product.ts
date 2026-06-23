import { useState, useEffect } from "react";
import { productService } from "@/lib/api/product.service";
import { ProductViewMapper, DisplayProduct } from "@/lib/mappers/product.mapper";
import { Product } from "@/types/shop/types";
import { ApiError } from "@/lib/api/api-client";

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    async function loadProductData() {
      try {
        if (!isRetrying) {
          setLoading(true);
        }
        // Fetch product and categories in parallel
        const [backendProduct, categories] = await Promise.all([
          productService.getProductById(id),
          productService.getCategories(),
        ]);

        if (!activeRequest) return;

        if (!backendProduct) {
          throw new ApiError("Product not found", 404);
        }

        const categoriesMap = new Map(categories.map((c) => [c.id, c.name]));
        const mappedProduct = ProductViewMapper.toDetailProduct(backendProduct, categoriesMap);

        // Fetch related products from the same category dynamically
        let relatedDisplay: DisplayProduct[] = [];
        try {
          const matchedCategory = categories.find(
            (c) => c.name.toLowerCase() === mappedProduct.category.toLowerCase()
          );
          const categoryId = matchedCategory ? matchedCategory.id : undefined;

          const relatedRes = await productService.getProducts({
            page: 1,
            limit: 5,
            categoryId,
          });

          const mappedRelated = ProductViewMapper.toDisplayProductList(relatedRes.products, categoriesMap);
          // Filter out the current product being viewed
          relatedDisplay = mappedRelated
            .filter((p) => String(p.id) !== String(mappedProduct.id))
            .slice(0, 4);
        } catch (err) {
          console.error("Failed to load related products:", err);
        }

        if (activeRequest) {
          setProduct(mappedProduct);
          setRelatedProducts(relatedDisplay);
          setError(null);
        }
      } catch (err) {
        if (!activeRequest) return;
        console.error("Failed to load product details:", err);
        if (err instanceof ApiError) {
          setError({ title: err.title, message: err.message });
        } else {
          setError({
            title: "Something Went Wrong",
            message: err instanceof Error ? err.message : "Failed to load product details",
          });
        }
      } finally {
        if (activeRequest) {
          setLoading(false);
          setIsRetrying(false);
        }
      }
    }

    loadProductData();

    return () => {
      activeRequest = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, retryCount]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
  };

  return {
    product,
    relatedProducts,
    loading,
    error,
    isRetrying,
    handleRetry,
  };
}
