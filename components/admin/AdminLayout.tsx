"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag },
  { label: "Settings",  href: "/admin/settings",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, loading, logout } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      router.replace("/admin/login");
    }
  }, [loading, isAdminAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#1a1a1a] mb-4" strokeWidth={1.5} />
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#9a9a94]">Verifying Session...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white border-r border-[#e8e6e2] flex flex-col min-h-screen sticky top-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#e8e6e2]">
          <p className="text-[9px] tracking-[0.22em] uppercase text-[#9a9a94]">Admin</p>
          <p className="text-[16px] font-light font-serif tracking-[0.14em] uppercase text-[#1a1a1a]">E-com</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase no-underline transition-colors duration-150 ${
                  active
                    ? "bg-[#1a1a1a] text-white"
                    : "text-[#5a5a55] hover:bg-[#f4f1ec] hover:text-[#1a1a1a]"
                }`}
              >
                <Icon size={13} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-[#e8e6e2] pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase text-[#9a9a94] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}