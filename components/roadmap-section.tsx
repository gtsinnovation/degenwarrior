import { Check, Lock } from "lucide-react";
import { RoadmapPhase } from "@/types";
import { cn } from "@/lib/utils";

function PhaseCard({ phase }: { phase: RoadmapPhase }) {
  const isActive = phase.status === "active";
  const isCompleted = phase.status === "completed";
  const isLocked = phase.status === "locked";

  return (
    <div
      className={cn(
        "holo-panel cut-corners relative flex flex-col gap-3 border p-6 transition-all",
        isActive && "animate-pulse-glow",
        isLocked && "opacity-50 grayscale"
      )}
      style={{
        borderColor: isCompleted ? "var(--border-neon)" : isActive ? "var(--border-twist)" : "var(--border-soft)",
        boxShadow: isActive ? "var(--glow-twist-md)" : isCompleted ? "var(--glow-green-sm)" : undefined,
      }}
    >
      {isActive && (
        <span
          className="absolute -top-3 left-6 rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ borderColor: "var(--border-twist)", color: "var(--twist)", background: "#050505" }}
        >
          You Are Here
        </span>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">{phase.title}</h3>
        {isCompleted && <Check size={18} style={{ color: "var(--neon)" }} />}
        {isLocked && <Lock size={16} className="text-[var(--text-muted)]" />}
      </div>

      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
        {phase.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span style={{ color: isLocked ? "var(--text-muted)" : "var(--neon)" }}>&raquo;</span>
            {bullet}
          </li>
        ))}
      </ul>

      {isLocked && (
        <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          Upcoming
        </span>
      )}
    </div>
  );
}

export function RoadmapSection({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display mb-12 text-center text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
        Road<span style={{ color: "var(--neon)" }}>map</span>
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </section>
  );
}
