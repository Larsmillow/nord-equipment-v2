import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { productSchema } from "@/lib/admin-product";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const result = await query("SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id ORDER BY p.updated_at DESC");
    return NextResponse.json({ products: result.rows });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to load admin products.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось загрузить товары." }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (session.role !== "owner") return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
    const parsed = productSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Проверьте поля товара." }, { status: 400 });
    const product = parsed.data;
    const category = await query<{ id: string }>("SELECT id FROM categories WHERE slug = $1", [product.categorySlug]);
    if (!category.rows[0]) return NextResponse.json({ error: "Категория не найдена." }, { status: 400 });

    await query(
      `INSERT INTO products
        (id, name, slug, short_name, description, category_id, manufacturer, model, images,
         characteristics, materials, purchase_price, rental_price_daily, rental_min_days,
         stock_quantity, purchase_enabled, rental_enabled, published, badge, source_url,
         flow_lpm, drive, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb)`,
      [
        product.id, product.name, product.slug, product.shortName, product.description, category.rows[0].id,
        product.manufacturer, product.model, JSON.stringify(product.images), JSON.stringify(product.characteristics),
        product.materials, product.purchasePrice, product.rentalPriceDaily, product.rentalMinDays,
        product.stockQuantity, product.purchaseEnabled, product.rentalEnabled, product.published, product.badge,
        product.sourceUrl ?? null, product.flowLpm ?? null, product.drive, JSON.stringify(product.features),
      ],
    );
    return NextResponse.json({ created: true }, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to create admin product.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось сохранить товар." }, { status });
  }
}
