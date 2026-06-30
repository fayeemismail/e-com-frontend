"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { AdminOrder } from "@/types/admin/types";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

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
  pending: "text-amber-700 bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-200",
  processing: "text-violet-700 bg-violet-50 border-violet-200 focus:border-violet-400 focus:ring-violet-200",
  shipped: "text-indigo-700 bg-indigo-50 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200",
  delivered: "text-green-700 bg-green-50 border-green-200 focus:border-green-400 focus:ring-green-200",
  completed: "text-emerald-700 bg-emerald-50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200",
  cancelled: "text-red-700 bg-red-50 border-red-200 focus:border-red-400 focus:ring-red-200",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-200",
  paid: "text-emerald-700 bg-emerald-50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200",
  failed: "text-red-700 bg-red-50 border-red-200 focus:border-red-400 focus:ring-red-200",
  refunded: "text-gray-500 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-200",
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
  pending_return: "text-amber-700 bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-200",
  returned_in_full: "text-emerald-700 bg-emerald-50 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200",
  returned_damaged: "text-orange-700 bg-orange-50 border-orange-200 focus:border-orange-400 focus:ring-orange-200",
  forfeited: "text-red-700 bg-red-50 border-red-200 focus:border-red-400 focus:ring-red-200",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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
      const dropdownHeight = 180; // Estimated height for options card

      const shouldOpenUpwards = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      if (shouldOpenUpwards) {
        setCoords({
          bottom: viewportHeight - rect.top + 6,
          left: rect.left,
          width: rect.width,
          openUpwards: true,
        });
      } else {
        setCoords({
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
          openUpwards: false,
        });
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleScroll() {
      setIsOpen(false);
    }

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
    <div ref={containerRef} className="relative inline-block w-full min-w-[130px]">
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between text-[9px] tracking-[0.08em] font-semibold border rounded-full px-3 py-1.5 uppercase select-none outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${currentStyle}`}
      >
        <span className="truncate pr-1">{currentLabel}</span>
        {!disabled && (
          <ChevronDown
            size={11}
            className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen &&
        !disabled &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              ...(coords.openUpwards ? { bottom: `${coords.bottom}px` } : { top: `${coords.top}px` }),
            }}
            className={`z-50 bg-white border border-[#e8e6e2] rounded-md shadow-lg py-1 max-h-48 overflow-y-auto ${
              coords.openUpwards
                ? "animate-in fade-in slide-in-from-bottom-1 duration-150"
                : "animate-in fade-in slide-in-from-top-1 duration-150"
            }`}
          >
            {Object.entries(options).map(([val, label]) => {
              const isSelected = val === value;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors duration-150 hover:bg-[#faf9f7] flex items-center justify-between ${
                    isSelected ? "bg-[#faf9f7] font-semibold text-[#1a1a1a]" : "text-[#5a5a55]"
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ml-1.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

function OrderRow({
  order,
  onFlagChange,
}: {
  order: AdminOrder;
  onFlagChange: (
    id: string,
    updates: { orderStatus?: string; paymentStatus?: string; rentalReturnStatus?: string }
  ) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasRental = order.items.some((item) => item.transactionType === "rent");
  const hasPurchase = order.items.some((item) => item.transactionType === "buy");
  let typeLabel = "Purchase";
  let typeStyle = "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (hasRental && hasPurchase) {
    typeLabel = "Mixed";
    typeStyle = "text-violet-700 bg-violet-50 border-violet-200";
  } else if (hasRental) {
    typeLabel = "Rental";
    typeStyle = "text-indigo-700 bg-indigo-50 border-indigo-200";
  }

  return (
    <>
      <tr
        className="border-b border-[#f4f2ee] hover:bg-[#faf9f7] transition-colors cursor-pointer"
        onClick={() => setExpanded((o) => !o)}
      >
        {/* Order ID & Date */}
        <td className="px-4 py-3.5 align-middle">
          <p className="text-[11px] font-mono text-[#1a1a1a] font-medium">{order.id}</p>
          <p className="text-[10px] text-[#9a9a94] mt-0.5">{order.date}</p>
        </td>

        {/* Customer */}
        <td className="px-4 py-3.5 align-middle">
          <p className="text-[12px] text-[#1a1a1a] font-medium">{order.customer}</p>
          <p className="text-[10px] text-[#9a9a94] mt-0.5">{order.email}</p>
        </td>

        {/* Order Type */}
        <td className="px-4 py-3.5 align-middle">
          <span className={`inline-block text-[9px] tracking-wider uppercase px-2.5 py-0.5 border font-semibold ${typeStyle}`}>
            {typeLabel}
          </span>
        </td>

        {/* Amount */}
        <td className="px-4 py-3.5 align-middle">
          <p className="text-[12px] text-[#1a1a1a] font-medium">${order.total.toFixed(2)}</p>
          <p className="text-[10px] text-[#9a9a94] mt-0.5 uppercase tracking-wider">
            {order.paymentMethod}
          </p>
        </td>

        {/* Order Status Select */}
        <td className="px-4 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
          <StatusSelect
            value={order.orderStatus}
            options={ORDER_STATUS_LABELS}
            styles={ORDER_STATUS_STYLES}
            onChange={(val) => onFlagChange(order.id, { orderStatus: val })}
          />
        </td>

        {/* Payment Status Select */}
        <td className="px-4 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
          <StatusSelect
            value={order.paymentStatus}
            options={PAYMENT_STATUS_LABELS}
            styles={PAYMENT_STATUS_STYLES}
            onChange={(val) => onFlagChange(order.id, { paymentStatus: val })}
          />
        </td>

        {/* Rental Status Select */}
        <td className="px-4 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
          <StatusSelect
            value={order.rentalReturnStatus}
            options={RENTAL_STATUS_LABELS}
            styles={RENTAL_STATUS_STYLES}
            disabled={!order.hasRental}
            onChange={(val) => onFlagChange(order.id, { rentalReturnStatus: val })}
          />
        </td>

        {/* Expand Toggle */}
        <td className="px-4 py-3.5 text-[#9a9a94] align-middle text-center">
          <div className="flex items-center justify-center">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="bg-[#faf9f7] border-b border-[#f0eeea]">
          <td colSpan={8} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Items */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-3">Order Items</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white border border-[#e8e6e2] p-2.5 rounded-sm">
                      <div>
                        <p className="text-[#1a1a1a] text-[11px] font-medium">{item.name}</p>
                        <p className="text-[#9a9a94] text-[10px] mt-0.5">Qty: {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 border font-semibold ${
                          item.transactionType === "rent"
                            ? "text-indigo-700 bg-indigo-50 border-indigo-200"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200"
                        }`}>
                          {item.transactionType === "rent" ? "Rent" : "Buy"}
                        </span>
                        <span className="text-[#5a5a55] text-[11px] font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-3">Delivery Address</p>
                <div className="bg-white border border-[#e8e6e2] p-3 rounded-sm leading-relaxed text-[#5a5a55] text-[11px]">
                  <p className="font-semibold text-[#1a1a1a] mb-1">{order.customer}</p>
                  <p>{order.address}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-3">Order Summary</p>
                <div className="bg-white border border-[#e8e6e2] p-3 rounded-sm text-[11px] space-y-1.5">
                  <div className="flex justify-between text-[#5a5a55]">
                    <span>Payment Method</span>
                    <span className="font-semibold text-[#1a1a1a] uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#5a5a55]">
                    <span>Contains Rentals</span>
                    <span className="font-semibold text-[#1a1a1a]">{order.hasRental ? "Yes" : "No"}</span>
                  </div>
                  <div className="border-t border-[#e8e6e2] mt-2 pt-2 flex justify-between font-semibold text-[12px] text-[#1a1a1a]">
                    <span>Total Amount</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const ordersPerPage = 10;
  const {
    orders,
    loading,
    error,
    filter,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    handleFilterChange,
    handleFlagChange,
    refresh,
  } = useAdminOrders(1, ordersPerPage);

  const shownCountStart = totalCount > 0 ? (currentPage - 1) * ordersPerPage + 1 : 0;
  const shownCountEnd = Math.min(currentPage * ordersPerPage, totalCount);

  return (
    <AdminLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-0.5">Management</p>
            <h1 className="text-2xl font-light font-serif text-[#1a1a1a]">Orders</h1>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e8e6e2] hover:border-[#1a1a1a] bg-white text-[10px] uppercase tracking-wider text-[#5a5a55] hover:text-[#1a1a1a] cursor-pointer transition-colors duration-150"
            title="Refresh List"
          >
            <RefreshCw size={11} />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border whitespace-nowrap shrink-0 bg-transparent cursor-pointer transition-colors duration-150 ${
                  filter === f.value
                    ? "border-[#1a1a1a] text-[#1a1a1a] font-semibold"
                    : "border-transparent text-[#888] hover:text-[#1a1a1a] hover:border-[#ddd]"
                }`}
              >
                {f.label}
                {f.value === filter && totalCount > 0 && (
                  <span className="ml-1 text-[#aaa]">({totalCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20 bg-white border border-[#e8e6e2]">
            <Loader2 className="animate-spin h-5 w-5 text-[#1a1a1a] mr-2" />
            <span className="text-[11px] tracking-wider uppercase text-[#9a9a94]">Loading orders...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-red-100">
            <p className="text-sm text-red-600 mb-4 font-medium">{error}</p>
            <button
              onClick={refresh}
              className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] bg-transparent cursor-pointer pb-px font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content Table */}
        {!loading && !error && (
          <>
            <div className="bg-white border border-[#e8e6e2] overflow-x-auto rounded-sm shadow-sm">
              <table className="w-full min-w-[950px] border-collapse">
                <thead>
                  <tr className="border-b border-[#f0eeea] bg-[#faf9f7]">
                    {[
                      "Order",
                      "Customer",
                      "Type",
                      "Amount",
                      "Order Status",
                      "Payment Status",
                      "Rental Status",
                      "",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-semibold ${
                          i === 7 ? "text-center w-10" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f2ee]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-[12px] text-[#9a9a94]">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <OrderRow
                        key={o.id}
                        order={o}
                        onFlagChange={handleFlagChange}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border border-[#e8e6e2] border-t-0 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="relative inline-flex items-center rounded-md border border-[#e8e6e2] bg-white px-4 py-2 text-xs font-medium text-[#1a1a1a] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="relative ml-3 inline-flex items-center rounded-md border border-[#e8e6e2] bg-white px-4 py-2 text-xs font-medium text-[#1a1a1a] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] text-[#888]">
                      Page <span className="font-medium text-[#1a1a1a]">{currentPage}</span> of{" "}
                      <span className="font-medium text-[#1a1a1a]">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px" aria-label="Pagination">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="relative inline-flex items-center px-3 py-2 text-[11px] font-medium text-[#888] hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-3 py-2 text-[11px] font-medium transition-colors border-none cursor-pointer bg-transparent ${
                              currentPage === pageNum
                                ? "text-[#1a1a1a] font-bold border-b border-[#1a1a1a]"
                                : "text-[#888] hover:text-[#1a1a1a]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="relative inline-flex items-center px-3 py-2 text-[11px] font-medium text-[#888] hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-[#bbb] mt-3">
              Showing {shownCountStart}–{shownCountEnd} of {totalCount} orders
            </p>
          </>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </AdminLayout>
  );
}