import type { Metadata } from "next";
import ShopPageView from "@/components/shop/ShopPageView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | Celoria",
  description: "Explore our curated collection of premium jewellery and fashion.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <ShopPageView
      sortByParam={params.sortBy}
      stoneTypeParam={params.stoneType}
      stoneColorParam={params.stoneColor}
      gridParam={params.grid}
    />
  );
}
