"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Check, AlertCircle, Info, X } from "lucide-react";

export interface ToastData {
  id: string;
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  action?: {
    label: string;
    href: string;
  };
  duration?: number;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = toast?.duration || 2600;
  const type = toast?.type || "success";

  const triggerClose = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 160);
  };

  useEffect(() => {
    if (!toast || !toast.visible) {
      setIsExiting(false);
      return;
    }

    setIsExiting(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(triggerClose, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast?.id, toast?.visible, duration]);

  if (!toast || !toast.visible) return null;

  const renderIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" strokeWidth={2.25} />;
      case "info":
        return <Info className="w-4 h-4 text-[#00a6e0] shrink-0" strokeWidth={2.25} />;
      case "success":
      default:
        return <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.25} />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[120] pointer-events-none"
    >
      <div
        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a1f3d] text-white border border-[#1e3a5f] shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-[13px] font-normal tracking-wide ${
          isExiting ? "toast-exit" : "toast-enter"
        }`}
      >
        {renderIcon()}

        <span className="text-slate-100 whitespace-nowrap">{toast.message}</span>

        {toast.action && (
          <Link
            href={toast.action.href}
            onClick={triggerClose}
            className="text-[#00a6e0] hover:text-[#38bdf8] font-medium text-[12px] ml-1 transition-colors underline underline-offset-2"
          >
            {toast.action.label}
          </Link>
        )}

        <button
          type="button"
          onClick={triggerClose}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors ml-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
