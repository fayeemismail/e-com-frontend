"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  PackageCheck,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────

type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";

interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  payment: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  status: OrderStatus;
  address: string;
}

// ── Dummy orders ──────────────────────────────────────────────────

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ORD-2841", customer: "Amara Singh",    email: "amara@example.com", date: "28 Jun 2025",
    items: [{ name: "Hee Lounge Chair", qty: 1, price: 420 }],
    total: 420, payment: "Card", paymentStatus: "Paid", status: "Delivered",
    address: "12 Park Lane, Mumbai, MH 400001, India",
  },
  {
    id: "ORD-2840", customer: "Leo Ferreira",   email: "leo@example.com", date: "27 Jun 2025",
    items: [{ name: "Arc Floor Lamp", qty: 1, price: 185 }],
    total: 185, payment: "UPI", paymentStatus: "Paid", status: "Shipped",
    address: "5 Sunset Ave, Bangalore, KA 560001, India",
  },
  {
    id: "ORD-2839", customer: "Nadia Okafor",   email: "nadia@example.com", date: "27 Jun 2025",
    items: [{ name: "Linen Sofa", qty: 1, price: 1290 }],
    total: 1290, payment: "COD", paymentStatus: "Pending", status: "Processing",
    address: "88 Rose Street, Kozhikode, KL 673001, India",
  },
  {
    id: "ORD-2838", customer: "James Whitmore", email: "james@example.com", date: "26 Jun 2025",
    items: [{ name: "Marble Side Table", qty: 1, price: 310 }],
    total: 310, payment: "Card", paymentStatus: "Paid", status: "Pending",
    address: "3 Oakwood Drive, Chennai, TN 600001, India",
  },
  {
    id: "ORD-2837", customer: "Priya Nair",     email: "priya@example.com", date: "26 Jun 2025",
    items: [{ name: "Woven Pendant Light", qty: 2, price: 260 }],
    total: 520, payment: "Card", paymentStatus: "Refunded", status: "Cancelled",
    address: "21 Hill View, Kochi, KL 682001, India",
  },
  {
    id: "ORD-2836", customer: "Kenji Tanaka",   email: "kenji@example.com", date: "25 Jun 2025",
    items: [{ name: "Walnut Coffee Table", qty: 1, price: 580 }],
    total: 580, payment: "Card", paymentStatus: "Paid", status: "Delivered",
    address: "14 Maple Road, Hyderabad, TS 500001, India",
  },
  {
    id: "ORD-2835", customer: "Sofia Mendes",   email: "sofia@example.com", date: "25 Jun 2025",
    items: [{ name: "Bouclé Accent Chair", qty: 1, price: 490 }, { name: "Ceramic Table Lamp", qty: 1, price: 145 }],
    total: 635, payment: "UPI", paymentStatus: "Paid", status: "Confirmed",
    address: "7 Marine Drive, Delhi, DL 110001, India",
  },
  {
    id: "ORD-2834", customer: "Ethan Brooks",   email: "ethan@example.com", date: "24 Jun 2025",
    items: [{ name: "Scandinavian Desk", qty: 1, price: 860 }],
    total: 860, payment: "Card", paymentStatus: "Paid", status: "Processing",
    address: "32 Baker Street, Pune, MH 411001, India",
  },
];

// ── Status config ─────────────────────────────────────────────────

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:    "text-amber-600 bg-amber-50 border-amber-200",
  Confirmed:  "text-blue-600 bg-blue-50 border-blue-200",
  Processing: "text-violet-600 bg-violet-50 border-violet-200",
  Shipped:    "text-indigo-600 bg-indigo-50 border-indigo-200",
  Delivered:  "text-green-600 bg-green-50 border-green-200",
  Cancelled:  "text-red-500 bg-red-50 border-red-200",
  Refunded:   "text-gray-500 bg-gray-50 border-gray-200",
};

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  Pending:    ["Confirmed", "Cancelled"],
  Confirmed:  ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped:    ["Delivered"],
  Delivered:  ["Refunded"],
  Cancelled:  [],
  Refunded:   [],
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  Confirmed:  <CheckCircle2 size={12} />,
  Processing: <PackageCheck size={12} />,
  Shipped:    <Truck size={12} />,
  Delivered:  <CheckCircle2 size={12} />,
  Cancelled:  <XCircle size={12} />,
  Refunded:   <RotateCcw size={12} />,
};

const ACTION_STYLES: Record<string, string> = {
  Confirmed:  "bg-blue-600 hover:bg-blue-700 text-white",
  Processing: "bg-violet-600 hover:bg-violet-700 text-white",
  Shipped:    "bg-indigo-600 hover:bg-indigo-700 text-white",
  Delivered:  "bg-green-600 hover:bg-green-700 text-white",
  Cancelled:  "bg-red-500 hover:bg-red-600 text-white",
  Refunded:   "bg-gray-400 hover:bg-gray-500 text-white",
};

const FILTERS: (OrderStatus | "All")[] = [
  "All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled",
];

// ── Order row ─────────────────────────────────────────────────────

function OrderRow({
  order,
  onStatusChange,
}: {
  order: AdminOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const actions = STATUS_FLOW[order.status];

  return (
    <>
      <tr
        className="border-b border-[#f4f2ee] hover:bg-[#faf9f7] transition-colors cursor-pointer"
        onClick={() => setExpanded((o) => !o)}
      >
        {/* Order ID */}
        <td className="px-4 py-3.5">
          <p className="text-[11px] font-mono text-[#1a1a1a] font-medium">{order.id}</p>
          <p className="text-[10px] text-[#9a9a94]">{order.date}</p>
        </td>

        {/* Customer */}
        <td className="px-4 py-3.5">
          <p className="text-[12px] text-[#1a1a1a]">{order.customer}</p>
          <p className="text-[10px] text-[#9a9a94]">{order.email}</p>
        </td>

        {/* Total */}
        <td className="px-4 py-3.5">
          <p className="text-[12px] text-[#1a1a1a] font-medium">${order.total.toFixed(2)}</p>
          <p className={`text-[10px] ${order.paymentStatus === "Paid" ? "text-green-600" : order.paymentStatus === "Refunded" ? "text-gray-500" : "text-amber-600"}`}>
            {order.paymentStatus} · {order.payment}
          </p>
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">
          <span className={`inline-block text-[9px] tracking-widest uppercase border px-2 py-0.5 font-medium ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            {actions.map((next) => (
              <button
                key={next}
                onClick={() => onStatusChange(order.id, next)}
                className={`flex items-center gap-1 text-[9px] tracking-[0.08em] uppercase px-2.5 py-1.5 border-none cursor-pointer transition-colors ${ACTION_STYLES[next] ?? "bg-[#1a1a1a] text-white hover:bg-[#333]"}`}
                title={`Mark as ${next}`}
              >
                {ACTION_ICONS[next]}
                {next}
              </button>
            ))}
            {actions.length === 0 && (
              <span className="text-[10px] text-[#bbb]">—</span>
            )}
          </div>
        </td>

        {/* Expand */}
        <td className="px-4 py-3.5 text-[#9a9a94]">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="bg-[#faf9f7] border-b border-[#f0eeea]">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              {/* Items */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-2">Items</p>
                {order.items.map((item) => (
                  <div key={item.name} className="flex justify-between mb-1">
                    <span className="text-[#1a1a1a]">{item.name} × {item.qty}</span>
                    <span className="text-[#5a5a55]">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#e8e6e2] mt-2 pt-2 flex justify-between font-medium">
                  <span className="text-[#1a1a1a]">Total</span>
                  <span className="text-[#1a1a1a]">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-2">Deliver to</p>
                <p className="text-[#5a5a55] leading-relaxed">{order.address}</p>
              </div>

              {/* Quick status change */}
              <div>
                <p className="text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] mb-2">Update Status</p>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                  className="w-full border border-[#e8e6e2] bg-white px-2 py-2 text-[11px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] cursor-pointer"
                >
                  {(["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled","Refunded"] as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleFilterChange = (newFilter: OrderStatus | "All") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filtered = orders.filter((o) => {
    return filter === "All" || o.status === filter;
  });

  const totalPages = Math.ceil(filtered.length / ordersPerPage) || 1;
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filtered.slice(startIndex, startIndex + ordersPerPage);

  const counts: Record<string, number> = {};
  orders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  const shownCountStart = filtered.length > 0 ? startIndex + 1 : 0;
  const shownCountEnd = Math.min(startIndex + ordersPerPage, filtered.length);

  return (
    <AdminLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-0.5">Management</p>
          <h1 className="text-2xl font-light font-serif text-[#1a1a1a]">Orders</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border whitespace-nowrap shrink-0 bg-transparent cursor-pointer transition-colors duration-150 ${
                  filter === f
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#888] hover:text-[#1a1a1a] hover:border-[#ddd]"
                }`}
              >
                {f}
                {f !== "All" && counts[f] ? (
                  <span className="ml-1 text-[#aaa]">({counts[f]})</span>
                ) : f === "All" ? (
                  <span className="ml-1 text-[#aaa]">({orders.length})</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e8e6e2] overflow-x-auto">
          <table className="w-full min-w-175">
            <thead>
              <tr className="border-b border-[#f0eeea]">
                {["Order", "Customer", "Amount", "Status", "Actions", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] tracking-[0.14em] uppercase text-[#9a9a94] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-[12px] text-[#9a9a94]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <OrderRow key={o.id} order={o} onStatusChange={updateStatus} />
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
                            ? "text-[#1a1a1a] font-bold"
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
          Showing {shownCountStart}–{shownCountEnd} of {filtered.length} orders
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </AdminLayout>
  );
}