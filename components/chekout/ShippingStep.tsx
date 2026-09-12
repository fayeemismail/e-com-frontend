"use client";

import Image from "next/image";
import CheckoutField from "./ChekoutField";
import { formatPrice } from "@/lib/utils/format.util";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";

export type ShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type RequisitionItem = {
  sku: string;
  name: string;
  quantity: number;
  price?: number;
  itemTotal: number;
  image?: string;
  unit?: string;
  unitName?: string;
  transactionType?: string;
};

type Props = {
  data: ShippingData;
  errors: Record<string, string>;
  onChange: (key: keyof ShippingData, val: string) => void;
  onClearError: (key: string) => void;
  onContinue: () => void;
  isPlacing?: boolean;
  items?: RequisitionItem[];
};

export default function ShippingStep({
  data,
  errors,
  onChange,
  onClearError,
  onContinue,
  isPlacing = false,
  items = [],
}: Props) {
  const field = (
    key: keyof ShippingData,
    label: string,
    placeholder: string,
    colSpan = false
  ) => ({
    fieldKey: key,
    label,
    placeholder,
    value: data[key],
    onChange: (val: string) => {
      onChange(key, val);
      onClearError(key);
    },
    error: errors[key],
    colSpan,
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#e2e8f0]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#64748b] mb-1 font-medium">
          Consignment Requisition
        </p>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0f2e5a] tracking-tight">
            Requisition Items
          </h2>
          <span className="text-[11px] font-medium text-[#64748b]">
            Total Items: <span className="font-bold text-[#0f172a]">{items.length}</span>
          </span>
        </div>
      </div>

      {/* Items Table - Desktop & Tablet */}
      <div className="hidden sm:block mb-8 overflow-hidden rounded-xs border border-[#e2e8f0]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f0f4f9] border-b border-[#e2e8f0] text-[10px] tracking-[0.12em] uppercase text-[#0f2e5a] font-semibold">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-3">SAP ID</th>
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3 text-center">Qty</th>
              <th className="py-3 px-3 text-right">Price</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-xs bg-white">
            {items.map((item) => {
              const unit =
                item.unit ||
                item.unitName ||
                (item as any).uom ||
                (item.name.match(/\b(dz|pac|pc|box|set|bundle|pkt|packet|rm|ea|pk)\b/i)?.[1]?.toUpperCase()) ||
                "EA";
              const unitPrice = item.price || (item.quantity > 0 ? item.itemTotal / item.quantity : 0);

              return (
                <tr key={item.sku} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs overflow-hidden relative shrink-0">
                        <Image
                          src={item.image || FALLBACK_IMG}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-[#0f172a] line-clamp-2 max-w-xs">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-[#0f2e5a]">
                    {item.sku}
                  </td>
                  <td className="py-3.5 px-3 uppercase text-[#475569] font-medium">
                    {unit}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-[#0f172a]">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[#475569]">
                    {formatPrice(unitPrice)} SAR
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0f2e5a]">
                    {formatPrice(item.itemTotal)} SAR
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Items Cards - Mobile View (< sm) */}
      <div className="sm:hidden space-y-3 mb-6">
        {items.map((item) => {
          const unit =
            item.unit ||
            item.unitName ||
            (item as any).uom ||
            (item.name.match(/\b(dz|pac|pc|box|set|bundle|pkt|packet|rm|ea|pk)\b/i)?.[1]?.toUpperCase()) ||
            "EA";
          const unitPrice = item.price || (item.quantity > 0 ? item.itemTotal / item.quantity : 0);

          return (
            <div
              key={item.sku}
              className="p-3.5 bg-white border border-[#e2e8f0] rounded-xs shadow-2xs flex gap-3 items-start"
            >
              <div className="w-12 h-14 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs overflow-hidden relative shrink-0">
                <Image
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0f172a] truncate">
                  {item.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-[#64748b]">
                  <span className="font-mono text-[#0f2e5a] font-semibold">
                    SAP: {item.sku}
                  </span>
                  <span>•</span>
                  <span>Unit: <strong className="text-[#0f172a] uppercase">{unit}</strong></span>
                  <span>•</span>
                  <span>Qty: <strong className="text-[#0f172a]">{item.quantity}</strong></span>
                </div>
                <div className="flex justify-between items-baseline mt-2 pt-1.5 border-t border-[#f1f5f9]">
                  <span className="text-[10px] text-[#64748b]">
                    {formatPrice(unitPrice)} SAR / {unit}
                  </span>
                  <span className="text-xs font-bold text-[#0f2e5a]">
                    {formatPrice(item.itemTotal)} SAR
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consignment Store Information Strip */}
      <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs mb-8 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#475569]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Consignment Store: <strong>Substore 1000</strong> · Vendor <strong>455853</strong></span>
        </div>
        <div className="text-[10.5px] uppercase tracking-wider text-[#64748b] font-medium">
          Outline Agreement 46000 · Prices in SAR
        </div>
      </div>

      {/* Contact / Requester Details - Commented down per user request */}
      {/*
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#0f2e5a] font-semibold mb-4 pb-3 border-b border-[#e2e8f0]">
          Contact & Requester Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckoutField {...field("firstName", "First Name", "First name")} />
          <CheckoutField {...field("lastName", "Last Name", "Last name")} />
          <CheckoutField {...field("email", "Email", "Email address", true)} />
          <CheckoutField {...field("phone", "Phone", "Phone number", true)} />
        </div>
      </div>
      */}

      {/* Complete Requisition Action */}
      <div className="pt-2">
        <button
          onClick={onContinue}
          disabled={isPlacing}
          className="w-full sm:w-auto bg-[#0f2e5a] text-white text-[11px] tracking-[0.16em] uppercase px-12 py-4 hover:bg-[#0b2447] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xs font-semibold cursor-pointer shadow-2xs flex items-center justify-center gap-2"
        >
          {isPlacing ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing Requisition...</span>
            </>
          ) : (
            "Complete Requisition"
          )}
        </button>
      </div>
    </div>
  );
}