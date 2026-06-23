"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types";

export default function ProductDetails({ product }: { product: Product }) {
  // Determine if this is a book/literary item vs structural item to customize tabs
  const isBook = !!(product.author || product.isbn || product.pages);
  const specTabName = isBook ? "Specifications" : "Dimensions";

  const tabs = ["Description", "Details", specTabName] as const;
  type Tab = (typeof tabs)[number];

  const [tab, setTab] = useState<Tab>("Description");

  return (
    <div className="mt-12 md:mt-16 border-t border-[#ebebeb]">
      {/* Tab Nav */}
      <div className="flex gap-6 pt-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-4 text-[11px] tracking-[0.12em] uppercase bg-transparent border-none cursor-pointer transition-colors duration-150 border-b-[1.5px] ${
              tab === t
                ? "text-[#1a1a1a] border-[#1a1a1a]"
                : "text-[#aaa] border-transparent hover:text-[#1a1a1a]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-7 max-w-2xl">
        {/* Description Tab */}
        {tab === "Description" && (
          <p className="text-[13px] text-[#5a5a55] leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        )}

        {/* Details Tab */}
        {tab === "Details" && (
          <div className="space-y-4">
            {product.materials && product.materials.length > 0 && (
              <div>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-2 font-serif">
                  Materials
                </p>
                <ul className="space-y-1 pl-0 list-none">
                  {product.materials.map((m) => (
                    <li key={m} className="text-[13px] text-[#5a5a55] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.features && product.features.length > 0 && (
              <div>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-2 font-serif">
                  Features
                </p>
                <ul className="space-y-1 pl-0 list-none">
                  {product.features.map((f) => (
                    <li key={f} className="text-[13px] text-[#5a5a55] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Dimensions or Specifications Tab */}
        {tab === specTabName && (
          <div className="divide-y divide-[#f5f5f5]">
            {isBook ? (
              // Book Specifications
              <>
                {product.author && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-[12px] text-[#9a9a94]">Author</span>
                    <span className="text-[12px] text-[#1a1a1a] font-serif">{product.author}</span>
                  </div>
                )}
                {product.publisher && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-[12px] text-[#9a9a94]">Publisher</span>
                    <span className="text-[12px] text-[#1a1a1a]">{product.publisher}</span>
                  </div>
                )}
                {product.language && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-[12px] text-[#9a9a94]">Language</span>
                    <span className="text-[12px] text-[#1a1a1a]">{product.language}</span>
                  </div>
                )}
                {product.pages && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-[12px] text-[#9a9a94]">Pages</span>
                    <span className="text-[12px] text-[#1a1a1a]">{product.pages} pages</span>
                  </div>
                )}
                {product.isbn && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-[12px] text-[#9a9a94]">ISBN</span>
                    <span className="text-[12px] text-[#1a1a1a] font-mono">{product.isbn}</span>
                  </div>
                )}
              </>
            ) : (
              // Furniture Dimensions
              <>
                {product.dimensions &&
                  Object.entries(product.dimensions).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2.5">
                      <span className="text-[12px] text-[#9a9a94] capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-[12px] text-[#1a1a1a]">{val}</span>
                    </div>
                  ))}
              </>
            )}
            {product.weight && (
              <div className="flex justify-between py-2.5">
                <span className="text-[12px] text-[#9a9a94]">Weight</span>
                <span className="text-[12px] text-[#1a1a1a]">{product.weight}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}