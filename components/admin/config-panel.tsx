"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { SiteConfig } from "@/types";

export function ConfigPanel() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/config");
    setConfig(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading || !config) {
    return <Loader2 className="animate-spin text-[var(--neon)]" />;
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">Launch Config</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Flip this switch when the token actually launches — it swaps "Join Waitlist" for "Buy Now" and reveals the
          How To Buy flow site-wide. Keep it off during community building.
        </p>
      </div>

      <div className="holo-panel cut-corners flex items-center justify-between border p-5" style={{ borderColor: "var(--border-soft)" }}>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">Launch Live</p>
          <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
            Currently: {config.launchLive ? "LIVE" : "Pre-Launch"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfig({ ...config, launchLive: !config.launchLive })}
          className="h-7 w-14 rounded-full border transition-colors"
          style={{
            borderColor: config.launchLive ? "var(--border-neon)" : "var(--border-soft)",
            background: config.launchLive ? "var(--neon-soft)" : "var(--bg-input)",
          }}
        >
          <span
            className="block h-5 w-5 rounded-full transition-transform"
            style={{
              background: config.launchLive ? "var(--neon)" : "var(--text-muted)",
              transform: config.launchLive ? "translateX(30px)" : "translateX(4px)",
            }}
          />
        </button>
      </div>

      <div className="space-y-1">
        <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
          Token Contract Address
        </label>
        <input
          value={config.tokenAddress ?? ""}
          onChange={(e) => setConfig({ ...config, tokenAddress: e.target.value })}
          placeholder="Not set yet"
          className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
          style={{ borderColor: "var(--border-soft)" }}
        />
      </div>

      <div className="space-y-1">
        <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Buy Link</label>
        <input
          value={config.buyLink ?? ""}
          onChange={(e) => setConfig({ ...config, buyLink: e.target.value })}
          placeholder="Not set yet"
          className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
          style={{ borderColor: "var(--border-soft)" }}
        />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 rounded-md px-6 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-black disabled:opacity-60"
        style={{ background: "var(--neon)" }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : null}
        {saved ? "Saved" : "Save Changes"}
      </button>
    </div>
  );
}
