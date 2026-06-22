"use client";

import { useProduct } from "@/hooks/use-product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ProductDetails from "@/components/product/ProductDetails";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import ErrorState from "@/components/common/ErrorState";

interface ProductClientProps {
  id: string;
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-[#ebebeb]">
        <div className="h-3 bg-[#f0eeea] w-48 rounded animate-pulse" />
      </div>

      {/* Main product section Skeleton */}
      <div className="px-5 sm:px-8 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
          {/* Gallery image block */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <div className="flex flex-row sm:flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f0eeea] rounded animate-pulse" />
              ))}
            </div>
            <div className="flex-1 bg-[#f0eeea] aspect-square sm:aspect-4/5 rounded animate-pulse" />
          </div>

          {/* Product Info Block */}
          <div className="space-y-6">
            <div>
              <div className="h-3.5 bg-[#f0eeea] w-1/4 rounded animate-pulse mb-3" />
              <div className="h-7 bg-[#f0eeea] w-3/4 rounded animate-pulse mb-4" />
              <div className="h-4 bg-[#f0eeea] w-full rounded animate-pulse mb-2" />
              <div className="h-4 bg-[#f0eeea] w-5/6 rounded animate-pulse" />
            </div>

            {/* Actions Panel Skeleton */}
            <div className="space-y-4 pt-4 border-t border-[#ebebeb]">
              <div className="h-4 bg-[#f0eeea] w-1/3 rounded animate-pulse" />
              <div className="h-12 bg-[#f0eeea] w-full rounded animate-pulse" />
              <div className="h-12 bg-[#f0eeea] w-full rounded animate-pulse" />
            </div>
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
