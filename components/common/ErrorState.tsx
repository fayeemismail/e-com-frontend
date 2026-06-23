"use client";

import React from "react";

interface ErrorStateProps {
  error: { title: string; message: string };
  isRetrying: boolean;
  handleRetry: () => void;
  className?: string;
}

export default function ErrorState({
  error,
  isRetrying,
  handleRetry,
  className = "py-16",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto ${className}`}>
      {/* Pulsing icon */}
      <div className="mb-5 w-14 h-14 rounded-full bg-[#fdf0ec] flex items-center justify-center text-lg select-none relative">
        <span className="absolute inset-0 rounded-full bg-[#fdf0ec] animate-ping opacity-20" />
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c27c5a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3 className="text-[12px] tracking-[0.22em] uppercase text-[#111] font-normal mb-2.5 font-serif">
        {error.title}
      </h3>
      <p className="text-[11px] leading-relaxed text-[#888] font-light tracking-wide mb-6">
        {error.message}
      </p>

      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="group relative text-[9px] tracking-[0.2em] uppercase bg-[#111] text-white px-6 py-3 border-none cursor-pointer transition-all duration-300 hover:bg-[#c27c5a] overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-500 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"}`}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {isRetrying ? "Retrying..." : "Try Again"}
        </span>
      </button>
    </div>
  );
}
