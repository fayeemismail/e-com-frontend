"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

// ── Dummy data ────────────────────────────────────────────────────

const STATS = [
  {
    label: "Total Revenue",
    value: "₹24,830",
    change: "+12.4%",
    up: true,
    icon: DollarSign,
    sub: "vs last month",
  },
  {
    label: "Total Orders",
    value: "348",
    change: "+8.1%",
    up: true,
    icon: ShoppingBag,
    sub: "vs last month",
  },
  {
    label: "Customers",
    value: "1,204",
    change: "+5.3%",
    up: true,
    icon: Users,
    sub: "registered users",
  },
  {
    label: "Pending Orders",
    value: "17",
    change: "-2",
    up: false,
    icon: Clock,
    sub: "needs attention",
  },
];

const RECENT_ORDERS = [
  { id: "ORD-2841", customer: "Amara Singh",    total: "₹420.00", status: "Delivered", date: "Jun 28" },
  { id: "ORD-2840", customer: "Leo Ferreira",   total: "₹185.00", status: "Shipped",   date: "Jun 27" },
  { id: "ORD-2839", customer: "Nadia Okafor",   total: "₹1,290.00",status: "Processing",date: "Jun 27" },
  { id: "ORD-2838", customer: "James Whitmore", total: "₹310.00", status: "Pending",   date: "Jun 26" },
  { id: "ORD-2837", customer: "Priya Nair",     total: "₹260.00", status: "Cancelled", date: "Jun 26" },
  { id: "ORD-2836", customer: "Kenji Tanaka",   total: "₹580.00", status: "Delivered", date: "Jun 25" },
];

const TOP_PRODUCTS = [
  { name: "Linen Sofa",          category: "Seating",  sold: 42, revenue: "₹54,180" },
  { name: "Hee Lounge Chair",    category: "Seating",  sold: 38, revenue: "₹15,960" },
  { name: "Woven Pendant Light", category: "Lighting", sold: 31, revenue: "₹8,060" },
  { name: "Walnut Coffee Table", category: "Tables",   sold: 27, revenue: "₹15,660" },
  { name: "Bouclé Accent Chair", category: "Seating",  sold: 24, revenue: "₹11,760" },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "text-green-600 bg-green-50",
  Shipped:    "text-indigo-600 bg-indigo-50",
  Processing: "text-violet-600 bg-violet-50",
  Pending:    "text-amber-600 bg-amber-50",
  Cancelled:  "text-red-500 bg-red-50",
};

// ── Stat card ─────────────────────────────────────────────────────

function StatCard({ label, value, change, up, icon: Icon, sub }: typeof STATS[0]) {
  return (
    <div className="bg-white border border-[#e8e6e2] p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] tracking-[0.14em] uppercase text-[#9a9a94]">{label}</p>
        <div className="w-8 h-8 bg-[#f4f1ec] flex items-center justify-center">
          <Icon size={14} strokeWidth={1.5} className="text-[#1a1a1a]" />
        </div>
      </div>
      <p className="text-2xl font-light text-[#1a1a1a] mb-1">{value}</p>
      <div className="flex items-center gap-1.5">
        {up
          ? <TrendingUp size={11} className="text-green-500" />
          : <TrendingDown size={11} className="text-red-400" />
        }
        <span className={`text-[10px] font-medium ${up ? "text-green-600" : "text-red-500"}`}>{change}</span>
        <span className="text-[10px] text-[#bbb]">{sub}</span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-0.5">Overview</p>
          <h1 className="text-2xl font-light font-serif text-[#1a1a1a]">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Two-col: recent orders + top products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white border border-[#e8e6e2]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0eeea]">
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a]">Recent Orders</p>
              <Link href="/admin/orders" className="text-[10px] tracking-widest uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors no-underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-[#f4f2ee]">
              {RECENT_ORDERS.map((o) => (
                <div key={o.id} className="flex items-center px-5 py-3.5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1a1a1a] truncate">{o.customer}</p>
                    <p className="text-[10px] text-[#9a9a94] font-mono">{o.id}</p>
                  </div>
                  <p className="text-[11px] text-[#9a9a94] shrink-0">{o.date}</p>
                  <p className="text-[12px] text-[#1a1a1a] shrink-0 w-20 text-right">{o.total}</p>
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 shrink-0 font-medium ${STATUS_STYLES[o.status] ?? "text-[#5a5a55] bg-[#f4f1ec]"}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white border border-[#e8e6e2]">
            <div className="px-5 py-4 border-b border-[#f0eeea]">
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a]">Top Products</p>
            </div>
            <div className="divide-y divide-[#f4f2ee]">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center px-5 py-3.5 gap-3">
                  <span className="text-[11px] text-[#ccc] w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1a1a1a] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#9a9a94] uppercase tracking-wide">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] text-[#1a1a1a]">{p.revenue}</p>
                    <p className="text-[10px] text-[#9a9a94]">{p.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}