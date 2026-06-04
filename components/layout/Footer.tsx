"use client";

import { useState } from "react";

const footerColumns = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "#" },
      { label: "Furniture", href: "#" },
      { label: "Lighting", href: "#" },
      { label: "Accessories", href: "#" },
      { label: "Sale", href: "#" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping & Delivery", href: "#" },
      { label: "Returns & Exchanges", href: "#" },
      { label: "Order Tracking", href: "#" },
      { label: "Size Guide", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Designers", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Find a Store", href: "#" },
      { label: "Trade Programme", href: "#" },
      { label: "Gift Cards", href: "#" },
      { label: "Catalogues", href: "#" },
      { label: "B2B", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Vimeo",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807z"/>
      </svg>
    ),
  },
];

const legalLinks = [
  { label: "Privacy Notice", href: "#" },
  { label: "Cookie Notice", href: "#" },
  { label: "Cookie Settings", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const toggleSection = (heading: string) => {
    setOpenSection((prev) => (prev === heading ? null : heading));
  };

  return (
    <footer className="bg-[#f5f4f0] text-[#1a1a1a] mt-auto">

      {/* ── TOP STRIP: Newsletter ── */}
      <div className="border-b border-[#dddbd5] px-5 sm:px-8 md:px-12 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-10">
        <div className="max-w-sm">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a] mb-1">
            Newsletter
          </p>
          <p className="text-[13px] text-[#5a5a55] leading-relaxed">
            Sign up for news, campaigns and exclusive offers.
          </p>
        </div>
        {subscribed ? (
          <p className="text-[13px] tracking-[0.06em] text-[#1a1a1a]">
            Thank you for subscribing.
          </p>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex w-full md:max-w-md border-b border-[#1a1a1a] pb-1"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent text-[13px] text-[#1a1a1a] placeholder-[#9a9a94] outline-none tracking-[0.03em] py-1"
            />
            <button
              type="submit"
              className="text-[11px] tracking-[0.14em] uppercase text-[#1a1a1a] hover:opacity-50 transition-opacity duration-200 pl-4 shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* ── MAIN COLUMNS ── */}
      <div className="px-5 sm:px-8 md:px-12 py-8 md:py-12">

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-8">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] tracking-[0.18em] uppercase mb-4 text-[#1a1a1a]">
                {col.heading}
              </p>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-[#5a5a55] no-underline hover:text-[#1a1a1a] transition-colors duration-200 tracking-[0.02em]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Address column — 5th on lg */}
          <div className="lg:block hidden">
            <p className="text-[11px] tracking-[0.18em] uppercase mb-4 text-[#1a1a1a]">
              E-com
            </p>
            <address className="not-italic text-[13px] text-[#5a5a55] leading-relaxed tracking-[0.02em] space-y-1">
              <p>123 Design Street</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
              <a href="tel:+12125550000" className="block mt-3 text-[#5a5a55] no-underline hover:text-[#1a1a1a] transition-colors duration-200">
                +1 212 555 0000
              </a>
              <a href="mailto:hello@e-com.com" className="block text-[#5a5a55] no-underline hover:text-[#1a1a1a] transition-colors duration-200">
                hello@e-com.com
              </a>
            </address>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden divide-y divide-[#dddbd5]">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <button
                onClick={() => toggleSection(col.heading)}
                className="w-full flex items-center justify-between py-4 bg-transparent border-none cursor-pointer p-0"
              >
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#1a1a1a]">
                  {col.heading}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={[
                    "transition-transform duration-300",
                    openSection === col.heading ? "rotate-180" : "",
                  ].join(" ")}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={[
                  "overflow-hidden transition-all duration-300",
                  openSection === col.heading ? "max-h-64 pb-4" : "max-h-0",
                ].join(" ")}
              >
                <ul className="space-y-3 list-none p-0 m-0">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-[#5a5a55] no-underline hover:text-[#1a1a1a] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Address on mobile — always visible */}
          <div className="py-6">
            <p className="text-[11px] tracking-[0.18em] uppercase mb-3 text-[#1a1a1a]">E-com</p>
            <address className="not-italic text-[13px] text-[#5a5a55] leading-relaxed space-y-0.5">
              <p>123 Design Street, New York, NY 10001</p>
              <a href="tel:+12125550000" className="block text-[#5a5a55] no-underline">+1 212 555 0000</a>
              <a href="mailto:hello@e-com.com" className="block text-[#5a5a55] no-underline">hello@e-com.com</a>
            </address>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-[#dddbd5] px-5 sm:px-8 md:px-12 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Legal links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.06em] text-[#9a9a94] no-underline hover:text-[#1a1a1a] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: social + copyright */}
        <div className="flex items-center gap-5">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-[#9a9a94] hover:text-[#1a1a1a] transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <span className="hidden sm:block w-px h-4 bg-[#dddbd5]" />

          <p className="text-[11px] tracking-[0.04em] text-[#9a9a94] whitespace-nowrap">
            © {new Date().getFullYear()} E-com
          </p>
        </div>
      </div>

    </footer>
  );
}