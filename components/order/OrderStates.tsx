import Link from "next/link";
import { Loader2, Package } from "lucide-react";

// Small spinner shown while the orders request is in flight.
export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin h-4 w-4 text-[#9a9a94]" strokeWidth={1.5} />
    </div>
  );
}

// Shown when the orders request fails, with a retry button.
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-[13px] text-[#5a5a55] font-light mb-5">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] bg-transparent cursor-pointer pb-px"
      >
        Try Again
      </button>
    </div>
  );
}

// Shown when the request succeeds but the user has no orders yet.
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Package size={30} strokeWidth={1} className="text-[#d8d5cf] mb-5" />
      <h2 className="text-lg font-light font-serif text-[#1a1a1a] mb-2">No orders yet</h2>
      <p className="text-[12px] text-[#9a9a94] tracking-wide mb-8 max-w-xs">
        Your order history will appear here once you make a purchase.
      </p>
      <Link
        href="/shop"
        className="bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-[#333] transition-colors no-underline"
      >
        Start Shopping
      </Link>
    </div>
  );
}