import Image from "next/image";

const HERO_IMAGE_URL = "https://galaxy-prod.tlcdn.com/gen/user_321HpBS0N3wNsExhmni8Y9Gx4VV/db623135-9ef7-4b4f-a92e-88f2cec5836b.webp";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-[var(--border-soft)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(0,255,102,0.10), transparent 55%), radial-gradient(ellipse at bottom right, rgba(0,229,255,0.08), transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span
            className="inline-block rounded-full border px-4 py-1 font-mono text-xs uppercase tracking-widest"
            style={{ borderColor: "var(--border-twist)", color: "var(--twist)", boxShadow: "var(--glow-twist-sm)" }}
          >
            Pre-Launch &middot; Building The Community
          </span>

          <h1 className="font-display mt-6 text-5xl font-black leading-tight tracking-wide text-white sm:text-6xl">
            DEGEN
            <br />
            <span style={{ color: "var(--neon)", textShadow: "var(--glow-green-md)" }}>WARRIOR</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-[var(--text-secondary)]">
            Not a token yet — an army being built. Forged from the resilience of every degen who got knocked down and
            came back sharper.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#join"
              className="animate-pulse-glow rounded-md px-7 py-3 font-display text-sm font-bold uppercase tracking-widest text-black"
              style={{ background: "var(--neon)" }}
            >
              Join Waitlist
            </a>
            <a
              href="#updates"
              className="rounded-md border px-7 py-3 font-display text-sm font-bold uppercase tracking-widest"
              style={{ borderColor: "var(--border-twist)", color: "var(--twist)" }}
            >
              Join Community
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <Image
            src={HERO_IMAGE_URL}
            alt="Degen Warrior masked samurai character"
            width={1475}
            height={1024}
            className="w-full drop-shadow-[0_0_40px_rgba(0,255,102,0.25)]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
