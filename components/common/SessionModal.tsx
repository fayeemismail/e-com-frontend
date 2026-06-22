"use client";

import { useState } from "react";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function SessionModal({ isOpen, onClose, onSubmit }: SessionModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(trimmedEmail);
      setEmail("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px] transition-opacity duration-300"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[400px] mx-4 p-8 sm:p-9 border border-[#e8e6e2] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-[6px] z-10 animate-[scaleUp_0.25s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-[#9a9a94] hover:text-[#1a1a1a] cursor-pointer disabled:opacity-30 transition-colors duration-150 p-1"
          aria-label="Close modal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div>
          {/* Elegant Gold/Tan Shopping Bag Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#fafaf9] border border-[#e8e6e2] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c4a882"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-xl font-light tracking-[0.02em] font-serif text-[#1a1a1a] mb-2.5">
            Continue to Cart
          </h2>
          <p className="text-center text-[12px] font-light leading-relaxed text-[#6a6a65] tracking-[0.01em] max-w-[300px] mx-auto mb-7">
            Enter your email to secure your shopping bag. We&apos;ll save your progress and keep your items ready for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label htmlFor="modal-email-input" className="block text-[10px] tracking-[0.14em] uppercase text-[#1a1a1a] font-medium">
                Email Address
              </label>
              <input
                id="modal-email-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                className="w-full h-11 px-4 border border-[#e8e6e2] outline-none rounded-[4px] text-[13px] tracking-[0.02em] text-[#1a1a1a] placeholder-[#bbb] focus:border-[#1a1a1a] bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] transition-all disabled:bg-[#fcfcfa] disabled:text-[#aaa]"
              />
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-[10px] tracking-wide leading-tight font-medium">
                    {error}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase border border-[#1a1a1a] cursor-pointer hover:bg-white hover:text-black transition-colors duration-200 rounded-[4px] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center font-light"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Embedded CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.96);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
