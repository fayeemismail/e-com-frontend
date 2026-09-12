import Image from "next/image";
import { formatPrice } from "@/lib/utils/format.util";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";

type CartItem = {
  sku: string;
  name: string;
  quantity: number;
  itemTotal: number;
  image?: string;
  unit?: string;
  unitName?: string;
};

type Props = {
  items: CartItem[];
  subtotal: number;
  securityDeposits: number;
  total: number;
};

export default function OrderSidebar({
  items,
  subtotal,
  securityDeposits,
  total,
}: Props) {
  return (
    <div className="sticky top-8 border border-[#e2e8f0] bg-white p-6 rounded-xs shadow-2xs">
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#0f2e5a] font-semibold mb-5 pb-2 border-b border-[#e2e8f0]">
        Requisition Summary
      </p>

      {/* Items */}
      <div className="space-y-4 mb-5">
        {items.map((item) => {
          const unit =
            item.unit ||
            item.unitName ||
            (item as any).uom ||
            (item.name.match(/\b(dz|pac|pc|box|set|bundle|pkt|packet|rm|ea|pk)\b/i)?.[1]?.toUpperCase());

          return (
            <div key={item.sku} className="flex items-start gap-3">
              <div className="w-10 h-12 bg-[#f8fafc] border border-[#e2e8f0] shrink-0 overflow-hidden relative rounded-xs">
                <Image
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0f172a] truncate">
                  {item.name}
                </p>
                <div className="text-[10px] text-[#64748b] flex flex-col gap-0.5 mt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Qty: {item.quantity}</span>
                    {unit && (
                      <>
                        <span>•</span>
                        <span className="uppercase font-medium text-[#475569]">
                          Unit: {unit}
                        </span>
                      </>
                    )}
                  </div>
                  {item.sku && (
                    <span className="font-mono text-[9.5px] text-[#475569]">
                      SAP ID: {item.sku}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#0f172a] shrink-0 font-semibold">
                {formatPrice(item.itemTotal)} SAR
              </p>
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      <div className="border-t border-[#e2e8f0] pt-4 space-y-2.5 mb-4">
        <div className="flex justify-between text-[11.5px] text-[#64748b] tracking-wide">
          <span>Subtotal</span>
          <span className="font-medium text-[#0f172a]">{formatPrice(subtotal)} SAR</span>
        </div>
        {securityDeposits > 0 && (
          <div className="flex justify-between text-[11.5px] text-[#64748b] tracking-wide">
            <span>Refundable Deposits</span>
            <span className="font-medium text-[#0f172a]">{formatPrice(securityDeposits)} SAR</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#e2e8f0] pt-4 flex justify-between items-baseline">
        <span className="text-sm font-medium text-[#0f172a]">
          Total
        </span>
        <span className="text-base font-bold text-[#0f2e5a]">
          {formatPrice(total)} SAR
        </span>
      </div>
    </div>
  );
}