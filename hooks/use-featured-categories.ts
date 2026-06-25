import { useState, useEffect } from "react";
import { productService, BackendCategory } from "@/lib/api/product.service";
import { ApiError } from "@/lib/api/api-client";

export function useFeaturedCategories() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    let activeRequest = true;

    async function loadData() {
      try {
        const data = await productService.getCategories({ featured: true });

        if (!activeRequest) return;

        setCategories(data || []);
        setError(null);
      } catch (err) {
        if (!activeRequest) return;
        console.error("Failed to load featured categories:", err);
        if (err instanceof ApiError) {
          setError({ title: err.title, message: err.message });
        } else {
          setError({
            title: "Something Went Wrong",
            message: err instanceof Error ? err.message : "Failed to load featured categories",
          });
        }
      } finally {
        if (activeRequest) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      activeRequest = false;
    };
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
