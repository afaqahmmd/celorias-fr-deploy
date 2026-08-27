import { landingMock } from "@/data/mock/landing";
import { siteAssets } from "@/config/assets";
import {
  fetchDashboardCategories,
  fetchDashboardTestimonials,
  fetchFeaturedProducts,
} from "@/services/dashboard";
import type {
  ApiCategory,
  ApiFeaturedProduct,
  ApiTestimonial,
} from "@/types/api";
import type { LandingData } from "@/types/landing";

const testimonialsSectionMeta = {
  badge: landingMock.testimonials.badge,
  title: landingMock.testimonials.title,
  titleAccent: landingMock.testimonials.titleAccent,
  titleSuffix: landingMock.testimonials.titleSuffix,
  backgroundImage: siteAssets.testimonialsBackground,
};

function mapCategories(categories: ApiCategory[]) {
  return {
    ...landingMock.categories,
    items: categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.imageUrl,
      href: `/products/${category.slug}`,
    })),
  };
}

function mapProducts(products: ApiFeaturedProduct[]) {
  return {
    ...landingMock.products,
    items: products.map((product) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      currency: "Rs.",
      image: product.images[0] ?? landingMock.hero.images[0],
      href: `/product/${product.id}`,
    })),
  };
}

function mapTestimonials(testimonials: ApiTestimonial[]) {
  return {
    ...testimonialsSectionMeta,
    items: testimonials
      .filter((testimonial) => testimonial.isActive !== false)
      .map((testimonial) => ({
        id: testimonial.id,
        rating: testimonial.stars,
        quote: testimonial.description,
        author: testimonial.customerName,
        role: "Customer",
        productImage:
          testimonial.product?.images[0] ?? "/images/placeholder-product.svg",
      })),
  };
}

export async function getLandingData(): Promise<LandingData> {
  const [categoriesResult, productsResult, testimonialsResult] =
    await Promise.allSettled([
      fetchDashboardCategories(),
      fetchFeaturedProducts(),
      fetchDashboardTestimonials(),
    ]);

  const data: LandingData = { ...landingMock };

  if (categoriesResult.status === "fulfilled") {
    data.categories = mapCategories(categoriesResult.value);
  } else {
    console.error("Failed to fetch categories:", categoriesResult.reason);
  }

  if (productsResult.status === "fulfilled") {
    data.products = mapProducts(productsResult.value);
  } else {
    console.error("Failed to fetch products:", productsResult.reason);
  }

  if (testimonialsResult.status === "fulfilled") {
    data.testimonials = mapTestimonials(testimonialsResult.value);
  } else {
    console.error("Failed to fetch testimonials:", testimonialsResult.reason);
    data.testimonials = { ...testimonialsSectionMeta, items: [] };
  }

  return data;
}
