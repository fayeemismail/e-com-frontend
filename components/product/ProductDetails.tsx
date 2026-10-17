"use client";

import { useState } from "react";
import type { Product } from "@/types/shop/types";
import { FileText, Settings, CheckCircle2 } from "lucide-react";

export default function ProductDetails({ product }: { product: Product }) {
  const hasFeatures = Boolean(product.features && product.features.length > 0);
  const hasDescription = Boolean(product.description && product.description.trim().length > 0);

  const tabs = ["Overview", "Specifications"] as const;
  type Tab = (typeof tabs)[number];

  const [tab, setTab] = useState<Tab>(hasDescription || hasFeatures ? "Overview" : "Specifications");

  const sapCode = product.sapId || (product as any).rawProduct?.sapId;
  const unit = product.unit || product.unitName || (product as any).rawProduct?.unit;
  const customAttributes = product.attributes && typeof product.attributes === "object"
    ? Object.entries(product.attributes).filter(([k, v]) => {
        if (!v || typeof v !== "string") return false;
        const lower = k.toLowerCase();
        return lower !== "brand" && lower !== "category" && lower !== "sapid" && lower !== "features" && lower !== "rating" && lower !== "reviews";
      })
    : [];

  return (
    <div className="mt-12 md:mt-16 border-t border-slate-200 font-nav">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 overflow-x-auto no-scrollbar pt-2">
        {tabs.map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`py-3.5 px-3 sm:px-4 text-[13px] font-semibold tracking-tight transition-all duration-150 border-b-2 cursor-pointer bg-transparent border-t-0 border-x-0 whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "text-[#0a1f3d] border-[#0a1f3d]"
                  : "text-slate-500 border-transparent hover:text-[#0a1f3d]"
              }`}
            >
              {t === "Overview" && <FileText size={15} className={isActive ? "text-[#00a6e0]" : "text-slate-400"} />}
              {t === "Specifications" && <Settings size={15} className={isActive ? "text-[#00a6e0]" : "text-slate-400"} />}
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="py-7 max-w-4xl">
        {/* 1. Overview Tab */}
        {tab === "Overview" && (
          <div className="space-y-6">
            {hasDescription ? (
              <p className="text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            ) : (
              <p className="text-[13px] text-slate-500 italic">No description provided for this product.</p>
            )}

            {/* Real Backend Features (only shown if provided by backend attributes) */}
            {hasFeatures && (
              <div className="pt-2">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#0a1f3d] mb-3">
                  Product Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features!.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                    >
                      <CheckCircle2 size={16} className="text-[#00a6e0] shrink-0 mt-0.5" />
                      <span className="text-[12.5px] text-slate-700 font-medium leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Specifications Tab — Strictly Backend Data */}
        {tab === "Specifications" && (
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-semibold text-slate-500 w-1/3">Product Name</td>
                  <td className="py-3 px-4 font-medium text-[#0a1f3d]">{product.name}</td>
                </tr>
                {sapCode && (
                  <tr className="bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-500">SAP Item ID</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0a1f3d]">#{sapCode}</td>
                  </tr>
                )}
                {product.brand && (
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-semibold text-slate-500">Brand</td>
                    <td className="py-3 px-4 font-medium text-[#0a1f3d]">{product.brand}</td>
                  </tr>
                )}
                {product.category && (
                  <tr className="bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-500">Category</td>
                    <td className="py-3 px-4 font-medium text-[#0a1f3d]">{product.category}</td>
                  </tr>
                )}
                {unit && (
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-semibold text-slate-500">Unit of Measure (UOM)</td>
                    <td className="py-3 px-4 font-medium text-[#0a1f3d] capitalize">{unit}</td>
                  </tr>
                )}
                {product.sku && (
                  <tr className="bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-500">SKU Code</td>
                    <td className="py-3 px-4 font-mono text-[#0a1f3d]">{product.sku}</td>
                  </tr>
                )}
                {/* Dynamically mapped real attributes from database */}
                {customAttributes.map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="py-3 px-4 font-semibold text-slate-500 capitalize">{key}</td>
                    <td className="py-3 px-4 font-medium text-[#0a1f3d]">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}