import Image from "next/image";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";

type CartItem = {
  sku: string;
  name: string;
  quantity: number;
  itemTotal: number;
  image?: string;
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
    <div className="sticky top-8 border border-[#e8e6e2] p-6">
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-5">
        Order Summary
      </p>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.sku} className="flex items-center gap-3">
            <div className="w-10 h-12 bg-[#f5f4f1] border border-[#e8e6e2] shrink-0 overflow-hidden relative">
              <Image
                src={item.image || FALLBACK_IMG}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#1a1a1a] tracking-wide truncate font-serif">
                {item.name}
              </p>
              <p className="text-[10px] text-[#9a9a94]">Qty {item.quantity}</p>
            </div>
            <p className="text-[11px] text-[#1a1a1a] shrink-0 font-medium">
              ₹{item.itemTotal.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="border-t border-[#e8e6e2] pt-4 space-y-2.5 mb-4">
        <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {securityDeposits > 0 && (
          <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
            <span>Refundable Deposits</span>
            <span>₹{securityDeposits.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#e8e6e2] pt-4 flex justify-between">
        <span className="text-sm font-light font-serif text-[#1a1a1a]">
          Total
        </span>
        <span className="text-sm font-medium text-[#1a1a1a]">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}