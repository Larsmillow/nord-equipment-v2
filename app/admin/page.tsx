"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import "./admin-ios.css";

// Фирменная векторная иконка Apple Face ID
function AppleFaceIdIcon({
  size = 28,
  color = "#007aff",
  isSuccess = false,
}: {
  size?: number;
  color?: string;
  isSuccess?: boolean;
}) {
  if (isSuccess) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#34c759"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3H5a2 2 0 0 0-2 2v2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M3 17v2a2 2 0 0 0 2 2h2" />
        <polyline points="8 12 11 15 16 9" stroke="#34c759" strokeWidth="2.6" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3H5a2 2 0 0 0-2 2v2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M3 17v2a2 2 0 0 0 2 2h2" />
      <line x1="9" y1="9" x2="9" y2="10.5" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15" y2="10.5" strokeWidth="2.5" />
      <path d="M12 11v2a1 1 0 0 0 1 1h.5" />
      <path d="M8 17a4.2 4.2 0 0 0 8 0" />
    </svg>
  );
}

export default function NordIosAdminPage() {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingToast, setSavingToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "spares" | "categories" | "accounting" | "docs">("products");

  // Авторизация по PIN-коду (Passcode Lock)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);

  // Биометрия Apple Face ID / Touch ID (WebAuthn API)
  const [faceIdCredId, setFaceIdCredId] = useState<string | null>(null);
  const [isBioSupported, setIsBioSupported] = useState<boolean>(false);
  const [faceIdStatus, setFaceIdStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [faceIdToast, setFaceIdToast] = useState<string | null>(null);

  // Модальные шторки (iOS Bottom Sheets)
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingSpare, setEditingSpare] = useState<any | null>(null);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [newTxModal, setNewTxModal] = useState<any | null>(null);

  // Генератор документов в 1 клик
  const [docClientName, setDocClientName] = useState('ООО «СтройПодряд»');
  const [docClientInn, setDocClientInn] = useState("7810492015");
  const [docSelectedItem, setDocSelectedItem] = useState("NORD-6000 (6.5 л/мин, 230 бар)");
  const [docAmountRub, setDocAmountRub] = useState(95000);

  useEffect(() => {
    // Проверка сохранённой сессии входа и биометрии
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const storedCred = localStorage.getItem("nord_faceid_cred_id");
        if (storedCred) setFaceIdCredId(storedCred);
        if (window.PublicKeyCredential) {
          setIsBioSupported(true);
        }
      }

      try {
        const authRes = await fetch("/api/admin/auth");
        const authData = await authRes.json();
        if (authData.authorized) {
          setIsAuthenticated(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("nord_admin_auth", "true");
          }
        } else if (typeof window !== "undefined" && sessionStorage.getItem("nord_admin_auth") === "true") {
          setIsAuthenticated(true);
        }
      } catch {}

      try {
        const dbRes = await fetch("/api/admin/db");
        const dbData = await dbRes.json();
        setDb(dbData);
        if (dbData.authorized) {
          setIsAuthenticated(true);
        }
      } catch {} finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    initAuth();
  }, []);

  // Слушатель ввода с клавиатуры на экране блокировки
  useEffect(() => {
    if (isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handlePinDigit(e.key);
      } else if (e.key === "Backspace") {
        handlePinBackspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, enteredPin, db]);

  const handlePinDigit = async (digit: string) => {
    if (enteredPin.length >= 4) return;
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);

    if (nextPin.length === 4) {
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "loginPin", pin: nextPin }),
        });
        const data = await res.json();
        if (data.ok) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("nord_admin_auth", "true");
          }
          setIsAuthenticated(true);
          setPinError(false);

          // Загружаем полные закрытые данные (себестоимость, транзакции, реквизиты)
          const fullRes = await fetch("/api/admin/db");
          const fullDb = await fullRes.json();
          setDb(fullDb);
        } else {
          setPinError(true);
          setTimeout(() => {
            setEnteredPin("");
            setPinError(false);
          }, 500);
        }
      } catch {
        setPinError(true);
        setTimeout(() => {
          setEnteredPin("");
          setPinError(false);
        }, 500);
      }
    }
  };

  const handlePinBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  const handleLock = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("nord_admin_auth");
    }
    setIsAuthenticated(false);
    setEnteredPin("");

    // Очищаем локальные данные до безопасной публичной витрины
    try {
      const res = await fetch("/api/admin/db");
      const safeDb = await res.json();
      setDb(safeDb);
    } catch {}
  };

  // ==========================================================================
  // WEBAUTHN API: ПРИВЯЗКА APPLE FACE ID / TOUCH ID (registerFaceId)
  // ==========================================================================
  const registerFaceId = async () => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      alert("Apple Face ID / Touch ID не поддерживается на этом устройстве или в этом браузере.");
      return;
    }

    try {
      setFaceIdStatus("scanning");

      // 1. Получаем подписанный вызов от сервера
      const chalRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPasskeyRegisterChallenge" }),
      });
      const chalData = await chalRes.json();

      let challengeBytes: Uint8Array;
      if (chalData.ok && chalData.challenge) {
        challengeBytes = Uint8Array.from(
          window.atob(chalData.challenge.replace(/-/g, "+").replace(/_/g, "/")),
          (c) => c.charCodeAt(0)
        );
      } else {
        challengeBytes = new Uint8Array(32);
        window.crypto.getRandomValues(challengeBytes);
      }

      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge: challengeBytes as any,
          rp: { name: "NORD Executive OS" },
          user: {
            id: userId as any,
            name: "kurbanov@nord.ru",
            displayName: "Курбанов Магомед Магомедович",
          },
          pubKeyCredParams: [
            { type: "public-key" as const, alg: -7 },   // ES256
            { type: "public-key" as const, alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform" as const,
            userVerification: "required" as const,
          },
          timeout: 60000,
        },
      })) as PublicKeyCredential | null;

      if (credential && credential.rawId) {
        const rawIdBytes = new Uint8Array(credential.rawId);
        let binary = "";
        for (let i = 0; i < rawIdBytes.byteLength; i++) {
          binary += String.fromCharCode(rawIdBytes[i]);
        }
        const credIdBase64 = window.btoa(binary);

        // Регистрируем ключ на сервере
        if (chalData.challenge && chalData.challengeToken) {
          await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "registerPasskey",
              credentialId: credIdBase64,
              challenge: chalData.challenge,
              challengeToken: chalData.challengeToken,
              deviceName: "Apple Device (iPhone / Mac Face ID)",
            }),
          });
        }

        localStorage.setItem("nord_faceid_cred_id", credIdBase64);
        setFaceIdCredId(credIdBase64);
        setFaceIdStatus("success");

        setTimeout(() => {
          sessionStorage.setItem("nord_admin_auth", "true");
          setIsAuthenticated(true);
          setFaceIdStatus("idle");
          setSavingToast("✓ Face ID успешно привязан к вашему устройству");
          setTimeout(() => setSavingToast(null), 3500);
        }, 500);
      } else {
        setFaceIdStatus("idle");
      }
    } catch (err: any) {
      console.log("Face ID creation cancelled or not allowed:", err);
      setFaceIdStatus("idle");
    }
  };

  // ==========================================================================
  // WEBAUTHN API: ВХОД ПО APPLE FACE ID / TOUCH ID (loginWithFaceId)
  // ==========================================================================
  const loginWithFaceId = async () => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      alert("Биометрия не поддерживается в этом браузере.");
      return;
    }

    try {
      setFaceIdStatus("scanning");

      // 1. Получаем challenge от сервера
      const chalRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPasskeyLoginChallenge" }),
      });
      const chalData = await chalRes.json();

      if (!chalData.ok || !chalData.challenge) {
        setFaceIdStatus("idle");
        alert("Не удалось связаться с сервером биометрии");
        return;
      }

      const chalBytes = Uint8Array.from(
        window.atob(chalData.challenge.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0)
      );

      const storedCredId = localStorage.getItem("nord_faceid_cred_id");
      let allowList: PublicKeyCredentialDescriptor[] | undefined = undefined;
      const targetCredId = storedCredId || (chalData.allowedIds && chalData.allowedIds[0]);

      if (targetCredId) {
        try {
          const bin = window.atob(targetCredId.replace(/-/g, "+").replace(/_/g, "/"));
          const arr = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          allowList = [{ type: "public-key" as const, id: arr }];
        } catch {}
      }

      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge: chalBytes as any,
          userVerification: "required" as const,
          timeout: 60000,
          ...(allowList ? { allowCredentials: allowList as any } : {}),
        },
      })) as PublicKeyCredential | null;

      if (assertion && assertion.rawId) {
        const rawIdBytes = new Uint8Array(assertion.rawId);
        let binary = "";
        for (let i = 0; i < rawIdBytes.byteLength; i++) {
          binary += String.fromCharCode(rawIdBytes[i]);
        }
        const credIdBase64 = window.btoa(binary);

        // Отправляем на сервер для валидации и выдачи сессии
        const verifyRes = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "loginPasskey",
            credentialId: credIdBase64,
            challenge: chalData.challenge,
            challengeToken: chalData.challengeToken,
          }),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.ok) {
          localStorage.setItem("nord_faceid_cred_id", credIdBase64);
          setFaceIdCredId(credIdBase64);
          sessionStorage.setItem("nord_admin_auth", "true");
          setFaceIdStatus("success");

          // Загружаем полные данные
          const fullRes = await fetch("/api/admin/db");
          const fullDb = await fullRes.json();
          setDb(fullDb);

          setTimeout(() => {
            setIsAuthenticated(true);
            setFaceIdStatus("idle");
          }, 400);
        } else {
          setFaceIdStatus("idle");
          alert(verifyData.error || "Ошибка биометрической авторизации");
        }
      } else {
        setFaceIdStatus("idle");
      }
    } catch (err: any) {
      console.log("Face ID verification cancelled or failed:", err);
      setFaceIdStatus("idle");
    }
  };

  const resetFaceId = async () => {
    if (confirm("Отвязать Face ID от этого устройства?")) {
      const stored = localStorage.getItem("nord_faceid_cred_id");
      if (stored) {
        try {
          await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "removePasskey", credentialId: stored }),
          });
        } catch {}
      }
      localStorage.removeItem("nord_faceid_cred_id");
      setFaceIdCredId(null);
      setSavingToast("Face ID отвязан");
      setTimeout(() => setSavingToast(null), 2000);
    }
  };

  const saveDatabase = async (nextDb: any, toastMsg = "Сохранено на сайте") => {
    setDb(nextDb);
    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db: nextDb }),
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        alert("Сессия администратора истекла. Пожалуйста, введите PIN-код заново.");
        return;
      }
      setSavingToast(toastMsg);
      setTimeout(() => setSavingToast(null), 2200);
    } catch {
      alert("Ошибка сохранения. Проверьте соединение.");
    }
  };

  // Удаление отдельной бухгалтерской записи
  const deleteTransaction = (txId: string) => {
    const next = { ...db };
    next.accounting.transactions = (next.accounting?.transactions || []).filter(
      (t: any) => t.id !== txId
    );
    saveDatabase(next, "Запись удалена");
  };

  // Загрузка фото напрямую с iPhone (Камера или Медиатека)
  const handleIphonePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "uploadImage", base64Data }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        onUploaded(data.url);
      }
    };
    reader.readAsDataURL(file);
  };

  // Финансовая сводка бухгалтерии
  const financeSummary = useMemo(() => {
    const txs = db?.accounting?.transactions || [];
    let totalIncome = 0;
    let totalExpense = 0;
    let netProfit = 0;
    for (const t of txs) {
      if (t.type === "income") {
        totalIncome += Number(t.amountRub) || 0;
        netProfit += Number(t.profitRub) || 0;
      } else {
        totalExpense += Number(t.amountRub) || 0;
        netProfit -= Math.abs(Number(t.amountRub) || 0);
      }
    }
    return { totalIncome, totalExpense, netProfit };
  }, [db]);

  // Печать официального бухгалтерского документа А4 (Счёт / УПД / Договор)
  const handlePrintOfficialDoc = (docType: "invoice" | "upd" | "contract") => {
    if (!db?.companyDocs) return;
    const c = db.companyDocs;
    const num = `${c.invoicePrefix || "НРД"}-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toLocaleDateString("ru-RU");
    const director = c.directorName || "Курбанов Магомед Магомедович";
    const titleMap = {
      invoice: `СЧЁТ НА ОПЛАТУ № ${num} от ${dateStr}`,
      upd: `УНИВЕРСАЛЬНЫЙ ПЕРЕДАТОЧНЫЙ ДОКУМЕНТ (УПД / АКТ) № ${num} от ${dateStr}`,
      contract: `ДОГОВОР ПОСТАВКИ ОБОРУДОВАНИЯ № ${num} от ${dateStr}`,
    };
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${titleMap[docType]}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 28px; max-width: 820px; margin: 0 auto; line-height: 1.45; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  th, td { border: 1px solid #000; padding: 7px 9px; text-align: left; }
  th { background: #f2f2f7; }
  .print-btn { background: #007aff; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 18px; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Распечатать / Сохранить PDF на iPhone</button>
  <table>
    <tr>
      <td colspan="2"><strong>Банк получателя:</strong> ${c.bankName}<br/><strong>БИК:</strong> ${c.bik} · <strong>К/с:</strong> ${c.corrAccount}</td>
      <td><strong>Р/с:</strong> ${c.checkingAccount}</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Поставщик:</strong> ${c.companyName}, ИНН ${c.inn}, КПП ${c.kpp}, ОГРН ${c.ogrn}<br/><strong>Адрес:</strong> ${c.legalAddress} · <strong>Тел.:</strong> ${c.phone}</td>
    </tr>
  </table>
  <h2 style="margin:16px 0 8px 0; border-bottom:2px solid #000; padding-bottom:6px;">${titleMap[docType]}</h2>
  <p><strong>Заказчик (Плательщик):</strong> ${docClientName} (ИНН: ${docClientInn})</p>
  <p><strong>Налоговый режим:</strong> ${c.vatMode} · <strong>Гарантия:</strong> ${c.warrantyMonths} мес.</p>
  <table>
    <thead>
      <tr><th>№</th><th>Наименование товара / оборудования</th><th>Кол-во</th><th>Цена, ₽</th><th>Сумма, ₽</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>${docSelectedItem}</strong></td>
        <td>1 шт.</td>
        <td>${docAmountRub.toLocaleString("ru-RU")} ₽</td>
        <td><strong>${docAmountRub.toLocaleString("ru-RU")} ₽</strong></td>
      </tr>
    </tbody>
  </table>
  <p style="font-size:14px; font-weight:bold; text-align:right;">ИТОГО К ОПЛАТЕ: ${docAmountRub.toLocaleString("ru-RU")} ₽ (${c.vatMode})</p>
  ${
    docType === "contract"
      ? `<p style="margin-top:12px;">1. Поставщик обязуется передать в собственность Покупателя промышленное окрасочное оборудование, а Покупатель принять и оплатить его.<br/>2. Гарантийный срок составляет ${c.warrantyMonths} месяцев с момента отгрузки со склада (${c.legalAddress}).</p>`
      : ""
  }
  <div style="display:flex; justify-content:space-between; margin-top:36px;">
    <div><strong>От Поставщика (${c.companyName}):</strong><br/><br/>___________________ / ${director} /<br/><small>М.П.</small></div>
    <div><strong>От Покупателя (${docClientName}):</strong><br/><br/>___________________ / Подпись /<br/><small>М.П.</small></div>
  </div>
</body>
</html>`);
    win.document.close();
  };

  if (loading || !db || !authChecked) {
    return (
      <div className="ios-admin-app" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "15px", color: "#6d6d72" }}>Загрузка терминала NORD...</div>
      </div>
    );
  }

  // ==========================================================================
  // ТРЕБОВАНИЕ 1 & 4: ЭКРАН ВХОДА С ВЕКТОРНЫМ APPLE FACE ID И КЛАВИАТУРОЙ
  // ==========================================================================
  if (!isAuthenticated) {
    return (
      <div className="ios-admin-app ios-lockscreen">
        {/* Dynamic Island / Face ID HUD Pop-up */}
        {(faceIdStatus === "scanning" || faceIdStatus === "success") && (
          <div className="ios-faceid-hud-backdrop" onClick={() => setFaceIdStatus("idle")}>
            <div className="ios-faceid-hud" onClick={(e) => e.stopPropagation()}>
              <div className={faceIdStatus === "scanning" ? "ios-faceid-hud-pulse" : ""}>
                <AppleFaceIdIcon
                  size={54}
                  color={faceIdStatus === "success" ? "#34c759" : "#ffffff"}
                  isSuccess={faceIdStatus === "success"}
                />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.2px" }}>
                {faceIdStatus === "success" ? "Подтверждено" : "Face ID"}
              </span>
            </div>
          </div>
        )}

        <div className="ios-lock-card">
          <div className="ios-lock-badge">
            <span>⚡</span> NORD EXECUTIVE OS
          </div>

          {/* Фирменная иконка Apple Face ID сверху над именем */}
          <div
            className={`ios-faceid-icon-wrap ${faceIdStatus === "success" ? "success" : ""}`}
            onClick={() => {
              if (faceIdCredId) {
                loginWithFaceId();
              } else {
                registerFaceId();
              }
            }}
            title={faceIdCredId ? "Войти по Face ID" : "Привязать Face ID"}
          >
            <AppleFaceIdIcon
              size={34}
              color={faceIdStatus === "success" ? "#34c759" : "#007aff"}
              isSuccess={faceIdStatus === "success"}
            />
          </div>

          <h1 className="ios-lock-title">Курбанов Магомед Магомедович</h1>
          <p className="ios-lock-subtitle">Личный терминал собственника · Введите PIN-код</p>

          {/* Индикатор ввода 4 цифр PIN-кода */}
          <div className={`ios-lock-dots ${pinError ? "ios-lock-shake" : ""}`}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`ios-lock-dot ${idx < enteredPin.length ? "filled" : ""}`}
              />
            ))}
          </div>

          {/* Крупная кнопка "Войти по Face ID" если биометрия привязана */}
          {faceIdCredId ? (
            <button
              type="button"
              onClick={loginWithFaceId}
              className="ios-faceid-btn"
              title="Сканировать лицо через Apple Face ID"
            >
              <AppleFaceIdIcon size={19} color="#007aff" />
              <span>Войти по Face ID</span>
            </button>
          ) : isBioSupported ? (
            <button
              type="button"
              onClick={registerFaceId}
              className="ios-faceid-btn"
              style={{ borderColor: "#d1d1d6", color: "#6d6d72", background: "#f8f9fa" }}
              title="Привязать Face ID на этом iPhone"
            >
              <AppleFaceIdIcon size={18} color="#007aff" />
              <span>Включить вход по Face ID</span>
            </button>
          ) : null}

          {pinError && (
            <div style={{ color: "#ff3b30", fontSize: "13px", fontWeight: 600, marginBottom: "14px" }}>
              Неверный PIN-код
            </div>
          )}

          {faceIdToast && (
            <div style={{ color: "#007aff", fontSize: "12px", fontWeight: 600, marginBottom: "12px" }}>
              {faceIdToast}
            </div>
          )}

          {/* Круглая клавиатура iPhone с кнопкой Face ID слева от 0 */}
          <div className="ios-lock-keypad">
            {[
              { num: "1", sub: "" },
              { num: "2", sub: "ABC" },
              { num: "3", sub: "DEF" },
              { num: "4", sub: "GHI" },
              { num: "5", sub: "JKL" },
              { num: "6", sub: "MNO" },
              { num: "7", sub: "PQRS" },
              { num: "8", sub: "TUV" },
              { num: "9", sub: "WXYZ" },
              { num: "faceid", sub: "FACE ID", isFaceId: true },
              { num: "0", sub: "+" },
              { num: "⌫", sub: "", action: true },
            ].map((key, i) => {
              if (key.isFaceId) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (faceIdCredId) {
                        loginWithFaceId();
                      } else {
                        registerFaceId();
                      }
                    }}
                    className="ios-lock-key"
                    title={faceIdCredId ? "Войти через Apple Face ID" : "Привязать Apple Face ID"}
                  >
                    <AppleFaceIdIcon
                      size={28}
                      color={faceIdStatus === "success" ? "#34c759" : "#007aff"}
                      isSuccess={faceIdStatus === "success"}
                    />
                    <span className="ios-lock-key-sub" style={{ fontSize: "7.5px", color: "#007aff", marginTop: "2px" }}>
                      FACE ID
                    </span>
                  </button>
                );
              }
              if (key.action) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={handlePinBackspace}
                    className="ios-lock-key action"
                    title="Стереть"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePinDigit(key.num)}
                  className="ios-lock-key"
                >
                  <span className="ios-lock-key-num">{key.num}</span>
                  {key.sub && <span className="ios-lock-key-sub">{key.sub}</span>}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link href="/" style={{ color: "#8e8e93", fontSize: "13px", textDecoration: "none" }}>
              ← Вернуться на главную витрину NORD
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // АВТОРИЗОВАННЫЙ ЭКРАН УПРАВЛЕНИЯ
  // ==========================================================================
  return (
    <div className="ios-admin-app">
      {/* Dynamic Island / Face ID HUD Pop-up (при регистрации из админки) */}
      {(faceIdStatus === "scanning" || faceIdStatus === "success") && (
        <div className="ios-faceid-hud-backdrop" onClick={() => setFaceIdStatus("idle")}>
          <div className="ios-faceid-hud" onClick={(e) => e.stopPropagation()}>
            <div className={faceIdStatus === "scanning" ? "ios-faceid-hud-pulse" : ""}>
              <AppleFaceIdIcon
                size={54}
                color={faceIdStatus === "success" ? "#34c759" : "#ffffff"}
                isSuccess={faceIdStatus === "success"}
              />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.2px" }}>
              {faceIdStatus === "success" ? "Подтверждено" : "Face ID"}
            </span>
          </div>
        </div>
      )}

      {/* ТРЕБОВАНИЕ 2: ПРЕМИАЛЬНАЯ ИМЕННАЯ ШАПКА РУКОВОДИТЕЛЯ */}
      <header className="ios-navbar">
        <div className="ios-navbar-inner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #007aff, #1d4ed8)",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "26px",
                  height: "26px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0, 122, 255, 0.35)",
                }}
              >
                ММ
              </div>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#34c759",
                  boxShadow: "0 0 6px #34c759",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#1c1c1e", letterSpacing: "-0.2px" }}>
                NORD EXECUTIVE · Курбанов Магомед Магомедович
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "#6d6d72", marginLeft: "34px", marginTop: "-2px" }}>
              Управление каталогом и финансами
            </div>
            <h1 className="ios-large-title" style={{ marginTop: "6px" }}>
              {activeTab === "products" && "Аппараты"}
              {activeTab === "spares" && "Запчасти и ЗИП"}
              {activeTab === "categories" && "Категории"}
              {activeTab === "accounting" && "Бухгалтерия"}
              {activeTab === "docs" && "Реквизиты и КП"}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {savingToast && (
              <span style={{ background: "#34c759", color: "#fff", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                ✓ {savingToast}
              </span>
            )}

            {/* Быстрый бейдж Face ID в шапке */}
            {isBioSupported && (
              faceIdCredId ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#34c759",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "rgba(52, 199, 89, 0.12)",
                    padding: "6px 9px",
                    borderRadius: "10px",
                  }}
                  title="Face ID активен на этом iPhone"
                >
                  <AppleFaceIdIcon size={14} color="#34c759" isSuccess={true} />
                  <span>Face ID ✓</span>
                </span>
              ) : (
                <button
                  onClick={registerFaceId}
                  className="ios-btn-soft"
                  title="Привязать Apple Face ID на этом iPhone"
                  style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 10px", fontSize: "12px" }}
                >
                  <AppleFaceIdIcon size={15} color="#007aff" />
                  <span>+ Face ID</span>
                </button>
              )
            )}

            <button
              onClick={handleLock}
              className="ios-btn-soft"
              title="Заблокировать терминал (Выйти)"
              style={{ padding: "8px 10px", fontSize: "15px", cursor: "pointer" }}
            >
              🔒
            </button>
            <Link className="ios-btn-soft" href="/" style={{ textDecoration: "none" }}>
              На сайт ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="ios-container">
        {/* ================================================================
            ВКЛАДКА 1: УПРАВЛЕНИЕ АППАРАТАМИ (С ТОЧНЫМ РАСЧЁТОМ МАРЖИ)
           ================================================================ */}
        {activeTab === "products" && (
          <div>
            <button
              onClick={() =>
                setEditingProduct({
                  id: `nord-${Date.now()}`,
                  name: "NORD-НОВЫЙ",
                  categoryId: "piston_paint",
                  badge: "НОВИНКА",
                  subtitle: "Бесщёточная окрасочная станция высокого давления",
                  priceRub: 65000,
                  costPriceRub: 42000,
                  rentDayRub: 2500,
                  inStock: true,
                  powerW: "3000 W",
                  flowLpm: "4.5 л/мин",
                  pressureBar: "230 бар",
                  maxTip: '0.035"',
                  motorType: "Бесщёточный",
                  weightKg: "22кг / 26кг",
                  photoUrl: "/assets/site/nord-station-1095-cutout.png",
                  description: "Профессиональный безвоздушный аппарат.",
                  isNew: true,
                })
              }
              className="ios-btn-primary"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              + Добавить новый аппарат на сайт
            </button>

            <div className="ios-section-header">АКТИВНЫЕ СТАНЦИИ В КАТАЛОГЕ ({db.products.length})</div>
            <div className="ios-card">
              {db.products.map((p: any, idx: number) => {
                const cost = Number(p.costPriceRub) || 0;
                const price = Number(p.priceRub) || 0;
                const margin = price - cost;

                return (
                  <div key={p.id} className="ios-row" style={{ alignItems: "flex-start", padding: "12px 14px" }}>
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="ios-thumb"
                      style={{ marginTop: "2px" }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/site/nord-station-1095-cutout.png";
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <div
                          style={{ fontSize: "16px", fontWeight: 700, color: "#000", cursor: "pointer" }}
                          onClick={() => setEditingProduct(p)}
                        >
                          {p.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => {
                              const next = { ...db };
                              next.products[idx].inStock = !next.products[idx].inStock;
                              saveDatabase(next, next.products[idx].inStock ? "Включено на сайте" : "Скрыто в резерв");
                            }}
                            className={`ios-switch ${p.inStock ? "on" : ""}`}
                            title="В наличии на сайте"
                          >
                            <div className="ios-switch-knob" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="ios-btn-soft"
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            Изменить
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: "12px", color: "#6d6d72", margin: "2px 0 6px 0" }}>
                        {p.flowLpm} · {p.pressureBar} · сопло {p.maxTip}
                      </div>

                      {/* ТРЕБОВАНИЕ 3: ТОЧНЫЙ ИНФОРМЕР ЗАКУПКИ И МАРЖИ */}
                      <div
                        style={{
                          fontSize: "11px",
                          background: "#f2f2f7",
                          borderRadius: "8px",
                          padding: "6px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        <span style={{ color: "#6d6d72" }}>
                          Куплен за: <strong>{cost.toLocaleString("ru-RU")} ₽</strong>
                        </span>
                        <span style={{ color: "#000" }}>
                          Продажа: <strong>{price.toLocaleString("ru-RU")} ₽</strong>
                        </span>
                        <strong style={{ color: margin >= 0 ? "#34c759" : "#ff3b30", fontWeight: 700 }}>
                          Чистая маржа: {margin >= 0 ? `+${margin.toLocaleString("ru-RU")}` : margin.toLocaleString("ru-RU")} ₽
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================
            ВКЛАДКА 2: ЗАПЧАСТИ И АКСЕССУАРЫ (ЗИП)
           ================================================================ */}
        {activeTab === "spares" && (
          <div>
            <button
              onClick={() =>
                setEditingSpare({
                  id: `spare-${Date.now()}`,
                  name: "Новая запчасть / комплектующее NORD",
                  subCategory: "Сопла и базы",
                  sku: `NRD-${Math.floor(100 + Math.random() * 900)}`,
                  priceRub: 2500,
                  costPriceRub: 1100,
                  inStock: true,
                  photoUrl: "/assets/site/nord-station-595-cutout.png",
                  compatibility: "Все аппараты NORD / Aspro / Graco",
                  isNew: true,
                })
              }
              className="ios-btn-primary"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              + Добавить запчасть или аксессуар
            </button>

            <div className="ios-section-header">КАТАЛОГ ЗАПЧАСТЕЙ И РАСХОДНИКОВ ({db.spares?.length || 0})</div>
            <div className="ios-card">
              {(db.spares || []).map((sp: any) => {
                const spCost = Number(sp.costPriceRub) || 0;
                const spPrice = Number(sp.priceRub) || 0;
                const spMargin = spPrice - spCost;

                return (
                  <div
                    key={sp.id}
                    className="ios-row"
                    style={{ alignItems: "flex-start", padding: "12px 14px", cursor: "pointer" }}
                    onClick={() => setEditingSpare(sp)}
                  >
                    <img
                      src={sp.photoUrl}
                      alt={sp.name}
                      className="ios-thumb"
                      style={{ marginTop: "2px" }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/site/nord-station-595-cutout.png";
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "#000" }}>{sp.name}</div>
                        <span style={{ fontSize: "12px", color: "#007aff", flexShrink: 0 }}>Изменить ›</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#6d6d72", margin: "2px 0 6px 0" }}>
                        {sp.subCategory} · Арт. {sp.sku} · Совместимость: {sp.compatibility}
                      </div>

                      {/* ТРЕБОВАНИЕ 3: ПЛАШКА МАРЖИ ПО ЗАПЧАСТЯМ */}
                      <div
                        style={{
                          fontSize: "11px",
                          background: "#f2f2f7",
                          borderRadius: "8px",
                          padding: "6px 8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        <span style={{ color: "#6d6d72" }}>
                          Куплен за: <strong>{spCost.toLocaleString("ru-RU")} ₽</strong>
                        </span>
                        <span style={{ color: "#000" }}>
                          Продажа: <strong>{spPrice.toLocaleString("ru-RU")} ₽</strong>
                        </span>
                        <strong style={{ color: spMargin >= 0 ? "#34c759" : "#ff3b30", fontWeight: 700 }}>
                          Чистая маржа: {spMargin >= 0 ? `+${spMargin.toLocaleString("ru-RU")}` : spMargin.toLocaleString("ru-RU")} ₽
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================
            ВКЛАДКА 3: КАТЕГОРИИ САЙТА
           ================================================================ */}
        {activeTab === "categories" && (
          <div>
            <button
              onClick={() =>
                setEditingCategory({
                  id: `cat-${Date.now()}`,
                  name: "Новая категория оборудования",
                  badge: "Промышленная серия",
                  order: (db.categories?.length || 4) + 1,
                  active: true,
                  isNew: true,
                })
              }
              className="ios-btn-primary"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              + Создать новую категорию на сайте
            </button>

            <div className="ios-section-header">РАЗДЕЛЫ КАТАЛОГА НА САЙТЕ</div>
            <div className="ios-card">
              {(db.categories || []).map((cat: any, idx: number) => (
                <div key={cat.id} className="ios-row">
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setEditingCategory(cat)}>
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>{cat.name}</div>
                    <div style={{ fontSize: "12px", color: "#6d6d72" }}>Подпись: {cat.badge}</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...db };
                      next.categories[idx].active = !next.categories[idx].active;
                      saveDatabase(next, "Категории обновлены");
                    }}
                    className={`ios-switch ${cat.active ? "on" : ""}`}
                  >
                    <div className="ios-switch-knob" />
                  </button>
                  <button onClick={() => setEditingCategory(cat)} className="ios-btn-soft">
                    Правка
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            ВКЛАДКА 4: УЧЁТ И БУХГАЛТЕРИЯ (ТОЧНЫЙ РАСЧЁТ, УДАЛЕНИЕ И СБРОС)
           ================================================================ */}
        {activeTab === "accounting" && (
          <div>
            <div className="ios-kpi-grid">
              <div className="ios-kpi-box">
                <div style={{ fontSize: "12px", color: "#6d6d72" }}>Выручка (Оплачено)</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#000", marginTop: "4px" }}>
                  {financeSummary.totalIncome.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <div className="ios-kpi-box">
                <div style={{ fontSize: "12px", color: "#6d6d72" }}>Чистая прибыль</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#34c759", marginTop: "4px" }}>
                  +{financeSummary.netProfit.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setNewTxModal({
                  id: `tx-${Date.now()}`,
                  date: new Date().toISOString().slice(0, 10),
                  type: "income",
                  title: "Продажа станции NORD-6000",
                  clientName: "Покупатель",
                  clientInn: "",
                  amountRub: 95000,
                  costPriceRub: 64000,
                  extraCostRub: 0,
                  profitRub: 31000,
                  paymentMethod: "Безнал (Счёт с НДС)",
                  status: "paid",
                })
              }
              className="ios-btn-primary"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              + Записать продажу / аренду / расход
            </button>

            {/* ТРЕБОВАНИЕ 4: ШАПКА ЖУРНАЛА С КНОПКОЙ СБРОСА ДЕМО-ДАННЫХ */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 6px 16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", color: "#6d6d72", letterSpacing: "0.2px" }}>
                ЖУРНАЛ ОПЕРАЦИЙ ({(db.accounting?.transactions || []).length})
              </div>
              {(db.accounting?.transactions || []).length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Очистить все демо-записи? Баланс станет 0 ₽, и вы сможете вести чистый реальный учёт.")) {
                      const next = { ...db };
                      next.accounting.transactions = [];
                      saveDatabase(next, "Журнал очищен · Баланс 0 ₽");
                    }
                  }}
                  style={{
                    background: "rgba(255, 59, 48, 0.1)",
                    color: "#ff3b30",
                    border: "none",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Очистить демо-записи (Начать учёт с 0 ₽)
                </button>
              )}
            </div>

            <div className="ios-card">
              {(db.accounting?.transactions || []).length === 0 ? (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "#8e8e93", fontSize: "14px" }}>
                  Журнал пуст. Нажмите «+ Записать продажу», чтобы добавить первую реальную сделку.
                </div>
              ) : (
                (db.accounting?.transactions || []).map((tx: any, i: number) => {
                  const amt = Number(tx.amountRub) || 0;
                  const cost = Number(tx.costPriceRub != null ? tx.costPriceRub : Math.max(0, amt - (Number(tx.profitRub) || 0)));
                  const profit = Number(tx.profitRub != null ? tx.profitRub : (amt - cost));

                  return (
                    <div key={tx.id || i} className="ios-row">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "11px", color: "#6d6d72" }}>
                          {tx.date} · {tx.paymentMethod}
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "#000" }}>{tx.title}</div>
                        <div style={{ fontSize: "12px", color: "#007aff", marginBottom: "4px" }}>{tx.clientName}</div>

                        {/* ТРЕБОВАНИЕ 4: ПОДРОБНАЯ ДЕТАЛИЗАЦИЯ КАЖДОЙ ОПЕРАЦИИ */}
                        {tx.type === "income" ? (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#3c3c43",
                              background: "#f2f2f7",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              display: "inline-block",
                              marginTop: "2px",
                            }}
                          >
                            Продажа: {amt.toLocaleString("ru-RU")} ₽ · Куплен за: {cost.toLocaleString("ru-RU")} ₽ ·{" "}
                            <strong style={{ color: "#34c759" }}>Чистая прибыль: +{profit.toLocaleString("ru-RU")} ₽</strong>
                          </div>
                        ) : (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#ff3b30",
                              background: "#fdf2f2",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              display: "inline-block",
                              marginTop: "2px",
                            }}
                          >
                            Расход: -{amt.toLocaleString("ru-RU")} ₽
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: tx.type === "income" ? "#34c759" : "#ff3b30",
                            }}
                          >
                            {tx.type === "income" ? "+" : "-"}
                            {amt.toLocaleString("ru-RU")} ₽
                          </div>
                        </div>

                        {/* ТРЕБОВАНИЕ 4: КНОПКА УДАЛЕНИЯ ОПЕРАЦИИ */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(tx.id || `tx-${i}`);
                          }}
                          className="ios-tx-del-btn"
                          title="Удалить запись из учёта"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            ВКЛАДКА 5: ДОКУМЕНТЫ, РЕКВИЗИТЫ И ПАРОЛЬ ТЕРМИНАЛА
           ================================================================ */}
        {activeTab === "docs" && (
          <div>
            <div className="ios-section-header">БЫСТРАЯ ВЫПИСКА ДОКУМЕНТА КЛИЕНТУ (A4 PDF)</div>
            <div className="ios-card" style={{ padding: "14px" }}>
              <div style={{ display: "grid", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Покупатель (Название ООО / ИП / ФИО):</label>
                  <input
                    className="ios-input"
                    value={docClientName}
                    onChange={(e) => setDocClientName(e.target.value)}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#6d6d72" }}>ИНН покупателя:</label>
                    <input
                      className="ios-input"
                      value={docClientInn}
                      onChange={(e) => setDocClientInn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#6d6d72" }}>Сумма документа (₽):</label>
                    <input
                      type="number"
                      className="ios-input"
                      value={docAmountRub}
                      onChange={(e) => setDocAmountRub(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Аппарат или запчасть в документе:</label>
                  <select
                    className="ios-input"
                    value={docSelectedItem}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDocSelectedItem(val);
                      const found = db.products.find((p: any) => val.includes(p.name));
                      if (found) setDocAmountRub(Number(found.priceRub));
                    }}
                  >
                    {db.products.map((p: any) => (
                      <option key={p.id} value={`Безвоздушная станция ${p.name} (${p.flowLpm}, ${p.pressureBar})`}>
                        {p.name} — {Number(p.priceRub).toLocaleString("ru-RU")} ₽
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "4px" }}>
                  <button onClick={() => handlePrintOfficialDoc("invoice")} className="ios-btn-primary">
                    Счёт PDF
                  </button>
                  <button onClick={() => handlePrintOfficialDoc("upd")} className="ios-btn-green">
                    УПД / Акт
                  </button>
                  <button onClick={() => handlePrintOfficialDoc("contract")} className="ios-btn-soft">
                    Договор
                  </button>
                </div>
              </div>
            </div>

            {/* НАСТРОЙКА PIN-КОДА И FACE ID ТЕРМИНАЛА */}
            <div className="ios-section-header">БЕЗОПАСНОСТЬ И ВХОД В ТЕРМИНАЛ</div>
            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72", fontWeight: 600 }}>
                  PIN-код терминала собственника (по умолчанию 2026):
                </label>
                <input
                  type="text"
                  maxLength={8}
                  className="ios-input"
                  value={db.pinCode || "2026"}
                  onChange={(e) => {
                    const next = { ...db, pinCode: e.target.value };
                    setDb(next);
                  }}
                />
                <small style={{ fontSize: "11px", color: "#8e8e93", marginTop: "4px", display: "block" }}>
                  Этот 4-значный код запрашивается на экране блокировки iPhone Passcode при входе в /admin
                </small>
              </div>
              <button
                onClick={() => saveDatabase(db, "PIN-код обновлён")}
                className="ios-btn-primary"
                style={{ width: "100%" }}
              >
                Сохранить новый PIN-код
              </button>

              {/* Блок привязки Apple Face ID / Touch ID */}
              <div
                style={{
                  borderTop: "0.5px solid #e5e5ea",
                  paddingTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "rgba(0, 122, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AppleFaceIdIcon size={24} color="#007aff" isSuccess={!!faceIdCredId} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#000" }}>
                      Apple Face ID / Touch ID
                    </div>
                    <div style={{ fontSize: "12px", color: faceIdCredId ? "#34c759" : "#6d6d72" }}>
                      {faceIdCredId ? "✓ Face ID активен на этом iPhone" : "Биометрический вход не настроен"}
                    </div>
                  </div>
                </div>

                {faceIdCredId ? (
                  <button
                    onClick={resetFaceId}
                    className="ios-btn-danger"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    Отвязать
                  </button>
                ) : (
                  <button
                    onClick={registerFaceId}
                    className="ios-btn-soft"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    Привязать
                  </button>
                )}
              </div>
            </div>

            <div className="ios-section-header">РЕКВИЗИТЫ КОМПАНИИ (ПОДСТАВЛЯЮТСЯ В СЧЕТА И НА САЙТ)</div>
            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "10px" }}>
              {[
                { key: "companyName", label: "Юр. лицо / ИП" },
                { key: "directorName", label: "Руководитель (ФИО подписанта)" },
                { key: "inn", label: "ИНН" },
                { key: "kpp", label: "КПП" },
                { key: "bankName", label: "Банк" },
                { key: "bik", label: "БИК банка" },
                { key: "checkingAccount", label: "Расчётный счёт" },
                { key: "legalAddress", label: "Адрес склада и отгрузки" },
                { key: "phone", label: "Телефон отдела продаж" },
                { key: "vatMode", label: "Режим НДС (С НДС 20% / Без НДС)" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>{field.label}:</label>
                  <input
                    className="ios-input"
                    value={db.companyDocs?.[field.key] || ""}
                    onChange={(e) => {
                      const next = {
                        ...db,
                        companyDocs: { ...db.companyDocs, [field.key]: e.target.value },
                      };
                      setDb(next);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => saveDatabase(db, "Реквизиты обновлены")}
                className="ios-btn-primary"
                style={{ width: "100%", marginTop: "4px" }}
              >
                Сохранить реквизиты компании
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          ТРЕБОВАНИЕ 3: ШТОРКА РЕДАКТИРОВАНИЯ АППАРАТА (С ПОЛЯМИ ЗАКУПКИ И МАРЖИ)
         ==================================================================== */}
      {editingProduct && (
        <div className="ios-sheet-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-grabber" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => setEditingProduct(null)} className="ios-btn-soft">
                Отмена
              </button>
              <strong style={{ fontSize: "16px" }}>{editingProduct.name}</strong>
              <button
                onClick={() => {
                  const next = { ...db };
                  const idx = next.products.findIndex((x: any) => x.id === editingProduct.id);
                  const cleanItem = { ...editingProduct };
                  delete cleanItem.isNew;
                  if (idx >= 0) next.products[idx] = cleanItem;
                  else next.products.push(cleanItem);
                  saveDatabase(next, "Товар опубликован на сайте");
                  setEditingProduct(null);
                }}
                className="ios-btn-primary"
                style={{ padding: "8px 14px", fontSize: "14px" }}
              >
                Готово
              </button>
            </div>

            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={editingProduct.photoUrl}
                  alt=""
                  style={{ width: "72px", height: "72px", objectFit: "contain", borderRadius: "12px", border: "1px solid #e5e5ea", background: "#fff" }}
                />
                <label className="ios-btn-soft" style={{ cursor: "pointer" }}>
                  Загрузить фото с iPhone
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleIphonePhotoUpload(e, (url) => setEditingProduct({ ...editingProduct, photoUrl: url }))
                    }
                  />
                </label>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Название модели:</label>
                <input
                  className="ios-input"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Категория на сайте:</label>
                <select
                  className="ios-input"
                  value={editingProduct.categoryId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                >
                  {(db.categories || []).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ПОЛЯ ЗАКУПКИ И ПРОДАЖИ */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>Куплен за (Цена закупки, ₽):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={editingProduct.costPriceRub || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPriceRub: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>Цена продажи на сайте (₽):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={editingProduct.priceRub || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceRub: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>Аренда (₽/сут):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={editingProduct.rentDayRub || 2500}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rentDayRub: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* АВТОМАТИЧЕСКИЙ ЗЕЛЁНЫЙ ИНФОРМЕР ЧИСТОЙ ПРИБЫЛИ С 1 ШТ. */}
              {(() => {
                const pPrice = Number(editingProduct.priceRub) || 0;
                const pCost = Number(editingProduct.costPriceRub) || 0;
                const pProfit = pPrice - pCost;
                return (
                  <div
                    style={{
                      background: pProfit >= 0 ? "#eafaf1" : "#fdf2f2",
                      border: `1px solid ${pProfit >= 0 ? "#34c759" : "#ff3b30"}`,
                      color: pProfit >= 0 ? "#1b5e20" : "#d32f2f",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{pProfit >= 0 ? "💰" : "⚠️"}</span>
                    <span>
                      Ваша чистая прибыль с 1 шт.:{" "}
                      <strong style={{ fontSize: "14px" }}>
                        {pProfit >= 0 ? `+${pProfit.toLocaleString("ru-RU")}` : pProfit.toLocaleString("ru-RU")} ₽
                      </strong>
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Мощность (W):</label>
                  <input
                    className="ios-input"
                    value={editingProduct.powerW}
                    onChange={(e) => setEditingProduct({ ...editingProduct, powerW: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Производительность:</label>
                  <input
                    className="ios-input"
                    value={editingProduct.flowLpm}
                    onChange={(e) => setEditingProduct({ ...editingProduct, flowLpm: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Давление:</label>
                  <input
                    className="ios-input"
                    value={editingProduct.pressureBar}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pressureBar: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Макс. сопло:</label>
                  <input
                    className="ios-input"
                    value={editingProduct.maxTip}
                    onChange={(e) => setEditingProduct({ ...editingProduct, maxTip: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Описание для покупателя:</label>
                <textarea
                  rows={3}
                  className="ios-input"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              {!editingProduct.isNew && (
                <button
                  onClick={() => {
                    const next = {
                      ...db,
                      products: db.products.filter((x: any) => x.id !== editingProduct.id),
                    };
                    saveDatabase(next, "Товар удалён");
                    setEditingProduct(null);
                  }}
                  className="ios-btn-danger"
                >
                  Удалить аппарат с сайта
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ТРЕБОВАНИЕ 3: ШТОРКА РЕДАКТИРОВАНИЯ ЗАПЧАСТИ (С ЗАКУПКОЙ И МАРЖОЙ)
         ==================================================================== */}
      {editingSpare && (
        <div className="ios-sheet-backdrop" onClick={() => setEditingSpare(null)}>
          <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-grabber" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => setEditingSpare(null)} className="ios-btn-soft">
                Отмена
              </button>
              <strong>Запчасть / ЗИП</strong>
              <button
                onClick={() => {
                  const next = { ...db, spares: [...(db.spares || [])] };
                  const idx = next.spares.findIndex((x: any) => x.id === editingSpare.id);
                  const clean = { ...editingSpare };
                  delete clean.isNew;
                  if (idx >= 0) next.spares[idx] = clean;
                  else next.spares.push(clean);
                  saveDatabase(next, "Запчасть сохранена");
                  setEditingSpare(null);
                }}
                className="ios-btn-primary"
                style={{ padding: "8px 14px", fontSize: "14px" }}
              >
                Готово
              </button>
            </div>

            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={editingSpare.photoUrl}
                  alt=""
                  style={{ width: "68px", height: "68px", objectFit: "contain", borderRadius: "10px", border: "1px solid #e5e5ea", background: "#fff" }}
                />
                <label className="ios-btn-soft" style={{ cursor: "pointer" }}>
                  Загрузить фото запчасти с iPhone
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleIphonePhotoUpload(e, (url) => setEditingSpare({ ...editingSpare, photoUrl: url }))
                    }
                  />
                </label>
              </div>
              <input
                className="ios-input"
                placeholder="Название запчасти"
                value={editingSpare.name}
                onChange={(e) => setEditingSpare({ ...editingSpare, name: e.target.value })}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>Куплен за (Цена закупки, ₽):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={editingSpare.costPriceRub || 0}
                    onChange={(e) => setEditingSpare({ ...editingSpare, costPriceRub: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>Цена продажи на сайте (₽):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={editingSpare.priceRub || 0}
                    onChange={(e) => setEditingSpare({ ...editingSpare, priceRub: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Автоматический расчёт прибыли по запчасти */}
              {(() => {
                const spPrice = Number(editingSpare.priceRub) || 0;
                const spCost = Number(editingSpare.costPriceRub) || 0;
                const spProfit = spPrice - spCost;
                return (
                  <div
                    style={{
                      background: spProfit >= 0 ? "#eafaf1" : "#fdf2f2",
                      border: `1px solid ${spProfit >= 0 ? "#34c759" : "#ff3b30"}`,
                      color: spProfit >= 0 ? "#1b5e20" : "#d32f2f",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>💰</span>
                    <span>
                      Ваша чистая прибыль с 1 шт.:{" "}
                      <strong>
                        {spProfit >= 0 ? `+${spProfit.toLocaleString("ru-RU")}` : spProfit.toLocaleString("ru-RU")} ₽
                      </strong>
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <input
                  className="ios-input"
                  placeholder="Артикул (SKU)"
                  value={editingSpare.sku}
                  onChange={(e) => setEditingSpare({ ...editingSpare, sku: e.target.value })}
                />
                <input
                  className="ios-input"
                  placeholder="Совместимость"
                  value={editingSpare.compatibility}
                  onChange={(e) => setEditingSpare({ ...editingSpare, compatibility: e.target.value })}
                />
              </div>

              {!editingSpare.isNew && (
                <button
                  onClick={() => {
                    const next = { ...db, spares: db.spares.filter((x: any) => x.id !== editingSpare.id) };
                    saveDatabase(next, "Запчасть удалена");
                    setEditingSpare(null);
                  }}
                  className="ios-btn-danger"
                >
                  Удалить запчасть
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ШТОРКА РЕДАКТИРОВАНИЯ КАТЕГОРИИ */}
      {editingCategory && (
        <div className="ios-sheet-backdrop" onClick={() => setEditingCategory(null)}>
          <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-grabber" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => setEditingCategory(null)} className="ios-btn-soft">
                Отмена
              </button>
              <strong>Категория</strong>
              <button
                onClick={() => {
                  const next = { ...db, categories: [...(db.categories || [])] };
                  const idx = next.categories.findIndex((x: any) => x.id === editingCategory.id);
                  const clean = { ...editingCategory };
                  delete clean.isNew;
                  if (idx >= 0) next.categories[idx] = clean;
                  else next.categories.push(clean);
                  saveDatabase(next, "Категория сохранена");
                  setEditingCategory(null);
                }}
                className="ios-btn-primary"
                style={{ padding: "8px 14px", fontSize: "14px" }}
              >
                Готово
              </button>
            </div>
            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "10px" }}>
              <input
                className="ios-input"
                placeholder="Название категории"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
              <input
                className="ios-input"
                placeholder="Короткий бейдж"
                value={editingCategory.badge}
                onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ТРЕБОВАНИЕ 3: ШТОРКА НОВОЙ БУХГАЛТЕРСКОЙ ОПЕРАЦИИ С ТОЧНЫМ РАСЧЁТОМ
         ==================================================================== */}
      {newTxModal && (
        <div className="ios-sheet-backdrop" onClick={() => setNewTxModal(null)}>
          <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-grabber" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => setNewTxModal(null)} className="ios-btn-soft">
                Отмена
              </button>
              <strong>Новая запись в учёт</strong>
              <button
                onClick={() => {
                  const amt = Number(newTxModal.amountRub) || 0;
                  const cost = Number(newTxModal.costPriceRub) || 0;
                  const extra = Number(newTxModal.extraCostRub) || 0;
                  const profit = newTxModal.type === "income" ? amt - cost - extra : -amt;

                  const finalTx = {
                    ...newTxModal,
                    amountRub: amt,
                    costPriceRub: cost,
                    extraCostRub: extra,
                    profitRub: profit,
                  };
                  const next = { ...db };
                  next.accounting.transactions = [finalTx, ...(next.accounting?.transactions || [])];
                  saveDatabase(next, "Записано в бухгалтерию");
                  setNewTxModal(null);
                }}
                className="ios-btn-primary"
                style={{ padding: "8px 14px", fontSize: "14px" }}
              >
                Сохранить
              </button>
            </div>

            <div className="ios-card" style={{ padding: "14px", display: "grid", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Тип операции:</label>
                <select
                  className="ios-input"
                  value={newTxModal.type}
                  onChange={(e) => setNewTxModal({ ...newTxModal, type: e.target.value })}
                >
                  <option value="income">Приход (Продажа аппарата / ЗИП / Аренда)</option>
                  <option value="expense">Расход (Закупка / Логистика / Реклама)</option>
                </select>
              </div>

              {newTxModal.type === "income" && (
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72", fontWeight: 600 }}>
                    Выберите проданный товар из каталога (автозаполнение закупки и цены):
                  </label>
                  <select
                    className="ios-input"
                    defaultValue=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      if (val.startsWith("prod_")) {
                        const p = db.products.find((x: any) => x.id === val.replace("prod_", ""));
                        if (p) {
                          setNewTxModal({
                            ...newTxModal,
                            title: `Продажа станции ${p.name}`,
                            amountRub: Number(p.priceRub) || 0,
                            costPriceRub: Number(p.costPriceRub) || 0,
                            extraCostRub: 0,
                          });
                        }
                      } else if (val.startsWith("spare_")) {
                        const sp = (db.spares || []).find((x: any) => x.id === val.replace("spare_", ""));
                        if (sp) {
                          setNewTxModal({
                            ...newTxModal,
                            title: `Продажа ЗИП: ${sp.name}`,
                            amountRub: Number(sp.priceRub) || 0,
                            costPriceRub: Number(sp.costPriceRub) || 0,
                            extraCostRub: 0,
                          });
                        }
                      }
                    }}
                  >
                    <option value="">-- Выбрать из каталога (или ввести вручную) --</option>
                    <optgroup label="Окрасочные станции NORD">
                      {db.products.map((p: any) => (
                        <option key={p.id} value={`prod_${p.id}`}>
                          {p.name} — Закупка: {Number(p.costPriceRub || 0).toLocaleString("ru-RU")} ₽ | Продажа: {Number(p.priceRub).toLocaleString("ru-RU")} ₽
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Запчасти и ЗИП">
                      {(db.spares || []).map((sp: any) => (
                        <option key={sp.id} value={`spare_${sp.id}`}>
                          {sp.name} — Закупка: {Number(sp.costPriceRub || 0).toLocaleString("ru-RU")} ₽ | Продажа: {Number(sp.priceRub).toLocaleString("ru-RU")} ₽
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Описание операции:</label>
                <input
                  className="ios-input"
                  placeholder="Например: Продажа станции NORD-6000 + сопло"
                  value={newTxModal.title}
                  onChange={(e) => setNewTxModal({ ...newTxModal, title: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Клиент / Контрагент:</label>
                <input
                  className="ios-input"
                  placeholder="Например: ООО «СтройПодряд» / Частный мастер"
                  value={newTxModal.clientName}
                  onChange={(e) => setNewTxModal({ ...newTxModal, clientName: e.target.value })}
                />
              </div>

              {newTxModal.type === "income" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>
                        Цена продажи клиенту (₽):
                      </label>
                      <input
                        type="number"
                        className="ios-input"
                        value={newTxModal.amountRub}
                        onChange={(e) => setNewTxModal({ ...newTxModal, amountRub: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>
                        Куплен за / Себест. (₽):
                      </label>
                      <input
                        type="number"
                        className="ios-input"
                        value={newTxModal.costPriceRub || 0}
                        onChange={(e) => setNewTxModal({ ...newTxModal, costPriceRub: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "#6d6d72", fontWeight: 600 }}>
                        Доп. расход (скидка/дост., ₽):
                      </label>
                      <input
                        type="number"
                        className="ios-input"
                        value={newTxModal.extraCostRub || 0}
                        onChange={(e) => setNewTxModal({ ...newTxModal, extraCostRub: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* БЛОК ТОЧНОГО АВТОМАТИЧЕСКОГО РАСЧЁТА ЧИСТОЙ ПРИБЫЛИ */}
                  {(() => {
                    const amt = Number(newTxModal.amountRub) || 0;
                    const cost = Number(newTxModal.costPriceRub) || 0;
                    const extra = Number(newTxModal.extraCostRub) || 0;
                    const calcProfit = amt - cost - extra;
                    return (
                      <div
                        style={{
                          background: "#eafaf1",
                          border: "1px solid #34c759",
                          borderRadius: "12px",
                          padding: "12px 14px",
                          color: "#1b5e20",
                          fontSize: "13px",
                          lineHeight: 1.45,
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                          Точный расчёт прибыли:
                        </div>
                        <div style={{ fontSize: "13px" }}>
                          <strong>{amt.toLocaleString("ru-RU")} ₽</strong> (продажа) −{" "}
                          <strong>{cost.toLocaleString("ru-RU")} ₽</strong> (куплен за)
                          {extra > 0 ? (
                            <> − <strong>{extra.toLocaleString("ru-RU")} ₽</strong> (доп. расход)</>
                          ) : ""}
                          {" = "}
                          <span style={{ fontSize: "16px", fontWeight: 800, color: "#2e7d32" }}>
                            {calcProfit >= 0 ? `+${calcProfit.toLocaleString("ru-RU")}` : calcProfit.toLocaleString("ru-RU")} ₽ чистыми
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div>
                  <label style={{ fontSize: "12px", color: "#6d6d72" }}>Сумма расхода (₽):</label>
                  <input
                    type="number"
                    className="ios-input"
                    value={newTxModal.amountRub}
                    onChange={(e) => setNewTxModal({ ...newTxModal, amountRub: Number(e.target.value) })}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: "12px", color: "#6d6d72" }}>Способ оплаты:</label>
                <select
                  className="ios-input"
                  value={newTxModal.paymentMethod}
                  onChange={(e) => setNewTxModal({ ...newTxModal, paymentMethod: e.target.value })}
                >
                  <option value="Безнал (Счёт с НДС)">Безнал (Счёт с НДС)</option>
                  <option value="СБП / Перевод">СБП / Перевод</option>
                  <option value="Наличные в офисе">Наличные в офисе</option>
                  <option value="Карта компании">Карта компании</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* НИЖНИЙ НАТИВНЫЙ TAB BAR iPHONE (5 ВКЛАДОК) */}
      <nav className="ios-tabbar">
        <div className="ios-tabbar-inner">
          <button
            onClick={() => setActiveTab("products")}
            className={`ios-tab-btn ${activeTab === "products" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Аппараты</span>
          </button>

          <button
            onClick={() => setActiveTab("spares")}
            className={`ios-tab-btn ${activeTab === "spares" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9" />
            </svg>
            <span>Запчасти</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`ios-tab-btn ${activeTab === "categories" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Категории</span>
          </button>

          <button
            onClick={() => setActiveTab("accounting")}
            className={`ios-tab-btn ${activeTab === "accounting" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Учёт</span>
          </button>

          <button
            onClick={() => setActiveTab("docs")}
            className={`ios-tab-btn ${activeTab === "docs" ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>Документы</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
