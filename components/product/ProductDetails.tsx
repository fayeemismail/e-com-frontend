"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types";

const tabs = ["Description", "Details", "Dimensions"] as const;
type Tab = (typeof tabs)[number];

export default function ProductDetails({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>("Description");

  return (
    <div className="mt-12 md:mt-16 border-t border-[#ebebeb]">
      {/* Tab nav */}
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
        {tab === "Description" && (
          <p className="text-[13px] text-[#5a5a55] leading-relaxed">{product.description}</p>
        )}

        {tab === "Details" && (
          <div className="space-y-4">
            {product.materials && (
              <div>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-2">Materials</p>
                <ul className="space-y-1">
                  {product.materials.map((m) => (
                    <li key={m} className="text-[13px] text-[#5a5a55] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.features && (
              <div>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-2">Features</p>
                <ul className="space-y-1">
                  {product.features.map((f) => (
                    <li key={f} className="text-[13px] text-[#5a5a55] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.sku && (
              <p className="text-[12px] text-[#aaa]">SKU: {product.sku}</p>
            )}
          </div>
        )}

        {tab === "Dimensions" && product.dimensions && (
          <div className="divide-y divide-[#f0f0f0]">
            {Object.entries(product.dimensions).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2.5">
                <span className="text-[12px] text-[#9a9a94] capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-[12px] text-[#1a1a1a]">{val}</span>
              </div>
            ))}
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