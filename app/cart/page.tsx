"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    loading,
    sessionEmail,
    updateQuantity,
    removeFromCart,
    initializeSession,
    isSyncing,
  } = useCart();

  const [emailInput, setEmailInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);


  // Handle inline sign-in
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const email = emailInput.trim();
    if (!email) {
      setAuthError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    try {
      setAuthLoading(true);
      await initializeSession(email);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to verify email. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };



  // Loader state / Skeleton Rows
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] pb-16">
        <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-8 bg-white">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Shopping Bags</p>
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-[4px]" />
        </div>
        <div className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#e8e6e2] p-5 rounded-[4px] flex gap-4 items-center">
                <div className="w-16 h-20 bg-gray-200 animate-pulse rounded-[4px]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-[#e8e6e2] p-6 h-64 rounded-[4px] space-y-4">
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Case 1: Unauthenticated -> Show elegant inline email form
  if (!sessionEmail) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center items-center py-20 px-4">
        <div className="bg-white w-full max-w-md p-8 sm:p-10 border border-[#e8e6e2] shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[6px] text-center">
          <div className="w-12 h-12 rounded-full bg-[#fafaf9] border border-[#e8e6e2] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-5 h-5 text-[#c4a882]" strokeWidth={1.4} />
          </div>

          <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-[0.02em] mb-2.5">
            Access Your Cart
          </h2>
          <p className="text-[12px] font-light leading-relaxed text-[#6a6a65] tracking-[0.01em] max-w-[300px] mx-auto mb-7">
            To view items in your cart and continue shopping, please enter your email address below. We&apos;ll retrieve your progress instantly.
          </p>

          <form onSubmit={handleSignInSubmit} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label htmlFor="cart-email-input" className="block text-[10px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium">
                Email Address
              </label>
              <input
                id="cart-email-input"
                type="email"
                placeholder="name@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={authLoading}
                className="w-full h-11 px-4 border border-[#e8e6e2] outline-none rounded-[4px] text-[13px] 
                tracking-[0.02em] text-[#1a1a1a] placeholder-[#bbb] focus:border-[#1a1a1a] bg-white transition-all disabled:bg-[#fcfcfa] disabled:text-[#aaa]"
              />
              {authError && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600">
                  <span className="text-[10px] tracking-wide leading-tight font-medium">
                    {authError}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-11 bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] 
              cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 rounded-[4px] 
              disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center font-light"
            >
              {authLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  Connecting...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Case 2: Cart is Empty
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-12">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Shopping Bags</p>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">Cart</h1>
        </div>

        <div className="px-5 sm:px-8 md:px-12 flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="w-14 h-14 bg-[#fafaf9] border border-[#e8e6e2] rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-6 h-6 text-[#ccc]" strokeWidth={1} />
          </div>
          <h2 className="text-lg font-light tracking-tight font-serif text-[#1a1a1a] mb-2">
            Your cart is empty
          </h2>
          <p className="text-xs text-[#9a9a94] tracking-wide leading-relaxed mb-8">
            Looks like you haven&apos;t added any items to your bag yet. Explore our selections and find something you like.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 
            hover:bg-white hover:text-black border border-[#1a1a1a] transition-colors duration-200 rounded-[4px]"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  // Case 3: Display Cart items & breakdown
  const summary = cart.summary;
  const items = cart.items;

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-16">
      {/* Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2] mb-8 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-6xl mx-auto">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Shopping Bags</p>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">Cart</h1>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      <div className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const formatSuffix = item.transactionType === "rent" ? ` / ${item.rentalDurationDays} days` : "";
              const defaultImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80"; // Muted book texture cover
              const itemImage = item.image || defaultImage;

              return (
                <div
                  key={item.sku}
                  className="bg-white border border-[#e8e6e2] p-5 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Item Image */}
                    <div className="w-16 h-20 bg-[#fafaf9] border border-[#e8e6e2] shrink-0 overflow-hidden rounded-[2px] relative">
                      <Image
                        src={itemImage}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="min-w-0">
                      <Link
                        href={item.productId ? `/shop/${item.productId}` : "/shop"}
                        className="text-sm font-light font-serif text-[#1a1a1a] hover:text-[#c4a882] transition-colors leading-snug block truncate max-w-[280px]"
                      >
                        {item.name}
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                        <span className={`text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded font-mono font-semibold ${
                          item.transactionType === "buy" ? "bg-[#edf7ed] text-[#1e4620]" : "bg-[#e8f4fd] text-[#0d3c61]"
                        }`}>
                          {item.transactionType === "buy" ? "Buy" : `Rent${formatSuffix}`}
                        </span>
                        
                        <span className="text-[11px] text-[#9a9a94] font-light">
                          ${item.price.toFixed(2)}{item.transactionType === "rent" ? "/day" : ""}
                        </span>
                      </div>

                      {item.transactionType === "rent" && item.securityDeposit && (
                        <p className="text-[9px] text-[#9a9a94] mt-1 tracking-normal font-light">
                          +${item.securityDeposit} deposit per unit (refundable)
                        </p>
                      )}

                      {item.isActive === false ? (
                        <p className="text-[10px] text-[#d32f2f] mt-1.5 font-medium tracking-wide">
                          This item is no longer available
                        </p>
                      ) : item.availableStock === 0 ? (
                        <p className="text-[10px] text-[#d32f2f] mt-1.5 font-medium tracking-wide">
                          Out of Stock
                        </p>
                      ) : !item.inStock ? (
                        <p className="text-[10px] text-orange-600 mt-1.5 font-medium tracking-wide">
                          Only {item.availableStock} available (Requested: {item.quantity})
                        </p>
                      ) : null}
                    </div>
                  </div>
 
                  {/* Quantity Controls & Totals */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-[#e8e6e2] rounded-[4px] bg-[#fafaf9] h-9">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        disabled={item.quantity <= 1 || item.availableStock === 0 || item.isActive === false}
                        aria-label="Decrease quantity"
                        className="px-2.5 py-2 text-[#9a9a94] hover:text-[#1a1a1a] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors h-full flex items-center justify-center bg-transparent border-none"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-7 flex items-center justify-center">
                        <span className={`text-xs font-mono font-medium ${item.quantity === 0 || item.isActive === false ? "text-[#d32f2f] font-bold" : "text-[#1a1a1a]"}`}>
                          {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock || item.availableStock === 0 || item.isActive === false}
                        aria-label="Increase quantity"
                        className="px-2.5 py-2 text-[#9a9a94] hover:text-[#1a1a1a] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors h-full flex items-center justify-center bg-transparent border-none"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total values */}
                    <div className="text-right min-w-[70px]">
                      <p className="text-xs font-medium text-[#1a1a1a]">
                        ${item.itemTotal.toFixed(2)}
                      </p>
                      {item.transactionType === "rent" && item.itemDepositTotal > 0 && (
                        <p className="text-[9px] text-[#9a9a94] mt-0.5">
                          ${item.itemDepositTotal.toFixed(2)} dep.
                        </p>
                      )}
                    </div>

                    {/* Remove Action Button */}
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      aria-label="Remove item"
                      className="text-[#9a9a94] hover:text-red-600 transition-colors p-1 bg-transparent border-none cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary Panel */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e6e2] p-6 rounded-[4px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-5 font-serif font-semibold">Order Summary</p>
              
              <div className="space-y-3.5 mb-5 border-b border-[#e8e6e2] pb-5">
                <div className="flex justify-between text-[12px] text-[#6a6a65] tracking-wide">
                  <span>Subtotal</span>
                  <span className="text-[#1a1a1a] font-medium">${summary.subtotal.toFixed(2)}</span>
                </div>
                
                {summary.totalSecurityDeposits > 0 && (
                  <div className="flex justify-between text-[12px] text-[#6a6a65] tracking-wide">
                    <span>Refundable Deposits</span>
                    <span className="text-[#1a1a1a] font-medium">${summary.totalSecurityDeposits.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Promo Code"
                  disabled={true}
                  className="flex-1 min-w-0 border border-[#e8e6e2] bg-[#fafaf9] text-[#9a9a94] outline-none rounded-[4px] px-3 py-2 text-xs tracking-wide cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={true}
                  className="px-4 py-2 border border-[#e8e6e2] text-[#9a9a94] bg-[#fafaf9] text-[10px] tracking-[0.14em] uppercase rounded-[4px] cursor-not-allowed opacity-60"
                >
                  Apply
                </button>
              </form>



              <div className="flex justify-between items-baseline mb-6 pt-1">
                <span className="text-sm font-light font-serif text-[#1a1a1a]">Total</span>
                <span className="text-xl font-light text-[#1a1a1a]">${summary.totalAmount.toFixed(2)}</span>
              </div>

              {summary.totalSecurityDeposits > 0 && (
                <p className="text-[10px] text-[#9a9a94] mb-5 tracking-[0.01em] leading-relaxed">
                  * Refundable security deposits are refunded completely upon returned inspect validation of rental books.
                </p>
              )}

              {isSyncing ? (
                <button
                  disabled
                  className="w-full bg-[#fafaf9] text-[#9a9a94] text-[11px] tracking-[0.18em] uppercase border border-[#e8e6e2] 
                  rounded-[4px] flex items-center justify-center h-12 font-light cursor-not-allowed gap-2"
                >
                  <Loader2 className="animate-spin h-3.5 w-3.5 text-[#9a9a94]" />
                  Syncing Bag...
                </button>
              ) : !cart.isValid ? (
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full bg-[#fafaf9] text-[#9a9a94] text-[11px] tracking-[0.18em] uppercase border border-[#e8e6e2] 
                    rounded-[4px] flex items-center justify-center h-12 font-light cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-[10px] text-[#d32f2f] text-center font-light leading-relaxed">
                    Please resolve stock issues or remove unavailable items before checking out.
                  </p>
                </div>
              ) : (
                <Link
                  href="/checkout"
                  className="w-full bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] 
                  hover:bg-white hover:text-black transition-colors duration-200 rounded-[4px] flex items-center justify-center h-12 font-light"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}