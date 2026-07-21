import { NextResponse } from "next/server";
import { getAdminSession, AdminSessionPayload } from "./auth";

/**
 * Call at the top of every /api/admin/* route handler. Returns the verified
 * session on success, or a ready-to-return 401 NextResponse on failure —
 * callers do `const session = await requireAdmin(); if (session instanceof NextResponse) return session;`
 */
export async function requireAdmin(): Promise<AdminSessionPayload | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return session;
}

export async function logActivity(
  pool: import("pg").Pool,
  adminUserId: string,
  action: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await pool.query(`INSERT INTO activity_logs (admin_user_id, action, metadata) VALUES ($1,$2,$3)`, [
    adminUserId,
    action,
    JSON.stringify(metadata),
  ]);
}
