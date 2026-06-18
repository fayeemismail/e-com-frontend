"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-8">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          Shopping Bags
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          Cart
        </h1>
      </div>

      <div className="px-5 sm:px-8 md:px-12">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ccc"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-5"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h2 className="text-lg font-light tracking-tight font-serif text-[#1a1a1a] mb-2">
            Your cart is empty
          </h2>
          <p className="text-xs text-[#9a9a94] tracking-wide leading-relaxed mb-8">
            Looks like you haven&apos;t added anything to your cart yet. Browse our
            collections to find your favorites.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 
                hover:bg-transparent hover:text-[#1a1a1a] border border-[#1a1a1a] transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
