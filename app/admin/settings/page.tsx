"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Save,
  Check,
  Loader2,
  Sliders,
  CreditCard,
  Shield,
  Globe,
  AlertTriangle,
} from "lucide-react";

type SettingsTab = "general" | "store" | "payments" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Ainorax E-Com",
    storeUrl: "https://ainorax-ecom.com",
    supportEmail: "support@ainorax-ecom.com",
    phoneNumber: "+91 98765 43210",
  });

  // Store Config State
  const [storeSettings, setStoreSettings] = useState({
    currency: "USD",
    timezone: "UTC+5:30 (India Standard Time)",
    allowGuestCheckout: true,
    maintenanceMode: false,
  });

  // Payments State
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_test_************************",
    paypalEnabled: false,
    codEnabled: true,
  });

  // Security State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordAge: "90 days",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="px-6 md:px-8 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-0.5">Management</p>
            <h1 className="text-2xl font-light font-serif text-[#1a1a1a]">Settings</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="self-start sm:self-center flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333] disabled:bg-[#888] text-white px-5 py-2 text-[10px] tracking-[0.16em] uppercase font-light transition-all duration-200 cursor-pointer h-9 shrink-0"
          >
            {isSaving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saveSuccess ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}
            {isSaving ? "Saving..." : saveSuccess ? "Saved" : "Save Changes"}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tab Sidebar */}
          <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-[#e8e6e2] pb-2 md:pb-0 md:pr-4 gap-1">
            {(
              [
                { id: "general", label: "General Settings", icon: Sliders },
                { id: "store", label: "Store Config", icon: Globe },
                { id: "payments", label: "Payment Methods", icon: CreditCard },
                { id: "security", label: "Security & Login", icon: Shield },
              ] as const
            ).map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase whitespace-nowrap bg-transparent cursor-pointer transition-all duration-150 text-left border-b-2 md:border-b-0 md:border-l-2 ${
                    isActive
                      ? "border-[#1a1a1a] text-[#1a1a1a] font-medium"
                      : "border-transparent text-[#888] hover:text-[#1a1a1a] hover:border-[#ddd]"
                  }`}
                >
                  <TabIcon size={12} strokeWidth={1.5} className="shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content Panel */}
          <div className="md:col-span-3 bg-white border border-[#e8e6e2] p-6 md:p-8">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Tab 1: General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium border-b border-[#f0eeea] pb-2 mb-4">
                      General Information
                    </h3>
                    <p className="text-[11px] text-[#9a9a94] mb-5">
                      Configure the basic information for your public store front and operations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.storeName}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, storeName: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Store URL
                      </label>
                      <input
                        type="text"
                        value={generalSettings.storeUrl}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, storeUrl: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={generalSettings.phoneNumber}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Store Configuration */}
              {activeTab === "store" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium border-b border-[#f0eeea] pb-2 mb-4">
                      Store Localization & Behavior
                    </h3>
                    <p className="text-[11px] text-[#9a9a94] mb-5">
                      Adjust regional behaviors, currencies, guest actions, and maintenance settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Base Currency
                      </label>
                      <select
                        value={storeSettings.currency}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, currency: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="INR">INR (₹) - Indian Rupee</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                        Store Timezone
                      </label>
                      <select
                        value={storeSettings.timezone}
                        onChange={(e) =>
                          setStoreSettings({ ...storeSettings, timezone: e.target.value })
                        }
                        className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                      >
                        <option value="UTC+5:30 (India Standard Time)">
                          UTC+5:30 (India Standard Time)
                        </option>
                        <option value="UTC+0:00 (Greenwich Mean Time)">
                          UTC+0:00 (Greenwich Mean Time)
                        </option>
                        <option value="UTC-5:00 (Eastern Standard Time)">
                          UTC-5:00 (Eastern Standard Time)
                        </option>
                        <option value="UTC+9:00 (Japan Standard Time)">
                          UTC+9:00 (Japan Standard Time)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    {/* Toggle: Guest Checkout */}
                    <div className="flex items-center justify-between border-b border-[#f4f2ee] pb-4">
                      <div>
                        <p className="text-[11px] text-[#1a1a1a] font-medium">Guest Checkout</p>
                        <p className="text-[10px] text-[#9a9a94]">
                          Allow customers to checkout without creating an account.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setStoreSettings({
                            ...storeSettings,
                            allowGuestCheckout: !storeSettings.allowGuestCheckout,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          storeSettings.allowGuestCheckout ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            storeSettings.allowGuestCheckout ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle: Maintenance Mode */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium text-red-600 flex items-center gap-1.5">
                          <AlertTriangle size={12} />
                          Maintenance Mode
                        </p>
                        <p className="text-[10px] text-[#9a9a94]">
                          Make store front inaccessible to customers while updating.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setStoreSettings({
                            ...storeSettings,
                            maintenanceMode: !storeSettings.maintenanceMode,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          storeSettings.maintenanceMode ? "bg-red-500" : "bg-[#e8e6e2]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            storeSettings.maintenanceMode ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Payment Gateways */}
              {activeTab === "payments" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium border-b border-[#f0eeea] pb-2 mb-4">
                      Payment Gateways & Options
                    </h3>
                    <p className="text-[11px] text-[#9a9a94] mb-5">
                      Configure active payment methods that clients can select at checkout.
                    </p>
                  </div>

                  {/* Stripe Card */}
                  <div className="border border-[#e8e6e2] p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif italic font-bold text-indigo-600 tracking-wide text-[16px]">
                          stripe
                        </span>
                        <span className="text-[9px] text-[#9a9a94] uppercase tracking-wider bg-[#f4f1ec] px-1.5 py-0.5">
                          Direct Cards
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentSettings({
                            ...paymentSettings,
                            stripeEnabled: !paymentSettings.stripeEnabled,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          paymentSettings.stripeEnabled ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            paymentSettings.stripeEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {paymentSettings.stripeEnabled && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                          Stripe Public Key
                        </label>
                        <input
                          type="password"
                          value={paymentSettings.stripePublicKey}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              stripePublicKey: e.target.value,
                            })
                          }
                          className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                        />
                      </div>
                    )}
                  </div>

                  {/* PayPal Card */}
                  <div className="border border-[#e8e6e2] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold italic text-blue-700 tracking-wide text-[15px]">
                          PayPal
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paypalEnabled: !paymentSettings.paypalEnabled,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          paymentSettings.paypalEnabled ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            paymentSettings.paypalEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div className="border border-[#e8e6e2] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#1a1a1a] font-medium">Cash on Delivery (COD)</p>
                        <p className="text-[10px] text-[#9a9a94]">
                          Permit users to pay using physical cash upon delivery.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentSettings({
                            ...paymentSettings,
                            codEnabled: !paymentSettings.codEnabled,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          paymentSettings.codEnabled ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            paymentSettings.codEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Security & Login */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium border-b border-[#f0eeea] pb-2 mb-4">
                      Security & Account Settings
                    </h3>
                    <p className="text-[11px] text-[#9a9a94] mb-5">
                      Control security rules, administrator account settings, and credential expiry.
                    </p>
                  </div>

                  {/* Two Factor Authentication */}
                  <div className="flex items-center justify-between border-b border-[#f4f2ee] pb-4">
                    <div>
                      <p className="text-[11px] text-[#1a1a1a] font-medium">
                        Two-Factor Authentication (2FA)
                      </p>
                      <p className="text-[10px] text-[#9a9a94]">
                        Enforce dual factor login verification (Authenticator App / SMS).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: !securitySettings.twoFactorAuth,
                        })
                      }
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        securitySettings.twoFactorAuth ? "bg-[#1a1a1a]" : "bg-[#e8e6e2]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          securitySettings.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Password age selection */}
                  <div className="space-y-1 max-w-sm">
                    <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                      Enforce Password Expiration
                    </label>
                    <select
                      value={securitySettings.passwordAge}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, passwordAge: e.target.value })
                      }
                      className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                    >
                      <option value="Never">Never Expiry</option>
                      <option value="30 days">Every 30 Days</option>
                      <option value="90 days">Every 90 Days</option>
                      <option value="180 days">Every 180 Days</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-[#f0eeea] space-y-4">
                    <h4 className="text-[10px] tracking-[0.12em] uppercase text-[#1a1a1a] font-medium">
                      Update Password
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] tracking-[0.12em] uppercase text-[#9a9a94]">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[#fcfbfa] border border-[#e8e6e2] focus:border-[#1a1a1a] outline-none text-[12px] text-[#1a1a1a] px-3 py-2 transition-colors duration-150"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </AdminLayout>
  );
}
