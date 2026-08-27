import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductTabs from "@/components/product/ProductTabs";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import ShopHero from "@/components/shop/ShopHero";
import SiteChrome from "@/components/layout/SiteChrome";
import type { ApiProductDetail, ProductPreview } from "@/types/api";

interface ProductDetailViewProps {
  product: ApiProductDetail;
  relatedProducts: ProductPreview[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const categoryHref = `/products/${product.category.slug}`;
  const currentViewed: ProductPreview = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    images: product.images,
    rating: product.reviews?.averageRating ?? 0,
    reviewCount: product.reviews?.count ?? 0,
  };

  return (
    <SiteChrome>
      <ShopHero
        title="Premium Jewellery"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/products" },
          { label: product.category.name },
        ]}
      />

      <section className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-text-muted">
              <li>
                <Link
                  href={categoryHref}
                  className="transition-colors hover:text-foreground"
                >
                  Back
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="hidden md:inline">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="hidden md:inline">
                /
              </li>
              <li className="hidden md:inline">
                <Link href="/products" className="hover:text-foreground">
                  Category
                </Link>
              </li>
              <li aria-hidden="true" className="hidden md:inline">
                /
              </li>
              <li className="hidden md:inline">
                <Link href={categoryHref} className="hover:text-foreground">
                  {product.category.name}
                </Link>
              </li>
              <li aria-hidden="true" className="hidden md:inline">
                /
              </li>
              <li className="min-w-0 truncate text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 xl:gap-16">
            <div className="min-w-0">
              <ProductGallery
                key={product.id}
                name={product.name}
                images={product.images}
              />
              <ProductTrustBadges />
            </div>

            <div className="lg:w-[448px]">
              <ProductPurchase
                productId={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.stock}
              />
            </div>
          </div>

          <ProductTabs product={product} />
          <RecentlyViewed current={currentViewed} fallback={relatedProducts} />
        </div>
      </section>
    </SiteChrome>
  );
}
