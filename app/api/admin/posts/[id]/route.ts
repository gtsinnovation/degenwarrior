import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";
import { mapPost } from "@/lib/mappers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const { id } = await params;

  const body = (await request.json()) as {
    title?: string;
    excerpt?: string;
    body?: string;
    coverImageUrl?: string;
    published?: boolean;
  };

  const { rows } = await pool.query(
    `UPDATE posts SET
       title = COALESCE($1, title),
       excerpt = COALESCE($2, excerpt),
       body = COALESCE($3, body),
       cover_image_url = COALESCE($4, cover_image_url),
       published = COALESCE($5, published),
       published_at = CASE WHEN $5 = TRUE AND published_at IS NULL THEN now() ELSE published_at END,
       updated_at = now()
     WHERE id = $6
     RETURNING *`,
    [body.title ?? null, body.excerpt ?? null, body.body ?? null, body.coverImageUrl ?? null, body.published ?? null, id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await logActivity(pool, session.adminUserId, "post_updated", { id });

  return NextResponse.json(mapPost(rows[0]));
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const { id } = await params;

  const { rowCount } = await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
  if (rowCount === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await logActivity(pool, session.adminUserId, "post_deleted", { id });

  return NextResponse.json({ ok: true });
}
