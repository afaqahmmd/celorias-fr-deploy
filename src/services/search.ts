import { PRODUCT_PAGE_SIZE, isSearchableQuery } from "@/lib/catalog";
// import { readApiMessage } from "@/lib/api-message";
import { mockProducts } from "@/data/mock/products";
import type {
  ApiProductListResponse,
  ApiSearchSuggestionResponse,
} from "@/types/api";

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const SUGGESTION_LIMIT = 8;

export interface FetchSearchSuggestionsParams {
  q: string;
  limit?: number;
}

export interface FetchSearchResultsParams {
  q: string;
  page?: number;
  pageSize?: number;
}

function emptySearchResults(
  page: number,
  pageSize: number,
): ApiProductListResponse {
  return {
    items: [],
    page,
    pageSize,
    total: 0,
    totalPages: 0,
  };
}

function matchesQuery(name: string, q: string): boolean {
  return name.toLowerCase().includes(q.toLowerCase());
}

/**
 * Backend is currently unavailable — filtering the static local catalog
 * (src/data/mock/products.ts) instead of calling `${API_URL}/search/suggestions`.
 * Restore the commented-out implementation below once the API is back.
 */
export async function fetchSearchSuggestions(
  params: FetchSearchSuggestionsParams,
): Promise<ApiSearchSuggestionResponse> {
  const q = params.q.trim().slice(0, 100);
  if (!isSearchableQuery(q)) {
    return { items: [] };
  }

  const limit =
    params.limit && params.limit > 0 && params.limit <= 20
      ? params.limit
      : SUGGESTION_LIMIT;

  const items = mockProducts
    .filter((product) => matchesQuery(product.name, q))
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.images[0] ?? null,
    }));

  return { items };

  // const searchParams = new URLSearchParams();
  // searchParams.set("q", q);
  // searchParams.set("limit", String(limit));
  //
  // const response = await fetch(
  //   `${API_URL}/search/suggestions?${searchParams.toString()}`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     cache: "no-store",
  //   },
  // );
  //
  // if (!response.ok) {
  //   const raw: unknown = await response.json().catch(() => null);
  //   throw new Error(
  //     readApiMessage(raw, "Unable to load search suggestions."),
  //   );
  // }
  //
  // return response.json() as Promise<ApiSearchSuggestionResponse>;
}

/**
 * Backend is currently unavailable — filtering the static local catalog
 * (src/data/mock/products.ts) instead of calling `${API_URL}/search`.
 * Restore the commented-out implementation below once the API is back.
 */
export async function fetchSearchResults(
  params: FetchSearchResultsParams,
): Promise<ApiProductListResponse> {
  const q = params.q.trim().slice(0, 100);
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? PRODUCT_PAGE_SIZE;

  if (!isSearchableQuery(q)) {
    return emptySearchResults(page, pageSize);
  }

  const matches = mockProducts.filter((product) => matchesQuery(product.name, q));
  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = matches.slice(start, start + pageSize).map((product) => ({
    ...product,
  }));

  return { items, page, pageSize, total, totalPages };

  // const searchParams = new URLSearchParams();
  // searchParams.set("q", q);
  // searchParams.set("page", String(page));
  // searchParams.set("pageSize", String(pageSize));
  //
  // const response = await fetch(`${API_URL}/search?${searchParams.toString()}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   cache: "no-store",
  // });
  //
  // if (!response.ok) {
  //   const raw: unknown = await response.json().catch(() => null);
  //   throw new Error(
  //     readApiMessage(raw, "Unable to load search results. Please try again later."),
  //   );
  // }
  //
  // return response.json() as Promise<ApiProductListResponse>;
}
