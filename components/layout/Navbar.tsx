"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "New", href: "#" },
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Sale", href: "#" },
  { label: "About", href: "#" },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e8e6e2] h-13 flex items-center px-4 md:px-6">

        {/* ── MOBILE: Hamburger (left) ── */}
        <div className="flex items-center flex-1 md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col justify-center gap-1.25 w-6 h-6 bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a]"
          >
            <span
              className={[
                "block h-px bg-[#1a1a1a] transition-all duration-300 origin-center",
                mobileOpen ? "rotate-45 translate-y-1.75" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-px bg-[#1a1a1a] transition-all duration-300",
                mobileOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-px bg-[#1a1a1a] transition-all duration-300 origin-center",
                mobileOpen ? "-rotate-45 -translate-y-1.75" : "",
              ].join(" ")}
            />
          </button>
        </div>

        {/* ── DESKTOP: Nav links (left) ── */}
        <ul className="hidden md:flex items-center gap-7 flex-1 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link 
                href={link.href}
                onMouseEnter={() => setActiveMenu(link.label)}
                onMouseLeave={() => setActiveMenu(null)}
                className={[
                  "text-[13px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline relative pb-0.5 transition-opacity duration-200",
                  activeMenu === link.label ? "opacity-50" : "opacity-100",
                ].join(" ")}
              >
                {link.label}
                {activeMenu === link.label && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#1a1a1a]" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── CENTER: Logo (hidden when mobile search is open) ── */}
        <a
          href="/"
          className={[
            "absolute left-1/2 -translate-x-1/2 text-[18px] md:text-[20px] font-medium tracking-[0.22em] uppercase text-[#1a1a1a] no-underline whitespace-nowrap select-none font-serif transition-opacity duration-200",
            mobileSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100",
          ].join(" ")}
        >
          E-com
        </a>

        {/* ── RIGHT: Search + Icons ── */}
        <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end">

          {/* Desktop / md+ search input — always visible */}
          <div className="hidden md:flex items-center border border-[#e2e0db] focus-within:border-[#1a1a1a] transition-colors duration-200 px-3 h-8 w-44 lg:w-56">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-[#aaa] shrink-0">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-[12px] tracking-[0.04em] text-[#1a1a1a] placeholder-[#bbb] px-2"
            />
          </div>

          {/* Mobile search toggle */}
          <button
            aria-label="Search"
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="flex md:hidden items-center bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a] transition-opacity duration-200 hover:opacity-50"
          >
            {mobileSearchOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            )}
          </button>

          {/* Account — hidden on mobile to save space */}
          <button
            aria-label="Account"
            className="hidden sm:flex items-center bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a] transition-opacity duration-200 hover:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>

          {/* Cart */}
          <button
            aria-label="Cart"
            className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a] transition-opacity duration-200 hover:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-[11px] tracking-[0.04em]">0</span>
          </button>
        </div>
      </nav>

      {/* ── MOBILE SEARCH BAR — slides down below navbar ── */}
      <div
        className={[
          "fixed top-13 left-0 right-0 z-40 md:hidden bg-white border-b border-[#e8e6e2] overflow-hidden transition-all duration-300",
          mobileSearchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center border border-[#e2e0db] focus-within:border-[#1a1a1a] transition-colors duration-200 mx-4 my-2.5 px-3 h-9">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-[#aaa] shrink-0">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          <input
            type="text"
            placeholder="Search products"
            autoFocus={mobileSearchOpen}
            className="flex-1 bg-transparent border-none outline-none text-[13px] tracking-[0.02em] text-[#1a1a1a] placeholder-[#bbb] px-2"
          />
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={[
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={[
            "absolute inset-0 bg-black/30 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Drawer panel */}
        <div
          className={[
            "absolute top-13 left-0 right-0 bg-white border-b border-[#e8e6e2] transition-all duration-300 overflow-hidden",
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <ul className="list-none m-0 p-0 py-2">
            {navLinks.map((link, i) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] last:border-0 hover:bg-[#fafaf9] transition-colors duration-150"
                  style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {/* Account in mobile drawer */}
            <li>
              <a
                href="#"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline hover:bg-[#fafaf9] transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Account
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-13" />
    </>
  );
}