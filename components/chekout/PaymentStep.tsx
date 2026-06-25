"use client";

import type { ShippingData } from "./ShippingStep";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", disabled: false },
  { id: "card", label: "Card", disabled: true, note: "Unavailable" },
  { id: "upi", label: "UPI", disabled: true, note: "Unavailable" },
];

type Props = {
  shipping: ShippingData;
  paymentMethod: string;
  onPaymentChange: (method: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function PaymentStep({
  shipping,
  paymentMethod,
  onPaymentChange,
  onBack,
  onContinue,
}: Props) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
        Step 2 of 3
      </p>
      <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">
        Payment
      </h2>

      {/* Shipping summary */}
      <div className="mb-8 p-4 bg-[#faf9f7] border border-[#e8e6e2] flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] mb-1">
            Ships to
          </p>
          <p className="text-xs text-[#1a1a1a] tracking-wide">
            {shipping.firstName} {shipping.lastName}
          </p>
          <p className="text-xs text-[#1a1a1a] tracking-wide">
            {shipping.addressLine1}
            {shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}
          </p>
          <p className="text-xs text-[#1a1a1a] tracking-wide">
            {shipping.city}, {shipping.state} {shipping.postalCode},{" "}
            {shipping.country}
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors shrink-0 bg-transparent border-none cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Payment method selector */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">
          Payment Method
        </p>
        <div className="flex flex-wrap gap-3 mb-6">
          {PAYMENT_METHODS.map(({ id, label, disabled, note }) => (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onPaymentChange(id)}
              className={`text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
                paymentMethod === id
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : disabled
                  ? "border-[#e8e6e2] text-[#c5c5bf] bg-[#fafaf9] cursor-not-allowed"
                  : "border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] cursor-pointer"
              }`}
            >
              {label}
              {disabled && note && (
                <span className="lowercase text-[8px] tracking-normal text-[#9a9a94] ml-1">
                  ({note})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* COD info */}
        {paymentMethod === "cod" && (
          <div className="p-4 bg-[#faf9f7] border border-[#e8e6e2]">
            <p className="text-xs text-[#6b6b65] tracking-wide leading-relaxed font-light">
              Pay in cash when your order arrives. Please keep exact change ready.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="sm:w-auto text-[11px] tracking-[0.16em] uppercase px-8 py-4 border border-[#e8e6e2] text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-transparent"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          className="flex-1 sm:flex-none bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors cursor-pointer"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}