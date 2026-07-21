import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "dw_admin_session";

export interface AdminSessionPayload {
  adminUserId: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me-in-production";

export function signAdminSession(payload: AdminSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminSession(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSessionPayload;
  } catch {
    return null;
  }
}

/** Reads and verifies the admin session cookie in a Server Component / Route Handler. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}
