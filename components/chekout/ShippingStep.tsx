"use client";

import CheckoutField from "./ChekoutField";

export type ShippingData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  data: ShippingData;
  errors: Record<string, string>;
  onChange: (key: keyof ShippingData, val: string) => void;
  onClearError: (key: string) => void;
  onContinue: () => void;
  isPlacing?: boolean;
};

export default function ShippingStep({
  data,
  errors,
  onChange,
  onClearError,
  onContinue,
  isPlacing = false,
}: Props) {
  const field = (
    key: keyof ShippingData,
    label: string,
    placeholder: string,
    colSpan = false
  ) => ({
    fieldKey: key,
    label,
    placeholder,
    value: data[key],
    onChange: (val: string) => {
      onChange(key, val);
      onClearError(key);
    },
    error: errors[key],
    colSpan,
  });

  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#64748b] mb-1 font-medium">
        Requisition Details
      </p>
      <h2 className="text-xl font-light font-serif text-[#0f2e5a] tracking-tight mb-8">
        Requester Information
      </h2>

      {/* Contact / Requester */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#0f2e5a] font-semibold mb-4 pb-3 border-b border-[#e2e8f0]">
          Contact & Requester Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckoutField {...field("firstName", "First Name", "First name")} />
          <CheckoutField {...field("lastName", "Last Name", "Last name")} />
          <CheckoutField {...field("email", "Email", "Email address", true)} />
          <CheckoutField {...field("phone", "Phone", "Phone number", true)} />
        </div>
      </div>

      {/* Shipping Address - Commented down per user request */}
      {/*
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">
          Shipping Address
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckoutField {...field("addressLine1", "Address Line 1", "Street address, P.O. box", true)} />
          <CheckoutField {...field("addressLine2", "Address Line 2", "Apartment, suite (optional)", true)} />
          <CheckoutField {...field("city", "City", "City")} />
          <CheckoutField {...field("state", "State", "State")} />
          <CheckoutField {...field("postalCode", "Postal Code", "Postal code")} />
          <CheckoutField {...field("country", "Country", "Country")} />
        </div>
      </div>
      */}

      <button
        onClick={onContinue}
        disabled={isPlacing}
        className="w-full sm:w-auto bg-[#0f2e5a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#0b2447] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xs font-semibold cursor-pointer shadow-2xs flex items-center justify-center gap-2"
      >
        {isPlacing ? "Processing Requisition..." : "Complete Requisition"}
      </button>
    </div>
  );
}