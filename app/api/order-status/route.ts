import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("id");
  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) {
    return NextResponse.json({ error: "Некорректный номер заказа." }, { status: 400 });
  }
  try {
    const result = await query<{ status: string }>("SELECT status FROM orders WHERE id = $1 LIMIT 1", [orderId]);
    if (!result.rows[0]) return NextResponse.json({ error: "Заказ не найден." }, { status: 404 });
    return NextResponse.json({ status: result.rows[0].status });
  } catch (error) {
    console.error("Unable to check order status.", error);
    return NextResponse.json({ error: "Не удалось проверить статус заказа." }, { status: 500 });
  }
}
