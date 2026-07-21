import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";
import { mapPost } from "@/lib/mappers";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(`SELECT * FROM posts ORDER BY created_at DESC`);
  return NextResponse.json({ posts: rows.map(mapPost) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    body?: string;
    coverImageUrl?: string;
    published?: boolean;
  };

  if (!body.title || !body.excerpt) {
    return NextResponse.json({ error: "missing_fields", message: "Title and excerpt are required." }, { status: 400 });
  }

  const slug = slugify(body.title);
  const published = body.published ?? false;

  const { rows } = await pool.query(
    `INSERT INTO posts (title, slug, excerpt, body, cover_image_url, published, published_at)
     VALUES ($1,$2,$3,$4,$5,$6, CASE WHEN $6 THEN now() ELSE NULL END)
     RETURNING *`,
    [body.title, slug, body.excerpt, body.body ?? "", body.coverImageUrl ?? null, published]
  );

  await logActivity(pool, session.adminUserId, "post_created", { id: rows[0].id, title: body.title });

  return NextResponse.json(mapPost(rows[0]), { status: 201 });
}
