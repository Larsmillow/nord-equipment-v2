import { redirect } from "next/navigation";

export default async function LegacyCategoryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  if (!category) redirect("/catalog");
  redirect(`/category/${encodeURIComponent(category)}`);
}
