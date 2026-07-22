import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pool } from "@/lib/db";
import { mapPost } from "@/lib/mappers";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const { rows } = await pool.query(`SELECT * FROM posts WHERE slug = $1 AND published = TRUE LIMIT 1`, [slug]);
  if (rows.length === 0) return null;
  return mapPost(rows[0]);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Update not found — Degen Warrior" };
  return {
    title: `${post.title} — Degen Warrior`,
    description: post.excerpt,
  };
}

export default async function UpdatePostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/#updates"
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--twist)" }}
        >
          <ArrowLeft size={14} /> Back To Updates
        </Link>

        <article className="holo-panel cut-corners border p-8 md:p-12" style={{ borderColor: "var(--border-soft)" }}>
          {publishedDate && (
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {publishedDate}
            </p>
          )}
          <h1 className="font-display text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">{post.excerpt}</p>

          <div className="mt-8 space-y-4 whitespace-pre-line text-base leading-relaxed text-[var(--text-secondary)]">
            {post.body}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
