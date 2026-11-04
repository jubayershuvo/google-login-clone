"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#09090b]/90">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
            <ShieldCheck size={21} className="text-white" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight">
              Admin Portal
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Management Dashboard
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <Icon size={17} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-white/10 dark:text-zinc-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={16} />
            {loading ? "Signing out..." : "Logout"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-white/[0.08] md:hidden">

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/[0.06]"
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut size={18} />
              {loading ? "Signing out..." : "Logout"}
            </button>
          </nav>

        </div>
      )}

    </header>
  );
}