import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mapPost } from "@/lib/mappers";

// Public — only published posts, for the Updates section.
export async function GET(): Promise<NextResponse> {
  const { rows } = await pool.query(
    `SELECT * FROM posts WHERE published = TRUE ORDER BY published_at DESC LIMIT 20`
  );
  return NextResponse.json({ posts: rows.map(mapPost) });
}
