import { readApiMessage } from "@/lib/api-message";
import type {
  ApiCategory,
  ApiFeaturedProduct,
  ApiTestimonial,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const API_KEY = process.env.CELORIAS_API_KEY ?? "";

async function dashboardFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const raw: unknown = await response.json().catch(() => null);
    throw new Error(
      readApiMessage(raw, `Dashboard API ${path} failed: ${response.status}`),
    );
  }

  return response.json() as Promise<T>;
}

export function fetchDashboardCategories(): Promise<ApiCategory[]> {
  return dashboardFetch<ApiCategory[]>("/dashboard/categories");
}

export function fetchFeaturedProducts(): Promise<ApiFeaturedProduct[]> {
  return dashboardFetch<ApiFeaturedProduct[]>("/dashboard/products/featured");
}

export function fetchDashboardTestimonials(): Promise<ApiTestimonial[]> {
  return dashboardFetch<ApiTestimonial[]>("/dashboard/testimonials");
}
