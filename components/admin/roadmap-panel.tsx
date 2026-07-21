"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Lock, Check } from "lucide-react";
import { RoadmapPhase, RoadmapStatus } from "@/types";

const STATUS_OPTIONS: RoadmapStatus[] = ["locked", "active", "completed"];

export function RoadmapPanel() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/roadmap");
    const data = await res.json();
    setPhases(data.phases ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: RoadmapStatus) {
    setSavingId(id);
    await fetch("/api/admin/roadmap", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setSavingId(null);
  }

  if (loading) {
    return <Loader2 className="animate-spin text-[var(--neon)]" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">
        Roadmap Milestone Control
      </h2>
      <p className="max-w-xl text-sm text-[var(--text-secondary)]">
        Unlock a milestone the moment it's achieved — flip a phase to Active when it starts, Completed when it's
        done. Changes go live on the public site immediately.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {phases.map((phase) => (
          <div key={phase.id} className="holo-panel cut-corners border p-5" style={{ borderColor: "var(--border-soft)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">{phase.title}</h3>
              {phase.status === "completed" && <Check size={16} style={{ color: "var(--neon)" }} />}
              {phase.status === "locked" && <Lock size={14} className="text-[var(--text-muted)]" />}
            </div>
            <div className="mt-3 flex gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={savingId === phase.id}
                  onClick={() => updateStatus(phase.id, option)}
                  className="rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide disabled:opacity-50"
                  style={{
                    borderColor: phase.status === option ? "var(--border-twist)" : "var(--border-soft)",
                    color: phase.status === option ? "var(--twist)" : "var(--text-secondary)",
                    background: phase.status === option ? "var(--twist-soft)" : "transparent",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
