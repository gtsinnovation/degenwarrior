import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(`SELECT id, email, display_name FROM admin_users WHERE id = $1`, [
    session.adminUserId,
  ]);
  if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ id: rows[0].id, email: rows[0].email, displayName: rows[0].display_name });
}
