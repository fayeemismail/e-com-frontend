"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { cartService, CartItemInput, CartValidationResponse, CartValidationItem } from "@/lib/api/cart.service";
import SessionModal from "@/components/common/SessionModal";
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
      itemTotal,
      itemDepositTotal,
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
    errors.push("Your cart is empty");
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
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalSecurityDeposits: parseFloat(totalSecurityDeposits.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    },
    isValid,
    errors,
  };
}

interface CartContextType {
  cart: CartValidationResponse | null;
  cartCount: number;
  loading: boolean;
  sessionEmail: string | null;
  showSessionModal: boolean;
  isAddingToCart: boolean;
  isSyncing: boolean;
  toast: { visible: boolean; message: string } | null;
  addToCart: (item: CartItemInput) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  initializeSession: (email: string) => Promise<void>;
  clearSession: () => Promise<void>;
  setShowSessionModal: (open: boolean) => void;
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
  const [toast, setToast] = useState<{ visible: boolean; message: string } | null>(null);

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
        setLoading(false);
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
        // Run asynchronously without blocking session completion
        executeAddToCart(pendingItem);
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
      showNotification("Signed out of guest session.");
    }
  };

  // Helper: Triggers a clean floating toast notification
  const showNotification = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Core Add to Cart flow
  const executeAddToCart = async (item: CartItemInput) => {
    try {
      setIsAddingToCart(true);
      const res = await cartService.addToCart(item);
      showNotification(`Added item to your bag (${res.itemCount} items).`);
      await loadCartData();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      if (err instanceof ApiError && err.status === 401) {
        setPendingItem(item);
        setShowSessionModal(true);
      } else {
        showNotification(err instanceof Error ? err.message : "Failed to add item.");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const addToCart = async (item: CartItemInput) => {
    // If no session exists, prompt email sign-in first
    if (!sessionEmail) {
      setPendingItem(item);
      setShowSessionModal(true);
      return;
    }
    await executeAddToCart(item);
  };

  // Remove item from cart
  const removeFromCart = async (sku: string) => {
    if (!cart) return;

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
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      if (seq === requestSequenceRef.current) {
        setCart(rollbackCart);
        setCartCount(rollbackCart.items.reduce((sum, item) => sum + item.quantity, 0));
        showNotification("Failed to remove item.");
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

    const targetItem = cart.items.find((item) => item.sku === sku);
    if (!targetItem) return;

    if (quantity > targetItem.availableStock) {
      showNotification(`Cannot exceed available stock of ${targetItem.availableStock}.`);
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
        console.error("Failed to update cart item quantity:", err);
        if (seq === requestSequenceRef.current) {
          setCart(rollbackCart);
          setCartCount(rollbackCart.items.reduce((sum, item) => sum + item.quantity, 0));
          showNotification(err instanceof Error ? err.message : "Failed to update quantity.");
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

      {/* Premium Toast Notification Thingy */}
      {toast && toast.visible && (
        <div className="fixed bottom-6 right-6 z-120 bg-[#1a1a1a] text-white border border-[#333] px-5 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-[4px] flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c4a882"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[12px] tracking-[0.04em] font-light">{toast.message}</span>
        </div>
      )}

      {/* SlideIn CSS animation keyframe injected directly */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) translateY(0);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
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
