import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

/*
 * Заявка из Telegram-витрины NORD.
 * Доставка менеджеру через бота: задайте в .env.local
 *   TELEGRAM_BOT_TOKEN=...      токен бота от @BotFather
 *   TELEGRAM_CHAT_ID=...        chat_id менеджера (@LarsenMl должен один раз нажать /start в боте)
 *                               или id закрытой группы менеджеров
 * Если переменные не заданы — ответ { delivered: false }, и витрина
 * открывает личный чат с менеджером с уже заполненным текстом заявки.
 */

const itemSchema = z.object({
  model: z.string().max(80),
  mode: z.enum(["buy", "rent"]),
  days: z.number().int().min(1).max(365).optional(),
  price: z.number().nullable(),
});

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  comment: z.string().trim().max(1500).optional().default(""),
  tgUser: z.string().trim().max(64).optional().default(""),
  items: z.array(itemSchema).min(1).max(20),
  total: z.number().nullable(),
});

const rub = (n: number | null) => (n === null ? "по запросу" : `${new Intl.NumberFormat("ru-RU").format(n)} ₽`);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Проверьте имя и телефон" }, { status: 400 });
  }

  const lead = parsed.data;
  const id = `TG-${Date.now().toString().slice(-6)}`;
  const lines = [
    `Заявка из витрины NORD · ${id}`,
    "",
    ...lead.items.map((i, n) =>
      i.mode === "rent"
        ? `${n + 1}. ${i.model} — аренда ${i.days ?? 1} сут. · ${rub(i.price)}`
        : `${n + 1}. ${i.model} — покупка · ${rub(i.price)}`,
    ),
    "",
    `Итого: ${rub(lead.total)}`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.tgUser ? `Telegram: @${lead.tgUser.replace(/^@/, "")}` : null,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
  ].filter((l) => l !== null);

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  let delivered = false;

  if (botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          reply_markup: lead.tgUser
            ? { inline_keyboard: [[{ text: "Написать клиенту", url: `https://t.me/${lead.tgUser.replace(/^@/, "")}` }]] }
            : undefined,
        }),
      });
      delivered = res.ok;
    } catch (error) {
      console.error("tg-lead delivery error:", error);
    }
  }

  return NextResponse.json({ ok: true, id, delivered, text: lines.join("\n") });
}
