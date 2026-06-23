"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Loader2, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { orderService, OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { cart, loading, sessionEmail, refreshCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  // Controlled states for contact details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Controlled states for shipping address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{8,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number (8-15 digits)";
    }
    
    if (!addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!country.trim()) newErrors.country = "Country is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;

    setOrderError(null);
    setIsPlacingOrder(true);

    try {
      const payload = {
        customerInfo: {
          name: `${firstName} ${lastName}`.trim(),
          phone: phone.trim(),
        },
        shippingAddress: {
          street: `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}`.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: postalCode.trim(),
          country: country.trim(),
        },
        billingAddress: {
          street: `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}`.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: postalCode.trim(),
          country: country.trim(),
        },
        paymentMethod: paymentMethod as "cod" | "card" | "upi" | "paypal",
      };

      console.log("Placing guest checkout order. Payload:", payload);
      const result = await orderService.createOrder(payload);
      console.log("Guest checkout order placed successfully. Response:", result);
      setPlacedOrder(result);
      await refreshCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Order placement failed:", err);
      if (err instanceof ApiError) {
        setOrderError(err.message);
      } else if (err instanceof Error) {
        setOrderError(err.message);
      } else {
        setOrderError("An unexpected error occurred while placing your order.");
      }
      try {
        await refreshCart();
      } catch (refreshErr) {
        console.warn("Failed to refresh cart after order failure:", refreshErr);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Sync session email when it's available
  useEffect(() => {
    if (sessionEmail) {
      setTimeout(() => {
        setEmail(sessionEmail);
      }, 0);
    }
  }, [sessionEmail]);

  // Route protection: redirect if unauthenticated, cart is empty, or cart is invalid
  useEffect(() => {
    if (!loading && !placedOrder) {
      if (!sessionEmail || !cart || cart.items.length === 0 || !cart.isValid) {
        router.replace("/cart");
      }
    }
  }, [loading, sessionEmail, cart, router, placedOrder]);

  // Loading state
  if ((loading || !cart || cart.items.length === 0 || !cart.isValid) && !placedOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a1a1a] mx-auto" />
          <p className="text-xs text-[#9a9a94] tracking-wide">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-white pb-20 animate-[fadeIn_0.5s_ease-out]">
        {/* Top bar */}
        <div className="border-b border-[#e8e6e2] px-5 sm:px-8 md:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm font-light font-serif tracking-widest text-[#1a1a1a]">MAISON</Link>
          <Link href="/" className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors">
            Return to shop
          </Link>
        </div>

        <div className="px-5 sm:px-8 md:px-12 pt-16 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#faf9f7] border border-[#e8e6e2] mb-6">
            <svg
              className="w-8 h-8 text-[#c4a882]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9a9a94] mb-2 font-light">Thank you for your order</p>
          <h1 className="text-3xl font-light font-serif text-[#1a1a1a] tracking-tight mb-3">Order Confirmed</h1>
          <p className="text-xs text-[#6b6b65] tracking-wide max-w-md mx-auto mb-8 font-light leading-relaxed">
            Your order has been placed successfully. A confirmation email has been sent to <span className="font-medium text-[#1a1a1a]">{placedOrder.email}</span> with your tracking details.
          </p>

          {/* Order Details Card */}
          <div className="border border-[#e8e6e2] rounded-[4px] text-left mb-10 overflow-hidden">
            <div className="bg-[#faf9f7] px-6 py-4 border-b border-[#e8e6e2] flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">Order Reference</p>
                <p className="text-sm font-mono font-medium text-[#1a1a1a] mt-0.5">{placedOrder.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] tracking-wider uppercase text-[#9a9a94]">Status</p>
                <span className="inline-block text-[9px] tracking-[0.14em] uppercase bg-[#e8e6e2] text-[#1a1a1a] px-2 py-0.5 mt-0.5 rounded-[2px] font-medium">
                  {placedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Items Summary */}
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-3 pb-1 border-b border-[#faf9f7] font-semibold">Items Purchased</p>
                <div className="divide-y divide-[#e8e6e2]/50">
                  {placedOrder.items.map((item) => (
                    <div key={item.sku} className="py-3 flex justify-between items-center gap-4 text-xs">
                      <div className="min-w-0">
                        <p className="font-light font-serif text-[#1a1a1a] truncate">{item.name}</p>
                        <p className="text-[9px] text-[#9a9a94] uppercase tracking-wider mt-0.5">
                          {item.transactionType === "rent" ? `Rent / ${item.rentalDurationDays} days` : "Buy"} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#1a1a1a] font-medium shrink-0">
                        ${(item.price * item.quantity * (item.transactionType === "rent" ? (item.rentalDurationDays || 1) : 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e8e6e2]/60">
                {/* Shipping info */}
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-2 font-semibold">Shipping Address</p>
                  <p className="text-xs text-[#6b6b65] leading-relaxed font-light">
                    {placedOrder.customerInfo.name}<br />
                    {placedOrder.shippingAddress.street}<br />
                    {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.zipCode}<br />
                    {placedOrder.shippingAddress.country}
                  </p>
                </div>
                {/* Payment info */}
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-2 font-semibold">Payment Details</p>
                  <p className="text-xs text-[#6b6b65] leading-relaxed font-light mb-1">
                    Method: <span className="uppercase font-medium text-[#1a1a1a]">{placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : placedOrder.paymentMethod}</span>
                  </p>
                  <p className="text-xs text-[#6b6b65] leading-relaxed font-light">
                    Status: <span className="capitalize font-medium text-[#1a1a1a]">{placedOrder.paymentStatus}</span>
                  </p>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="pt-4 border-t border-[#e8e6e2]/60 space-y-2">
                <div className="flex justify-between text-xs text-[#6b6b65]">
                  <span>Subtotal</span>
                  <span>${placedOrder.pricingSummary.subtotal.toFixed(2)}</span>
                </div>
                {placedOrder.pricingSummary.totalSecurityDeposits > 0 && (
                  <div className="flex justify-between text-xs text-[#6b6b65]">
                    <span>Refundable Deposits</span>
                    <span>${placedOrder.pricingSummary.totalSecurityDeposits.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[#1a1a1a] font-medium pt-2 border-t border-[#e8e6e2]/30">
                  <span className="font-serif font-light">Total Paid</span>
                  <span>${placedOrder.pricingSummary.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-8 py-4 hover:bg-[#333] transition-colors rounded-[4px] text-center">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Global style for fade-in animation */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  const items = cart.items;
  const subtotal = cart.summary.subtotal;
  const securityDeposits = cart.summary.totalSecurityDeposits;
  const total = subtotal + securityDeposits;

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
                      { key: "firstName", label: "First Name", value: firstName, onChange: (val: string) => { setFirstName(val); if (errors.firstName) setErrors(prev => { const n = {...prev}; delete n.firstName; return n; }); }, placeholder: "First name", full: false },
                      { key: "lastName", label: "Last Name", value: lastName, onChange: (val: string) => { setLastName(val); if (errors.lastName) setErrors(prev => { const n = {...prev}; delete n.lastName; return n; }); }, placeholder: "Last name", full: false },
                      { key: "email", label: "Email", value: email, onChange: (val: string) => { setEmail(val); if (errors.email) setErrors(prev => { const n = {...prev}; delete n.email; return n; }); }, placeholder: "Email address", full: true },
                      { key: "phone", label: "Phone", value: phone, onChange: (val: string) => { setPhone(val); if (errors.phone) setErrors(prev => { const n = {...prev}; delete n.phone; return n; }); }, placeholder: "Phone number", full: true },
                    ].map(({ key, label, value, onChange, placeholder, full }) => (
                      <div key={label} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full border ${errors[key] ? "border-[#d32f2f]" : "border-[#e8e6e2]"} px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#c5c5bf]`} />
                        {errors[key] && <span className="text-[10px] text-[#d32f2f] mt-1 block font-light tracking-wide">{errors[key]}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Shipping Address</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "addressLine1", label: "Address Line 1", value: addressLine1, onChange: (val: string) => { setAddressLine1(val); if (errors.addressLine1) setErrors(prev => { const n = {...prev}; delete n.addressLine1; return n; }); }, placeholder: "Street address, P.O. box", full: true },
                      { key: "addressLine2", label: "Address Line 2", value: addressLine2, onChange: (val: string) => setAddressLine2(val), placeholder: "Apartment, suite, unit (optional)", full: true },
                      { key: "city", label: "City", value: city, onChange: (val: string) => { setCity(val); if (errors.city) setErrors(prev => { const n = {...prev}; delete n.city; return n; }); }, placeholder: "City" },
                      { key: "state", label: "State", value: state, onChange: (val: string) => { setState(val); if (errors.state) setErrors(prev => { const n = {...prev}; delete n.state; return n; }); }, placeholder: "State" },
                      { key: "postalCode", label: "Postal Code", value: postalCode, onChange: (val: string) => { setPostalCode(val); if (errors.postalCode) setErrors(prev => { const n = {...prev}; delete n.postalCode; return n; }); }, placeholder: "Postal code" },
                      { key: "country", label: "Country", value: country, onChange: (val: string) => { setCountry(val); if (errors.country) setErrors(prev => { const n = {...prev}; delete n.country; return n; }); }, placeholder: "Country" },
                    ].map(({ key, label, value, onChange, placeholder, full }) => (
                      <div key={label} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full border ${errors[key] ? "border-[#d32f2f]" : "border-[#e8e6e2]"} px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#c5c5bf]`} />
                        {errors[key] && <span className="text-[10px] text-[#d32f2f] mt-1 block font-light tracking-wide">{errors[key]}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleContinueToPayment} className="w-full sm:w-auto bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-[4px]">
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
                <div className="mb-8 p-4 bg-[#faf9f7] border border-[#e8e6e2] flex items-start justify-between rounded-[4px]">
                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] mb-1">Ships to</p>
                    <p className="text-xs text-[#1a1a1a] tracking-wide">{firstName} {lastName}</p>
                    <p className="text-xs text-[#1a1a1a] tracking-wide">{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}</p>
                    <p className="text-xs text-[#1a1a1a] tracking-wide">{city}, {state} {postalCode}, {country}</p>
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
                      { id: "card", label: "Card", disabled: true, note: "Unavailable" },
                      { id: "upi", label: "UPI", disabled: true, note: "Unavailable" },
                      { id: "cod", label: "Cash on Delivery", disabled: false },
                    ].map(({ id, label, disabled, note }) => (
                      <button
                        key={id}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setPaymentMethod(id)}
                        className={`text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors rounded-[4px] ${
                          paymentMethod === id
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white cursor-default"
                            : disabled
                            ? "border-[#e8e6e2] text-[#c5c5bf] bg-[#fafaf9] cursor-not-allowed"
                            : "border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] cursor-pointer"
                        }`}
                      >
                        {label} {disabled && <span className="lowercase text-[8px] tracking-normal text-[#9a9a94] inline-block ml-0.5">({note})</span>}
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
                    <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-[4px]">
                      <p className="text-xs text-[#6b6b65] tracking-wide leading-relaxed font-light">Pay in cash when your order arrives. Please keep exact change ready.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(0)} className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors rounded-[4px] cursor-pointer bg-transparent">
                    ← Back
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 sm:flex-none bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-[4px] cursor-pointer">
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
                          <div className="w-14 h-16 bg-[#f5f4f1] border border-[#e8e6e2] overflow-hidden shrink-0 rounded-[2px]">
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
                  <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-[4px]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">Ships to</p>
                      <button onClick={() => setStep(0)} className="text-[10px] tracking-[0.12em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent border-none p-0">Edit</button>
                    </div>
                    <p className="text-xs text-[#1a1a1a] leading-relaxed tracking-wide font-light">
                      {firstName} {lastName}<br />
                      {addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}<br />
                      {city}, {state} {postalCode}, {country}
                    </p>
                  </div>
                  <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2] rounded-[4px]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">Payment</p>
                      <button onClick={() => setStep(1)} className="text-[10px] tracking-[0.12em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent border-none p-0">Edit</button>
                    </div>
                    <p className="text-xs text-[#1a1a1a] tracking-wide font-light">
                      {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(1)} disabled={isPlacingOrder} className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors rounded-[4px] cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="grow sm:grow-0 bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors rounded-[4px] cursor-pointer disabled:bg-[#9a9a94] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                        Processing...
                      </>
                    ) : (
                      `Place Order · $${total.toFixed(2)}`
                    )}
                  </button>
                </div>

                {orderError && (
                  <div className="mt-4 p-4 border border-[#d32f2f]/20 bg-[#d32f2f]/5 text-[#d32f2f] text-xs rounded-[4px] font-light tracking-wide">
                    {orderError}
                  </div>
                )}

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
            <div className="sticky top-8 border border-[#e8e6e2] p-6 rounded-[4px]">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-5 font-serif font-semibold">Order Summary</p>
              <div className="space-y-3 mb-5">
                {items.map((item) => {
                  const defaultImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80";
                  const itemImage = item.image || defaultImage;
                  return (
                    <div key={item.sku} className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#f5f4f1] border border-[#e8e6e2] shrink-0 overflow-hidden rounded-[2px]">
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