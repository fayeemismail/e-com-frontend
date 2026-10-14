"use client";

import { useProduct } from "@/hooks/use-product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ProductDetails from "@/components/product/ProductDetails";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton, ProductCardSkeleton } from "@/components/common/Skeleton";

interface ProductClientProps {
  id: string;
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]" aria-busy="true" aria-label="Loading product">
      <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-[#e2e8f0] bg-white">
        <Skeleton className="h-3 w-48" />
      </div>

      <div className="px-5 sm:px-8 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <div className="flex flex-row sm:flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-14 h-14 sm:w-16 sm:h-16" rounded="md" />
              ))}
            </div>
            <Skeleton className="flex-1 aspect-square sm:aspect-4/5 min-h-[240px]" rounded="md" />
          </div>

          <div className="space-y-6 bg-white border border-[#e2e8f0] rounded-md p-5 sm:p-6">
            <div>
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-6 w-4/5 mb-4" />
              <Skeleton className="h-3.5 w-full mb-2" />
              <Skeleton className="h-3.5 w-5/6 mb-2" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>

            <div className="space-y-3 pt-4 border-t border-[#eef2f7]">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-10 w-24" rounded="sm" />
                <Skeleton className="h-10 flex-1" rounded="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
          <Skeleton className="h-4 w-36 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductClient({ id }: ProductClientProps) {
  const { product, relatedProducts, loading, error, isRetrying, handleRetry } = useProduct(id);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <ErrorState
        error={error || { title: "Product Not Found", message: "This product details could not be found." }}
        isRetrying={isRetrying}
        handleRetry={handleRetry}
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-[#ebebeb]">
        <nav className="flex items-center gap-2 text-[11px] text-[#aaa] tracking-[0.06em]">
          <Link href="/" className="hover:text-[#1a1a1a] transition-colors duration-150 no-underline text-[#aaa]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1a1a1a] transition-colors duration-150 no-underline text-[#aaa]">Shop</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="px-5 sm:px-8 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
          <ProductGallery images={product.gallery} name={product.name} />
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#aaa] mb-2">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif mb-4">
              {product.name}
            </h1>
            <p className="text-[13px] text-[#5a5a55] leading-relaxed mb-6 whitespace-pre-wrap">
              {product.shortDescription}
            </p>
            <ProductActions product={product} />
          </div>
        </div>
        <ProductDetails product={product} />
      </div>

      {/* Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="px-5 sm:px-8 md:px-12 py-10 border-t border-[#ebebeb]">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-6">
            You May Also Like
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
