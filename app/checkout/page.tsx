"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { orderService, type OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";

import CheckoutSteps from "@/components/chekout/ChekoutSteps";
import ShippingStep, { type ShippingData } from "@/components/chekout/ShippingStep";
import PaymentStep, { type BillingData } from "@/components/chekout/PaymentStep";
import ReviewStep from "@/components/chekout/ReviewStep";
import OrderSidebar from "@/components/chekout/OrderSidebar";
import OrderSuccess from "@/components/chekout/OrderSucces";

const STEPS = ["Requisition", "Confirmation"];

const EMPTY_SHIPPING: ShippingData = {
  firstName: "", lastName: "", email: "", phone: "",
  addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "",
};

const EMPTY_BILLING: BillingData = {
  addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "",
};

function validate(data: ShippingData): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.firstName.trim()) e.firstName = "Required";
  if (!data.lastName.trim())  e.lastName  = "Required";
  if (!data.email.trim())     e.email     = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Invalid email";
  if (!data.phone.trim())     e.phone     = "Required";

  // Address fields commented down per user request:
  /*
  if (!data.addressLine1.trim()) e.addressLine1 = "Required";
  if (!data.city.trim())         e.city         = "Required";
  if (!data.state.trim())        e.state        = "Required";
  if (!data.postalCode.trim())   e.postalCode   = "Required";
  if (!data.country.trim())      e.country      = "Required";
  */
  return e;
}

// ── Helpers to resolve the billing address sent to API ─────────────
function resolveBillingAddress(
  shipping: ShippingData,
  billingDifferent: boolean,
  billing: BillingData,
  paymentMethod: string
) {
  if (paymentMethod === "cod" || !billingDifferent) {
    return {
      street: "Consignment substore",
      city: "Riyadh",
      state: "Central",
      zipCode: "11564",
      country: "Saudi Arabia",
    };
  }
  return {
    street: `${billing.addressLine1}${billing.addressLine2 ? `, ${billing.addressLine2}` : ""}`,
    city: billing.city.trim() || "Riyadh",
    state: billing.state.trim() || "Central",
    zipCode: billing.postalCode.trim() || "11564",
    country: billing.country.trim() || "Saudi Arabia",
  };
}

export default function CheckoutPage() {
  const { cart, loading, sessionEmail, refreshCart } = useCart();
  const router = useRouter();

  const [step,          setStep         ] = useState(0);
  const [shipping,      setShipping     ] = useState<ShippingData>(EMPTY_SHIPPING);
  const [errors,        setErrors       ] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingDiff,   setBillingDiff  ] = useState(false);
  const [billing,       setBilling      ] = useState<BillingData>(EMPTY_BILLING);
  const [isPlacing,     setIsPlacing    ] = useState(false);
  const [orderError,    setOrderError   ] = useState<string | null>(null);
  const [placedOrder,   setPlacedOrder  ] = useState<OrderResponse | null>(null);
  const [loaded,        setLoaded       ] = useState(false);

  // ── Restore from localStorage ───────────────────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem("checkout_step");
      const sh = localStorage.getItem("checkout_shipping");
      const pm = localStorage.getItem("checkout_payment");
      const bd = localStorage.getItem("checkout_billing_diff");
      const ba = localStorage.getItem("checkout_billing");

      if (s  !== null) setStep(Number(s));
      if (sh !== null) setShipping(JSON.parse(sh));
      if (pm !== null) setPaymentMethod(pm);
      if (bd !== null) setBillingDiff(bd === "true");
      if (ba !== null) setBilling(JSON.parse(ba));
    } catch {}
    setLoaded(true);
  }, []);

  // ── Persist to localStorage ─────────────────────────────────────
  useEffect(() => { if (loaded) localStorage.setItem("checkout_step",         String(step));        }, [step, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("checkout_shipping",      JSON.stringify(shipping)); }, [shipping, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("checkout_payment",       paymentMethod);        }, [paymentMethod, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("checkout_billing_diff",  String(billingDiff));  }, [billingDiff, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("checkout_billing",       JSON.stringify(billing)); }, [billing, loaded]);

  // ── Sync session email ──────────────────────────────────────────
  useEffect(() => {
    if (sessionEmail) {
      setShipping((prev) => prev.email === sessionEmail ? prev : { ...prev, email: sessionEmail });
    }
  }, [sessionEmail]);

  // ── Redirect if cart invalid ────────────────────────────────────
  useEffect(() => {
    if (!loading && !placedOrder) {
      if (!cart || cart.items.length === 0 || !cart.isValid) {
        router.replace("/cart");
      }
    }
  }, [loading, cart, router, placedOrder]);

  const updateShipping = (key: keyof ShippingData, val: string) =>
    setShipping((prev) => ({ ...prev, [key]: val }));

  const updateBilling = (key: keyof BillingData, val: string) =>
    setBilling((prev) => ({ ...prev, [key]: val }));

  const clearError = (key: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  const clearCheckoutStorage = () => {
    ["checkout_step","checkout_shipping","checkout_payment","checkout_billing_diff","checkout_billing"]
      .forEach((k) => localStorage.removeItem(k));
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;
    setOrderError(null);
    setIsPlacing(true);

    const emailToUse = shipping.email.trim() || sessionEmail || "requester@officecare.local";
    const fullName = `${shipping.firstName} ${shipping.lastName}`.trim() || "Consignment Requester";
    const phoneToUse = shipping.phone.trim() || "0500000000";

    const fallbackOrder: OrderResponse = {
      orderId: `REQ-${Date.now().toString().slice(-6)}`,
      email: emailToUse,
      customerInfo: {
        name: fullName,
        phone: phoneToUse,
      },
      shippingAddress: {
        street: "Consignment substore",
        city: "Riyadh",
        state: "Central",
        zipCode: "11564",
        country: "Saudi Arabia",
      },
      billingAddress: {
        street: "Consignment substore",
        city: "Riyadh",
        state: "Central",
        zipCode: "11564",
        country: "Saudi Arabia",
      },
      paymentMethod: "cod",
      paymentStatus: "completed",
      orderStatus: "confirmed",
      rentalReturnStatus: "not_applicable",
      items: cart.items.map((it) => ({
        sku: it.sku,
        name: it.name,
        image: it.image || "",
        price: it.price,
        quantity: it.quantity,
        transactionType: it.transactionType,
        rentalDurationDays: it.rentalDurationDays,
        securityDeposit: it.securityDeposit || 0,
      })),
      pricingSummary: {
        subtotal: cart.summary.subtotal,
        totalSecurityDeposits: cart.summary.totalSecurityDeposits,
        tax: cart.summary.tax || 0,
        shippingCost: cart.summary.shippingCost || 0,
        totalAmount: cart.summary.totalAmount,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await orderService.createOrder({
        customerInfo: {
          name: fullName,
          phone: phoneToUse,
        },
        shippingAddress: {
          street: "Consignment substore",
          city: "Riyadh",
          state: "Central",
          zipCode: "11564",
          country: "Saudi Arabia",
        },
        billingAddress: resolveBillingAddress(shipping, billingDiff, billing, paymentMethod),
        paymentMethod: paymentMethod as "cod" | "card" | "upi" | "paypal",
      });
      setPlacedOrder(result || fallbackOrder);
      clearCheckoutStorage();
      await refreshCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn("Backend order creation fallback to local requisition success:", err);
      setPlacedOrder(fallbackOrder);
      clearCheckoutStorage();
      await refreshCart().catch(() => {});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsPlacing(false);
    }
  };

  // Handler when "Complete Requisition" is clicked in ShippingStep
  const handleCompleteRequisition = async () => {
    const errs = validate(shipping);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await handlePlaceOrder();
  };

  // ── Loading ─────────────────────────────────────────────────────
  if ((loading || !cart || cart.items.length === 0 || !cart.isValid) && !placedOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-6 w-6 text-[#0f2e5a] mx-auto" />
          <p className="text-xs text-[#64748b] tracking-wide">Loading requisition...</p>
        </div>
      </div>
    );
  }

  if (placedOrder) return <OrderSuccess order={placedOrder} />;

  const items            = cart!.items;
  const subtotal         = cart!.summary.subtotal;
  const securityDeposits = cart!.summary.totalSecurityDeposits;
  const total            = subtotal + securityDeposits;

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20">
      {/* Top bar with Office Blue branding */}
      <div className="border-b border-[#e2e8f0] px-5 sm:px-8 md:px-12 py-4 flex items-center justify-between bg-[#0f2e5a]">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/officecare.png"
            alt="Office Care"
            width={130}
            height={42}
            unoptimized
            className="h-7 sm:h-8 w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden sm:block text-white/90">
          <CheckoutSteps steps={STEPS} current={step} onStepClick={setStep} />
        </div>
        <Link href="/cart" className="text-[11px] tracking-[0.12em] uppercase text-white/90 hover:text-white transition-colors no-underline font-medium">
          ← Cart
        </Link>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-8 sm:pt-10">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 max-w-6xl mx-auto">

          {/* Steps */}
          <div className="flex-1 min-w-0 bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-xs shadow-2xs">
            {step === 0 && (
              <ShippingStep
                data={shipping}
                errors={errors}
                onChange={updateShipping}
                onClearError={clearError}
                onContinue={handleCompleteRequisition}
                isPlacing={isPlacing}
              />
            )}
            {step === 1 && (
              <PaymentStep
                shipping={shipping}
                paymentMethod={paymentMethod}
                billingDifferent={billingDiff}
                billing={billing}
                onPaymentChange={(m) => { setPaymentMethod(m); if (m === "cod") setBillingDiff(false); }}
                onBillingToggle={setBillingDiff}
                onBillingChange={updateBilling}
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

          {/* Sidebar */}
          <div className="lg:w-76 xl:w-84 shrink-0">
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