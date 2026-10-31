"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/components/store-context";
import { SITE_CONFIG } from "@/lib/site-config";

const messages: Record<string, string> = {
  pending_payment: "Платёж обрабатывается. Статус обновится автоматически.",
  refund_pending: "Оплата получена, но заказ не удалось подтвердить. Оформляем возврат.",
  paid: "Оплата подтверждена. Заказ принят в обработку инженером склада.",
  processing: "Заказ принят в работу. Инженер NORD свяжется с вами для согласования отгрузки и счёта.",
  shipped: "Оборудование отгружено / передано в доставку.",
  completed: "Заказ успешно выполнен.",
  cancelled: "Заказ отменён.",
  payment_failed: "Платёж не прошёл. Вы можете связаться с менеджером или оформить заказ по счёту.",
  refunded: "По заказу оформлен возврат средств.",
};

export function OrderReturnStatus({ orderId, submitted }: { orderId: string; submitted?: boolean }) {
  const { clearCart } = useStore();
  const [status, setStatus] = useState(submitted ? "processing" : "pending_payment");
  const [error, setError] = useState("");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (submitted) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      try {
        const response = await fetch(`/api/order-status?id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Не удалось проверить статус платежа.");
        if (!active) return;
        setStatus(result.status);
        setError("");
        if (result.status === "pending_payment" || result.status === "refund_pending") {
          timer = setTimeout(check, 2500);
        }
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Заказ зарегистрирован. Ожидайте звонка инженера.");
      }
    };
    check();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [orderId, submitted]);

  return (
    <div className="empty-state">
      <h2>Заказ № {orderId.slice(0, 8).toUpperCase()} зарегистрирован</h2>
      <p>{error || messages[status] || "Статус обновляется."}</p>
      <p style={{ marginTop: 12 }}>
        Полный идентификатор: <code>{orderId}</code>
      </p>
      <p style={{ marginTop: 12 }}>
        Прямая линия склада в Москве: <a href={SITE_CONFIG.phoneHref}><strong>{SITE_CONFIG.phone}</strong></a>
      </p>
    </div>
  );
}
