import { useState, useEffect } from "react";
import { adminService } from "@/lib/api/admin.service";
import { AdminOrderMapper } from "@/lib/mappers/admin.mapper";
import { AdminOrder } from "@/types/admin/types";
import { ApiError } from "@/lib/api/api-client";

export function useAdminOrders(initialPage = 1, initialLimit = 10) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const backendStatus = filter === "all" ? undefined : filter;
        const res = await adminService.getOrders(currentPage, initialLimit, backendStatus);
        if (active) {
          const mapped = AdminOrderMapper.toAdminOrderList(res.orders);
          setOrders(mapped);
          setTotalPages(res.pagination?.totalPages || 1);
          setTotalCount(res.pagination?.total || 0);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof ApiError || err instanceof Error
              ? err.message
              : "Failed to load orders."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchOrders();
    return () => {
      active = false;
    };
  }, [currentPage, filter, initialLimit, reloadTrigger]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleFlagChange = async (
    id: string,
    updates: { orderStatus?: string; paymentStatus?: string; rentalReturnStatus?: string }
  ) => {
    try {
      await adminService.updateOrderStatus(id, updates);
      setReloadTrigger((r) => r + 1);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to update order details.";
      alert(errMsg);
    }
  };

  const refresh = () => setReloadTrigger((r) => r + 1);

  return {
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
  };
}
