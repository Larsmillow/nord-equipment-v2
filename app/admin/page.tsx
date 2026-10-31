import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  return (
    <>
      <section className="page-hero"><div className="container"><p className="eyebrow">NORD · Управление</p><h1>Панель управления</h1><p className="lead">Каталог, заказы и аренда.</p></div></section>
      <AdminDashboard initiallyAuthenticated={Boolean(session)} />
    </>
  );
}
