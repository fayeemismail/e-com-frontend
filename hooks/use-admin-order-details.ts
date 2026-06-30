import { useState, useEffect } from "react";
import { adminService } from "@/lib/api/admin.service";
import { AdminOrderMapper } from "@/lib/mappers/admin.mapper";
import { AdminOrder } from "@/types/admin/types";
import { ApiError } from "@/lib/api/api-client";

export function useAdminOrderDetails(orderId: string) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchOrder() {
      if (!orderId) return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getOrder(orderId);
        if (active) {
          const mapped = AdminOrderMapper.toAdminOrder(res);
          setOrder(mapped);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof ApiError || err instanceof Error
              ? err.message
              : "Failed to load order details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchOrder();
    return () => {
      active = false;
    };
  }, [orderId, reloadTrigger]);

  const handleFlagChange = async (
    updates: { orderStatus?: string; paymentStatus?: string; rentalReturnStatus?: string }
  ) => {
    if (!orderId) return;
    try {
      await adminService.updateOrderStatus(orderId, updates);
      setReloadTrigger((r) => r + 1);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to update order details.";
      alert(errMsg);
    }
  };

  const refresh = () => setReloadTrigger((r) => r + 1);

  return {
    order,
    loading,
    error,
    handleFlagChange,
    refresh,
  };
}
