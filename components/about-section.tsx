import { WarriorMark } from "@/components/warrior-mark";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <div className="holo-panel cut-corners glow-green flex flex-col items-center gap-8 p-10 text-center md:p-14">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border" style={{ borderColor: "var(--border-neon)", boxShadow: "var(--glow-green-sm)" }}>
          <WarriorMark size={48} />
        </div>

        <h2 className="font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
          About <span style={{ color: "var(--neon)" }}>Degen Warrior</span>
        </h2>

        <div className="max-w-2xl space-y-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          <p>
            Every degen carries scars from the last cycle — the rugs, the dumps, the promises that never shipped.
            Degen Warrior was forged from those stories: SectorH&rsquo;s resilience, and every trader who got knocked
            down and came back sharper.
          </p>
          <p>
            We are not soft. We are not naive. We are veterans of the charts, banded together — tough enough to
            survive the battlefield, wise enough to protect the ones who join us.
          </p>
        </div>

        <a
          href="#join"
          className="rounded-md border px-8 py-3 font-display text-sm font-bold uppercase tracking-widest"
          style={{ borderColor: "var(--border-twist)", color: "var(--twist)", boxShadow: "var(--glow-twist-sm)" }}
        >
          Join Community
        </a>
      </div>
    </section>
  );
}
