import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(120),
  phone: z.string().trim().min(6, "Укажите телефон").max(40),
  email: z.union([z.string().trim().email().max(254), z.literal(""), z.null()]).optional(),
  message: z.string().trim().min(3, "Опишите задачу или модель").max(3000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте правильность заполнения имени, телефона и описания задачи." },
      { status: 400 },
    );
  }

  const { name, phone, email, message } = parsed.data;

  // Save to DB if DATABASE_URL is configured
  let requestId = `REQ-${Date.now().toString().slice(-6)}`;
  if (process.env.DATABASE_URL) {
    try {
      const result = await query<{ id: string }>(
        `INSERT INTO customers (name, phone, email, address)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [name, phone, email || null, `[ЗАЯВКА С САЙТА] ${message}`],
      );
      if (result.rows[0]?.id) {
        requestId = result.rows[0].id.slice(0, 8).toUpperCase();
      }
    } catch (error) {
      console.error("Failed to save contact request to DB:", error);
    }
  }

  // Optional Telegram notification if TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID are set
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (botToken && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: [
            `⚡ Новая заявка NORD #${requestId}`,
            `Имя: ${name}`,
            `Телефон: ${phone}`,
            email ? `Email: ${email}` : null,
            `Задача: ${message}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch (error) {
      console.error("Telegram notification error:", error);
    }
  }

  return NextResponse.json({
    ok: true,
    requestId,
    message: `Заявка №${requestId} принята. Инженер NORD свяжется с вами по номеру ${phone}.`,
  });
}
