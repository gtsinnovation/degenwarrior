"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Download, AlertTriangle } from "lucide-react";
import { WaitlistSignup, WaitlistStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: WaitlistStatus[] = ["pending", "verified", "flagged", "rejected"];

const STATUS_COLOR: Record<WaitlistStatus, string> = {
  pending: "var(--text-secondary)",
  verified: "var(--neon)",
  flagged: "var(--warning)",
  rejected: "var(--danger)",
};

export function WaitlistPanel() {
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WaitlistStatus | "all">("all");

  const load = useCallback(async (status: WaitlistStatus | "all") => {
    setLoading(true);
    const query = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/admin/waitlist${query}`);
    const data = await res.json();
    setSignups(data.signups ?? []);
    setCounts(data.counts ?? {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  async function updateStatus(id: string, status: WaitlistStatus) {
    await fetch("/api/admin/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load(filter);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">Waitlist Review</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Review signups for authenticity before they count toward the real launch whitelist.
          </p>
        </div>
        <a
          href="/api/admin/waitlist/export"
          className="flex items-center gap-2 rounded-md border px-4 py-2 font-display text-xs font-bold uppercase tracking-widest"
          style={{ borderColor: "var(--border-neon)", color: "var(--neon)" }}
        >
          <Download size={14} /> Export Verified CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className="rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide"
            style={{
              borderColor: filter === s ? "var(--border-twist)" : "var(--border-soft)",
              color: filter === s ? "var(--twist)" : "var(--text-secondary)",
            }}
          >
            {s} {s !== "all" && counts[s] !== undefined ? `(${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader2 className="animate-spin text-[var(--neon)]" />
      ) : signups.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No signups in this view yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b font-mono text-xs uppercase tracking-wide text-[var(--text-muted)]" style={{ borderColor: "var(--border-soft)" }}>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Flag Reason</th>
                <th className="py-2 pr-4">Joined</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((signup) => (
                <tr key={signup.id} className="border-b" style={{ borderColor: "var(--border-soft)" }}>
                  <td className="py-2 pr-4 text-white">{signup.email}</td>
                  <td className="py-2 pr-4">
                    <span className="font-mono text-xs uppercase" style={{ color: STATUS_COLOR[signup.status] }}>
                      {signup.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs text-[var(--text-muted)]">
                    {signup.flagReason && (
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={12} /> {signup.flagReason}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-xs text-[var(--text-muted)]">
                    {new Date(signup.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-1.5">
                      {STATUS_OPTIONS.filter((s) => s !== signup.status).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateStatus(signup.id, option)}
                          className={cn(
                            "rounded border px-2 py-1 font-mono text-[10px] uppercase text-[var(--text-secondary)] hover:text-white"
                          )}
                          style={{ borderColor: "var(--border-soft)" }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
