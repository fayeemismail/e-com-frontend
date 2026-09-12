"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSearchAutosuggest } from "@/hooks/use-search-autosuggest";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ShoppingCart, LogOut } from "lucide-react";
// import { User, Heart, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format.util";

const navLinks = [
  { label: "Home",  href: "/" },
  { label: "Shop",  href: "/shop" },
  { label: "Sale",  href: "#" },
  { label: "About", href: "#" },
];

/*
// ── Profile dropdown (Commented down per user request) ─────────────
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
  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className="flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0 text-white/80 hover:text-white"
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
          <Link href="/profile" onClick={(e) => { onProfileClick(e); setOpen(false); }} className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline hover:bg-[#faf9f7]">
            <User size={12} strokeWidth={1.4} /> My Profile
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#1a1a1a] no-underline hover:bg-[#faf9f7]">
            <ShoppingCart size={12} strokeWidth={1.4} /> My Orders
          </Link>
          <div className="border-t border-[#f0eeea] mt-1 pt-1">
            <button onClick={() => { onSignOut(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[11px] tracking-[0.08em] uppercase text-red-500 bg-transparent border-none cursor-pointer hover:bg-[#faf9f7]">
              <LogOut size={12} strokeWidth={1.4} /> {sessionEmail ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
*/

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
        className={`flex items-center bg-white border border-transparent shadow-xs transition-all px-3 ${
          mobile ? "h-9 rounded-md w-full" : "h-8.5 w-40 lg:w-56 rounded-md"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          autoFocus={mobile}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent border-none outline-none text-[12px] tracking-[0.02em] text-[#1a1a1a] placeholder-[#8e8e93] px-2.5"
        />
        {query && (
          <button type="button" onClick={clearQuery} className="bg-transparent border-none cursor-pointer text-[#8e8e93] hover:text-[#1a1a1a] p-0 flex items-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className={`absolute top-full mt-1.5 bg-white border border-gray-200 shadow-xl z-50 overflow-hidden py-1.5 ${mobile ? "left-0 right-0" : "right-0 w-72"} rounded-md text-left`}>
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                  <div className="w-8 h-10 bg-gray-100 rounded shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-4 text-center text-[11px] text-gray-500">No results for &quot;{query}&quot;</p>
          ) : (
            <>
              <p className="text-[9px] tracking-[0.15em] uppercase text-gray-400 px-4 pb-1.5 border-b border-gray-100">Suggestions</p>
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {suggestions.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                    onClick={() => { setIsOpen(false); onSelectSuggestion(); }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group no-underline"
                  >
                    <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} width={32} height={40} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-800 truncate">{item.name}</p>
                      {item.author && <p className="text-[10px] text-gray-400 truncate">{item.author}</p>}
                    </div>
                    <p className="text-[11px] font-medium text-gray-800 shrink-0">₹{formatPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-1.5 px-4 pb-0.5">
                <Link
                  href={`/shop?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => { setIsOpen(false); onSelectSuggestion(); }}
                  className="block text-center text-[10px] tracking-widest uppercase text-blue-900 hover:text-blue-700 font-medium py-1 no-underline"
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f2e5a] shadow-md">
        {/* Row 1: Left (Client Name + Logo), Center (Navlinks), Right (Search + Trolly Cart) */}
        <div className="h-15 sm:h-16 px-4 md:px-8 flex items-center justify-between relative gap-3 sm:gap-4">
          
          {/* Left: Mobile Toggle + Client Name bordered box + Office Care Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden flex flex-col justify-center gap-1.25 w-6 h-6 bg-transparent border-none cursor-pointer p-0 text-white"
            >
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-1.75" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
            </button>

            {/* Hardcoded item left of logo: Client Name in bordered box */}
            <div className="flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-white/25 bg-white/5 text-[11px] sm:text-[12px] font-medium tracking-wide text-blue-100 whitespace-nowrap shadow-2xs">
              Client Name
            </div>

            {/* Office Care Logo (enlarged & prominent) */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/officecare.png"
                alt="Office Care"
                width={160}
                height={52}
                unoptimized
                className="h-8.5 sm:h-10 md:h-11 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center: Navlinks centered in Row 1 */}
          <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[13.5px] font-medium tracking-[0.06em] uppercase text-white/90 hover:text-white no-underline transition-colors py-1 hover:opacity-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Search, Trolly Cart in bordered box (Wishlist & Profile commented out per user request) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search */}
            {!isAdminAuthenticated && (
              <div className="hidden md:block">
                <SearchBox {...search} onSubmit={handleSearchSubmit} onSelectSuggestion={() => {}} />
              </div>
            )}

            {/* Mobile Search Toggle */}
            {!isAdminAuthenticated && (
              <button
                aria-label="Search"
                onClick={() => setMobileSearchOpen((o) => !o)}
                className="flex md:hidden items-center bg-transparent border-none cursor-pointer p-1 text-white/90 hover:text-white transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
            )}

            {/* Profile Dropdown - Commented down per user request */}
            {/*
            {!isAdminAuthenticated && (
              <ProfileDropdown
                sessionEmail={sessionEmail}
                onSignOut={sessionEmail ? clearSession : () => setShowSessionModal(true)}
                onProfileClick={handleProfileClick}
              />
            )}
            */}

            {/* Wishlist Icon - Commented down per user request */}
            {/*
            {!isAdminAuthenticated && (
              <Link href="/wishlist" aria-label="Wishlist" className="flex items-center text-white/80 hover:text-white transition-opacity">
                <Heart size={18} strokeWidth={1.3} />
              </Link>
            )}
            */}

            {/* Cart Button: Trolly Icon in a bordered box */}
            {!isAdminAuthenticated && (
              <Link
                href="/cart"
                aria-label="Cart"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white transition-all no-underline shadow-2xs"
              >
                <ShoppingCart size={17} strokeWidth={1.8} className="text-white shrink-0" />
                <span className="text-[12px] font-medium hidden sm:inline text-white/95">Cart</span>
                {cartCount > 0 && (
                  <span className="text-[10px] font-bold font-mono text-slate-900 bg-amber-400 px-1.5 py-0.2 rounded-full leading-tight min-w-4 text-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin shortcut */}
            {isAdminAuthenticated && (
              <div className="flex items-center gap-3 border-l border-white/20 pl-3 ml-1">
                <Link href="/admin/dashboard" className="text-[11px] tracking-[0.12em] uppercase text-white/90 hover:text-white no-underline">
                  Admin
                </Link>
                <button
                  onClick={async () => { await adminLogout(); router.push("/admin/login"); }}
                  className="text-[11px] tracking-[0.12em] uppercase text-red-300 bg-transparent border-none cursor-pointer hover:text-red-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Hardcoded texts in second row with rounded divs, dots, and expanded gap on lg screen */}
        <div className="bg-[#0b2447] border-t border-white/10 px-4 md:px-8 py-2">
          <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-6 text-[11px] sm:text-[11.5px] tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none font-normal">
            <span className="px-3 py-0.5 rounded-full bg-white/8 border border-white/10 text-blue-100/90 shadow-2xs">
              Consigment store
            </span>
            <span className="text-blue-300/40 select-none text-[8px]">•</span>
            <span className="px-3 py-0.5 rounded-full bg-white/8 border border-white/10 text-blue-100/90 shadow-2xs">
              Outline Agreement 46000
            </span>
            <span className="text-blue-300/40 select-none text-[8px]">•</span>
            <span className="px-3 py-0.5 rounded-full bg-white/8 border border-white/10 text-blue-100/90 shadow-2xs">
              Vendor 455853
            </span>
            <span className="text-blue-300/40 select-none text-[8px]">•</span>
            <span className="px-3 py-0.5 rounded-full bg-white/8 border border-white/10 text-blue-100/90 shadow-2xs">
              Prices in SAR
            </span>
          </div>
        </div>
      </header>

      {/* Mobile search bar dropdown */}
      {!isAdminAuthenticated && (
        <div className={`fixed top-23 sm:top-24 left-0 right-0 z-40 md:hidden bg-[#0f2e5a] border-b border-[#0b2447] px-4 py-2.5 transition-all duration-300 ${mobileSearchOpen ? "max-h-16 opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden pointer-events-none py-0"}`}>
          <SearchBox
            {...search}
            onSubmit={handleSearchSubmit}
            onSelectSuggestion={() => setMobileSearchOpen(false)}
            mobile
          />
        </div>
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-23 sm:top-24 left-0 right-0 bg-[#0f2e5a] border-b border-[#0b2447] text-white transition-all duration-300 overflow-hidden shadow-2xl ${mobileOpen ? "max-h-screen opacity-100 py-2" : "max-h-0 opacity-0 py-0"}`}>
          <ul className="list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-[13px] tracking-widest uppercase text-white/90 hover:text-white no-underline border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Cart link in mobile drawer (with trolley icon) */}
            {!isAdminAuthenticated && (
              <li>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-[13px] tracking-widest uppercase text-white/90 hover:text-white no-underline border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <ShoppingCart size={16} strokeWidth={1.6} />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </li>
            )}

            {/* Wishlist link in mobile drawer - Commented down per user request */}
            {/*
            {!isAdminAuthenticated && (
              <li>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[13px] tracking-widest uppercase text-white/90 hover:text-white no-underline border-b border-white/10 hover:bg-white/5 transition-colors">
                  <Heart size={15} strokeWidth={1.5} /> Wishlist
                </Link>
              </li>
            )}
            */}

            {/* Profile link in mobile drawer - Commented down per user request */}
            {/*
            {!isAdminAuthenticated && (
              <li>
                <Link href="/profile" onClick={(e) => { handleProfileClick(e); setMobileOpen(false); }} className="flex items-center gap-3 px-6 py-3 text-[13px] tracking-widest uppercase text-white/90 hover:text-white no-underline border-b border-white/10 hover:bg-white/5 transition-colors">
                  <User size={15} strokeWidth={1.5} /> Profile
                </Link>
              </li>
            )}
            */}

            {/* Admin in mobile drawer */}
            {isAdminAuthenticated && (
              <>
                <li>
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[13px] tracking-widest uppercase text-white/90 hover:text-white no-underline border-b border-white/10 hover:bg-white/5 transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={async () => { await adminLogout(); setMobileOpen(false); router.push("/admin/login"); }} className="flex items-center gap-3 w-full px-6 py-3 text-[13px] tracking-widest uppercase text-red-300 bg-transparent border-none cursor-pointer hover:bg-white/5 transition-colors text-left">
                    <LogOut size={15} strokeWidth={1.5} /> Admin Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Spacer to prevent content overlap under the fixed 2-row navbar */}
      <div className="h-23 sm:h-24" />
    </>
  );
}