import { notFound } from "next/navigation";
import { products } from "@/lib/products/data";

import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ProductDetails from "@/components/product/ProductDetails";
import Link from "next/link";

// Works for both Next.js 14 and 15
type Props = { params: Promise<{ slug: string }> | { slug: string } };

export default async function ProductPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24">
          <ProductGallery images={product.gallery} name={product.name} />
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#aaa] mb-2">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif mb-4">
              {product.name}
            </h1>
            <p className="text-[13px] text-[#5a5a55] leading-relaxed mb-6">
              {product.shortDescription}
            </p>
            <ProductActions product={product} />
          </div>
        </div>
        <ProductDetails product={product} />
      </div>

      {related.length > 0 && (
        <div className="px-5 sm:px-8 md:px-12 py-10 border-t border-[#ebebeb]">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-6">
            You May Also Like
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}