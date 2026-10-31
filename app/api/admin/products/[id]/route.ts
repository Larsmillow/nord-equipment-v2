import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { productSchema } from "@/lib/admin-product";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (session.role !== "owner") return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
    const { id } = await params;
    const parsed = productSchema.safeParse({ ...await request.json().catch(() => null), id });
    if (!parsed.success) return NextResponse.json({ error: "Проверьте поля товара." }, { status: 400 });
    const product = parsed.data;
    const category = await query<{ id: string }>("SELECT id FROM categories WHERE slug = $1", [product.categorySlug]);
    if (!category.rows[0]) return NextResponse.json({ error: "Категория не найдена." }, { status: 400 });
    const result = await query(
      `UPDATE products SET name=$2, slug=$3, short_name=$4, description=$5, category_id=$6,
        manufacturer=$7, model=$8, images=$9::jsonb, characteristics=$10::jsonb, materials=$11,
        purchase_price=$12, rental_price_daily=$13, rental_min_days=$14, stock_quantity=$15,
        purchase_enabled=$16, rental_enabled=$17, published=$18, badge=$19, source_url=$20,
        flow_lpm=$21, drive=$22, features=$23::jsonb, updated_at=now()
       WHERE id=$1 RETURNING id`,
      [
        id, product.name, product.slug, product.shortName, product.description, category.rows[0].id,
        product.manufacturer, product.model, JSON.stringify(product.images), JSON.stringify(product.characteristics),
        product.materials, product.purchasePrice, product.rentalPriceDaily, product.rentalMinDays,
        product.stockQuantity, product.purchaseEnabled, product.rentalEnabled, product.published, product.badge,
        product.sourceUrl ?? null, product.flowLpm ?? null, product.drive, JSON.stringify(product.features),
      ],
    );
    if (!result.rowCount) return NextResponse.json({ error: "Товар не найден." }, { status: 404 });
    return NextResponse.json({ updated: true });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to update admin product.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось обновить товар." }, { status });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (session.role !== "owner") return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
    const { id } = await params;
    const result = await query("UPDATE products SET published = false, updated_at = now() WHERE id = $1 RETURNING id", [id]);
    if (!result.rowCount) return NextResponse.json({ error: "Товар не найден." }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Unable to archive admin product.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось архивировать товар." }, { status });
  }
}
