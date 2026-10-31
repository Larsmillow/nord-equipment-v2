import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ids = new URL(request.url).searchParams.get("ids")?.split(",").filter(Boolean).slice(0, 100) || [];
  if (!ids.length) return NextResponse.json({ products: [] });
  try {
    const all = await getProducts();
    const wanted = new Set(ids);
    return NextResponse.json({ products: all.filter((product) => wanted.has(product.id)) });
  } catch (error) {
    console.error("Unable to load products.", error);
    return NextResponse.json({ error: "Не удалось загрузить каталог." }, { status: 500 });
  }
}
