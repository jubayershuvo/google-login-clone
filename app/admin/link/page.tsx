
"use client";

import { useCallback, useEffect, useState } from "react";

interface LinkItem {
    _id: string;
    name: string;
}

export default function LinkManagePage() {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getLinkUrl = (linkName: string) => {
        if (typeof window === "undefined") return "";

        return `${window.location.origin}/${encodeURIComponent(linkName)}`;
    };

    // Fetch links (manual refresh)
    const fetchLinks = useCallback(async () => {
        try {
            setError("");

            const response = await fetch("/api/admin/link", {
                cache: "no-store",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch links");
            }

            setLinks(data.links || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        const controller = new AbortController();

        const loadLinks = async () => {
            try {
                const response = await fetch("/api/admin/link", {
                    cache: "no-store",
                    signal: controller.signal,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch links");
                }

                setLinks(data.links || []);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadLinks();

        return () => controller.abort();
    }, []);

    // Create link
    const createLink = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!name.trim() || creating) return;

        try {
            setCreating(true);
            setError("");
            setMessage("");

            const response = await fetch("/api/admin/link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create link");
            }

            setLinks((prev) => [data.link, ...prev]);
            setName("");
            setMessage("Link created successfully!");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create link"
            );
        } finally {
            setCreating(false);
        }
    };

    // Copy link
    const copyLink = async (linkName: string) => {
        try {
            const url = getLinkUrl(linkName);

            await navigator.clipboard.writeText(url);

            setCopied(linkName);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            setError("Failed to copy link");
        }
    };

    // Delete all links
    const deleteAllLinks = async () => {
        if (links.length === 0 || deleting) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete all ${links.length} links? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            setError("");
            setMessage("");

            const response = await fetch("/api/admin/link", {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete links");
            }

            setLinks([]);
            setMessage(
                `${data.deletedCount} links deleted successfully.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete links"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-gray-900 dark:bg-[#09090b] dark:text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl space-y-8">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Link Management
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Create, manage and share your links.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setLoading(true);
                            void fetchLinks();
                        }}
                        disabled={loading}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* Create Link */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111113] sm:p-6">
                    <h2 className="mb-1 text-lg font-semibold">
                        Create New Link
                    </h2>

                    <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        Enter a link name to generate a URL using your current domain.
                    </p>

                    <form
                        onSubmit={createLink}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter link name..."
                            required
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5"
                        />

                        <button
                            type="submit"
                            disabled={creating || !name.trim()}
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "+ Create Link"}
                        </button>
                    </form>
                </section>

                {/* Notifications */}
                {message && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Link List */}
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111113]">

                    <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 dark:border-white/10 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-semibold">
                                All Links
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {links.length} total links
                            </p>
                        </div>

                        <button
                            onClick={() => void deleteAllLinks()}
                            disabled={deleting || links.length === 0}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete All Links"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                        </div>
                    ) : links.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="mb-3 text-4xl">
                                🔗
                            </div>

                            <h3 className="font-semibold">
                                No links found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create your first link to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {links.map((link, index) => (
                                <div
                                    key={link._id}
                                    className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                #{index + 1}
                                            </span>

                                            <h3 className="font-semibold">
                                                {link.name}
                                            </h3>
                                        </div>

                                        <p className="break-all text-sm text-blue-600 dark:text-blue-400">
                                            {getLinkUrl(link.name)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            void copyLink(link.name)
                                        }
                                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                    >
                                        {copied === link.name
                                            ? "✓ Copied"
                                            : "Copy Link"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <p className="text-center text-xs text-gray-400">
                    Link Management Dashboard
                </p>
            </div>
        </main>
    );
}
