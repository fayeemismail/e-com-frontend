"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SecondBarLayout = "spread" | "classic";
export type ProductCardStyle =
  | "corporate"
  | "minimalist"
  | "structured"
  | "floating"
  | "architectural"
  | "studio"
  | "matrix"
  | "classic";

interface DesignSettingsContextType {
  isDevMode: boolean;
  setIsDevMode: (val: boolean) => void;
  secondBarLayout: SecondBarLayout;
  setSecondBarLayout: (layout: SecondBarLayout) => void;
  cardStyle: ProductCardStyle;
  setCardStyle: (style: ProductCardStyle) => void;
  showInlineSwitchers: boolean;
  setShowInlineSwitchers: (val: boolean) => void;
  exitDevMode: () => void;
}

const DesignSettingsContext = createContext<DesignSettingsContextType | undefined>(undefined);

export function DesignSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [secondBarLayout, setSecondBarLayoutState] = useState<SecondBarLayout>("spread");
  const [cardStyle, setCardStyleState] = useState<ProductCardStyle>("corporate");
  const [showInlineSwitchers, setShowInlineSwitchersState] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL parameters for secret trigger (?dev=true, ?dev=admin, ?preview=true, ?preview=admin)
    const params = new URLSearchParams(window.location.search);
    const devParam = params.get("dev")?.toLowerCase();
    const previewParam = params.get("preview")?.toLowerCase();

    if (
      devParam === "true" ||
      devParam === "admin" ||
      previewParam === "true" ||
      previewParam === "admin"
    ) {
      setIsDevMode(true);
      localStorage.setItem("officecares_dev_mode", "true");
    } else if (devParam === "false" || previewParam === "false") {
      setIsDevMode(false);
      localStorage.removeItem("officecares_dev_mode");
    } else {
      const storedDev = localStorage.getItem("officecares_dev_mode");
      if (storedDev === "true") {
        setIsDevMode(true);
      }
    }

    // 2. Load saved preferences from localStorage
    const savedNavbar = localStorage.getItem("officecares_second_bar_layout") as SecondBarLayout | null;
    if (savedNavbar === "spread" || savedNavbar === "classic") {
      setSecondBarLayoutState(savedNavbar);
    }

    const savedCardStyle = localStorage.getItem("officecares_card_style") as ProductCardStyle | null;
    const validStyles: ProductCardStyle[] = [
      "corporate",
      "minimalist",
      "structured",
      "floating",
      "architectural",
      "studio",
      "matrix",
      "classic",
    ];
    if (savedCardStyle && validStyles.includes(savedCardStyle)) {
      setCardStyleState(savedCardStyle);
    }

    const savedInline = localStorage.getItem("officecares_show_inline_switchers");
    if (savedInline === "true") {
      setShowInlineSwitchersState(true);
    }

    // 3. Secret keyboard shortcut toggle: Ctrl + Shift + D (or Cmd + Shift + D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        setIsDevMode((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem("officecares_dev_mode", "true");
          } else {
            localStorage.removeItem("officecares_dev_mode");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setSecondBarLayout = (layout: SecondBarLayout) => {
    setSecondBarLayoutState(layout);
    if (typeof window !== "undefined") {
      localStorage.setItem("officecares_second_bar_layout", layout);
    }
  };

  const setCardStyle = (style: ProductCardStyle) => {
    setCardStyleState(style);
    if (typeof window !== "undefined") {
      localStorage.setItem("officecares_card_style", style);
    }
  };

  const setShowInlineSwitchers = (val: boolean) => {
    setShowInlineSwitchersState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("officecares_show_inline_switchers", val ? "true" : "false");
    }
  };

  const exitDevMode = () => {
    setIsDevMode(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("officecares_dev_mode");
    }
  };

  return (
    <DesignSettingsContext.Provider
      value={{
        isDevMode,
        setIsDevMode,
        secondBarLayout,
        setSecondBarLayout,
        cardStyle,
        setCardStyle,
        showInlineSwitchers,
        setShowInlineSwitchers,
        exitDevMode,
      }}
    >
      {children}
    </DesignSettingsContext.Provider>
  );
}

export function useDesignSettings() {
  const context = useContext(DesignSettingsContext);
  if (!context) {
    throw new Error("useDesignSettings must be used within a DesignSettingsProvider");
  }
  return context;
}
