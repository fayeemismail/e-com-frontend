"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Loader2, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { cart, loading, sessionEmail } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Route protection: redirect if unauthenticated or cart is empty
  useEffect(() => {
    if (!loading) {
      if (!sessionEmail || !cart || cart.items.length === 0) {
        router.replace("/cart");
      }
    }
  }, [loading, sessionEmail, cart, router]);

  // Loading state
  if (loading || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a1a1a] mx-auto" />
          <p className="text-xs text-[#9a9a94] tracking-wide">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  const items = cart.items;
  const subtotal = cart.summary.subtotal;
  const securityDeposits = cart.summary.totalSecurityDeposits;
  const tax = cart.summary.tax;
  const baseShipping = cart.summary.shippingCost;
  const shipping = shippingMethod === "express" ? baseShipping + 18 : baseShipping;
  const total = subtotal + securityDeposits + tax + shipping;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top bar */}
      <div className="border-b border-[#e8e6e2] px-5 sm:px-8 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="text-sm font-light font-serif tracking-widest text-[#1a1a1a]">MAISON</Link>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`text-[10px] tracking-[0.16em] uppercase transition-colors ${i === step ? "text-[#1a1a1a]" : i < step ? "text-[#9a9a94] hover:text-[#1a1a1a] cursor-pointer" : "text-[#c5c5bf] cursor-default"}`}
              >
                {s}
              </button>
              {i < steps.length - 1 && <span className="text-[#e8e6e2] text-xs">›</span>}
            </div>
          ))}
        </div>
        <Link href="/cart" className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors">
          ← Back to cart
        </Link>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 max-w-6xl mx-auto">

          {/* Left — Form */}
          <div className="flex-1 min-w-0">

            {/* STEP 0 — SHIPPING */}
            {step === 0 && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Step 1 of 3</p>
                <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">Shipping Details</h2>

                {/* Contact */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "First Name", placeholder: "Amara", full: false },
                      { label: "Last Name", placeholder: "Singh", full: false },
                      { label: "Email", placeholder: sessionEmail || "amara.singh@email.com", full: true },
                      { label: "Phone", placeholder: "+91 98765 43210", full: true },
                    ].map(({ label, placeholder, full }) => (
                      <div key={label} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input defaultValue={placeholder} className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Shipping Address</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Address Line 1", placeholder: "42 Prestige Gardens", full: true },
                      { label: "Address Line 2", placeholder: "Apt 7B (optional)", full: true },
                      { label: "City", placeholder: "Mumbai" },
                      { label: "State", placeholder: "Maharashtra" },
                      { label: "Postal Code", placeholder: "400001" },
                      { label: "Country", placeholder: "India" },
                    ].map(({ label, placeholder, full }) => (
                      <div key={label} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input defaultValue={placeholder} className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Shipping Method</p>
                  <div className="space-y-3">
                    {[
                      { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: baseShipping === 0 ? "Complimentary" : `$${baseShipping.toFixed(2)}` },
                      { id: "express", label: "Express Shipping", sub: "2–3 business days", price: `$${(baseShipping + 18).toFixed(2)}` },
                    ].map(({ id, label, sub, price }) => (
                      <label key={id} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${shippingMethod === id ? "border-[#1a1a1a]" : "border-[#e8e6e2] hover:border-[#9a9a94]"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${shippingMethod === id ? "border-[#1a1a1a]" : "border-[#c5c5bf]"}`}>
                            {shippingMethod === id && <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}
                          </div>
                          <div>
                            <p className="text-xs text-[#1a1a1a] tracking-wide">{label}</p>
                            <p className="text-[10px] text-[#9a9a94] tracking-wide">{sub}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#1a1a1a] tracking-wide">{price}</p>
                        <input type="radio" name="shipping" value={id} checked={shippingMethod === id} onChange={() => setShippingMethod(id)} className="sr-only" />
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(1)} className="w-full sm:w-auto bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-sm">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* STEP 1 — PAYMENT */}
            {step === 1 && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Step 2 of 3</p>
                <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">Payment</h2>

                {/* Shipping summary */}
                <div className="mb-8 p-4 bg-[#faf9f7] border border-[#e8e6e2] flex items-start justify-between rounded-sm">
                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] mb-1">Ships to</p>
                    <p className="text-xs text-[#1a1a1a] tracking-wide">42 Prestige Gardens, Apt 7B</p>
                    <p className="text-xs text-[#1a1a1a] tracking-wide">Mumbai, 400001, India</p>
                  </div>
                  <button onClick={() => setStep(0)} className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors shrink-0">
                    Edit
                  </button>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Payment Method</p>
                  <div className="flex gap-3 mb-6">
                    {[
                      { id: "card", label: "Card" },
                      { id: "upi", label: "UPI" },
                      { id: "cod", label: "Cash on Delivery" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className={`text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors rounded-sm cursor-pointer ${paymentMethod === id ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">Card Number</label>
                        <input defaultValue="4242  4242  4242  4242" className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-widest outline-none focus:border-[#1a1a1a] transition-colors font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">Expiry</label>
                          <input defaultValue="08 / 27" className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-widest outline-none focus:border-[#1a1a1a] transition-colors font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">CVV</label>
                          <input defaultValue="•••" className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-widest outline-none focus:border-[#1a1a1a] transition-colors font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">Name on Card</label>
                        <input defaultValue="AMARA SINGH" className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-widest outline-none focus:border-[#1a1a1a] transition-colors" />
                      </div>
                    </div>
                  )}
                  {paymentMethod === "upi" && (
                    <div>
                      <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">UPI ID</label>
                      <input defaultValue="amara@okicici" className="w-full border border-[#e8e6e2] px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors" />
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-sm">
                      <p className="text-xs text-[#6b6b65] tracking-wide leading-relaxed font-light">Pay in cash when your order arrives. Please keep exact change ready. A handling fee of ₹50 applies.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(0)} className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors rounded-sm cursor-pointer bg-transparent">
                    ← Back
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 sm:flex-none bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-sm cursor-pointer">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — REVIEW */}
            {step === 2 && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Step 3 of 3</p>
                <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">Review Order</h2>

                {/* Items */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Items ({items.length})</p>
                  <div className="divide-y divide-[#e8e6e2]">
                    {items.map((item) => {
                      const typeLabel = item.transactionType === "rent" ? `Rent / ${item.rentalDurationDays} days` : "Buy";
                      const defaultImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";
                      const itemImage = item.image || defaultImage;
                      
                      return (
                        <div key={item.sku} className="py-5 flex items-center gap-4">
                          <div className="w-14 h-16 bg-[#f5f4f1] border border-[#e8e6e2] overflow-hidden shrink-0 rounded-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-light font-serif text-[#1a1a1a] tracking-wide">{item.name}</p>
                            <p className="text-[10px] text-[#9a9a94] tracking-wider uppercase mt-1">
                              {typeLabel} · Qty {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#1a1a1a] font-medium">${item.itemTotal.toFixed(2)}</p>
                            {item.transactionType === "rent" && item.itemDepositTotal > 0 && (
                              <p className="text-[9px] text-[#9a9a94] mt-0.5">${item.itemDepositTotal.toFixed(2)} dep.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping + Payment summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">Ships to</p>
                      <button onClick={() => setStep(0)} className="text-[10px] tracking-[0.12em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent border-none p-0">Edit</button>
                    </div>
                    <p className="text-xs text-[#1a1a1a] leading-relaxed tracking-wide font-light">42 Prestige Gardens, Apt 7B<br />Mumbai, 400001, India</p>
                    <p className="text-[10px] text-[#9a9a94] mt-2 tracking-wide capitalize font-light">{shippingMethod} shipping</p>
                  </div>
                  <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">Payment</p>
                      <button onClick={() => setStep(1)} className="text-[10px] tracking-[0.12em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent border-none p-0">Edit</button>
                    </div>
                    {paymentMethod === "card" && <p className="text-xs text-[#1a1a1a] tracking-wide font-light">Visa ending in 4242</p>}
                    {paymentMethod === "upi" && <p className="text-xs text-[#1a1a1a] tracking-wide font-light">UPI · amara@okicici</p>}
                    {paymentMethod === "cod" && <p className="text-xs text-[#1a1a1a] tracking-wide font-light">Cash on Delivery</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(1)} className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors rounded-sm cursor-pointer bg-transparent">
                    ← Back
                  </button>
                  <button className="flex-1 sm:flex-none bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-sm cursor-pointer">
                    Place Order · ${total.toFixed(2)}
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { label: "SSL encrypted", icon: ShieldCheck },
                    { label: "Free 30-day returns", icon: RefreshCw },
                    { label: "Authenticity guaranteed", icon: Truck },
                  ].map(({ label, icon: Icon }) => (
                    <p key={label} className="text-[10px] tracking-widest text-[#9a9a94] flex items-center gap-1.5 uppercase font-light">
                      <Icon className="w-3.5 h-3.5 text-[#1a1a1a]" />
                      {label}
                    </p>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right — Order summary sidebar */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            <div className="sticky top-8 border border-[#e8e6e2] p-6 rounded-sm">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-5 font-serif font-semibold">Order Summary</p>
              <div className="space-y-3 mb-5">
                {items.map((item) => {
                  const defaultImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";
                  const itemImage = item.image || defaultImage;
                  return (
                    <div key={item.sku} className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#f5f4f1] border border-[#e8e6e2] shrink-0 overflow-hidden rounded-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={itemImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#1a1a1a] tracking-wide truncate font-serif">{item.name}</p>
                        <p className="text-[10px] text-[#9a9a94]">Qty {item.quantity}</p>
                      </div>
                      <p className="text-[11px] text-[#1a1a1a] shrink-0 font-medium">${item.itemTotal.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-[#e8e6e2] pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                {securityDeposits > 0 && (
                  <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
                    <span>Refundable Deposits</span><span>${securityDeposits.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
                  <span>Estimated Tax (10%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6b6b65] tracking-wide">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              
              <div className="border-t border-[#e8e6e2] pt-4 flex justify-between">
                <span className="text-sm font-light font-serif text-[#1a1a1a]">Total</span>
                <span className="text-sm font-medium text-[#1a1a1a]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}