import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { query } from "@/lib/db";

const cookieName = "nord_admin_session";
const sessionTtlSeconds = 60 * 60 * 8;

function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(adminId: string, role: string) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${sessionTtlSeconds}s`)
    .sign(signingKey());

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionTtlSeconds,
  });
}

export async function getAdminSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, signingKey());
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null;
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    const error = new Error("Admin authentication required.");
    Object.assign(error, { status: 401 });
    throw error;
  }
  const active = await query<{ role: string }>(
    "SELECT role FROM admin_users WHERE id = $1 AND active = true LIMIT 1",
    [session.id],
  );
  if (!active.rows[0]) {
    await clearAdminSession();
    const error = new Error("Admin account is inactive.");
    Object.assign(error, { status: 401 });
    throw error;
  }
  return { ...session, role: active.rows[0].role };
}
