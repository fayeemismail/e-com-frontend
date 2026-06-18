import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Shop() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          Collection
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          All Products
        </h1>
      </div>
      <Suspense fallback={
        <div className="px-5 sm:px-8 md:px-12 py-12 text-center text-xs tracking-widest text-[#9a9a94] uppercase font-light">
          Loading products...
        </div>
      }>
        <ShopClient />
      </Suspense>
    </div>
  );
}