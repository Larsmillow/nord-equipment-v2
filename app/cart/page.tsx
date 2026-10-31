import { PageHero } from "@/components/page-hero";
import { CartPage } from "@/components/cart-page";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function CartRoute() {
  const products = await getProducts();
  return <><PageHero title="Корзина" description="Проверьте выбранное оборудование и данные заказа." eyebrow="Корзина" /><section className="section"><div className="container"><CartPage products={products} /></div></section></>;
}
