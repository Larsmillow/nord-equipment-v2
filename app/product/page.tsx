import { notFound, redirect } from "next/navigation";

export default async function LegacyProductPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();
  redirect(`/product/${encodeURIComponent(id)}`);
}
