import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/adminGuard";
import { mapSiteConfig } from "@/lib/mappers";

export async function GET(): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { rows } = await pool.query(`SELECT launch_live, token_address, buy_link FROM site_config WHERE id = 1`);
  return NextResponse.json(mapSiteConfig(rows[0]));
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as { launchLive?: boolean; tokenAddress?: string; buyLink?: string };

  const { rows } = await pool.query(
    `UPDATE site_config SET
       launch_live = COALESCE($1, launch_live),
       token_address = COALESCE($2, token_address),
       buy_link = COALESCE($3, buy_link),
       updated_at = now()
     WHERE id = 1
     RETURNING launch_live, token_address, buy_link`,
    [body.launchLive ?? null, body.tokenAddress ?? null, body.buyLink ?? null]
  );

  await logActivity(pool, session.adminUserId, "config_updated", body);

  return NextResponse.json(mapSiteConfig(rows[0]));
}
