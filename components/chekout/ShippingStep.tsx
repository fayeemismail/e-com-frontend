"use client";

import CheckoutField from "./ChekoutField"

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
};

export default function ShippingStep({
  data,
  errors,
  onChange,
  onClearError,
  onContinue,
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
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
        Step 1 of 3
      </p>
      <h2 className="text-xl font-light font-serif text-[#1a1a1a] tracking-tight mb-8">
        Shipping Details
      </h2>

      {/* Contact */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">
          Contact
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckoutField {...field("firstName", "First Name", "First name")} />
          <CheckoutField {...field("lastName", "Last Name", "Last name")} />
          <CheckoutField {...field("email", "Email", "Email address", true)} />
          <CheckoutField {...field("phone", "Phone", "Phone number", true)} />
        </div>
      </div>

      {/* Address */}
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

      <button
        onClick={onContinue}
        className="w-full sm:w-auto bg-[#1a1a1a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#333] transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  );
}