import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { createAdminSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const loginSchema = z.object({
  login: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Введите логин и пароль." }, { status: 400 });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const loginKey = `${parsed.data.login.toLocaleLowerCase("en-US")}:${forwarded}`;

  try {
    const existingLimit = await query<{ attempt_count: number; locked: boolean }>(
      `SELECT attempt_count, (window_started_at >= now() - interval '15 minutes') AS locked
       FROM admin_login_limits
       WHERE login_key = $1`,
      [loginKey],
    );
    if (existingLimit.rows[0]?.locked && existingLimit.rows[0].attempt_count >= 8) {
      return NextResponse.json({ error: "Слишком много попыток входа. Подождите 15 минут." }, { status: 429 });
    }

    const result = await query<{ id: string; password_hash: string; role: string }>(
      "SELECT id, password_hash, role FROM admin_users WHERE login = $1 AND active = true LIMIT 1",
      [parsed.data.login],
    );
    const admin = result.rows[0];
    if (!admin || !(await compare(parsed.data.password, admin.password_hash))) {
      await query(
        `INSERT INTO admin_login_limits (login_key, window_started_at, attempt_count)
         VALUES ($1, now(), 1)
         ON CONFLICT (login_key) DO UPDATE SET
           window_started_at = CASE
             WHEN admin_login_limits.window_started_at < now() - interval '15 minutes' THEN now()
             ELSE admin_login_limits.window_started_at
           END,
           attempt_count = CASE
             WHEN admin_login_limits.window_started_at < now() - interval '15 minutes' THEN 1
             ELSE admin_login_limits.attempt_count + 1
           END`,
        [loginKey],
      );
      return NextResponse.json({ error: "Неверный логин или пароль." }, { status: 401 });
    }
    await query("UPDATE admin_users SET last_login_at = now() WHERE id = $1", [admin.id]);
    await query("DELETE FROM admin_login_limits WHERE login_key = $1", [loginKey]);
    await createAdminSession(admin.id, admin.role);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Admin login failed.", error);
    return NextResponse.json({ error: "Не удалось выполнить вход." }, { status: 500 });
  }
}
