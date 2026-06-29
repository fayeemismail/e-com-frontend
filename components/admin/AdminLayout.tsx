"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag },
  { label: "Products",  href: "/admin/products",  icon: Package },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings",  href: "/admin/settings",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_auth")) {
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

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