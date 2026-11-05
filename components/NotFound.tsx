
"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] px-6 text-gray-900 dark:bg-[#09090b] dark:text-white">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-lg text-center">
                {/* 404 */}
                <h1 className="select-none text-[120px] font-black leading-none tracking-tighter text-blue-600 sm:text-[160px]">
                    404
                </h1>

                {/* Content */}
                <div className="mt-8 space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Page Not Found
                    </h2>

                    <p className="mx-auto max-w-sm text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                        Sorry, the page you&apos;re looking for doesn&apos;t exist,
                        has been moved, or is temporarily unavailable.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-gray-50 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                        Go Back
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-16 text-xs text-gray-400">
                    Error Code: 404 · Page Not Found
                </p>
            </div>
        </main>
    );
}
