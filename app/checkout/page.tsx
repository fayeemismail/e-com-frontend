"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { orderService, type OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";

import CheckoutSteps from "@/components/chekout/ChekoutSteps"; 
import ShippingStep, { ShippingData } from "@/components/chekout/ShippingStep"; 
import PaymentStep from "@/components/chekout/PaymentStep"; 
import ReviewStep from "@/components/chekout/ReviewStep"; 
import OrderSidebar from "@/components/chekout/OrderSidebar"; 
import OrderSuccess from "@/components/chekout/OrderSucces"; 

const STEPS = ["Shipping", "Payment", "Review"];

const EMPTY_SHIPPING: ShippingData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function validate(data: ShippingData): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.firstName.trim()) e.firstName = "Required";
  if (!data.lastName.trim()) e.lastName = "Required";
  if (!data.email.trim()) e.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    e.email = "Invalid email";
  if (!data.phone.trim()) e.phone = "Required";
  else if (!/^\+?[\d\s-]{8,15}$/.test(data.phone)) e.phone = "Invalid phone";
  if (!data.addressLine1.trim()) e.addressLine1 = "Required";
  if (!data.city.trim()) e.city = "Required";
  if (!data.state.trim()) e.state = "Required";
  if (!data.postalCode.trim()) e.postalCode = "Required";
  if (!data.country.trim()) e.country = "Required";
  return e;
}

export default function CheckoutPage() {
  const { cart, loading, sessionEmail, refreshCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  // Sync session email
  useEffect(() => {
    if (sessionEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShipping((prev) => {
        if (prev.email === sessionEmail) return prev;
        return { ...prev, email: sessionEmail };
      });
    }
  }, [sessionEmail]);

  // Redirect if cart invalid
  useEffect(() => {
    if (!loading && !placedOrder) {
      if (!sessionEmail || !cart || cart.items.length === 0 || !cart.isValid) {
        router.replace("/cart");
      }
    }
  }, [loading, sessionEmail, cart, router, placedOrder]);

  const updateShipping = (key: keyof ShippingData, val: string) =>
    setShipping((prev) => ({ ...prev, [key]: val }));

  const clearError = (key: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  const handleContinueToPayment = () => {
    const errs = validate(shipping);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;
    setOrderError(null);
    setIsPlacing(true);
    try {
      const result = await orderService.createOrder({
        customerInfo: {
          name: `${shipping.firstName} ${shipping.lastName}`.trim(),
          phone: shipping.phone.trim(),
        },
        shippingAddress: {
          street: `${shipping.addressLine1}${shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}`,
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          zipCode: shipping.postalCode.trim(),
          country: shipping.country.trim(),
        },
        billingAddress: {
          street: `${shipping.addressLine1}${shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}`,
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          zipCode: shipping.postalCode.trim(),
          country: shipping.country.trim(),
        },
        paymentMethod: paymentMethod as "cod" | "card" | "upi" | "paypal",
      });
      setPlacedOrder(result);
      await refreshCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setOrderError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
      await refreshCart().catch(() => {});
    } finally {
      setIsPlacing(false);
    }
  };

  // ── Loading ──
  if ((loading || !cart || cart.items.length === 0 || !cart.isValid) && !placedOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a1a1a] mx-auto" />
          <p className="text-xs text-[#9a9a94] tracking-wide">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (placedOrder) return <OrderSuccess order={placedOrder} />;

  const items = cart!.items;
  const subtotal = cart!.summary.subtotal;
  const securityDeposits = cart!.summary.totalSecurityDeposits;
  const total = subtotal + securityDeposits;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top bar */}
      <div className="border-b border-[#e8e6e2] px-5 sm:px-8 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="text-sm font-light font-serif tracking-widest text-[#1a1a1a] no-underline">
          E-com
        </Link>
        <CheckoutSteps
          steps={STEPS}
          current={step}
          onStepClick={setStep}
        />
        <Link href="/cart" className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors no-underline">
          ← Cart
        </Link>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 max-w-6xl mx-auto">

          {/* Left — Steps */}
          <div className="flex-1 min-w-0">
            {step === 0 && (
              <ShippingStep
                data={shipping}
                errors={errors}
                onChange={updateShipping}
                onClearError={clearError}
                onContinue={handleContinueToPayment}
              />
            )}
            {step === 1 && (
              <PaymentStep
                shipping={shipping}
                paymentMethod={paymentMethod}
                onPaymentChange={setPaymentMethod}
                onBack={() => setStep(0)}
                onContinue={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            )}
            {step === 2 && (
              <ReviewStep
                items={items}
                shipping={shipping}
                paymentMethod={paymentMethod}
                subtotal={subtotal}
                securityDeposits={securityDeposits}
                total={total}
                isPlacing={isPlacing}
                orderError={orderError}
                onBack={() => setStep(1)}
                onEditShipping={() => setStep(0)}
                onEditPayment={() => setStep(1)}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          {/* Right — Sidebar */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            <OrderSidebar
              items={items}
              subtotal={subtotal}
              securityDeposits={securityDeposits}
              total={total}
            />
          </div>

        </div>
      </div>
    </div>
  );
}