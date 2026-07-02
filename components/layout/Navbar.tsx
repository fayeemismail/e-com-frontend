"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSearchAutosuggest } from "@/hooks/use-search-autosuggest";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { User, ShoppingBag, Heart, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home",  href: "/" },
  { label: "Shop",  href: "/shop" },
  { label: "Sale",  href: "#" },
  { label: "About", href: "#" },
];

// ── Profile dropdown ──────────────────────────────────────────────
function ProfileDropdown({
  sessionEmail,
  onSignOut,
  onProfileClick,
}: {
  sessionEmail: string | null;
  onSignOut: () => void;
  onProfileClick: (e: React.MouseEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className="flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a] hover:opacity-50 transition-opacity duration-200"
      >
        <User size={16} strokeWidth={1.3} />
        <ChevronDown size={10} strokeWidth={1.5} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e8e6e2] shadow-sm z-50 py-1">
          {sessionEmail && (
            <p className="px-4 py-2 text-[10px] text-[#9a9a94] tracking-wide border-b border-[#f0eeea] truncate">
              {sessionEmail}
            </p>
          )}
          <Link
            href="/profile"
            onClick={(e) => {
              onProfileClick(e);
              setOpen(false);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline hover:bg-[#faf9f7] transition-colors"
          >
            <User size={12} strokeWidth={1.4} />
            My Profile
          </Link>
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline hover:bg-[#faf9f7] transition-colors"
          >
            <ShoppingBag size={12} strokeWidth={1.4} />
            My Orders
          </Link>
          <div className="border-t border-[#f0eeea] mt-1 pt-1">
            {sessionEmail ? (
              <button
                onClick={() => { onSignOut(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-red-500 bg-transparent border-none cursor-pointer hover:bg-[#faf9f7] transition-colors text-left"
              >
                <LogOut size={12} strokeWidth={1.4} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => { onSignOut(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] bg-transparent border-none cursor-pointer hover:bg-[#faf9f7] transition-colors text-left"
              >
                <User size={12} strokeWidth={1.4} />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Search box (shared, responsive) ──────────────────────────────
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
    <div ref={containerRef} className="relative">
      <form
        onSubmit={onSubmit}
        className={`flex items-center border border-[#e2e0db] focus-within:border-[#1a1a1a] transition-colors duration-200 px-3 bg-white ${
          mobile ? "h-9 rounded-lg" : "h-8 w-44 lg:w-56 rounded-xl"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-[#aaa] shrink-0">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={query}
          autoFocus={mobile}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent border-none outline-none text-[12px] tracking-[0.03em] text-[#1a1a1a] placeholder-[#bbb] px-2"
        />
        {query && (
          <button type="button" onClick={clearQuery} className="bg-transparent border-none cursor-pointer text-[#aaa] hover:text-[#1a1a1a] p-0 flex items-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </form>

      {/* Suggestions */}
      {isOpen && query.trim().length >= 2 && (
        <div className={`absolute top-full mt-2 bg-white border border-[#e8e6e2] shadow-xl z-50 overflow-hidden py-2 ${mobile ? "left-0 right-0" : "right-0 w-72"} rounded-xl`}>
          {isLoading ? (
            <div className="divide-y divide-[#f5f4f0]">
              {[0,1,2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                  <div className="w-9 h-11 bg-[#f0eeea] rounded shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-[#e8e6e2] rounded w-3/4" />
                    <div className="h-2 bg-[#e8e6e2] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-5 text-center text-[11px] text-[#888]">No results for "{query}"</p>
          ) : (
            <>
              <p className="text-[9px] tracking-[0.15em] uppercase text-[#9a9a94] px-4 pb-1.5 border-b border-[#f5f4f0]">Suggestions</p>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#f5f4f0]">
                {suggestions.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                    onClick={() => { setIsOpen(false); onSelectSuggestion(); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafaf9] transition-colors group no-underline"
                  >
                    <div className="w-9 h-11 bg-[#f0eeea] rounded overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} width={36} height={44} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#1a1a1a] truncate font-light">{item.name}</p>
                      {item.author && <p className="text-[10px] text-[#9a9a94] truncate">{item.author}</p>}
                    </div>
                    <p className="text-[11px] text-[#1a1a1a] shrink-0">₹{item.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
              <div className="border-t border-[#e8e6e2] pt-1.5 px-4 pb-1">
                <Link
                  href={`/shop?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => { setIsOpen(false); onSelectSuggestion(); }}
                  className="block text-center text-[10px] tracking-widest uppercase text-[#1a1a1a] hover:text-[#c27c5a] transition-colors py-1 no-underline"
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

// ── Navbar ────────────────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { cartCount, sessionEmail, clearSession, setShowSessionModal } = useCart();
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

  // If not signed in, clicking "My Profile" opens the same session modal
  // used by "Sign In" instead of navigating to /profile.
  const handleProfileClick = (e: React.MouseEvent) => {
    if (!sessionEmail) {
      e.preventDefault();
      setShowSessionModal(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e8e6e2] h-13 flex items-center px-4 md:px-6">

        {/* Mobile: hamburger */}
        <div className="flex items-center flex-1 md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col justify-center gap-1.25 w-6 h-6 bg-transparent border-none cursor-pointer p-0"
          >
            <span className={`block h-px bg-[#1a1a1a] transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-1.75" : ""}`} />
            <span className={`block h-px bg-[#1a1a1a] transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-px bg-[#1a1a1a] transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
          </button>
        </div>

        {/* Desktop: nav links */}
        <ul className="hidden md:flex items-center gap-7 flex-1 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[13px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline relative pb-0.5 hover:opacity-50 transition-opacity duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Center: logo */}
        <Link
          href="/"
          className={`absolute left-1/2 -translate-x-1/2 text-[18px] md:text-[20px] font-medium tracking-[0.22em] uppercase text-[#1a1a1a] no-underline whitespace-nowrap select-none font-serif transition-opacity duration-200 ${mobileSearchOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}
        >
          E-com
        </Link>

        {/* Right: icons */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">

          {/* Desktop search */}
          {!isAdminAuthenticated && (
            <div className="hidden md:block">
              <SearchBox {...search} onSubmit={handleSearchSubmit} onSelectSuggestion={() => {}} />
            </div>
          )}

          {/* Mobile search toggle */}
          {!isAdminAuthenticated && (
            <button
              aria-label="Search"
              onClick={() => setMobileSearchOpen((o) => !o)}
              className="flex md:hidden items-center bg-transparent border-none cursor-pointer p-0 text-[#1a1a1a] hover:opacity-50 transition-opacity"
            >
              {mobileSearchOpen
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" /></svg>
              }
            </button>
          )}

          {/* Profile dropdown (desktop) */}
          {!isAdminAuthenticated && (
            <ProfileDropdown
              sessionEmail={sessionEmail}
              onSignOut={sessionEmail ? clearSession : () => setShowSessionModal(true)}
              onProfileClick={handleProfileClick}
            />
          )}

          {/* Wishlist */}
          {!isAdminAuthenticated && (
            <Link href="/wishlist" aria-label="Wishlist" className="flex items-center text-[#1a1a1a] hover:opacity-50 transition-opacity">
              <Heart size={16} strokeWidth={1.3} />
            </Link>
          )}

          {/* Cart */}
          {!isAdminAuthenticated && (
            <Link href="/cart" aria-label="Cart" className="flex items-center gap-1 text-[#1a1a1a] hover:opacity-50 transition-opacity no-underline">
              <ShoppingBag size={16} strokeWidth={1.3} />
              {cartCount > 0 && (
                <span className="text-[10px] font-mono text-[#1a1a1a]">({cartCount})</span>
              )}
            </Link>
          )}

          {/* Admin shortcut */}
          {isAdminAuthenticated && (
            <div className="flex items-center gap-3 border-l border-[#e8e6e2] pl-3 ml-1">
              <Link href="/admin/dashboard" className="text-[10px] tracking-[0.14em] uppercase text-[#1a1a1a] no-underline hover:opacity-60 transition-opacity">
                Admin
              </Link>
              <button
                onClick={async () => { await adminLogout(); router.push("/admin/login"); }}
                className="text-[10px] tracking-[0.14em] uppercase text-red-500 bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile search bar */}
      {!isAdminAuthenticated && (
        <div className={`fixed top-13 left-0 right-0 z-40 md:hidden bg-white border-b border-[#e8e6e2] transition-all duration-300 ${mobileSearchOpen ? "max-h-16 opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"}`}>
          <div className="mx-4 my-2.5">
            <SearchBox
              {...search}
              onSubmit={handleSearchSubmit}
              onSelectSuggestion={() => setMobileSearchOpen(false)}
              mobile
            />
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-13 left-0 right-0 bg-white border-b border-[#e8e6e2] transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="list-none m-0 p-0 py-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={() => setMobileOpen(false)} className="block px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            {!isAdminAuthenticated && (<>
              <li>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors">
                  <Heart size={14} strokeWidth={1.3} /> Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors">
                  <ShoppingBag size={14} strokeWidth={1.3} /> Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  onClick={(e) => {
                    handleProfileClick(e);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors"
                >
                  <User size={14} strokeWidth={1.3} /> Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors">
                  <ShoppingBag size={14} strokeWidth={1.3} /> My Orders
                </Link>
              </li>
              <li>
                <button
                  onClick={() => { sessionEmail ? clearSession() : setShowSessionModal(true); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] bg-transparent border-none cursor-pointer hover:bg-[#fafaf9] transition-colors text-left"
                >
                  <LogOut size={14} strokeWidth={1.3} />
                  {sessionEmail ? "Sign Out" : "Sign In"}
                </button>
              </li>
            </>)}
            {isAdminAuthenticated && (<>
              <li>
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-[#1a1a1a] no-underline border-b border-[#f0eeea] hover:bg-[#fafaf9] transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <button onClick={async () => { await adminLogout(); setMobileOpen(false); router.push("/admin/login"); }} className="flex items-center gap-3 w-full px-6 py-4 text-[13px] tracking-[0.12em] uppercase text-red-500 bg-transparent border-none cursor-pointer hover:bg-[#fafaf9] transition-colors text-left">
                  <LogOut size={14} strokeWidth={1.3} /> Admin Sign Out
                </button>
              </li>
            </>)}
          </ul>
        </div>
      </div>

      <div className="h-13" />
    </>
  );
}