import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const [today, week, products] = await Promise.all([
      query<{ count: string; revenue: string }>(
        `SELECT COUNT(*)::text AS count, COALESCE(SUM(amount), 0)::text AS revenue
         FROM orders WHERE status IN ('paid', 'processing', 'shipped', 'completed')
           AND created_at >= date_trunc('day', now())`,
      ),
      query<{ count: string; revenue: string }>(
        `SELECT COUNT(*)::text AS count, COALESCE(SUM(amount), 0)::text AS revenue
         FROM orders WHERE status IN ('paid', 'processing', 'shipped', 'completed')
           AND created_at >= now() - interval '7 days'`,
      ),
      query<{ count: string }>("SELECT COUNT(*)::text AS count FROM products"),
    ]);
    return NextResponse.json({
      today: { orders: Number(today.rows[0].count), revenue: Number(today.rows[0].revenue) },
      week: { orders: Number(week.rows[0].count), revenue: Number(week.rows[0].revenue) },
      products: Number(products.rows[0].count),
    });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to load admin dashboard.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось загрузить сводку." }, { status });
  }
}
