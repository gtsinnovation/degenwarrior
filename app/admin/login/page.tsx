"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { WarriorMark } from "@/components/warrior-mark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-void)] px-6">
      <form
        onSubmit={handleSubmit}
        className="holo-panel cut-corners glow-green w-full max-w-sm space-y-5 border p-8"
      >
        <div className="flex flex-col items-center gap-3">
          <WarriorMark size={48} />
          <h1 className="font-display text-xl font-black uppercase tracking-wide text-white">Admin Access</h1>
        </div>

        <div className="space-y-1">
          <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div className="space-y-1">
          <label className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        {error && <p className="font-mono text-xs text-[var(--danger)]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-display text-sm font-bold uppercase tracking-widest text-black disabled:opacity-60"
          style={{ background: "var(--neon)" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
        </button>
      </form>
    </div>
  );
}
