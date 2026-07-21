import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// CSV export of verified waitlist emails — the real launch whitelist.
export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(
    `SELECT email, status, created_at FROM waitlist_signups WHERE status = 'verified' ORDER BY created_at ASC`
  );

  const header = "email,status,joined_at";
  const lines = rows.map((r) => [csvEscape(r.email), r.status, r.created_at.toISOString()].join(","));
  const csv = [header, ...lines].join("\n");

  await logActivity(pool, session.adminUserId, "waitlist_exported", { count: rows.length });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="waitlist-verified-${Date.now()}.csv"`,
    },
  });
}
