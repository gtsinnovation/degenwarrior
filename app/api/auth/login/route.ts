import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { signAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { logActivity } from "@/lib/adminGuard";

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields", message: "Email and password are required." }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT id, email, password_hash, display_name FROM admin_users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );

  const genericError = NextResponse.json(
    { error: "invalid_credentials", message: "Invalid email or password." },
    { status: 401 }
  );

  if (rows.length === 0) return genericError;

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return genericError;

  await pool.query(`UPDATE admin_users SET last_login_at = now() WHERE id = $1`, [user.id]);
  await logActivity(pool, user.id, "admin_login", {});

  const token = signAdminSession({ adminUserId: user.id, email: user.email });
  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, displayName: user.display_name } });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
