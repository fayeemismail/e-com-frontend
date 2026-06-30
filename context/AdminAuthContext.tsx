"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminService } from "@/lib/api/admin.service";
import { ApiError } from "@/lib/api/api-client";

interface AdminAuthContextType {
  adminEmail: string | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verify session on mount
  useEffect(() => {
    let active = true;
    async function verifySession() {
      try {
        const response = await adminService.getMe();
        if (active) {
          setAdminEmail(response.email);
          setIsAdminAuthenticated(true);
        }
      } catch {
        if (active) {
          setAdminEmail(null);
          setIsAdminAuthenticated(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    verifySession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.login(email, password);
      setAdminEmail(response.email);
      setIsAdminAuthenticated(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Invalid credentials";
      setError(message);
      setIsAdminAuthenticated(false);
      setAdminEmail(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminService.logout();
    } catch (err) {
      console.error("Failed to call logout API, clearing state locally", err);
    } finally {
      setAdminEmail(null);
      setIsAdminAuthenticated(false);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminEmail,
        isAdminAuthenticated,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
