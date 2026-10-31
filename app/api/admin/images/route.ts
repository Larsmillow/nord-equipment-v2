import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Выберите файл изображения." }, { status: 400 });
    const extension = extensions[file.type];
    if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Допустимы JPEG, PNG или WebP до 5 МБ." }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isJpeg = file.type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = file.type === "image/png" && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isWebp = file.type === "image/webp"
      && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json({ error: "Содержимое файла не совпадает с форматом изображения." }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Загрузка фото не настроена: задайте Supabase Storage на сервере." }, { status: 503 });
    }

    const objectPath = `${randomUUID()}.${extension}`;
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: await file.arrayBuffer(),
    });
    if (!response.ok) {
      const details = await response.text();
      console.error("Supabase Storage upload failed.", response.status, details);
      return NextResponse.json({ error: "Не удалось загрузить фото в хранилище." }, { status: 502 });
    }

    const url = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;
    return NextResponse.json({ image: { src: url, alt: file.name } }, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    if (status >= 500) console.error("Admin image upload failed.", error);
    return NextResponse.json({ error: status === 401 ? "Требуется вход." : "Не удалось загрузить фото." }, { status });
  }
}
