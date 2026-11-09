import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  readDb,
  writeDb,
  createSessionToken,
  verifySessionToken,
  createSignedChallenge,
  verifySignedChallenge,
} from "@/lib/admin-auth";

const COOKIE_NAME = "nord_admin_session";

// GET /api/admin/auth — Проверка текущего статуса авторизации
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  const isAuth = verifySessionToken(sessionCookie);
  return NextResponse.json(
    { ok: true, authorized: isAuth },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

// POST /api/admin/auth — Аутентификация, биометрия и завершение сессии
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    // 1. ВХОД ПО PIN-КОДУ
    if (action === "loginPin") {
      const pin = String(body.pin || "");
      const db = readDb();
      const serverPin = String(db?.pinCode || "2026");

      // Безопасное сравнение PIN-кода (timingSafeEqual)
      const pinBuf = Buffer.from(pin.padEnd(16, " "));
      const serverBuf = Buffer.from(serverPin.padEnd(16, " "));
      const isMatch = crypto.timingSafeEqual(pinBuf, serverBuf);

      if (!isMatch) {
        return NextResponse.json(
          { ok: false, error: "Неверный PIN-код" },
          { status: 401 }
        );
      }

      const token = createSessionToken("kurbanov");
      const res = NextResponse.json({ ok: true, message: "Вход выполнен" });
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 дней
      });
      return res;
    }

    // 2. ВЫХОД / БЛОКИРОВКА ЭКРАНА
    if (action === "logout") {
      const res = NextResponse.json({ ok: true, message: "Выход выполнен" });
      res.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        expires: new Date(0),
      });
      return res;
    }

    // 3. ПОЛУЧЕНИЕ CHALLENGE ДЛЯ ПРИВЯЗКИ FACE ID / PASSKEY (требует активной сессии)
    if (action === "getPasskeyRegisterChallenge") {
      const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
      if (!verifySessionToken(sessionCookie)) {
        return NextResponse.json({ ok: false, error: "Требуется авторизация" }, { status: 401 });
      }
      const { challenge, token } = createSignedChallenge();
      return NextResponse.json({ ok: true, challenge, challengeToken: token });
    }

    // 4. СОХРАНЕНИЕ ПРИВЯЗАННОГО КЛЮЧА FACE ID В БАЗУ ДАННЫХ (требует активной сессии)
    if (action === "registerPasskey") {
      const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
      if (!verifySessionToken(sessionCookie)) {
        return NextResponse.json({ ok: false, error: "Требуется авторизация" }, { status: 401 });
      }

      const { credentialId, challenge, challengeToken, deviceName } = body;
      if (!credentialId || !challenge || !challengeToken) {
        return NextResponse.json({ ok: false, error: "Недостаточно данных" }, { status: 400 });
      }

      if (!verifySignedChallenge(challenge, challengeToken)) {
        return NextResponse.json({ ok: false, error: "Срок действия challenge истёк" }, { status: 400 });
      }

      const db = readDb();
      if (!Array.isArray(db.allowedPasskeys)) {
        db.allowedPasskeys = [];
      }

      // Добавляем ключ, если его еще нет
      if (!db.allowedPasskeys.some((p: any) => p.id === credentialId)) {
        db.allowedPasskeys.push({
          id: credentialId,
          createdAt: new Date().toISOString(),
          deviceName: deviceName || "Apple Device (iPhone / Mac)",
        });
        writeDb(db);
      }

      return NextResponse.json({ ok: true, message: "Face ID привязан к серверу" });
    }

    // 5. ПОЛУЧЕНИЕ CHALLENGE ДЛЯ ВХОДА ПО FACE ID
    if (action === "getPasskeyLoginChallenge") {
      const { challenge, token } = createSignedChallenge();
      const db = readDb();
      const allowedIds = (db.allowedPasskeys || []).map((p: any) => p.id);
      return NextResponse.json({
        ok: true,
        challenge,
        challengeToken: token,
        allowedIds,
      });
    }

    // 6. ПРОВЕРКА И ВХОД ПО FACE ID
    if (action === "loginPasskey") {
      const { credentialId, challenge, challengeToken } = body;
      if (!credentialId || !challenge || !challengeToken) {
        return NextResponse.json({ ok: false, error: "Недостаточно данных" }, { status: 400 });
      }

      if (!verifySignedChallenge(challenge, challengeToken)) {
        return NextResponse.json({ ok: false, error: "Срок действия challenge истёк" }, { status: 401 });
      }

      const db = readDb();
      const allowedPasskeys = db.allowedPasskeys || [];

      // Если в базе уже зарегистрированы разрешённые ключи — проверяем наличие
      if (allowedPasskeys.length > 0) {
        const isAllowed = allowedPasskeys.some((p: any) => p.id === credentialId);
        if (!isAllowed) {
          return NextResponse.json({ ok: false, error: "Ключ устройства не найден в списке разрешённых" }, { status: 401 });
        }
      } else {
        // Если это первая привязка, автоматически регистрируем
        allowedPasskeys.push({
          id: credentialId,
          createdAt: new Date().toISOString(),
          deviceName: "Apple Device (Первичная привязка)",
        });
        db.allowedPasskeys = allowedPasskeys;
        writeDb(db);
      }

      const token = createSessionToken("kurbanov");
      const res = NextResponse.json({ ok: true, message: "Вход по Face ID выполнен" });
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      });
      return res;
    }

    // 7. СБРОС КЛЮЧА FACE ID
    if (action === "removePasskey") {
      const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
      if (!verifySessionToken(sessionCookie)) {
        return NextResponse.json({ ok: false, error: "Требуется авторизация" }, { status: 401 });
      }

      const { credentialId } = body;
      const db = readDb();
      if (Array.isArray(db.allowedPasskeys)) {
        db.allowedPasskeys = db.allowedPasskeys.filter((p: any) => p.id !== credentialId);
        writeDb(db);
      }
      return NextResponse.json({ ok: true, message: "Face ID удалён" });
    }

    return NextResponse.json({ ok: false, error: "Неизвестное действие" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Ошибка сервера" }, { status: 500 });
  }
}
