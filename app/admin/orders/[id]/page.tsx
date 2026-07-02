"use client";

import { use, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminOrderDetails } from "@/hooks/use-admin-order-details";
import { ChevronDown, ArrowLeft, Package, CreditCard, Clock } from "lucide-react";

// ── Status Config ─────────────────────────────────────────────────
const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  processing: "text-violet-700 bg-violet-50 border-violet-200",
  shipped: "text-indigo-700 bg-indigo-50 border-indigo-200",
  delivered: "text-green-700 bg-green-50 border-green-200",
  completed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  cancelled: "text-red-700 bg-red-50 border-red-200",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  paid: "text-emerald-700 bg-emerald-50 border-emerald-200",
  failed: "text-red-700 bg-red-50 border-red-200",
  refunded: "text-gray-500 bg-gray-50 border-gray-200",
};

const RENTAL_STATUS_LABELS: Record<string, string> = {
  "n/a": "N/A",
  pending_return: "Pending Return",
  returned_in_full: "Returned in Full",
  returned_damaged: "Returned Damaged",
  forfeited: "Forfeited",
};

const RENTAL_STATUS_STYLES: Record<string, string> = {
  "n/a": "text-gray-400 bg-gray-50 border-gray-200",
  pending_return: "text-amber-700 bg-amber-50 border-amber-200",
  returned_in_full: "text-emerald-700 bg-emerald-50 border-emerald-200",
  returned_damaged: "text-orange-700 bg-orange-50 border-orange-200",
  forfeited: "text-red-700 bg-red-50 border-red-200",
};

// ── Components ────────────────────────────────────────────────────
function StatusSelect({
  value,
  options,
  styles,
  disabled = false,
  onChange,
}: {
  value: string;
  options: Record<string, string>;
  styles: Record<string, string>;
  disabled?: boolean;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    openUpwards: boolean;
  }>({ left: 0, width: 0, openUpwards: false });

  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 180;

      const shouldOpenUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      if (shouldOpenUpwards) {
        setCoords({ bottom: viewportHeight - rect.top + 6, left: rect.left, width: rect.width, openUpwards: true });
      } else {
        setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width, openUpwards: false });
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(dropdownRef.current && dropdownRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    }
    function handleScroll() { setIsOpen(false); }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { capture: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen]);

  const currentLabel = options[value] || value;
  const currentStyle = styles[value] || "text-[#1a1a1a] bg-white border-[#e8e6e2]";

  return (
    <div ref={containerRef} className="relative inline-block w-full min-w-37.5">
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between text-[10px] tracking-[0.08em] font-semibold border rounded-sm px-3 py-2 uppercase select-none outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${currentStyle}`}
      >
        <span className="truncate pr-1">{currentLabel}</span>
        {!disabled && (
          <ChevronDown size={12} className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isOpen && !disabled && typeof window !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            ...(coords.openUpwards ? { bottom: `${coords.bottom}px` } : { top: `${coords.top}px` }),
          }}
          className={`z-50 bg-white border border-[#e8e6e2] rounded-sm shadow-lg py-1 max-h-48 overflow-y-auto ${
            coords.openUpwards ? "animate-in fade-in slide-in-from-bottom-1 duration-150" : "animate-in fade-in slide-in-from-top-1 duration-150"
          }`}
        >
          {Object.entries(options).map(([val, label]) => {
            const isSelected = val === value;
            return (
              <button
                key={val}
                type="button"
                onClick={() => { onChange(val); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-[10px] tracking-wider uppercase font-medium transition-colors ${
                  isSelected ? "bg-[#f4f2ee] text-[#1a1a1a]" : "text-[#5a5a55] hover:bg-[#faf9f7] hover:text-[#1a1a1a]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Page Component ──────────────────────────────────────────────────
export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap the params promise (Next.js 15 pattern)
  const resolvedParams = use(params);
  const { order, loading, error, handleFlagChange } = useAdminOrderDetails(resolvedParams.id);

  if (loading) {
    return (
      <AdminLayout>
        <div className="px-6 md:px-8 py-8 animate-pulse">
          <div className="h-6 w-32 bg-[#e8e6e2] rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-white border border-[#e8e6e2] rounded-sm" />
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-white border border-[#e8e6e2] rounded-sm" />
              <div className="h-48 bg-white border border-[#e8e6e2] rounded-sm" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="px-6 md:px-8 py-20 flex flex-col items-center justify-center text-center">
          <p className="text-red-600 mb-4 font-medium">{error || "Order not found"}</p>
          <button
            onClick={() => router.push("/admin/orders")}
            className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-px font-semibold hover:text-[#5a5a55]"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-6 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/orders")}
            className="flex items-center text-[#5a5a55] hover:text-[#1a1a1a] transition-colors text-[10px] uppercase tracking-wider font-semibold mb-4"
          >
            <ArrowLeft size={12} className="mr-1.5" />
            Back to Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">
                Placed on {order.date}
              </p>
              <h1 className="text-2xl font-light font-serif text-[#1a1a1a]">Order #{order.id}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Line Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-[#e8e6e2] rounded-sm overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#f0eeea] bg-[#faf9f7]">
                <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a]">Items Ordered</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#f0eeea]">
                      <th className="px-5 py-3 text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold">Product</th>
                      <th className="px-5 py-3 text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold">Type</th>
                      <th className="px-5 py-3 text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold">Price</th>
                      <th className="px-5 py-3 text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold text-center">Qty</th>
                      <th className="px-5 py-3 text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f2ee]">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#faf9f7] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-[#f4f2ee] rounded-sm overflow-hidden relative border border-[#e8e6e2] shrink-0 flex items-center justify-center">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                              ) : (
                                <Package size={16} className="text-[#bbb]" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[12px] text-[#1a1a1a] font-medium leading-tight">{item.name}</span>
                              {item.sku && item.sku !== "N/A" && (
                                <span className="text-[10px] text-[#9a9a94] uppercase tracking-wider mt-0.5">SKU: {item.sku}</span>
                              )}
                              {item.transactionType === "rent" && item.rentalDurationDays && (
                                <span className="text-[10px] text-[#9a9a94] mt-0.5">{item.rentalDurationDays} Days</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                            item.transactionType === "rent" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {item.transactionType}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-middle text-[12px] text-[#5a5a55]">
                          <div>₹{item.price.toFixed(2)}{item.transactionType === "rent" ? " / day" : ""}</div>
                          {item.transactionType === "rent" && item.securityDeposit ? (
                            <div className="text-[10px] text-[#9a9a94]">+₹{item.securityDeposit.toFixed(2)} deposit</div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4 align-middle text-center text-[12px] text-[#1a1a1a] font-medium">
                          {item.qty}
                        </td>
                        <td className="px-5 py-4 align-middle text-right text-[12px] text-[#1a1a1a] font-semibold">
                          <div>₹{(item.price * (item.transactionType === "rent" ? (item.rentalDurationDays || 1) : 1) * item.qty).toFixed(2)}</div>
                          {item.transactionType === "rent" && item.securityDeposit ? (
                            <div className="text-[10px] text-[#9a9a94]">+₹{(item.securityDeposit * item.qty).toFixed(2)} deposit</div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 bg-[#faf9f7] border-t border-[#f0eeea] flex flex-col items-end gap-2">
                <div className="flex justify-between w-full max-w-50 text-[12px] text-[#5a5a55]">
                  <span>Subtotal</span>
                  <span>₹{(order.pricingSummary?.subtotal || 0).toFixed(2)}</span>
                </div>
                {order.pricingSummary?.totalSecurityDeposits > 0 && (
                  <div className="flex justify-between w-full max-w-50 text-[12px] text-[#5a5a55]">
                    <span>Security Deposits</span>
                    <span>₹{order.pricingSummary.totalSecurityDeposits.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between w-full max-w-50 text-[12px] text-[#1a1a1a] font-bold border-t border-[#e8e6e2] pt-2 mt-1">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Panels */}
          <div className="space-y-6">
            {/* Status Panel */}
            <div className="bg-white border border-[#e8e6e2] rounded-sm shadow-sm">
              <div className="px-5 py-4 border-b border-[#f0eeea] bg-[#faf9f7] flex items-center gap-2">
                <Clock size={14} className="text-[#1a1a1a]" />
                <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a]">Order Status</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-1.5">Fulfillment</label>
                  <StatusSelect
                    value={order.orderStatus}
                    options={ORDER_STATUS_LABELS}
                    styles={ORDER_STATUS_STYLES}
                    onChange={(val) => handleFlagChange({ orderStatus: val })}
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-1.5">Payment</label>
                  <StatusSelect
                    value={order.paymentStatus}
                    options={PAYMENT_STATUS_LABELS}
                    styles={PAYMENT_STATUS_STYLES}
                    onChange={(val) => handleFlagChange({ paymentStatus: val })}
                  />
                </div>
                {order.hasRental && (
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-1.5">Rental Return</label>
                    <StatusSelect
                      value={order.rentalReturnStatus}
                      options={RENTAL_STATUS_LABELS}
                      styles={RENTAL_STATUS_STYLES}
                      onChange={(val) => handleFlagChange({ rentalReturnStatus: val })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Customer Panel */}
            <div className="bg-white border border-[#e8e6e2] rounded-sm shadow-sm">
              <div className="px-5 py-4 border-b border-[#f0eeea] bg-[#faf9f7]">
                <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a]">Customer Details</h2>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-[13px] font-semibold text-[#1a1a1a] leading-none mb-1">{order.customer}</p>
                  <p className="text-[12px] text-[#5a5a55]"><a href={`mailto:${order.email}`} className="hover:underline">{order.email}</a></p>
                  {order.phone && <p className="text-[12px] text-[#5a5a55] mt-1">{order.phone}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-2">Shipping Address</label>
                  {order.shippingAddress ? (
                    <div className="text-[12px] text-[#5a5a55] leading-relaxed">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-[12px] text-[#9a9a94] italic">{order.address}</p>
                  )}
                </div>

                {order.billingAddress && (
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-2">Billing Address</label>
                    <div className="text-[12px] text-[#5a5a55] leading-relaxed">
                      <p>{order.billingAddress.street}</p>
                      <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                      <p>{order.billingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment Panel */}
            <div className="bg-white border border-[#e8e6e2] rounded-sm shadow-sm">
              <div className="px-5 py-4 border-b border-[#f0eeea] bg-[#faf9f7] flex items-center gap-2">
                <CreditCard size={14} className="text-[#1a1a1a]" />
                <h2 className="text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a]">Payment Details</h2>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-1">Method</label>
                  <p className="text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-wider">{order.paymentMethod}</p>
                </div>
                {order.transactionId && (
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#9a9a94] font-semibold mb-1">Transaction ID</label>
                    <p className="text-[12px] text-[#5a5a55] break-all">{order.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
