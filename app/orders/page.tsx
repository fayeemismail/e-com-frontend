"use client";

import { useEffect, useState } from "react";
import { orderService, type OrderResponse } from "@/lib/api/order.service";
import { ApiError } from "@/lib/api/api-client";
import { OrderCard } from "@/components/order/OrderCard"; 
import { LoadingState, ErrorState, EmptyState } from "@/components/order/OrderStates";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .getOrders()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof ApiError || err instanceof Error
            ? err.message
            : "Failed to load orders."
        )
      )
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader orderCount={!loading && !error ? orders.length : null} />

      <div className="px-5 sm:px-8 md:px-12 py-8">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && orders.length === 0 && <EmptyState />}
        {!loading && !error && orders.length > 0 && (
          <div className="max-w-4xl space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PageHeader({ orderCount }: { orderCount: number | null }) {
  return (
    <div className="px-5 sm:px-8 md:px-12 pt-10 pb-6 border-b border-[#e8e6e2] flex items-end justify-between flex-wrap gap-3">
      <div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1.5">
          Account
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-tight text-[#1a1a1a] font-serif">
          My Orders
        </h1>
      </div>
      {orderCount !== null && orderCount > 0 && (
        <p className="text-[11px] tracking-[0.08em] text-[#9a9a94]">
          {orderCount} order{orderCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}