"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, FileText, Users, Settings, Activity, LogOut } from "lucide-react";
import { WarriorMark } from "@/components/warrior-mark";
import { RoadmapPanel } from "@/components/admin/roadmap-panel";
import { PostsPanel } from "@/components/admin/posts-panel";
import { WaitlistPanel } from "@/components/admin/waitlist-panel";
import { ConfigPanel } from "@/components/admin/config-panel";
import { ActivityPanel } from "@/components/admin/activity-panel";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "roadmap", label: "Roadmap", icon: TrendingUp },
  { id: "posts", label: "Updates", icon: FileText },
  { id: "waitlist", label: "Waitlist", icon: Users },
  { id: "config", label: "Launch Config", icon: Settings },
  { id: "activity", label: "Activity", icon: Activity },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminShell() {
  const [tab, setTab] = useState<TabId>("roadmap");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border-soft)" }}>
        <div className="flex items-center gap-3">
          <WarriorMark size={32} />
          <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Degen Warrior — Admin
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md border px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--danger)]"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <LogOut size={14} /> Log Out
        </button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b p-3 md:w-56 md:flex-col md:border-b-0 md:border-r" style={{ borderColor: "var(--border-soft)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-left font-display text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]",
                tab === t.id && "bg-[var(--neon-soft)] text-[var(--neon)]"
              )}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6">
          {tab === "roadmap" && <RoadmapPanel />}
          {tab === "posts" && <PostsPanel />}
          {tab === "waitlist" && <WaitlistPanel />}
          {tab === "config" && <ConfigPanel />}
          {tab === "activity" && <ActivityPanel />}
        </main>
      </div>
    </div>
  );
}
