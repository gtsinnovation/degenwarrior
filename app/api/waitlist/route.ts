import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { checkWaitlistRateLimit } from "@/lib/rateLimit";
import { checkEmailAuthenticity, isValidEmail } from "@/lib/waitlist-heuristics";

// Public — the "Join The Waitlist" / newsletter capture form.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { email?: string; source?: string; hp?: string };

  // Honeypot field: a real browser never fills this (it's visually hidden).
  // Bots that blindly fill every form field will populate it — treat that as
  // a silent success (don't tip off the bot) but never insert the row.
  if (body.hp) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.toLowerCase().trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email", message: "Please enter a valid email." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = await checkWaitlistRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many submissions — please try again later." },
      { status: 429 }
    );
  }

  const { status, flagReason } = checkEmailAuthenticity(email);
  const userAgent = request.headers.get("user-agent") || null;

  try {
    await pool.query(
      `INSERT INTO waitlist_signups (email, source, ip_address, user_agent, status, flag_reason)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [email, body.source ?? "site", ip, userAgent, status, flagReason]
    );
  } catch (err) {
    const message = (err as { code?: string }).code === "23505" ? "already_joined" : "internal_error";
    if (message === "already_joined") {
      // Treat duplicate emails as a friendly success, not an error — the
      // person is already on the list, which is what they wanted.
      return NextResponse.json({ ok: true, alreadyJoined: true });
    }
    console.error("[waitlist] insert failed:", err);
    return NextResponse.json({ error: "internal_error", message: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
