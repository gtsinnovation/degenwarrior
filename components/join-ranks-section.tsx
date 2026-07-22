"use client";

import { useState, FormEvent } from "react";
import { ExternalLink, MessageCircle, Bell, Gift, Loader2, CheckCircle } from "lucide-react";

const STEPS = [
  { icon: ExternalLink, title: "Follow On X", desc: "Follow @degenwar_game for real-time updates." },
  { icon: MessageCircle, title: "Join Discord / Telegram", desc: "Where the actual army gathers and talks." },
  { icon: Bell, title: "Join The Waitlist", desc: "Get a 24-hour heads-up before launch — fair launch for everyone, no priority access." },
  { icon: Gift, title: "Hold For The Airdrop", desc: "Waitlist members who hold through the airdrop date qualify for the drop." },
];

export function JoinRanksSection() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "join-ranks", hp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(data.alreadyJoined ? "You're already on the list, warrior." : "You're in. Welcome to the ranks.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <section id="join" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
          Join The <span style={{ color: "var(--neon)" }}>Warrior Ranks</span>
        </h2>
        <p className="mt-3 font-mono text-sm text-[var(--text-secondary)]">
          Fair launch. No token yet — just an army being built.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.title} className="holo-panel cut-corners border p-6" style={{ borderColor: "var(--border-soft)" }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--danger)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--neon)" }} />
            </div>
            <step.icon size={22} style={{ color: "var(--twist)" }} />
            <h3 className="font-display mt-3 text-sm font-bold uppercase tracking-wide text-white">{step.title}</h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{step.desc}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 rounded-md border bg-[var(--bg-input)] px-4 py-3 text-sm text-white outline-none placeholder:text-[var(--text-muted)]"
            style={{ borderColor: "var(--border-soft)" }}
          />
          {/* Honeypot — hidden from real users via CSS, bots fill every field blindly. */}
          <input
            type="text"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute h-0 w-0 opacity-0"
            aria-hidden="true"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="animate-pulse-glow flex items-center justify-center gap-2 rounded-md px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-black disabled:opacity-60"
            style={{ background: "var(--neon)" }}
          >
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Join Waitlist"}
          </button>
        </div>
        {message && (
          <p
            className="flex items-center gap-2 font-mono text-sm"
            style={{ color: status === "success" ? "var(--neon)" : "var(--danger)" }}
          >
            {status === "success" && <CheckCircle size={16} />}
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
