"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  Check,
  Lock,
  LayoutTemplate,
  Sparkles,
  Briefcase,
  Zap,
  LayoutGrid,
  Aperture,
  Table,
  PanelLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useDesignSettings,
  ProductCardStyle,
  SecondBarLayout,
} from "@/context/DesignSettingsContext";

interface CardStyleOption {
  id: ProductCardStyle;
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  badge?: string;
}

const cardStyleOptions: CardStyleOption[] = [
  {
    id: "corporate",
    name: "Corporate Clean",
    desc: "Unboxed hairline metadata and sleek specs",
    icon: Briefcase,
    badge: "Default",
  },
  {
    id: "floating",
    name: "Floating Action",
    desc: "Elevating card with floating cart trigger",
    icon: Zap,
  },
  {
    id: "studio",
    name: "Borderless Studio",
    desc: "Zero borders, airy Scandinavian canvas",
    icon: Aperture,
  },
  {
    id: "matrix",
    name: "Quick-Order Matrix",
    desc: "Dense enterprise procurement line-items table",
    icon: Table,
    badge: "B2B",
  },
  {
    id: "minimalist",
    name: "Minimalist Retail",
    desc: "Soft rounded card with editorial typography",
    icon: Sparkles,
  },
  {
    id: "structured",
    name: "Structured Catalog",
    desc: "Clear specification tags & high-contrast container",
    icon: LayoutGrid,
  },
  {
    id: "architectural",
    name: "Architectural Grid",
    desc: "Seamless continuous grid with zero card gaps",
    icon: PanelLeft,
  },
  {
    id: "classic",
    name: "Classic Split",
    desc: "Original horizontal card split layout",
    icon: LayoutTemplate,
  },
];

export default function DesignSettingsPanel() {
  const {
    isDevMode,
    secondBarLayout,
    setSecondBarLayout,
    cardStyle,
    setCardStyle,
    showInlineSwitchers,
    setShowInlineSwitchers,
    exitDevMode,
  } = useDesignSettings();

  const [isOpen, setIsOpen] = useState(false);

  // If dev mode is NOT active, completely hide everything from public visitors
  if (!isDevMode) return null;

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Design & Layout Settings"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0a1f3d] text-white shadow-2xl hover:bg-[#00a6e0] active:scale-95 transition-all border border-white/20 cursor-pointer select-none group"
          >
            <div className="w-5 h-5 rounded-full bg-[#00a6e0] group-hover:bg-white text-white group-hover:text-[#0a1f3d] flex items-center justify-center transition-colors">
              <SlidersHorizontal size={12} strokeWidth={2.4} />
            </div>
            <span className="text-[12px] font-semibold tracking-wide">Design Settings</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/15 text-white/90">
              Dev
            </span>
          </button>
        ) : null}
      </div>

      {/* Floating Settings Drawer / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Design Settings Modal"
          className="fixed bottom-5 right-5 z-50 w-[340px] sm:w-[380px] max-h-[88vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_25px_70px_-15px_rgba(10,31,61,0.35),0_0_0_1px_rgba(10,31,61,0.08)] border border-slate-200/90 overflow-hidden animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1f3d] text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#00a6e0] flex items-center justify-center">
                <SlidersHorizontal size={13} strokeWidth={2.4} className="text-white" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold leading-tight m-0 text-white">
                  Design & Layout Settings
                </h3>
                <p className="text-[10.5px] text-white/70 m-0">
                  Hidden from public visitors (?dev=true)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Close settings"
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
            {/* 1. Navbar Layout Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Secondary Navbar Layout
                </span>
                <span className="text-[11px] font-medium text-[#00a6e0]">
                  {secondBarLayout === "spread" ? "Spread" : "Dropdown"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setSecondBarLayout("spread")}
                  className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer border-none ${
                    secondBarLayout === "spread"
                      ? "bg-white text-[#0a1f3d] shadow-sm font-semibold"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-[12px] font-semibold">Spread Chips</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Direct category pills across bar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSecondBarLayout("classic")}
                  className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer border-none ${
                    secondBarLayout === "classic"
                      ? "bg-white text-[#0a1f3d] shadow-sm font-semibold"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-[12px] font-semibold">Browse Dropdown</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Dropdown menu + centered links
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Featured Product Card Design */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Featured Product Layout
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {cardStyleOptions.length} layouts
                </span>
              </div>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {cardStyleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = cardStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCardStyle(opt.id)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#0a1f3d]/5 border-[#0a1f3d]/25 shadow-2xs"
                          : "bg-white hover:bg-slate-50 border-slate-200/60"
                      }`}
                    >
                      <div
                        className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#0a1f3d] text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={14} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-[12px] m-0 truncate leading-snug ${
                              isSelected ? "font-bold text-[#0a1f3d]" : "font-semibold text-slate-800"
                            }`}
                          >
                            {opt.name}
                          </p>
                          {opt.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#00a6e0]/15 text-[#00a6e0] uppercase shrink-0">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-500 m-0 truncate font-normal">
                          {opt.desc}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#00a6e0] text-white flex items-center justify-center">
                            <Check size={12} strokeWidth={2.8} />
                          </div>
                        ) : (
                          <ChevronRight size={13} className="text-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Inline Switcher Visibility Option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showInlineSwitchers ? (
                  <Eye size={14} className="text-[#00a6e0]" />
                ) : (
                  <EyeOff size={14} className="text-slate-400" />
                )}
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-700 m-0 leading-tight">
                    Show switchers on page
                  </p>
                  <p className="text-[10px] text-slate-400 m-0">
                    Display switcher pills inline while testing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInlineSwitchers(!showInlineSwitchers)}
                role="switch"
                aria-checked={showInlineSwitchers}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showInlineSwitchers ? "bg-[#00a6e0]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    showInlineSwitchers ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer with Exit Button */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] shrink-0">
            <span className="text-slate-500 text-[10.5px]">
              Shortcut: <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[9.5px]">Ctrl+Shift+D</kbd>
            </span>
            <button
              type="button"
              onClick={() => {
                exitDevMode();
                setIsOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-200/60 bg-transparent cursor-pointer"
            >
              <Lock size={11} strokeWidth={2} />
              <span>Lock & Exit</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
