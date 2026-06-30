"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const tabs = ["Overview", "Orders", "Wishlist", "Settings"];

const dummyOrders = [
  { id: "ORD-4821", date: "12 Jun 2025", status: "Delivered", items: 3, total: 824, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80" },
  { id: "ORD-4733", date: "29 May 2025", status: "In Transit", items: 1, total: 195, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80" },
  { id: "ORD-4612", date: "8 Apr 2025", status: "Delivered", items: 2, total: 629, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80" },
];

const dummyWishlist = [
  { id: 1, name: "Wool Wrap Coat", price: 595, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&q=80", variant: "Camel" },
  { id: 2, name: "Tailored Wide-Leg Trousers", price: 245, image: "https://images.unsplash.com/photo-1594938298603-c8148c4a803b?w=300&q=80", variant: "Chalk" },
  { id: 3, name: "Merino Turtleneck", price: 165, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80", variant: "Stone" },
  { id: 4, name: "Structured Leather Tote", price: 420, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80", variant: "Tan" },
];

const statusColors: Record<string, string> = {
  Delivered: "text-[#5a7a5a]",
  "In Transit": "text-[#8a7a5a]",
  Processing: "text-[#9a9a94]",
};

export default function ProfilePage() {
  const router = useRouter();
  const { sessionEmail, clearSession } = useCart();
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Header */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-5 border-b border-[#e8e6e2]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">My Account</p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">Profile</h1>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-8">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#e8e6e2]">
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-light tracking-widest">
                  {sessionEmail ? sessionEmail.slice(0, 2).toUpperCase() : "GU"}
                </span>
              </div>
              <div>
                <p className="text-sm font-light font-serif text-[#1a1a1a] tracking-wide truncate max-w-[150px]" title={sessionEmail || "Guest"}>
                  {sessionEmail ? sessionEmail.split("@")[0] : "Guest User"}
                </p>
                <p className="text-[11px] text-[#9a9a94] tracking-wide">Member since 2026</p>
              </div>
            </div>

            {/* Loyalty */}
            <div className="mb-8 pb-8 border-b border-[#e8e6e2]">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-3">Loyalty Status</p>
              <p className="text-base font-light font-serif text-[#1a1a1a] mb-1">Gold Member</p>
              <p className="text-[11px] text-[#9a9a94] tracking-wide mb-3">2,480 points · $24.80 value</p>
              <div className="h-px bg-[#e8e6e2] relative">
                <div className="absolute top-0 left-0 h-px bg-[#1a1a1a]" style={{ width: "62%" }} />
              </div>
              <p className="text-[10px] text-[#9a9a94] mt-1.5 tracking-wide">520 pts to Platinum</p>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left text-[11px] tracking-[0.16em] uppercase py-2.5 px-0 border-l-2 pl-3 transition-colors duration-150 ${
                    activeTab === tab
                      ? "border-[#1a1a1a] text-[#1a1a1a]"
                      : "border-transparent text-[#9a9a94] hover:text-[#1a1a1a] hover:border-[#c5c5bf]"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={async () => {
                  await clearSession();
                  router.push("/");
                }}
                className="w-full text-left text-[11px] tracking-[0.16em] uppercase py-2.5 px-0 border-l-2 border-transparent pl-3 text-[#9a9a94] hover:text-[#c44] transition-colors mt-4 cursor-pointer"
              >
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">

            {/* OVERVIEW */}
            {activeTab === "Overview" && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-6">Overview</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                  {[
                    { label: "Total Orders", value: "12" },
                    { label: "Items Saved", value: "4" },
                    { label: "Total Spent", value: "$3,240" },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-[#e8e6e2] p-5">
                      <p className="text-xl font-light font-serif text-[#1a1a1a] mb-1">{value}</p>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-[#9a9a94]">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-4">Recent Activity</p>
                <div className="divide-y divide-[#e8e6e2]">
                  {dummyOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="py-5 flex items-center gap-5">
                      <div className="w-14 h-16 shrink-0 bg-[#f5f4f1] overflow-hidden relative">
                        <Image src={order.image} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-light text-[#1a1a1a] tracking-wide mb-0.5">{order.id}</p>
                        <p className="text-[11px] text-[#9a9a94] tracking-wide">{order.date} · {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] tracking-[0.12em] uppercase ${statusColors[order.status]}`}>{order.status}</p>
                        <p className="text-xs text-[#1a1a1a] mt-0.5">${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab("Orders")} className="mt-4 text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] hover:text-[#1a1a1a] transition-colors">
                  View all orders →
                </button>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "Orders" && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-6">Order History</p>
                <div className="divide-y divide-[#e8e6e2]">
                  {dummyOrders.map((order) => (
                    <div key={order.id} className="py-6 flex items-center gap-5">
                      <div className="w-16 h-20 shrink-0 bg-[#f5f4f1] overflow-hidden relative">
                        <Image src={order.image} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light font-serif text-[#1a1a1a] mb-1">{order.id}</p>
                        <p className="text-[11px] text-[#9a9a94] tracking-wide mb-2">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                        <p className={`text-[10px] tracking-[0.12em] uppercase ${statusColors[order.status]}`}>{order.status}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-light text-[#1a1a1a] mb-3">${order.total}</p>
                        <button className="text-[10px] tracking-[0.14em] uppercase border border-[#e8e6e2] px-3 py-1.5 text-[#9a9a94] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === "Wishlist" && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-6">Saved Items</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {dummyWishlist.map((item) => (
                    <div key={item.id} className="group">
                      <div className="aspect-3/4 bg-[#f5f4f1] overflow-hidden mb-3 relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-3 right-3 w-7 h-7 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#9a9a94] hover:text-[#c44]">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                      <p className="text-xs font-light font-serif text-[#1a1a1a] tracking-wide mb-0.5">{item.name}</p>
                      <p className="text-[10px] text-[#9a9a94] tracking-widest uppercase mb-1">{item.variant}</p>
                      <p className="text-xs text-[#1a1a1a]">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "Settings" && (
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-6">Account Settings</p>

                {/* Personal Info */}
                <div className="mb-10">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Personal Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { label: "First Name", value: "Amara" },
                      { label: "Last Name", value: "Singh" },
                      { label: "Email", value: "amara.singh@email.com" },
                      { label: "Phone", value: "+91 98765 43210" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input defaultValue={value} className="w-full border border-[#e8e6e2] px-3 py-2.5 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="text-[11px] tracking-[0.16em] uppercase bg-[#1a1a1a] text-white px-6 py-2.5 hover:bg-[#333] transition-colors">
                    Save Changes
                  </button>
                </div>

                {/* Address */}
                <div className="mb-10">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Shipping Address</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { label: "Address Line 1", value: "42 Prestige Gardens", full: true },
                      { label: "Address Line 2", value: "Apt 7B", full: true },
                      { label: "City", value: "Mumbai" },
                      { label: "Postal Code", value: "400001" },
                    ].map(({ label, value, full }) => (
                      <div key={label} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input defaultValue={value} className="w-full border border-[#e8e6e2] px-3 py-2.5 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="text-[11px] tracking-[0.16em] uppercase bg-[#1a1a1a] text-white px-6 py-2.5 hover:bg-[#333] transition-colors">
                    Save Address
                  </button>
                </div>

                {/* Password */}
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-4 pb-3 border-b border-[#e8e6e2]">Password</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {["Current Password", "New Password", "Confirm Password"].map((label) => (
                      <div key={label} className={label === "Current Password" ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">{label}</label>
                        <input type="password" placeholder="••••••••" className="w-full border border-[#e8e6e2] px-3 py-2.5 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#c5c5bf]" />
                      </div>
                    ))}
                  </div>
                  <button className="text-[11px] tracking-[0.16em] uppercase bg-[#1a1a1a] text-white px-6 py-2.5 hover:bg-[#333] transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}