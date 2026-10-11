import type { Metadata } from "next";
import ShopPageView from "@/components/shop/ShopPageView";

export const dynamic = "force-dynamic";

interface CategoryProductsPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const label = categorySlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: `${label} | Celoria`,
    description: `Shop ${label} from the Celoria premium jewellery collection.`,
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: CategoryProductsPageProps) {
  const [{ categorySlug }, query] = await Promise.all([params, searchParams]);

  return (
    <ShopPageView
      categorySlug={categorySlug}
      sortByParam={query.sortBy}
      stoneTypeParam={query.stoneType}
      stoneColorParam={query.stoneColor}
      gridParam={query.grid}
      qParam={query.q}
    />
  );
}
