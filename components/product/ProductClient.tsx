"use client";

import { useProduct } from "@/hooks/use-product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ProductDetails from "@/components/product/ProductDetails";
import FeaturedProductCardArchitectural from "@/components/home/FeaturedProductCardArchitectural";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ErrorState from "@/components/common/ErrorState";
import { Skeleton, ProductCardSkeleton } from "@/components/common/Skeleton";

interface ProductClientProps {
  id: string;
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafaf9] font-nav" aria-busy="true" aria-label="Loading product">
      {/* Breadcrumb skeleton */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 border-b border-slate-200 bg-white">
        <div className="max-w-[1240px] mx-auto">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="w-full aspect-square sm:aspect-[4/3] rounded-2xl" />
            <div className="grid grid-cols-3 gap-2.5">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>

          {/* Action column skeleton */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-4/5 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />

            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200">
          <Skeleton className="h-5 w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

  const categoryName = product.category && product.category !== "General" ? product.category : null;
  const sapCode = product.sapId || (product as any).rawProduct?.sapId;

  return (
    <div className="min-h-screen bg-white font-nav text-[#0a1f3d]">
      {/* ── BREADCRUMB ── */}
      <div className="bg-[#fafaf9] border-b border-slate-200/90 py-3 sm:py-3.5 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[1240px] mx-auto">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[12.5px] text-slate-500 font-medium flex-wrap">
            <Link
              href="/"
              className="text-slate-600 hover:text-[#00a6e0] transition-colors no-underline"
            >
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            {categoryName && (
              <>
                <Link
                  href={`/?category=${encodeURIComponent(categoryName)}`}
                  className="text-slate-600 hover:text-[#00a6e0] transition-colors no-underline"
                >
                  {categoryName}
                </Link>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
              </>
            )}
            <span className="text-[#0a1f3d] font-semibold truncate max-w-[260px] sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── MAIN PRODUCT SHOWCASE SECTION ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <ProductGallery images={product.gallery} name={product.name} />
          </div>

          {/* Right Column: Title, Metadata & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Category / Brand / SAP Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {categoryName && (
                <Link
                  href={`/?category=${encodeURIComponent(categoryName)}`}
                  className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f2e5a] text-[11px] font-bold border border-blue-200 no-underline hover:bg-blue-100 transition-colors"
                >
                  {categoryName}
                </Link>
              )}
              {product.brand && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {product.brand}
                </span>
              )}
              {sapCode && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold border border-slate-200">
                  SAP #{sapCode}
                </span>
              )}
              {(product.stock ?? 0) > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 ml-auto">
                  In Stock
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-semibold border border-red-200 ml-auto">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a1f3d] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Description (only if provided by backend) */}
            {product.description && (
              <p className="text-[13.5px] sm:text-[14px] text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                {product.description}
              </p>
            )}

            {/* Interactive Purchase Console */}
            <ProductActions product={product} />
          </div>
        </div>

        {/* ── DETAILED INFORMATION TABS ── */}
        <ProductDetails product={product} />

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0a1f3d] m-0 tracking-tight">
                  Related Products
                </h3>
                {categoryName && (
                  <p className="text-[12px] text-slate-500 m-0 mt-0.5">
                    Products in {categoryName}
                  </p>
                )}
              </div>

              {categoryName && (
                <Link
                  href={`/?category=${encodeURIComponent(categoryName)}`}
                  className="text-[12px] font-semibold text-[#00a6e0] hover:text-[#0a1f3d] transition-colors no-underline shrink-0"
                >
                  View all in {categoryName} →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <div key={p.id} className="h-full">
                  <FeaturedProductCardArchitectural product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
