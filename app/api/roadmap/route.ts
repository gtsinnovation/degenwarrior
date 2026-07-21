import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mapRoadmapPhase } from "@/lib/mappers";

// Public — powers the Roadmap section.
export async function GET(): Promise<NextResponse> {
  const { rows } = await pool.query(
    `SELECT id, position, title, bullets, status FROM roadmap_phases ORDER BY position ASC`
  );
  return NextResponse.json({ phases: rows.map(mapRoadmapPhase) });
}
