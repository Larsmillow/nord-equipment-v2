import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { OrderReturnStatus } from "@/components/order-return-status";

export default async function OrderReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; submitted?: string }>;
}) {
  const { order, submitted } = await searchParams;
  return (
    <>
      <PageHero
        title="Статус вашего заказа"
        description="Спецификация зарегистрирована в системе отдела поставок NORD."
        eyebrow="Заказ NORD"
      />
      <section className="section">
        <div className="container">
          {order && /^[0-9a-f-]{36}$/i.test(order) ? (
            <OrderReturnStatus orderId={order} submitted={submitted === "1"} />
          ) : (
            <div className="empty-state">
              <h2>Не удалось найти номер заказа</h2>
              <p>Проверьте статус оплаты или поставки у инженера NORD.</p>
            </div>
          )}
          <div className="hero-actions" style={{ marginTop: 20 }}>
            <Link className="button button-primary" href="/catalog">
              Вернуться в каталог
            </Link>
            <Link className="button button-outline" href="/">
              На главную
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
