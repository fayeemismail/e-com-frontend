"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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
  List,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format.util";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

const categoryList = [
  {
    name: "Writing Instruments",
    href: "/shop?category=Writing%20Instruments",
    desc: "Pens, markers, highlighters & writing tools",
    icon: "/images/categories/writing-pen.svg",
  },
  {
    name: "Paper & Print",
    href: "/shop?category=Paper%20%26%20Print",
    desc: "Copy paper, notebooks & print supplies",
    icon: "/images/categories/paper-print.svg",
  },
  {
    name: "Desk & Filing",
    href: "/shop?category=Desk%20%26%20Filing",
    desc: "Folders, files, trays & desk organizers",
    icon: "/images/categories/desk-filing.svg",
  },
  {
    name: "Toner & Cartridges",
    href: "/shop?category=Toner%20%26%20Cartridges",
    desc: "Printer toner, ink cartridges & imaging",
    icon: "/images/categories/toner-cartridge.svg",
  },
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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [secondBarLayout, setSecondBarLayout] = useState<"spread" | "classic">("spread");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const isHomePage = pathname === "/";
  const isShopPage = pathname === "/shop" || pathname.startsWith("/shop/");

  useEffect(() => {
    setCategoryDropdownOpen(false);
  }, [pathname]);

  // Sync active category with URL param and custom event
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat);
      } else {
        setActiveCategory("All");
      }
    }

    const handleCategoryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail === "All Products" ? "All" : customEvent.detail);
      }
    };

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      setActiveCategory(cat || "All");
    };

    window.addEventListener("featuredCategoryChange", handleCategoryEvent);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("featuredCategoryChange", handleCategoryEvent);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCategoryDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryDropdownOpen]);

  const { cartCount } = useCart();
  const { isAdminAuthenticated, logout: adminLogout } = useAdminAuth();
  const search = useSearchAutosuggest();

  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryName: string
  ) => {
    const targetCategory = categoryName === "All Products" ? "All" : categoryName;

    if (pathname === "/") {
      e.preventDefault();
      setActiveCategory(targetCategory);

      // Update URL query string without reloading page
      const url = new URL(window.location.href);
      if (targetCategory === "All") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", targetCategory);
      }
      window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));

      // Notify FeaturedProducts component
      window.dispatchEvent(
        new CustomEvent("featuredCategoryChange", { detail: targetCategory })
      );

      // Smoothly scroll down to Featured Products
      const featElement = document.getElementById("featured-products");
      if (featElement) {
        featElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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

        {/* ── Row 2: Dark Navy Bar with Browse Categories · Navlinks · Quote · Socials ── */}
        <div className="bg-[#0a1f3d]">
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-11 sm:h-12 flex items-center justify-between gap-4">
            {secondBarLayout === "spread" ? (
              /* Spread Categories across second navbar (no dropdown, no center navlinks) */
              <nav
                className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 overflow-x-auto no-scrollbar py-1 min-w-0 flex-1 select-none"
                aria-label="Categories Navigation"
              >
                {categoryList.map((cat) => {
                  const isCatActive = pathname === "/" && activeCategory === cat.name;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={(e) => handleCategoryClick(e, cat.name)}
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[12px] sm:text-[12.5px] lg:text-[13px] font-medium transition-all no-underline whitespace-nowrap shrink-0 cursor-pointer ${
                        isCatActive
                          ? "bg-white text-[#0a1f3d] font-semibold shadow-xs"
                          : "text-white/85 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isCatActive ? "bg-[#00a6e0]" : "bg-[#00a6e0]/70"
                        }`}
                      />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
                <Link
                  href="/shop"
                  onClick={(e) => handleCategoryClick(e, "All")}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[12px] sm:text-[12.5px] lg:text-[13px] font-medium transition-all no-underline whitespace-nowrap shrink-0 cursor-pointer ${
                    pathname === "/" && (activeCategory === "All" || !activeCategory)
                      ? "bg-white/20 text-white font-semibold ring-1 ring-white/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>All Products</span>
                </Link>
              </nav>
            ) : (
              /* Classic: Browse Categories Dropdown (left) + Navlinks (center) */
              <>
                {/* Left: Browse Categories (hidden on shop page) */}
                <div ref={categoryDropdownRef} className="relative shrink-0 flex items-center min-w-0">
                  {!isShopPage && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCategoryDropdownOpen((o) => !o)}
                        aria-expanded={categoryDropdownOpen}
                        aria-haspopup="menu"
                        className="inline-flex items-center gap-2 text-white hover:text-white/90 text-[12.5px] sm:text-[13px] font-medium tracking-wide transition-colors bg-transparent border-none cursor-pointer p-0 select-none"
                      >
                        <List size={16} strokeWidth={2.4} className="text-white" />
                        <span>Browse Categories</span>
                        <ChevronDown
                          size={13}
                          className={`text-white/80 transition-transform duration-200 ${
                            categoryDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu on / page */}
                      {categoryDropdownOpen && (
                        <div
                          className="dropdown-enter absolute top-full left-0 mt-2.5 w-[280px] sm:w-[300px] bg-white rounded-2xl shadow-[0_22px_60px_-15px_rgba(10,31,61,0.22),0_0_0_1px_rgba(10,31,61,0.07)] border border-slate-100/90 p-2 z-50 select-none"
                          role="menu"
                          aria-label="Categories menu"
                        >
                          {/* Subtle top header bar */}
                          <div className="px-3 pt-1.5 pb-2 flex items-center justify-between border-b border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 tracking-[0.14em] uppercase">
                              Categories
                            </span>
                            {activeCategory && activeCategory !== "All" && pathname === "/" ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  handleCategoryClick(e, "All");
                                  setCategoryDropdownOpen(false);
                                }}
                                className="text-[10.5px] font-semibold text-[#00a6e0] hover:underline bg-transparent border-none cursor-pointer p-0"
                              >
                                Reset Filter
                              </button>
                            ) : (
                              <span className="text-[10.5px] font-medium text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-full">
                                {categoryList.length} categories
                              </span>
                            )}
                          </div>

                          {/* Category cards list */}
                          <div className="py-1.5 space-y-1" role="none">
                            {categoryList.map((cat, index) => {
                              const isCatActive = pathname === "/" && activeCategory === cat.name;
                              return (
                                <Link
                                  key={cat.name}
                                  href={cat.href}
                                  onClick={(e) => {
                                    handleCategoryClick(e, cat.name);
                                    setCategoryDropdownOpen(false);
                                  }}
                                  style={{ animationDelay: `${index * 40}ms` }}
                                  className={`dropdown-item-enter group flex items-center gap-3 p-2 rounded-xl transition-all duration-180 no-underline cursor-pointer ${
                                    isCatActive
                                      ? "bg-[#0a1f3d]/8 border border-[#0a1f3d]/20"
                                      : "hover:bg-[#f4f7fc] border border-transparent hover:border-slate-200/60"
                                  }`}
                                  role="menuitem"
                                >
                                  <div
                                    className={`w-9 h-9 rounded-xl border flex items-center justify-center p-1.5 shrink-0 transition-all duration-200 ${
                                      isCatActive
                                        ? "bg-white border-[#0a1f3d]/30 shadow-xs"
                                        : "bg-slate-50 group-hover:bg-white border-slate-100 group-hover:border-slate-200/80 group-hover:scale-105"
                                    }`}
                                  >
                                    <Image
                                      src={cat.icon}
                                      alt=""
                                      width={20}
                                      height={20}
                                      className="w-5 h-5 object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <p
                                      className={`text-[13px] font-semibold transition-colors m-0 truncate ${
                                        isCatActive
                                          ? "text-[#00a6e0]"
                                          : "text-[#0a1f3d] group-hover:text-[#00a6e0]"
                                      }`}
                                    >
                                      {cat.name}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                      isCatActive
                                        ? "text-[#00a6e0]"
                                        : "text-slate-300 group-hover:text-[#00a6e0] group-hover:translate-x-0.5"
                                    }`}
                                  >
                                    <ChevronRight size={14} strokeWidth={2.4} />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Bottom shop button */}
                          <div className="pt-2 border-t border-slate-100">
                            <Link
                              href="/shop"
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#0a1f3d] hover:bg-[#00a6e0] text-white text-[12px] font-semibold transition-colors no-underline shadow-xs"
                            >
                              <span>View all in Shop</span>
                              <ChevronRight size={13} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Center: Nav links in second bar (dead-center on desktop) */}
                <nav
                  className="hidden md:flex items-center gap-6 lg:gap-8 select-none md:absolute md:left-1/2 md:-translate-x-1/2"
                  aria-label="Main Navigation"
                >
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
                          <span className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-white rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </>
            )}

            {/* Right: Switcher toggle pill + Get A Quote button + Social Icons */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
              {/* Layout Switcher Pill */}
              <div
                className="inline-flex items-center p-0.5 bg-white/10 rounded-full border border-white/15 shadow-2xs"
                role="radiogroup"
                aria-label="Navbar second row layout switcher"
              >
                <button
                  type="button"
                  onClick={() => setSecondBarLayout("spread")}
                  aria-checked={secondBarLayout === "spread"}
                  title="Spread categories across navbar"
                  className={`h-6 sm:h-6.5 px-2.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold transition-all cursor-pointer border-none flex items-center gap-1 select-none ${
                    secondBarLayout === "spread"
                      ? "bg-white text-[#0a1f3d] shadow-xs"
                      : "bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  <span>Spread</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSecondBarLayout("classic")}
                  aria-checked={secondBarLayout === "classic"}
                  title="Dropdown menu & centered navlinks"
                  className={`h-6 sm:h-6.5 px-2.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold transition-all cursor-pointer border-none flex items-center gap-1 select-none ${
                    secondBarLayout === "classic"
                      ? "bg-white text-[#0a1f3d] shadow-xs"
                      : "bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  <span>Dropdown</span>
                </button>
              </div>

              {/* Get A Quote button */}
              <a
                href="https://wa.me/966558749150?text=Hello%20Office%20Care%2C%20I%20would%20like%20to%20get%20a%20quote"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-[#0a1f3d] hover:bg-gray-100 active:scale-95 transition-all text-[11px] sm:text-[11.5px] font-semibold px-3 sm:px-3.5 py-1.5 rounded-full no-underline shadow-xs shrink-0 whitespace-nowrap"
              >
                Get A Quote
              </a>

              {/* Social icons */}
              <div className="hidden sm:flex items-center gap-2.5 text-white/90">
                <a
                  href="https://wa.me/966558749150"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="p-1 text-white hover:text-[#25D366] transition-colors flex items-center"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 2C6.505 2 2.012 6.493 2.012 12.019c0 1.954.564 3.784 1.543 5.334L2 22.5l5.318-1.512c1.488.895 3.228 1.411 5.088 1.411 5.526 0 10.019-4.493 10.019-10.019C22.05 6.493 17.557 2 12.031 2zm0 18.257c-1.637 0-3.181-.462-4.508-1.266l-.323-.197-3.342.951.96-3.239-.214-.336c-.888-1.393-1.36-3.023-1.36-4.707 0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.249-8.25 8.249zm4.526-6.177c-.248-.124-1.467-.724-1.694-.807-.228-.083-.393-.124-.559.124-.165.248-.642.807-.787.972-.145.166-.29.186-.538.062-.248-.124-1.047-.386-1.995-1.231-.738-.658-1.236-1.472-1.381-1.72-.145-.248-.016-.382.108-.506.112-.111.248-.29.373-.435.124-.145.166-.248.248-.414.083-.166.041-.311-.021-.435-.062-.124-.559-1.346-.766-1.844-.201-.486-.406-.42-.559-.428l-.476-.008c-.165 0-.435.062-.663.311-.228.248-.87 0.85-.87 2.073 0 1.223.89 2.406 1.014 2.571.124.166 1.751 2.673 4.242 3.748.593.256 1.056.409 1.417.524.596.189 1.138.163 1.567.098.479-.072 1.467-.6 1.674-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.476-.29z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/Office-Cares/100063205872889/?mibextid=D4KYlr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-1 text-white hover:text-[#1877F2] transition-colors flex items-center"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/officecares"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-1 text-white hover:text-[#E4405F] transition-colors flex items-center"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
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
            {!isShopPage && (
              <li className="border-b border-white/10 py-2">
                <div className="px-6 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase">
                    Categories
                  </span>
                  {activeCategory && activeCategory !== "All" && pathname === "/" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        handleCategoryClick(e, "All");
                        setMobileOpen(false);
                      }}
                      className="text-[11px] text-[#00a6e0] bg-transparent border-none cursor-pointer p-0"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="px-4 py-1 flex flex-col gap-1">
                  {categoryList.map((cat) => {
                    const isCatActive = pathname === "/" && activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={(e) => {
                          handleCategoryClick(e, cat.name);
                          setMobileOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] border-none cursor-pointer text-left transition-colors ${
                          isCatActive
                            ? "bg-white text-[#0a1f3d] font-semibold"
                            : "bg-white/5 text-white/90 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCatActive ? "bg-[#00a6e0]" : "bg-[#00a6e0]/70"
                            }`}
                          />
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight size={13} className="opacity-60" />
                      </button>
                    );
                  })}
                </div>
              </li>
            )}
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
            <li className="p-4 border-b border-white/10">
              <a
                href="https://wa.me/966558749150?text=Hello%20Office%20Care%2C%20I%20would%20like%20to%20get%20a%20quote"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-white text-[#0a1f3d] font-semibold text-[13px] py-2.5 rounded-full no-underline"
              >
                Get A Quote
              </a>
            </li>
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
