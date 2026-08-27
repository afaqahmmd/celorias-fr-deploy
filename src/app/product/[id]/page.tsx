import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/ProductDetailView";
import SiteChrome from "@/components/layout/SiteChrome";
import ApiErrorToast from "@/components/ui/ApiErrorToast";
import { fetchProductById, fetchProducts } from "@/services/products";
import type { ApiProductDetail, ProductPreview } from "@/types/api";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);
    if (!product) {
      return { title: "Product Not Found | Celoria" };
    }

    return {
      title: `${product.name} | Celoria`,
      description: product.description,
    };
  } catch {
    return { title: "Product | Celoria" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product: ApiProductDetail | null = null;
  let loadError: string | null = null;

  try {
    product = await fetchProductById(id);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load this product. Please try again later.";
  }

  if (loadError) {
    return (
      <SiteChrome>
        <section className="bg-white py-24">
          <ApiErrorToast message={loadError} />
          <p className="text-center text-sm text-text-muted">{loadError}</p>
        </section>
      </SiteChrome>
    );
  }

  if (!product) {
    notFound();
  }

  let relatedProducts: ProductPreview[] = [];

  try {
    const related = await fetchProducts({
      page: 1,
      pageSize: 12,
      sortBy: "best_sellers",
    });
    relatedProducts = related.items
      .filter((item) => item.id !== product.id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        images: item.images,
        rating: item.averageRating ?? 0,
        reviewCount: item.reviewCount,
      }));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }

  return (
    <ProductDetailView product={product} relatedProducts={relatedProducts} />
  );
}
