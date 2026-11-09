import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  readDb,
  writeDb,
  sanitizePublicDb,
  verifySessionToken,
} from "@/lib/admin-auth";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const COOKIE_NAME = "nord_admin_session";

// GET /api/admin/db
// - Если есть валидная сессия администратора -> возвращаем полную базу (включая себестоимость и бухгалтерию)
// - Если сессии нет (посетитель сайта, Telegram WebApp) -> возвращаем ТОЛЬКО безопасную витрину (БЕЗ себестоимости и PIN)
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthorized = verifySessionToken(sessionCookie);

  const db = readDb();

  if (isAuthorized) {
    return NextResponse.json(
      { ...db, authorized: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  // Публичный ответ без конфиденциальных данных
  const publicData = sanitizePublicDb(db);
  return NextResponse.json(publicData, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

// POST /api/admin/db
// Защищённый эндпоинт: изменения разрешены только авторизованному собственнику
export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
    const isAuthorized = verifySessionToken(sessionCookie);

    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: "Доступ запрещён: требуется авторизация" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Загрузка фото с мобильного устройства:
    if (body.action === "uploadImage" && body.base64Data) {
      const matches = body.base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const fileName = `nord-${Date.now()}.${ext}`;

        try {
          if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          }
          const filePath = path.join(UPLOADS_DIR, fileName);
          fs.writeFileSync(filePath, buffer);
          return NextResponse.json({ ok: true, url: `/uploads/${fileName}` });
        } catch {
          // Если на сервере (например, Vercel) файловая система read-only — возвращаем data URI
          return NextResponse.json({ ok: true, url: body.base64Data });
        }
      }
      return NextResponse.json({ ok: false, error: "Некорректный формат изображения" }, { status: 400 });
    }

    // Сохранение всей базы данных:
    if (body.db) {
      const saved = writeDb(body.db);
      if (saved) {
        return NextResponse.json({ ok: true, db: body.db });
      } else {
        return NextResponse.json({ ok: false, error: "Не удалось сохранить базу" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: false, error: "Неверный запрос" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Ошибка сервера" }, { status: 500 });
  }
}
