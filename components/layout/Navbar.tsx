"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSearchAutosuggest } from "@/hooks/use-search-autosuggest";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  ShoppingCart,
  LogOut,
  Menu,
  Search,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format.util";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

function SearchBox({
  query,
  setQuery,
  suggestions,
  isLoading,
  isOpen,
  setIsOpen,
  containerRef,
  clearQuery,
  onSubmit,
  onSelectSuggestion,
  mobile,
}: {
  query: string;
  setQuery: (q: string) => void;
  suggestions: any[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  clearQuery: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSelectSuggestion: () => void;
  mobile?: boolean;
}) {
  return (
    <div ref={containerRef} className={`relative ${mobile ? "w-full" : "w-full"}`}>
      <form
        onSubmit={onSubmit}
        className="flex items-center w-full h-10 sm:h-11 bg-[#ececec] rounded-full px-5 gap-2 border border-transparent transition-[box-shadow,border-color] focus-within:border-[#0a1f3d] focus-within:ring-2 focus-within:ring-[#0a1f3d]/25"
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          autoFocus={mobile}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-[13.5px] text-[#1e293b] placeholder:text-[#8e9aa8]"
        />
        {query ? (
          <button
            type="button"
            onClick={clearQuery}
            className="bg-transparent border-none cursor-pointer text-[#8e8e93] hover:text-[#1a1a1a] p-0 flex items-center shrink-0"
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={2} />
          </button>
        ) : (
          <Search size={17} strokeWidth={2} className="text-[#0a1f3d] shrink-0" aria-hidden />
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 shadow-xl z-50 overflow-hidden py-1.5 rounded-xl text-left">
          {isLoading ? (
            <div className="divide-y divide-[#eef2f7]" aria-busy="true" aria-label="Loading suggestions">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="skeleton-bone w-8 h-10 rounded shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton-bone h-2.5 rounded w-3/4" />
                    <div className="skeleton-bone h-2 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-4 text-center text-[12px] text-gray-500">
              No results for &quot;{query}&quot;
            </p>
          ) : (
            <>
              <p className="text-[9px] tracking-[0.15em] uppercase text-gray-400 px-4 pb-1.5 border-b border-gray-100">
                Suggestions
              </p>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      onSelectSuggestion();
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors no-underline"
                  >
                    <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-800 truncate">{item.name}</p>
                      {item.sapId ? (
                        <p className="text-[10px] text-gray-400 truncate">{item.sapId}</p>
                      ) : item.author ? (
                        <p className="text-[10px] text-gray-400 truncate">{item.author}</p>
                      ) : null}
                    </div>
                    <p className="text-[11px] font-medium text-gray-800 shrink-0">
                      {formatPrice(item.price)} SAR
                    </p>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-1.5 px-4 pb-0.5">
                <Link
                  href={`/shop?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => {
                    setIsOpen(false);
                    onSelectSuggestion();
                  }}
                  className="block text-center text-[10px] tracking-widest uppercase text-[#0f2e5a] hover:text-[#1e6bb8] font-medium py-1 no-underline"
                >
                  View All Results
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cartCount } = useCart();
  const { isAdminAuthenticated, logout: adminLogout } = useAdminAuth();
  const search = useSearchAutosuggest();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.query.trim().length >= 2) {
      router.push(`/shop?search=${encodeURIComponent(search.query.trim())}`);
      search.setIsOpen(false);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xs font-nav tracking-normal antialiased">
        {/* ── Row 1: Logo · Search · Contact info · Cart ─────────────── */}
        <div className="bg-white border-b border-[#eef0f3]">
          <div className="max-w-[1440px] mx-auto h-[76px] sm:h-[86px] flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 leading-none">
              <Image
                src="/images/logo-nav.webp"
                alt="Office Care — Lowest Price & Fastest Delivery"
                width={564}
                height={103}
                unoptimized
                priority
                className="h-10 sm:h-12 md:h-13 w-auto object-contain block"
              />
            </Link>

            {/* Centered Search Bar */}
            {!isAdminAuthenticated && (
              <div className="hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
                <SearchBox
                  {...search}
                  onSubmit={handleSearchSubmit}
                  onSelectSuggestion={() => {}}
                />
              </div>
            )}

            {/* Right cluster: Contact Details + Cart */}
            <div className="flex items-center gap-3.5 sm:gap-5 lg:gap-6 shrink-0">
              {/* Contact Information (Desktop) */}
              <div className="hidden lg:flex items-center gap-4 text-[#0a1f3d] select-text">
                <a
                  href="tel:+966558749150"
                  className="flex items-center gap-1.5 hover:text-[#00a6e0] transition-colors no-underline text-[#0a1f3d] text-[12px] font-semibold"
                >
                  <Phone size={13} className="text-[#00a6e0] fill-[#00a6e0] shrink-0" />
                  <span>+966 55 8749150</span>
                </a>
                <a
                  href="mailto:info@officecares.com"
                  className="flex items-center gap-1.5 hover:text-[#00a6e0] transition-colors no-underline text-[#0a1f3d] text-[12px] font-semibold"
                >
                  <Mail size={13} className="text-[#00a6e0] shrink-0" />
                  <span>info@officecares.com</span>
                </a>
              </div>

              {/* Mobile search button */}
              {!isAdminAuthenticated && (
                <button
                  aria-label="Search"
                  onClick={() => setMobileSearchOpen((o) => !o)}
                  className="md:hidden flex items-center bg-transparent border-none cursor-pointer p-1.5 text-[#0a1f3d]"
                >
                  <Search size={20} strokeWidth={1.8} />
                </button>
              )}

              {/* Requisition Cart Button */}
              {!isAdminAuthenticated && (
                <Link
                  href="/cart"
                  aria-label="Requisition cart"
                  className="relative inline-flex items-center gap-2 h-9 sm:h-9.5 px-3 sm:px-3.5 rounded-full border border-[#dbe3ef] text-[#0a1f3d] hover:bg-[#f3f6fb] transition-colors no-underline shrink-0"
                >
                  <ShoppingCart size={16} strokeWidth={1.8} className="shrink-0 text-[#0a1f3d]" />
                  <span className="text-[12px] font-semibold hidden xl:inline tracking-[0.01em] whitespace-nowrap">
                    Requisition cart
                  </span>
                  {cartCount > 0 && (
                    <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-[#00a6e0] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Mobile menu toggle button */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex items-center bg-transparent border-none cursor-pointer p-1.5 text-[#0a1f3d]"
              >
                {mobileOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
              </button>

              {/* Admin shortcut */}
              {isAdminAuthenticated && (
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/admin/dashboard"
                    className="text-[12.5px] font-semibold text-[#0a1f3d] hover:text-[#00a6e0] no-underline"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={async () => {
                      await adminLogout();
                      router.push("/admin/login");
                    }}
                    className="text-[12.5px] font-medium text-red-500 bg-transparent border-none cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 2: Dark Navy Bar with Navlinks ── */}
        <div className="bg-[#0a1f3d]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-11 sm:h-12 flex items-center justify-center">
            {/* Nav links */}
            <nav className="flex items-center justify-center gap-6 lg:gap-8 select-none" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : link.href === "/shop"
                    ? pathname === "/shop" || pathname.startsWith("/shop/")
                    : false;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative inline-flex items-center text-[12.5px] lg:text-[13px] tracking-wide transition-colors no-underline py-0.5 ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white font-medium"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#00a6e0] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {!isAdminAuthenticated && (
        <div
          className={`fixed top-[76px] sm:top-[86px] left-0 right-0 z-40 md:hidden bg-white border-b border-[#eef0f3] px-4 py-3 transition-all duration-300 ${
            mobileSearchOpen
              ? "max-h-24 opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden pointer-events-none py-0"
          }`}
        >
          <SearchBox
            {...search}
            onSubmit={handleSearchSubmit}
            onSelectSuggestion={() => setMobileSearchOpen(false)}
            mobile
          />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute top-[120px] sm:top-[134px] left-0 right-0 bg-[#0a1f3d] text-white transition-all duration-300 overflow-hidden shadow-2xl ${
            mobileOpen ? "max-h-[82vh] opacity-100 py-3 overflow-y-auto" : "max-h-0 opacity-0 py-0"
          }`}
        >
          {/* Contact block in mobile drawer */}
          <div className="px-6 py-3 border-b border-white/10 space-y-1.5 text-[12px]">
            <a href="tel:+966558749150" className="flex items-center gap-2 text-white/95 no-underline">
              <Phone size={13} className="text-[#00a6e0]" />
              <span>+966 55 8749150</span>
            </a>
            <a href="mailto:info@officecares.com" className="flex items-center gap-2 text-white/95 no-underline">
              <Mail size={13} className="text-[#00a6e0]" />
              <span>info@officecares.com</span>
            </a>
          </div>

          <ul className="list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href === "/shop"
                  ? pathname === "/shop" || pathname.startsWith("/shop/")
                  : false;

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-6 py-3 text-[13.5px] font-medium no-underline border-b border-white/10 ${
                      isActive ? "bg-white/15 text-white font-semibold" : "text-white/90 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {!isAdminAuthenticated && (
              <li>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-[13.5px] font-medium text-white/90 hover:bg-white/5 no-underline border-b border-white/10"
                >
                  <ShoppingCart size={16} strokeWidth={1.6} />
                  Requisition cart{cartCount > 0 ? ` (${cartCount})` : ""}
                </Link>
              </li>
            )}
            {isAdminAuthenticated && (
              <>
                <li>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-3 text-[13.5px] font-medium text-white/90 hover:bg-white/5 no-underline border-b border-white/10"
                  >
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await adminLogout();
                      setMobileOpen(false);
                      router.push("/admin/login");
                    }}
                    className="flex items-center gap-3 w-full px-6 py-3 text-[13.5px] font-medium text-red-300 bg-transparent border-none cursor-pointer hover:bg-white/5 text-left"
                  >
                    <LogOut size={15} strokeWidth={1.5} /> Admin Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Spacer for fixed header (Row 1 + Row 2) */}
      <div className="h-[120px] sm:h-[134px]" />
    </>
  );
}
