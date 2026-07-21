import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";
import { mapRoadmapPhase } from "@/lib/mappers";
import { RoadmapStatus } from "@/types";

const VALID_STATUSES: RoadmapStatus[] = ["locked", "active", "completed"];

export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(
    `SELECT id, position, title, bullets, status FROM roadmap_phases ORDER BY position ASC`
  );
  return NextResponse.json({ phases: rows.map(mapRoadmapPhase) });
}

// Body: { id: string, status: "locked" | "active" | "completed" }
// Toggling a phase to "unlock" it when a milestone is achieved.
export async function PATCH(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as { id?: string; status?: string };
  if (!body.id || !body.status || !VALID_STATUSES.includes(body.status as RoadmapStatus)) {
    return NextResponse.json({ error: "invalid_request", message: "id and a valid status are required." }, { status: 400 });
  }

  const { rows } = await pool.query(
    `UPDATE roadmap_phases SET status = $1, updated_at = now() WHERE id = $2 RETURNING id, position, title, bullets, status`,
    [body.status, body.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await logActivity(pool, session.adminUserId, "roadmap_status_updated", { id: body.id, status: body.status });

  return NextResponse.json(mapRoadmapPhase(rows[0]));
}
