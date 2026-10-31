import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { query, queryInTransaction, withTransaction } from "@/lib/db";

export const runtime = "nodejs";

const orderSchema = z.object({
  mode: z.enum(["buy", "rent"]),
  paymentMethod: z.enum(["online", "invoice"]).optional().default("online"),
  items: z.array(z.object({
    productId: z.string().min(1).max(160),
    quantity: z.number().int().min(1).max(25),
  })).min(1).max(20).refine(
    (items) => new Set(items.map((item) => item.productId)).size === items.length,
    "Товар не должен повторяться в заказе.",
  ),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(6).max(40),
    email: z.union([z.string().trim().email().max(254), z.null()]).optional(),
    address: z.union([z.string().trim().max(1000), z.null()]).optional(),
  }),
  rentalStart: z.string().date().nullable().optional(),
  rentalEnd: z.string().date().nullable().optional(),
});

function paymentConfig() {
  const { YOOKASSA_SHOP_ID: shopId, YOOKASSA_SECRET_KEY: secretKey } = process.env;
  if (!shopId || !secretKey) return null;
  return {
    shopId,
    secretKey,
    apiUrl: (process.env.YOOKASSA_API_URL || "https://api.yookassa.ru/v3").replace(/\/$/, ""),
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Проверьте данные заказа." }, { status: 400 });

  const input = parsed.data;
  const config = paymentConfig();

  // If online payment requested but YooKassa or DB is not configured, handle invoice/manager order fallback
  if (!process.env.DATABASE_URL) {
    const demoOrderId = randomUUID();
    return NextResponse.json({
      orderId: demoOrderId,
      confirmationUrl: `/order/return?order=${demoOrderId}&submitted=1`,
    });
  }

  if (input.paymentMethod === "online" && !config) {
    return NextResponse.json(
      { error: "Онлайн-оплата временно отключена. Выберите способ «Оплата по счёту / подтверждение с менеджером»." },
      { status: 503 },
    );
  }

  const vatCode = process.env.YOOKASSA_VAT_CODE;
  const receiptEnabled = process.env.YOOKASSA_RECEIPTS_ENABLED === "true";
  const taxSystemCode = process.env.YOOKASSA_TAX_SYSTEM_CODE;
  if (
    input.paymentMethod === "online" &&
    receiptEnabled &&
    (!vatCode || !/^[1-8]$/.test(vatCode) || (taxSystemCode && !/^[1-6]$/.test(taxSystemCode)))
  ) {
    return NextResponse.json({ error: "Не настроены параметры фискального чека. Проверьте их у бухгалтера и в ЮKassa." }, { status: 503 });
  }

  if (input.mode === "rent" && (!input.rentalStart || !input.rentalEnd || input.rentalEnd < input.rentalStart)) {
    return NextResponse.json({ error: "Укажите корректный период аренды." }, { status: 400 });
  }
  if (input.mode === "rent" && input.rentalStart && input.rentalStart < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: "Дата начала аренды не может быть в прошлом." }, { status: 400 });
  }
  if (input.mode === "buy" && (input.rentalStart || input.rentalEnd)) {
    return NextResponse.json({ error: "У заказа на покупку не должно быть дат аренды." }, { status: 400 });
  }

  const startDay = input.mode === "rent" ? Date.parse(`${input.rentalStart}T00:00:00Z`) : 0;
  const endDay = input.mode === "rent" ? Date.parse(`${input.rentalEnd}T00:00:00Z`) : 0;
  const rentalDays = input.mode === "rent" ? Math.floor((endDay - startDay) / 86_400_000) + 1 : null;
  const orderId = randomUUID();
  const idempotencyKey = randomUUID();

  let amount: number;
  try {
    amount = await withTransaction(async (client) => {
      const customerResult = await queryInTransaction<{ id: string }>(client,
        `INSERT INTO customers (name, phone, email, address)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [input.customer.name, input.customer.phone, input.customer.email ?? null, input.customer.address ?? null],
      );
      const customerId = customerResult.rows[0].id;
      let total = 0;
      const itemRows: Array<{
        id: string;
        name: string;
        model: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }> = [];

      for (const item of [...input.items].sort((a, b) => a.productId.localeCompare(b.productId))) {
        const productResult = await queryInTransaction<{
          id: string;
          name: string;
          model: string;
          purchase_price: number | null;
          rental_price_daily: number | null;
          rental_min_days: number;
          stock_quantity: number;
          purchase_enabled: boolean;
          rental_enabled: boolean;
          published: boolean;
        }>(
          client, `SELECT id, name, model, purchase_price, rental_price_daily,
                  rental_min_days, stock_quantity, purchase_enabled, rental_enabled, published
           FROM products WHERE id = $1 FOR UPDATE`,
          [item.productId],
        );
        const product = productResult.rows[0];
        if (!product?.published) throw new Error("PRODUCT_UNAVAILABLE");

        const unitPrice = input.mode === "buy" ? product.purchase_price : product.rental_price_daily;
        const enabled = input.mode === "buy" ? product.purchase_enabled : product.rental_enabled;
        if (!enabled || unitPrice === null || unitPrice <= 0) throw new Error("OFFER_UNAVAILABLE");
        if (input.mode === "rent" && rentalDays !== null && rentalDays < product.rental_min_days) {
          throw new Error("RENTAL_MINIMUM");
        }

        const reserved = input.mode === "rent"
          ? await queryInTransaction<{ quantity: string }>(client,
            `SELECT COALESCE(SUM(oi.quantity), 0)::text AS quantity
             FROM order_items oi JOIN orders o ON o.id = oi.order_id
             WHERE oi.product_id = $1
               AND (
                 (o.mode = 'rent'
                   AND o.status IN ('pending_payment', 'paid', 'processing', 'shipped')
                   AND (o.status <> 'pending_payment' OR o.expires_at > now())
                   AND o.rental_start <= $3::date AND o.rental_end >= $2::date)
                 OR
                 (o.mode = 'buy'
                   AND o.status = 'pending_payment'
                   AND o.expires_at > now())
               )`,
            [product.id, input.rentalStart, input.rentalEnd],
          )
          : await queryInTransaction<{ quantity: string }>(client,
            `SELECT COALESCE(SUM(oi.quantity), 0)::text AS quantity
             FROM order_items oi JOIN orders o ON o.id = oi.order_id
             WHERE oi.product_id = $1
               AND (
                 (o.mode = 'buy' AND o.status = 'pending_payment' AND o.expires_at > now())
                 OR
                 (o.mode = 'rent'
                   AND o.status IN ('pending_payment', 'paid', 'processing', 'shipped')
                   AND (o.status <> 'pending_payment' OR o.expires_at > now())
                   AND o.rental_end >= CURRENT_DATE)
               )`,
            [product.id],
          );

        if (Number(reserved.rows[0].quantity) + item.quantity > product.stock_quantity) {
          throw new Error(input.mode === "rent" ? "RENTAL_UNAVAILABLE" : "OUT_OF_STOCK");
        }

        const lineTotal = unitPrice * item.quantity * (rentalDays ?? 1);
        total += lineTotal;
        itemRows.push({
          id: product.id,
          name: product.name,
          model: product.model,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        });
      }

      if (!Number.isSafeInteger(total) || total <= 0) throw new Error("INVALID_TOTAL");
      const initialStatus = input.paymentMethod === "invoice" ? "processing" : "pending_payment";
      await client.query(
        `INSERT INTO orders
          (id, customer_id, mode, status, amount, rental_start, rental_end, idempotency_key, expires_at)
         VALUES ($1, $2, $3, $4::order_status, $5, $6, $7, $8, now() + interval '30 minutes')`,
        [orderId, customerId, input.mode, initialStatus, total, input.rentalStart ?? null, input.rentalEnd ?? null, idempotencyKey],
      );
      for (const item of itemRows) {
        await client.query(
          `INSERT INTO order_items
            (order_id, product_id, product_name, product_model, quantity, unit_price, rental_days, line_total)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [orderId, item.id, item.name, item.model, item.quantity, item.unitPrice, rentalDays, item.lineTotal],
        );
      }
      if (input.paymentMethod === "invoice" && input.mode === "buy") {
        for (const item of itemRows) {
          await client.query(
            "UPDATE products SET stock_quantity = stock_quantity - $2, updated_at = now() WHERE id = $1",
            [item.id, item.quantity],
          );
        }
      }
      return total;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const responseMessages: Record<string, string> = {
      PRODUCT_UNAVAILABLE: "Один из товаров больше недоступен.",
      OFFER_UNAVAILABLE: "Для одной из моделей выбранный способ заказа недоступен.",
      RENTAL_MINIMUM: "Выбранный срок меньше минимального срока аренды.",
      RENTAL_UNAVAILABLE: "На выбранные даты недостаточно свободной техники.",
      OUT_OF_STOCK: "Недостаточно товара в наличии.",
    };
    if (responseMessages[message]) return NextResponse.json({ error: responseMessages[message] }, { status: 409 });
    console.error("Unable to create order.", error);
    return NextResponse.json({ error: "Не удалось создать заказ. Попробуйте позже." }, { status: 500 });
  }

  if (input.paymentMethod === "invoice") {
    return NextResponse.json({
      orderId,
      confirmationUrl: `/order/return?order=${orderId}&submitted=1`,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const returnUrl = process.env.PAYMENT_RETURN_URL || (siteUrl ? `${siteUrl}/order/return` : null);
  if (!returnUrl || !config) {
    await query("UPDATE orders SET status = 'payment_failed' WHERE id = $1", [orderId]);
    return NextResponse.json({ error: "Не настроен адрес возврата после оплаты." }, { status: 503 });
  }

  try {
    const confirmationReturnUrl = new URL(returnUrl);
    confirmationReturnUrl.searchParams.set("order", orderId);
    const paymentBody: Record<string, unknown> = {
      amount: { value: amount.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: confirmationReturnUrl.toString() },
      description: `Заказ NORD ${orderId}`,
      metadata: { orderId },
    };
    if (receiptEnabled) {
      const receiptRows = await query<{
        product_name: string;
        quantity: number;
        unit_price: number;
        rental_days: number | null;
        mode: "buy" | "rent";
      }>(
        `SELECT oi.product_name, oi.quantity, oi.unit_price, oi.rental_days, o.mode
         FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.id = $1`,
        [orderId],
      );
      const digits = input.customer.phone.replace(/\D/g, "");
      const phone = digits.length === 10 ? `+7${digits}` : digits.startsWith("8") && digits.length === 11 ? `+7${digits.slice(1)}` : `+${digits}`;
      if (!/^\+[1-9]\d{9,14}$/.test(phone)) {
        await query("UPDATE orders SET status = 'payment_failed', updated_at = now() WHERE id = $1", [orderId]);
        return NextResponse.json({ error: "Укажите корректный номер телефона для кассового чека." }, { status: 400 });
      }
      paymentBody.receipt = {
        customer: input.customer.email ? { email: input.customer.email } : { phone },
        ...(taxSystemCode ? { tax_system_code: Number(taxSystemCode) } : {}),
        items: receiptRows.rows.map((item) => {
          const count = item.quantity * (item.mode === "rent" ? item.rental_days || 1 : 1);
          return {
            description: item.product_name.slice(0, 128),
            quantity: `${count.toFixed(2)}`,
            amount: { value: item.unit_price.toFixed(2), currency: "RUB" },
            vat_code: Number(vatCode),
            payment_mode: "full_payment",
            payment_subject: item.mode === "rent" ? "service" : "commodity",
          };
        }),
      };
    }
    const response = await fetch(`${config.apiUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.shopId}:${config.secretKey}`).toString("base64")}`,
        "Content-Type": "application/json",
        "Idempotence-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentBody),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`YooKassa returned HTTP ${response.status}.`);
    const payment = await response.json() as {
      id?: string;
      confirmation?: { confirmation_url?: string };
    };
    if (!payment.id || !payment.confirmation?.confirmation_url) throw new Error("YooKassa response has no payment id or confirmation URL.");

    await query(
      `UPDATE orders SET payment_id = $1, payment_confirmation_url = $2, updated_at = now()
       WHERE id = $3 AND status = 'pending_payment'`,
      [payment.id, payment.confirmation.confirmation_url, orderId],
    );
    return NextResponse.json({ orderId, confirmationUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Unable to create YooKassa payment.", error);
    await query("UPDATE orders SET status = 'payment_failed', updated_at = now() WHERE id = $1", [orderId]);
    return NextResponse.json({ error: "Платёжная система временно недоступна. Заказ не оплачен." }, { status: 502 });
  }
}
