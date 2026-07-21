"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { ActivityLogEntry } from "@/types";

interface ActivityRow extends ActivityLogEntry {
  adminEmail: string | null;
}

export function ActivityPanel() {
  const [entries, setEntries] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/activity");
    const data = await res.json();
    setEntries(data.activity ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader2 className="animate-spin text-[var(--neon)]" />;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">Activity Log</h2>
      <p className="text-sm text-[var(--text-secondary)]">Every admin action, in order — an audit trail of who changed what.</p>

      <div className="space-y-2">
        {entries.length === 0 && <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>}
        {entries.map((entry) => (
          <div key={entry.id} className="holo-panel cut-corners border p-4" style={{ borderColor: "var(--border-soft)" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wide" style={{ color: "var(--twist)" }}>
                {entry.action}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{entry.adminEmail ?? "unknown admin"}</p>
            {Object.keys(entry.metadata).length > 0 && (
              <pre className="mt-2 overflow-x-auto rounded bg-[var(--bg-input)] p-2 font-mono text-[10px] text-[var(--text-muted)]">
                {JSON.stringify(entry.metadata, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
