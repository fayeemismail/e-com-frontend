"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { cartService, CartItemInput, CartValidationResponse, CartValidationItem } from "@/lib/api/cart.service";
import SessionModal from "@/components/common/SessionModal";
import Toast, { ToastData } from "@/components/common/Toast";
import { ApiError } from "@/lib/api/api-client";

// Pure client-side helper to recalculate cart totals matching backend business rules
function recalculateCartTotals(items: CartValidationItem[]): CartValidationResponse {
  let subtotal = 0;
  let totalSecurityDeposits = 0;

  const updatedItems = items.map((item) => {
    let itemTotal = 0;
    let itemDepositTotal = 0;

    if (item.transactionType === "buy") {
      itemTotal = item.price * item.quantity;
    } else if (item.transactionType === "rent") {
      const duration = item.rentalDurationDays || 1;
      itemTotal = item.price * duration * item.quantity;
      itemDepositTotal = (item.securityDeposit || 0) * item.quantity;
    }

    subtotal += itemTotal;
    totalSecurityDeposits += itemDepositTotal;

    return {
      ...item,
      itemTotal: Math.round(itemTotal),
      itemDepositTotal: Math.round(itemDepositTotal),
      inStock: item.availableStock >= item.quantity,
    };
  });

  const TAX_RATE = 0.0;
  const SHIPPING_FLAT_RATE = 0.0;
  const FREE_SHIPPING_THRESHOLD = 0.0;

  const tax = subtotal * TAX_RATE;
  const shippingCost = (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_FLAT_RATE;
  const totalAmount = subtotal + totalSecurityDeposits + tax + shippingCost;

  const errors: string[] = [];
  const isValid = updatedItems.every((item) => item.inStock);
  if (updatedItems.length === 0) {
    errors.push("Your requisition cart is empty");
  } else {
    updatedItems.forEach((item) => {
      if (!item.inStock) {
        errors.push(`Insufficient stock for ${item.name}. Available: ${item.availableStock}, Requested: ${item.quantity}`);
      }
    });
  }

  return {
    items: updatedItems,
    summary: {
      subtotal: Math.round(subtotal),
      totalSecurityDeposits: Math.round(totalSecurityDeposits),
      tax: Math.round(tax),
      shippingCost: Math.round(shippingCost),
      totalAmount: Math.round(totalAmount),
    },
    isValid,
    errors,
  };
}

export type ToastNotification = ToastData;

interface CartContextType {
  cart: CartValidationResponse | null;
  cartCount: number;
  loading: boolean;
  sessionEmail: string | null;
  showSessionModal: boolean;
  isAddingToCart: boolean;
  isSyncing: boolean;
  toast: ToastNotification | null;
  addToCart: (item: CartItemInput) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  initializeSession: (email: string) => Promise<void>;
  clearSession: () => Promise<void>;
  setShowSessionModal: (open: boolean) => void;
  refreshCart: () => Promise<void>;
  showNotification: (
    message: string,
    options?: {
      type?: "success" | "error" | "info";
      action?: { label: string; href: string };
      duration?: number;
    }
  ) => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartValidationResponse | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  const lastSyncedCartRef = useRef<CartValidationResponse | null>(null);
  const debounceTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const requestSequenceRef = useRef<number>(0);
  
  // Pending action buffer to auto-retry after log-in
  const [pendingItem, setPendingItem] = useState<CartItemInput | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const handleLocalSignOut = () => {
    setCart(null);
    setCartCount(0);
    setSessionEmail(null);
    localStorage.removeItem("cart_email");
  };

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await cartService.validateCart();
      setCart(data);
      lastSyncedCartRef.current = data;
      const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.warn("Failed to load or validate cart data:", err);
      // Clean up session if backend rejects request as unauthorized (401)
      if (err instanceof ApiError && err.status === 401) {
        handleLocalSignOut();
      }
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    let active = true;
    const init = async () => {
      // Defer execution to avoid synchronous setState inside the effect body
      await Promise.resolve();
      if (!active) return;

      const email = localStorage.getItem("cart_email");
      if (email) {
        setSessionEmail(email);
        await loadCartData();
      } else {
        // Silently pre-initialize a guest session in background for instant add-to-cart clicks
        try {
          const guestEmail = `guest_${Date.now()}@officecare.local`;
          await cartService.createSession(guestEmail);
          if (active) {
            setSessionEmail(guestEmail);
            localStorage.setItem("cart_email", guestEmail);
          }
        } catch (e) {
          console.warn("Guest session pre-init skipped:", e);
        } finally {
          if (active) setLoading(false);
        }
      }
    };
    init();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Initialize Session
  const initializeSession = async (email: string) => {
    try {
      await cartService.createSession(email);
      setSessionEmail(email);
      localStorage.setItem("cart_email", email);
      
      // Load cart immediately after session is set
      const data = await cartService.validateCart();
      setCart(data);
      lastSyncedCartRef.current = data;
      const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);

      // Auto-retry adding the pending item if one exists
      if (pendingItem) {
        addToCart(pendingItem);
        setPendingItem(null);
      }
    } catch (err) {
      console.error("Failed to initialize cart session:", err);
      throw err;
    }
  };

  // 3. Clear Session
  const clearSession = async () => {
    try {
      await cartService.clearSession();
    } catch (err) {
      console.error("Failed to clear backend cart session:", err);
    } finally {
      handleLocalSignOut();
      showNotification("Signed out", { type: "info" });
    }
  };

  // Helper: Triggers a clean floating toast notification
  const showNotification = (
    message: string,
    options?: {
      type?: "success" | "error" | "info";
      action?: { label: string; href: string };
      duration?: number;
    }
  ) => {
    setToast({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visible: true,
      message,
      type: options?.type || "success",
      action: options?.action,
      duration: options?.duration || 2600,
    });
  };

  // Pure Backend-Driven Add to Cart (Option A: waits strictly for backend confirmation)
  const addToCart = async (item: CartItemInput) => {
    try {
      setIsAddingToCart(true);

      // Ensure active session cookie exists before posting item
      let activeEmail = sessionEmail || localStorage.getItem("cart_email");
      if (!activeEmail) {
        activeEmail = `guest_${Date.now()}@officecare.local`;
        await cartService.createSession(activeEmail);
        setSessionEmail(activeEmail);
        localStorage.setItem("cart_email", activeEmail);
      }

      // Send to backend MongoDB database
      await cartService.addToCart(item);

      // Fetch verified, complete cart state from backend database
      const freshData = await cartService.validateCart();
      setCart(freshData);
      lastSyncedCartRef.current = freshData;
      setCartCount(freshData.items.reduce((sum, i) => sum + i.quantity, 0));

      // ONLY on confirmed backend success: show toast notification
      showNotification("Added to cart", {
        type: "success",
        action: { label: "View", href: "/cart" },
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      showNotification(err instanceof Error ? err.message : "Failed to add item", {
        type: "error",
      });
      throw err;
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (sku: string) => {
    if (!cart) return;

    // Immediately cancel any pending debounced update for this SKU
    if (debounceTimeoutsRef.current[sku]) {
      clearTimeout(debounceTimeoutsRef.current[sku]);
      delete debounceTimeoutsRef.current[sku];
    }

    const targetItem = cart.items.find((item) => item.sku === sku);
    if (!targetItem) return;

    // Increment request sequence to drop older out-of-order backend responses
    const seq = ++requestSequenceRef.current;
    const rollbackCart = lastSyncedCartRef.current || cart;

    // Optimistic Update
    const updatedItems = cart.items.filter((item) => item.sku !== sku);
    const optimisticCart = recalculateCartTotals(updatedItems);
    setCart(optimisticCart);
    setCartCount(optimisticCart.items.reduce((sum, item) => sum + item.quantity, 0));

    setIsSyncing(true);

    try {
      await cartService.removeFromCart(sku);
      const freshData = await cartService.validateCart();
      
      if (seq === requestSequenceRef.current) {
        setCart(freshData);
        lastSyncedCartRef.current = freshData;
        setCartCount(freshData.items.reduce((sum, item) => sum + item.quantity, 0));
        showNotification("Removed from cart", {
          type: "info",
        });
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      if (seq === requestSequenceRef.current) {
        setCart(rollbackCart);
        setCartCount(rollbackCart.items.reduce((sum, item) => sum + item.quantity, 0));
        showNotification("Failed to remove item", {
          type: "error",
        });
      }
    } finally {
      // If there are no other pending debounced syncs, set syncing to false
      const hasPendingSyncs = Object.keys(debounceTimeoutsRef.current).length > 0;
      if (!hasPendingSyncs) {
        setIsSyncing(false);
      }
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (sku: string, quantity: number) => {
    if (!cart) return;

    // If quantity is reduced to 0 or less, immediately delegate to removeFromCart
    if (quantity <= 0) {
      await removeFromCart(sku);
      return;
    }

    const targetItem = cart.items.find((item) => item.sku === sku);
    if (!targetItem) return;

    if (quantity > targetItem.availableStock) {
      showNotification(`Max available stock is ${targetItem.availableStock}`, {
        type: "error",
      });
      return;
    }

    // Increment request sequence to drop older out-of-order backend responses
    const seq = ++requestSequenceRef.current;
    const rollbackCart = lastSyncedCartRef.current || cart;

    // Optimistic Update
    const updatedItems = cart.items.map((item) =>
      item.sku === sku ? { ...item, quantity } : item
    );
    const optimisticCart = recalculateCartTotals(updatedItems);
    setCart(optimisticCart);
    setCartCount(optimisticCart.items.reduce((sum, item) => sum + item.quantity, 0));

    setIsSyncing(true);

    // Debounce the backend sync call
    if (debounceTimeoutsRef.current[sku]) {
      clearTimeout(debounceTimeoutsRef.current[sku]);
    }

    debounceTimeoutsRef.current[sku] = setTimeout(async () => {
      try {
        await cartService.updateCartItemQuantity(sku, quantity);
        const freshData = await cartService.validateCart();
        
        if (seq === requestSequenceRef.current) {
          setCart(freshData);
          lastSyncedCartRef.current = freshData;
          setCartCount(freshData.items.reduce((sum, item) => sum + item.quantity, 0));
        }
      } catch (err) {
        console.warn("Handled cart update error:", err);
        if (seq === requestSequenceRef.current) {
          // If cart was not found or deleted concurrently, refresh state from server without crashing
          if (err instanceof ApiError && (err.status === 404 || err.message?.toLowerCase().includes("cart not found"))) {
            await loadCartData();
            return;
          }
          setCart(rollbackCart);
          setCartCount(rollbackCart.items.reduce((sum, item) => sum + item.quantity, 0));
          showNotification(err instanceof Error ? err.message : "Failed to update quantity", {
            type: "error",
          });
        }
      } finally {
        delete debounceTimeoutsRef.current[sku];
        const hasPendingSyncs = Object.keys(debounceTimeoutsRef.current).length > 0;
        if (!hasPendingSyncs) {
          setIsSyncing(false);
        }
      }
    }, 400); // 400ms debounce window
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        sessionEmail,
        showSessionModal,
        isAddingToCart,
        isSyncing,
        toast,
        addToCart,
        removeFromCart,
        updateQuantity,
        initializeSession,
        clearSession,
        setShowSessionModal,
        refreshCart: loadCartData,
        showNotification,
      }}
    >
      {children}

      {/* Guest Session Prompt Modal */}
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => {
          setShowSessionModal(false);
          setPendingItem(null); // Cancel pending items on modal close
        }}
        onSubmit={initializeSession}
      />

      {/* Polished Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
