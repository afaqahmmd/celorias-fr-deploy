import {
  isProductSortBy,
  PRODUCT_PAGE_SIZE,
} from "@/lib/catalog";
import { readApiMessage } from "@/lib/api-message";
import type {
  ApiProductDetail,
  ApiProductListResponse,
  ProductSortBy,
} from "@/types/api";

export {
  formatProductPrice,
  getProductHref,
  isProductSortBy,
  parseProductSortBy,
  PRODUCT_PAGE_SIZE,
  PRODUCT_SORT_OPTIONS,
} from "@/lib/catalog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  sortBy?: ProductSortBy;
  categorySlug?: string;
  q?: string;
  stoneType?: string[];
  color?: string[];
}

function appendQueryList(
  searchParams: URLSearchParams,
  key: string,
  values?: string[],
) {
  if (!values?.length) {
    return;
  }

  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed) {
      searchParams.append(key, trimmed);
    }
  }
}

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<ApiProductListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("pageSize", String(params.pageSize ?? PRODUCT_PAGE_SIZE));

  if (params.sortBy && isProductSortBy(params.sortBy)) {
    searchParams.set("sortBy", params.sortBy);
  }
  if (params.categorySlug) {
    searchParams.set("categorySlug", params.categorySlug);
  }
  if (params.q) {
    const q = params.q.trim().slice(0, 100);
    if (q) {
      searchParams.set("q", q);
    }
  }
  appendQueryList(searchParams, "stoneType", params.stoneType);
  appendQueryList(searchParams, "color", params.color);

  const path = `/products?${searchParams.toString()}`;
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const raw: unknown = await response.json().catch(() => null);
    throw new Error(
      readApiMessage(
        raw,
        "Unable to load products. Please try again later.",
      ),
    );
  }

  return response.json() as Promise<ApiProductListResponse>;
}

export async function fetchProductById(
  id: string,
): Promise<ApiProductDetail | null> {
  const path = `/products/${id}`;
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const raw: unknown = await response.json().catch(() => null);
    throw new Error(
      readApiMessage(
        raw,
        "Unable to load this product. Please try again later.",
      ),
    );
  }

  const data = (await response.json()) as ApiProductDetail;
  return {
    ...data,
    reviews: data.reviews ?? {
      averageRating: 0,
      count: 0,
      items: [],
    },
  };
}
