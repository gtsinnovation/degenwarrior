"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Trash, Edit } from "lucide-react";
import { Post } from "@/types";

interface DraftPost {
  id?: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
}

const EMPTY_DRAFT: DraftPost = { title: "", excerpt: "", body: "", published: false };

export function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftPost | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    const isEdit = Boolean(draft.id);
    await fetch(isEdit ? `/api/admin/posts/${draft.id}` : "/api/admin/posts", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    setDraft(null);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">Updates</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Create, edit, and publish community updates.</p>
        </div>
        <button
          type="button"
          onClick={() => setDraft(EMPTY_DRAFT)}
          className="flex items-center gap-2 rounded-md px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-black"
          style={{ background: "var(--neon)" }}
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {draft && (
        <div className="holo-panel cut-corners space-y-3 border p-5" style={{ borderColor: "var(--border-twist)" }}>
          <input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
            style={{ borderColor: "var(--border-soft)" }}
          />
          <textarea
            placeholder="Excerpt (short summary shown on the card)"
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
            rows={2}
            style={{ borderColor: "var(--border-soft)" }}
          />
          <textarea
            placeholder="Full post body"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            className="w-full rounded-md border bg-[var(--bg-input)] px-3 py-2 text-sm text-white outline-none"
            rows={5}
            style={{ borderColor: "var(--border-soft)" }}
          />
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Published
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.title || !draft.excerpt}
              className="flex items-center gap-2 rounded-md px-5 py-2 font-display text-xs font-bold uppercase tracking-widest text-black disabled:opacity-50"
              style={{ background: "var(--neon)" }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />} Save
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-md border px-5 py-2 font-display text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]"
              style={{ borderColor: "var(--border-soft)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <Loader2 className="animate-spin text-[var(--neon)]" />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="holo-panel cut-corners flex items-center justify-between gap-4 border p-4"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-white">{post.title}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide" style={{ color: post.published ? "var(--neon)" : "var(--text-muted)" }}>
                  {post.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ id: post.id, title: post.title, excerpt: post.excerpt, body: post.body, published: post.published })
                  }
                  className="rounded-md border p-2 text-[var(--text-secondary)] hover:text-[var(--twist)]"
                  style={{ borderColor: "var(--border-soft)" }}
                  aria-label="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="rounded-md border p-2 text-[var(--text-secondary)] hover:text-[var(--danger)]"
                  style={{ borderColor: "var(--border-soft)" }}
                  aria-label="Delete"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
