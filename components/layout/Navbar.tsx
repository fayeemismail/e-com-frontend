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
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format.util";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

const infoChips = [
  "Consignment store",
  "Outline Agreement 46000",
  "Vendor 455853",
  "Prices in SAR",
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
    <div ref={containerRef} className={`relative ${mobile ? "w-full" : "w-full max-w-xl"}`}>
      <form
        onSubmit={onSubmit}
        className="flex items-center w-full h-11 bg-[#ececec] rounded-full px-5 gap-2 border border-transparent transition-[box-shadow,border-color] focus-within:border-[#0a1f3d] focus-within:ring-2 focus-within:ring-[#0a1f3d]/30"
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
          className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-[#1e293b] placeholder:text-[#94a3b8]"
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
          <Search size={18} strokeWidth={1.8} className="text-[#6b7280] shrink-0" aria-hidden />
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm font-nav tracking-normal antialiased">
        {/* ── Top row: logo · nav · search · contact ─────────────── */}
        <div className="bg-white border-b border-[#eef0f3]">
          <div className="w-full h-[80px] sm:h-[92px] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Aligned with page content / Categories */}
            <div className="flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-[#dbe3ef] bg-[#f5f7fb] text-[11px] sm:text-[12px] font-medium tracking-wide text-[#0a1f3d] whitespace-nowrap shrink-0">
              Client Name
            </div>

            <div className="flex-1 min-w-0 max-w-[1400px] mx-auto flex items-center gap-5 lg:gap-8">
              <Link href="/" className="flex items-center shrink-0 leading-none">
                <Image
                  src="/images/logo-nav.webp"
                  alt="Office Care — Lowest Price & Fastest Delivery"
                  width={564}
                  height={103}
                  unoptimized
                  priority
                  className="h-12 sm:h-14 md:h-[3.75rem] w-auto object-contain block"
                />
              </Link>

              {/* Nav links with enterprise sliding active indicator */}
              {(() => {
                const isHome = pathname === "/";
                const isShop = pathname === "/shop" || pathname.startsWith("/shop/");
                const activeIndex = isHome ? 0 : isShop ? 1 : -1;

                return (
                  <nav
                    className="hidden md:inline-flex items-center p-1 rounded-full bg-[#f1f4f9] border border-[#dbe3ef] relative shrink-0 select-none"
                    aria-label="Primary"
                  >
                    {/* Sliding active pill indicator */}
                    <div
                      className={`absolute top-1 bottom-1 rounded-full bg-[#0a1f3d] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
                        activeIndex === -1 ? "opacity-0" : "opacity-100"
                      }`}
                      style={{
                        left: "4px",
                        width: "calc(50% - 4px)",
                        transform: activeIndex === 1 ? "translateX(100%)" : "translateX(0)",
                      }}
                    />

                    {navLinks.map((link, idx) => {
                      const isActive = activeIndex === idx;
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={`relative z-10 w-18 lg:w-20 text-center py-1.5 text-[13px] font-medium tracking-[0.02em] no-underline rounded-full transition-colors duration-200 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-[#52637a] hover:text-[#0a1f3d]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>
                );
              })()}

              {/* Right cluster: search + cart */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
                {!isAdminAuthenticated && (
                  <div className="hidden md:block w-[min(100%,280px)] lg:w-[320px] xl:w-[380px]">
                    <SearchBox
                      {...search}
                      onSubmit={handleSearchSubmit}
                      onSelectSuggestion={() => {}}
                    />
                  </div>
                )}

                {!isAdminAuthenticated && (
                  <button
                    aria-label="Search"
                    onClick={() => setMobileSearchOpen((o) => !o)}
                    className="md:hidden flex items-center bg-transparent border-none cursor-pointer p-1.5 text-[#0f2e5a]"
                  >
                    <Search size={20} strokeWidth={1.8} />
                  </button>
                )}

                {!isAdminAuthenticated && (
                  <Link
                    href="/cart"
                    aria-label="Requisition cart"
                    className="relative inline-flex items-center gap-2 h-10 px-3 sm:px-3.5 rounded-full border border-[#dbe3ef] text-[#0f2e5a] hover:bg-[#f3f6fb] transition-colors no-underline"
                  >
                    <ShoppingCart size={17} strokeWidth={1.8} className="shrink-0" />
                    <span className="text-[12px] font-medium hidden sm:inline tracking-[0.02em] whitespace-nowrap">
                      Requisition cart
                    </span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-[#1e6bb8] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  aria-label="Toggle menu"
                  onClick={() => setMobileOpen((o) => !o)}
                  className="md:hidden flex items-center bg-transparent border-none cursor-pointer p-1.5 text-[#0f2e5a]"
                >
                  {mobileOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
                </button>

                {isAdminAuthenticated && (
                  <div className="hidden sm:flex items-center gap-3">
                    <Link
                      href="/admin/dashboard"
                      className="text-[12.5px] font-medium text-[#0f2e5a] hover:text-[#1e6bb8] no-underline"
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
        </div>

        {/* ── Section bar: info chips ────────────────────────────── */}
        <div className="bg-[#0a1f3d]">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 h-11 sm:h-12 flex items-center">
            <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto whitespace-nowrap scrollbar-none min-w-0 w-full">
              {infoChips.map((chip, i) => (
                <span key={chip} className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
                  {i > 0 && (
                    <span className="text-white/35 select-none text-[10px]" aria-hidden>
                      •
                    </span>
                  )}
                  <span className="inline-flex items-center px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/12 border border-white/20 text-[12.5px] sm:text-[13px] font-medium tracking-[0.01em] text-white">
                    {chip}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {!isAdminAuthenticated && (
        <div
          className={`fixed top-[80px] sm:top-[92px] left-0 right-0 z-40 md:hidden bg-white border-b border-[#eef0f3] px-4 py-3 transition-all duration-300 ${
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
          className={`absolute top-[124px] sm:top-[140px] left-0 right-0 bg-[#0a1f3d] text-white transition-all duration-300 overflow-hidden shadow-2xl ${
            mobileOpen ? "max-h-[80vh] opacity-100 py-2 overflow-y-auto" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <ul className="list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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

      {/* Spacer for fixed header (top + section bar) */}
      <div className="h-[124px] sm:h-[140px]" />
    </>
  );
}
