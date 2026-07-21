import { FileText, ArrowRight } from "lucide-react";
import { Post } from "@/types";

export function UpdatesSection({ posts }: { posts: Post[] }) {
  return (
    <section id="updates" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">Updates</h2>
        <p className="text-sm text-[var(--text-secondary)]">Follow Degen Warrior on X for the latest.</p>
        <a
          href="#"
          className="rounded-md border px-5 py-2 font-display text-xs font-bold uppercase tracking-widest"
          style={{ borderColor: "var(--border-twist)", color: "var(--twist)" }}
        >
          View All
        </a>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)]">No updates published yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="holo-panel cut-corners border p-7" style={{ borderColor: "var(--border-soft)" }}>
              <FileText size={22} style={{ color: "var(--neon)" }} />
              <h3 className="font-display mt-4 text-lg font-bold uppercase tracking-wide text-white">{post.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{post.excerpt}</p>
              <a
                href={`/updates/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--twist)" }}
              >
                Continue Reading <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
