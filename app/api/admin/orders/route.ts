import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { query, queryInTransaction, withTransaction } from "@/lib/db";

export const runtime = "nodejs";

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["processing", "shipped", "completed", "cancelled"]),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const params = new URL(request.url).searchParams;
    const status = params.get("status");
    const mode = params.get("mode");
    const values: unknown[] = [];
    const conditions: string[] = [];
    if (status) {
      values.push(status);
      conditions.push(`o.status = $${values.length}`);
    }
    if (mode === "buy" || mode === "rent") {
      values.push(mode);
      conditions.push(`o.mode = $${values.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await query(
      `SELECT o.id, o.mode, o.status, o.amount, o.currency, o.rental_start, o.rental_end,
              o.payment_id, o.created_at, c.name AS customer_name, c.phone, c.email, c.address,
              COALESCE(json_agg(json_build_object(
                'productId', oi.product_id, 'name', oi.product_name, 'model', oi.product_model,
                'quantity', oi.quantity, 'unitPrice', oi.unit_price, 'lineTotal', oi.line_total
              )) FILTER (WHERE oi.id IS NOT NULL), '[]'::json) AS items
       FROM orders o JOIN customers c ON c.id = o.customer_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id, c.id
       ORDER BY o.created_at DESC LIMIT 200`,
      values,
    );
    return NextResponse.json({ orders: result.rows });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to load admin orders.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось загрузить заказы." }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const parsed = statusSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Некорректный статус заказа." }, { status: 400 });
    const result = await withTransaction(async (client) => {
      const order = await queryInTransaction<{ id: string; status: string; mode: "buy" | "rent" }>(
        client,
        "SELECT id, status, mode FROM orders WHERE id = $1 FOR UPDATE",
        [parsed.data.orderId],
      );
      const currentStatus = order.rows[0]?.status;
      const mode = order.rows[0]?.mode;
      const allowedNext: Record<string, string[]> = {
        pending_payment: ["cancelled"],
        paid: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["completed"],
      };
      if (!currentStatus || !allowedNext[currentStatus]?.includes(parsed.data.status)) return null;

      if (
        parsed.data.status === "cancelled" &&
        mode === "buy" &&
        (currentStatus === "paid" || currentStatus === "processing")
      ) {
        await client.query(
          `UPDATE products p
           SET stock_quantity = p.stock_quantity + oi.quantity, updated_at = now()
           FROM order_items oi
           WHERE oi.order_id = $1 AND oi.product_id = p.id`,
          [parsed.data.orderId],
        );
      }

      const updated = await client.query(
        "UPDATE orders SET status = $2::order_status, updated_at = now() WHERE id = $1 RETURNING id, status",
        [parsed.data.orderId, parsed.data.status],
      );
      return updated.rows[0];
    });
    if (!result) return NextResponse.json({ error: "Заказ не найден или переход статуса недопустим." }, { status: 409 });
    return NextResponse.json({ order: result });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to update order status.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось обновить статус заказа." }, { status });
  }
}
