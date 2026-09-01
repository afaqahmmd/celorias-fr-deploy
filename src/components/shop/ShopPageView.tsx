import ShopHero from "@/components/shop/ShopHero";
import ShopListing from "@/components/shop/ShopListing";
import SiteChrome from "@/components/layout/SiteChrome";
import ApiErrorToast from "@/components/ui/ApiErrorToast";
import { fetchDashboardCategories } from "@/services/dashboard";
import { fetchProducts } from "@/services/products";
import {
  parseGridColumns,
  parseProductSortBy,
  parseQueryList,
  parseSearchQuery,
  PRODUCT_PAGE_SIZE,
} from "@/lib/catalog";
import type { ApiCategory, ApiProduct } from "@/types/api";

function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface ShopPageViewProps {
  categorySlug?: string;
  sortByParam?: string | string[];
  stoneTypeParam?: string | string[];
  stoneColorParam?: string | string[];
  gridParam?: string | string[];
  qParam?: string | string[];
}

export default async function ShopPageView({
  categorySlug,
  sortByParam,
  stoneTypeParam,
  stoneColorParam,
  gridParam,
  qParam,
}: ShopPageViewProps) {
  const sortBy = parseProductSortBy(sortByParam);
  const stoneTypes = parseQueryList(stoneTypeParam);
  const stoneColors = parseQueryList(stoneColorParam);
  const gridColumns = parseGridColumns(gridParam);
  const searchQuery = parseSearchQuery(qParam);

  let errorMessage: string | null = null;
  let items: ApiProduct[] = [];
  let page = 1;
  let totalPages = 1;
  let total = 0;
  let categories: Pick<ApiCategory, "name" | "slug">[] = [];

  try {
    const response = await fetchProducts({
      page: 1,
      pageSize: PRODUCT_PAGE_SIZE,
      sortBy,
      categorySlug,
      q: searchQuery,
    });
    items = response.items;
    page = response.page;
    totalPages = response.totalPages;
    total = response.total;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load products. Please try again later.";
  }

  try {
    const dashboardCategories = await fetchDashboardCategories();
    categories = dashboardCategories.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    const unique = new Map<string, Pick<ApiCategory, "name" | "slug">>();
    for (const item of items) {
      unique.set(item.category.slug, {
        name: item.category.name,
        slug: item.category.slug,
      });
    }
    categories = Array.from(unique.values());
  }

  let categoryName: string | undefined;
  if (categorySlug) {
    categoryName =
      categories.find((category) => category.slug === categorySlug)?.name ??
      items[0]?.category.name ??
      formatCategoryLabel(categorySlug);
  }

  const breadcrumbs = searchQuery
    ? [{ label: "Home", href: "/" }, { label: "Search" }]
    : categorySlug
      ? [
          { label: "Home", href: "/" },
          { label: "Category", href: "/products" },
          { label: categoryName ?? formatCategoryLabel(categorySlug) },
        ]
      : [{ label: "Home", href: "/" }, { label: "Products" }];

  return (
    <SiteChrome>
      <ShopHero title="Premium Jewellery" breadcrumbs={breadcrumbs} />
      {errorMessage ? (
        <section className="bg-white py-20">
          <ApiErrorToast message={errorMessage} />
          <p className="text-center text-sm text-text-muted">{errorMessage}</p>
        </section>
      ) : (
        <ShopListing
          key={`${categorySlug ?? "all"}-${sortBy}-${searchQuery ?? ""}`}
          initialItems={items}
          page={page}
          totalPages={totalPages}
          total={total}
          sortBy={sortBy}
          gridColumns={gridColumns}
          categorySlug={categorySlug}
          categories={categories}
          stoneTypes={stoneTypes}
          stoneColors={stoneColors}
          pageSize={PRODUCT_PAGE_SIZE}
          searchQuery={searchQuery}
        />
      )}
    </SiteChrome>
  );
}
