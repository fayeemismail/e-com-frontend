"use client";

import Link from "next/link";
import { useState } from "react";

const dummyItems = [
  {
    id: 1,
    name: "Linen Oversized Blazer",
    variant: "Ivory / Size S",
    price: 289,
    qty: 1,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80",
  },
  {
    id: 2,
    name: "Silk Slip Dress",
    variant: "Sage / Size XS",
    price: 195,
    qty: 1,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80",
  },
  {
    id: 3,
    name: "Cashmere Ribbed Knit",
    variant: "Oat / Size M",
    price: 340,
    qty: 2,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80",
  },
];

export default function CartPage() {
  const [items, setItems] = useState(dummyItems);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-8">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
          Shopping Bag
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          Cart <span className="text-[#9a9a94] text-lg">({items.length})</span>
        </h1>
      </div>

      <div className="px-5 sm:px-8 md:px-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="text-lg font-light tracking-tight font-serif text-[#1a1a1a] mb-2">Your cart is empty</h2>
            <p className="text-xs text-[#9a9a94] tracking-wide leading-relaxed mb-8">
              Browse our collections to find your favorites.
            </p>
            <Link href="/shop" className="inline-block bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-transparent hover:text-[#1a1a1a] border border-[#1a1a1a] transition-colors duration-200">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Items */}
            <div className="flex-1">
              {/* Free shipping bar */}
              {shipping > 0 && (
                <div className="mb-8 p-4 bg-[#faf9f7] border border-[#e8e6e2]">
                  <p className="text-[11px] tracking-[0.12em] text-[#6b6b65]">
                    Add <span className="text-[#1a1a1a] font-medium">${(500 - subtotal).toFixed(0)}</span> more for complimentary shipping
                  </p>
                  <div className="mt-2 h-px bg-[#e8e6e2] relative">
                    <div className="absolute top-0 left-0 h-px bg-[#1a1a1a] transition-all duration-500" style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
              {shipping === 0 && (
                <div className="mb-8 p-4 bg-[#faf9f7] border border-[#e8e6e2]">
                  <p className="text-[11px] tracking-[0.12em] text-[#6b6b65]">
                    ✓ You qualify for <span className="text-[#1a1a1a] font-medium">complimentary shipping</span>
                  </p>
                </div>
              )}

              <div className="divide-y divide-[#e8e6e2]">
                {items.map((item) => (
                  <div key={item.id} className="py-7 flex gap-5">
                    <div className="w-24 h-28 shrink-0 overflow-hidden bg-[#f5f4f1]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-light tracking-wide text-[#1a1a1a] font-serif mb-0.5">{item.name}</h3>
                          <p className="text-[11px] text-[#9a9a94] tracking-widest uppercase">{item.variant}</p>
                        </div>
                        <p className="text-sm font-light text-[#1a1a1a] tracking-wide">${(item.price * item.qty).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#e8e6e2]">
                          <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-[#9a9a94] hover:text-[#1a1a1a] transition-colors text-lg font-light">−</button>
                          <span className="w-8 text-center text-xs text-[#1a1a1a] tracking-widest">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-[#9a9a94] hover:text-[#1a1a1a] transition-colors text-lg font-light">+</button>
                        </div>
                        <button onClick={() => updateQty(item.id, -item.qty)} className="text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:w-80 xl:w-96">
              <div className="sticky top-8">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-5">Order Summary</p>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-xs text-[#6b6b65] tracking-wide">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6b6b65] tracking-wide">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : `$${shipping}`}</span>
                  </div>
                </div>
                <div className="border-t border-[#e8e6e2] pt-4 mb-6 flex justify-between">
                  <span className="text-sm font-light font-serif text-[#1a1a1a]">Total</span>
                  <span className="text-sm font-light text-[#1a1a1a]">${total.toLocaleString()}</span>
                </div>

                {/* Promo */}
                <div className="mb-6 flex gap-2">
                  <input type="text" placeholder="Promo code" className="flex-1 border border-[#e8e6e2] px-3 py-2.5 text-xs tracking-wide text-[#1a1a1a] placeholder-[#c5c5bf] outline-none focus:border-[#1a1a1a] transition-colors" />
                  <button className="px-4 py-2.5 border border-[#1a1a1a] text-[10px] tracking-[0.16em] uppercase text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors">
                    Apply
                  </button>
                </div>

                <Link href="/checkout" className="block w-full bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase text-center py-4 hover:bg-[#333] transition-colors duration-200 mb-3">
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="block w-full text-center border border-[#e8e6e2] text-[11px] tracking-[0.16em] uppercase text-[#9a9a94] py-4 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors duration-200">
                  Continue Shopping
                </Link>

                <div className="mt-6 space-y-2">
                  {["Free returns within 30 days", "Secure checkout", "Authenticity guaranteed"].map((line) => (
                    <p key={line} className="text-[10px] tracking-widest text-[#9a9a94] flex items-center gap-2">
                      <span className="text-[#1a1a1a]">—</span> {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}