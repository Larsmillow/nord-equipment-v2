import { NextResponse } from "next/server";
import { queryInTransaction, withTransaction } from "@/lib/db";

export const runtime = "nodejs";

type RefundRequest = {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
};

export async function POST(request: Request) {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const apiUrl = (process.env.YOOKASSA_API_URL || "https://api.yookassa.ru/v3").replace(/\/$/, "");
  if (!shopId || !secretKey) return NextResponse.json({ error: "Payment provider is not configured." }, { status: 503 });

  const notification = await request.json().catch(() => null) as {
    event?: string;
    object?: { id?: string };
  } | null;
  const paymentId = notification?.object?.id;
  const eventType = notification?.event;
  if (!paymentId || !eventType) return NextResponse.json({ error: "Invalid notification." }, { status: 400 });

  try {
    const providerResponse = await fetch(`${apiUrl}/payments/${encodeURIComponent(paymentId)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      },
      cache: "no-store",
    });
    if (!providerResponse.ok) throw new Error(`YooKassa verification returned HTTP ${providerResponse.status}.`);
    const payment = await providerResponse.json() as {
      id?: string;
      status?: string;
      amount?: { value?: string; currency?: string };
      metadata?: { orderId?: string };
    };
    const orderId = payment.metadata?.orderId;
    if (payment.id !== paymentId || !orderId) throw new Error("Payment does not identify a NORD order.");

    const refund = await withTransaction(async (client): Promise<RefundRequest | null> => {
      const orderResult = await queryInTransaction<{
        id: string;
        status: string;
        amount: number;
        currency: string;
        mode: "buy" | "rent";
      }>(client, "SELECT id, status, amount, currency, mode FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
      const order = orderResult.rows[0];
      if (!order) throw new Error("Payment references an unknown order.");
      if (Number(payment.amount?.value) !== order.amount || payment.amount?.currency !== order.currency.trim()) {
        throw new Error("Payment amount or currency does not match the order.");
      }

      const providerEventId = `${eventType}:${paymentId}`;
      await client.query(
        `INSERT INTO payment_events (provider_event_id, payment_id, event_type, payload)
         VALUES ($1, $2, $3, $4::jsonb) ON CONFLICT (provider_event_id) DO NOTHING`,
        [providerEventId, paymentId, eventType, JSON.stringify(notification)],
      );

      if (payment.status === "succeeded") {
        if (order.status === "refunded" || ["paid", "processing", "shipped", "completed"].includes(order.status)) return null;
        if (order.status === "pending_payment") {
          const items = await queryInTransaction<{
            product_id: string;
            quantity: number;
            stock_quantity: number;
          }>(client,
            `SELECT p.id AS product_id, oi.quantity, p.stock_quantity
             FROM order_items oi JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = $1
             ORDER BY p.id
             FOR UPDATE OF p`,
            [orderId],
          );
          let inventoryAvailable = items.rows.length > 0;
          for (const item of items.rows) {
            const reserved = order.mode === "rent"
              ? await queryInTransaction<{ quantity: string }>(client,
                `SELECT COALESCE(SUM(oi.quantity), 0)::text AS quantity
                 FROM order_items oi JOIN orders o ON o.id = oi.order_id
                 WHERE oi.product_id = $1 AND o.id <> $2 AND o.mode = 'rent'
                   AND o.status IN ('pending_payment', 'paid', 'processing', 'shipped')
                   AND (o.status <> 'pending_payment' OR o.expires_at > now())
                   AND o.rental_start <= (SELECT rental_end FROM orders WHERE id = $2)
                   AND o.rental_end >= (SELECT rental_start FROM orders WHERE id = $2)`,
                [item.product_id, orderId],
              )
              : await queryInTransaction<{ quantity: string }>(client,
                `SELECT COALESCE(SUM(oi.quantity), 0)::text AS quantity
                 FROM order_items oi JOIN orders o ON o.id = oi.order_id
                 WHERE oi.product_id = $1 AND o.id <> $2 AND o.mode = 'buy'
                   AND o.status = 'pending_payment' AND o.expires_at > now()`,
                [item.product_id, orderId],
              );
            if (Number(reserved.rows[0].quantity) + item.quantity > item.stock_quantity) {
              inventoryAvailable = false;
              break;
            }
          }

          if (inventoryAvailable) {
            await client.query(
              "UPDATE orders SET status = 'paid', updated_at = now() WHERE id = $1 AND status = 'pending_payment'",
              [orderId],
            );
            if (order.mode === "buy") {
              await client.query(
                `UPDATE products p SET stock_quantity = p.stock_quantity - oi.quantity, updated_at = now()
                 FROM order_items oi WHERE oi.order_id = $1 AND oi.product_id = p.id`,
                [orderId],
              );
            }
            return null;
          }
          await client.query("UPDATE orders SET status = 'refund_pending', updated_at = now() WHERE id = $1", [orderId]);
        } else if (!["refund_pending", "cancelled", "payment_failed"].includes(order.status)) {
          return null;
        } else if (order.status !== "refund_pending") {
          await client.query("UPDATE orders SET status = 'refund_pending', updated_at = now() WHERE id = $1", [orderId]);
        }
        return { paymentId, orderId, amount: order.amount, currency: order.currency.trim() };
      }

      if (payment.status === "canceled" && order.status === "pending_payment") {
        await client.query("UPDATE orders SET status = 'cancelled', updated_at = now() WHERE id = $1", [orderId]);
      }
      return null;
    });

    if (refund) {
      const refundResponse = await fetch(`${apiUrl}/refunds`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
          "Content-Type": "application/json",
          "Idempotence-Key": `nord-refund-${refund.paymentId}`,
        },
        body: JSON.stringify({
          payment_id: refund.paymentId,
          amount: { value: refund.amount.toFixed(2), currency: refund.currency },
          description: `Возврат заказа NORD ${refund.orderId}`,
        }),
        cache: "no-store",
      });
      if (!refundResponse.ok) throw new Error(`YooKassa refund returned HTTP ${refundResponse.status}.`);
      const refundResult = await refundResponse.json() as { status?: string };
      if (refundResult.status === "succeeded") {
        await withTransaction(async (client) => {
          await client.query(
            "UPDATE orders SET status = 'refunded', updated_at = now() WHERE id = $1 AND status = 'refund_pending'",
            [refund.orderId],
          );
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Unable to process YooKassa notification.", error);
    return NextResponse.json({ error: "Notification could not be verified or processed." }, { status: 500 });
  }
}
