"use client";

import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-8">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          Favorites
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          Wishlist
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
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
            1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
          <h2 className="text-lg font-light tracking-tight font-serif text-[#1a1a1a] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#9a9a94] tracking-wide leading-relaxed mb-8">
            Explore our collections and save your favorite items here to view
            them later.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white  text-[11px] tracking-[0.16em] uppercase px-9 py-4 hover:bg-transparent 
                hover:text-[#1a1a1a] border border-[#1a1a1a] transition-colors duration-200"
          >
            Start Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
