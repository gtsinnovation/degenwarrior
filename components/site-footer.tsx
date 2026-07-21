import { MessageCircle, Send, Video, ExternalLink } from "lucide-react";
import { WarriorMark } from "@/components/warrior-mark";

const SOCIALS = [
  { icon: ExternalLink, label: "X" },
  { icon: Video, label: "YouTube" },
  { icon: MessageCircle, label: "Discord" },
  { icon: Send, label: "Telegram" },
];

const FOOTER_LINKS = ["About Us", "Terms", "Contact", "Join Us", "Disclaimer"];

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border-twist)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <WarriorMark size={32} />
          <span className="font-display text-sm font-bold uppercase tracking-widest text-white">Degen Warrior</span>
        </div>

        <div className="flex gap-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--border-neon)", color: "var(--neon)" }}
            >
              <social.icon size={16} />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-5 font-mono text-xs text-[var(--text-secondary)]">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-[var(--neon)]">
              {link}
            </a>
          ))}
        </div>
      </div>
      <p className="pb-6 text-center font-mono text-[10px] text-[var(--text-muted)]">
        &copy; {new Date().getFullYear()} Degen Warrior. Pre-launch — building the community.
      </p>
    </footer>
  );
}
