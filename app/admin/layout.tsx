"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!active) return;

        if (data.authenticated && data.status === "valid") {
          setChecking(false);
          return;
        }

        // Clear expired or invalid cookies.
        if (data.status === "expired" || data.status === "invalid") {
          await fetch("/api/admin/logout", {
            method: "POST",
          });
        }

        if (!active) return;

        router.replace("/admin/login");
        router.refresh();
      } catch (error) {
        console.error("Session verification failed:", error);

        if (active) {
          router.replace("/admin/login");
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [isLoginPage, router]);

  // Login page doesn't need the admin navbar.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent protected UI from appearing before verification.
  if (checking) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-blue-600/20 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            Verifying admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-white">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}