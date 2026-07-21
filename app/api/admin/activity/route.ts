import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/adminGuard";
import { mapActivityLog } from "@/lib/mappers";

export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(
    `SELECT al.id, al.admin_user_id, al.action, al.metadata, al.created_at, au.email AS admin_email
     FROM activity_logs al
     LEFT JOIN admin_users au ON au.id = al.admin_user_id
     ORDER BY al.created_at DESC LIMIT 100`
  );

  return NextResponse.json({
    activity: rows.map((r) => ({ ...mapActivityLog(r), adminEmail: r.admin_email as string | null })),
  });
}
