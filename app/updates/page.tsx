import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { pool } from "@/lib/db";
import { mapPost } from "@/lib/mappers";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Updates — Degen Warrior",
  description: "All community updates and progress reports from Degen Warrior.",
};

async function getAllPosts() {
  const { rows } = await pool.query(
    `SELECT * FROM posts WHERE published = TRUE ORDER BY published_at DESC LIMIT 100`
  );
  return rows.map(mapPost);
}

export default async function AllUpdatesPage() {
  const posts = await getAllPosts();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="mb-12 text-center font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
          All <span style={{ color: "var(--neon)" }}>Updates</span>
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)]">No updates published yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="holo-panel cut-corners border p-7"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <FileText size={22} style={{ color: "var(--neon)" }} />
                <h2 className="font-display mt-4 text-lg font-bold uppercase tracking-wide text-white">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{post.excerpt}</p>
                <Link
                  href={`/updates/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--twist)" }}
                >
                  Continue Reading <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
