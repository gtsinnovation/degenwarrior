"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WarriorMark } from "@/components/warrior-mark";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#join", label: "Join The Ranks" },
  { href: "#roadmap", label: "Road Map" },
  { href: "#updates", label: "Updates" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="#home" className="flex items-center gap-3">
          <WarriorMark size={38} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-black tracking-wide text-white">DEGEN</span>
            <span
              className="font-display -mt-1 text-lg font-black tracking-wide"
              style={{ color: "var(--neon)", textShadow: "var(--glow-green-sm)" }}
            >
              WARRIOR
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:text-[var(--neon)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#join"
          className="hidden rounded-full border px-5 py-2 font-display text-xs font-bold uppercase tracking-widest md:inline-block"
          style={{ borderColor: "var(--border-twist)", color: "var(--twist)", boxShadow: "var(--glow-twist-sm)" }}
        >
          Join Waitlist
        </a>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--border-soft)] bg-black/95 px-6 py-4 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 font-display text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--neon)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full border px-4 py-2 text-center font-display text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: "var(--border-twist)", color: "var(--twist)" }}
          >
            Join Waitlist
          </a>
        </nav>
      )}
    </header>
  );
}
