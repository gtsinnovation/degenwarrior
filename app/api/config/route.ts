import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { mapSiteConfig } from "@/lib/mappers";

// Public — drives whether the site shows pre-launch or live-launch UI.
export async function GET(): Promise<NextResponse> {
  const { rows } = await pool.query(`SELECT launch_live, token_address, buy_link FROM site_config WHERE id = 1`);
  const config = rows[0] ? mapSiteConfig(rows[0]) : { launchLive: false, tokenAddress: null, buyLink: null };
  return NextResponse.json(config);
}
