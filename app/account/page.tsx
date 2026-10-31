import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function AccountPage() {
  return (
    <>
      <PageHero title="Личный кабинет" description="История заказов и профиль клиента." eyebrow="Клиентам" />
      <section className="section"><div className="container"><div className="login-wrap"><div className="login-card"><p className="eyebrow">Личный кабинет</p><h2>Доступ к заказам</h2><p>Пока личные кабинеты покупателей не активированы. Чтобы уточнить статус заказа, свяжитесь с менеджером.</p><Link className="button button-primary" href="/contacts">Связаться с NORD</Link></div></div></div></section>
    </>
  );
}
