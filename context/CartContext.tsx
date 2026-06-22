"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService, CartItemInput, CartValidationResponse } from "@/lib/api/cart.service";
import SessionModal from "@/components/common/SessionModal";
import { ApiError } from "@/lib/api/api-client";

interface CartContextType {
  cart: CartValidationResponse | null;
  cartCount: number;
  loading: boolean;
  sessionEmail: string | null;
  showSessionModal: boolean;
  isAddingToCart: boolean;
  toast: { visible: boolean; message: string } | null;
  addToCart: (item: CartItemInput) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
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
    try {
      setLoading(true);
      await cartService.removeFromCart(sku);
      showNotification("Removed item from cart.");
      await loadCartData();
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      showNotification("Failed to remove item.");
    } finally {
      setLoading(false);
    }
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
        toast,
        addToCart,
        removeFromCart,
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
        <div className="fixed bottom-6 right-6 z-[120] bg-[#1a1a1a] text-white border border-[#333] px-5 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-[4px] flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
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
