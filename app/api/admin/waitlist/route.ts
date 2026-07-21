import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";
import { mapWaitlistSignup } from "@/lib/mappers";
import { WaitlistStatus } from "@/types";

const VALID_STATUSES: WaitlistStatus[] = ["pending", "verified", "flagged", "rejected"];

export async function GET(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (statusFilter && VALID_STATUSES.includes(statusFilter as WaitlistStatus)) {
    params.push(statusFilter);
    clauses.push(`status = $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `SELECT * FROM waitlist_signups ${where} ORDER BY created_at DESC LIMIT 500`,
    params
  );

  const counts = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM waitlist_signups GROUP BY status`
  );

  return NextResponse.json({
    signups: rows.map(mapWaitlistSignup),
    counts: Object.fromEntries(counts.rows.map((r) => [r.status, r.count])),
  });
}

// Body: { id: string, status: "pending" | "verified" | "flagged" | "rejected" }
export async function PATCH(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as { id?: string; status?: string };
  if (!body.id || !body.status || !VALID_STATUSES.includes(body.status as WaitlistStatus)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `UPDATE waitlist_signups SET status = $1 WHERE id = $2 RETURNING *`,
    [body.status, body.id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await logActivity(pool, session.adminUserId, "waitlist_status_updated", { id: body.id, status: body.status });

  return NextResponse.json(mapWaitlistSignup(rows[0]));
}
