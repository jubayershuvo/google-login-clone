"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
ShieldCheck,
Eye,
EyeOff,
LockKeyhole,
Mail,
ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [loading, setLoading] = useState(false);
const [checkingSession, setCheckingSession] = useState(true);

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Login failed.");
      return;
    }

    router.push("/admin");

  } catch {
    alert("Unable to connect to the server.");
  } finally {
    setLoading(false);
    setCheckingSession(false);
  }
};
    
useEffect(() => {
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
        router.replace("/admin/dashboard");
        return;
      }

      // Remove expired or invalid session.
      if (data.status === "expired" || data.status === "invalid") {
        await fetch("/api/admin/logout", {
          method: "POST",
        });
      }

      if (active) {
        setCheckingSession(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);

      if (active) {
        setCheckingSession(false);
      }
    }
  };

  checkSession();

  return () => {
    active = false;
  };
}, [router]);

return (
<main className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-white transition-colors duration-300">

  <div className="w-full max-w-[420px]">

    {/* Logo and Heading */}
    <div className="flex flex-col items-center mb-8">

      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 mb-5">
        <ShieldCheck size={29} className="text-white" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight">
        Admin Portal
      </h1>

      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
        Sign in to access your dashboard
      </p>

    </div>

    {/* Login Card */}
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-7 shadow-xl shadow-black/[0.03] dark:shadow-black/20">

      <div className="mb-7">
        <h2 className="text-lg font-semibold">
          Welcome back
        </h2>

        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Please enter your administrator credentials.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2"
          >
            Email or Username
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              type="text"
              name="email"
              autoComplete="username"
              placeholder="admin@example.com or admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18181b] text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-60"
            />

          </div>
        </div>

        {/* Password */}
        <div>

          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2"
          >
            Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18181b] text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between gap-3 text-sm">

          <label className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 cursor-pointer select-none">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
            />

            Remember me

          </label>

          <a
            href="/admin/forgot-password"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Forgot password?
          </a>

        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking credentials...
            </>
          ) : (
            <>
              Sign in to dashboard
              <ArrowRight size={17} />
            </>
          )}

        </button>

      </form>

      {/* Security Information */}
      <div className="mt-7 pt-5 border-t border-slate-100 dark:border-white/[0.07]">

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <LockKeyhole size={13} />
          Protected admin authentication
        </div>

      </div>

    </div>

    {/* Footer */}
    <p className="text-center text-xs text-slate-400 mt-7">
      © 2026 Admin Portal. All rights reserved.
    </p>

  </div>

</main>

);
}