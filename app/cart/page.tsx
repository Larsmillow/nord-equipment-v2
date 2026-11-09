import { PageHero } from "@/components/page-hero";
import { CartPage } from "@/components/cart-page";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CartRoute() {
  const products = await getProducts();
  return (
    <>
      <PageHero
        title="Спецификация заказа и расчёт аренды"
        description="Проверьте выбранные станции, укажите срок проката или реквизиты организации для выставления счёта с НДС 20%."
        eyebrow="КОРЗИНА И ОФОРМЛЕНИЕ ЗАЯВКИ"
        theme="rent"
      />
      <section className="section section-blueprint">
        <div className="container">
          <CartPage products={products} />
        </div>
      </section>
    </>
  );
}
