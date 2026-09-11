// import { readApiMessage } from "@/lib/api-message";
import { getMockFeaturedProducts, mockCategories } from "@/data/mock/products";
import type {
  ApiCategory,
  ApiFeaturedProduct,
  ApiTestimonial,
} from "@/types/api";

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
// const API_KEY = process.env.CELORIAS_API_KEY ?? "";

// async function dashboardFetch<T>(path: string): Promise<T> {
//   const response = await fetch(`${API_URL}${path}`, {
//     headers: {
//       "x-api-key": API_KEY,
//       "Content-Type": "application/json",
//     },
//     next: { revalidate: 60 },
//   });
//
//   if (!response.ok) {
//     const raw: unknown = await response.json().catch(() => null);
//     throw new Error(
//       readApiMessage(raw, `Dashboard API ${path} failed: ${response.status}`),
//     );
//   }
//
//   return response.json() as Promise<T>;
// }

/**
 * Backend is currently unavailable — serving the static local categories
 * (src/data/mock/products.ts) instead of calling `${API_URL}/dashboard/categories`.
 * Restore the commented-out implementation below once the API is back.
 */
export async function fetchDashboardCategories(): Promise<ApiCategory[]> {
  return mockCategories;
  // return dashboardFetch<ApiCategory[]>("/dashboard/categories");
}

/**
 * Backend is currently unavailable — serving featured products derived from
 * the static local catalog instead of calling `${API_URL}/dashboard/products/featured`.
 * Restore the commented-out implementation below once the API is back.
 */
export async function fetchFeaturedProducts(): Promise<ApiFeaturedProduct[]> {
  return getMockFeaturedProducts();
  // return dashboardFetch<ApiFeaturedProduct[]>("/dashboard/products/featured");
}

/**
 * Backend is currently unavailable — there is no local testimonials dataset,
 * so this resolves to an empty list (the landing page already falls back to
 * mock content when this list is empty). Restore the commented-out
 * implementation below once the API is back.
 */
export async function fetchDashboardTestimonials(): Promise<ApiTestimonial[]> {
  return [];
  // return dashboardFetch<ApiTestimonial[]>("/dashboard/testimonials");
}
