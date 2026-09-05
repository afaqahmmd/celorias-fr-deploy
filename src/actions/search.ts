"use server";

import { parseSearchQuery, PRODUCT_PAGE_SIZE } from "@/lib/catalog";
import { fetchSearchResults, fetchSearchSuggestions } from "@/services/search";
import type {
  ApiProductListResponse,
  ApiSearchSuggestionResponse,
} from "@/types/api";

export async function getSearchSuggestions(
  q: string,
): Promise<ApiSearchSuggestionResponse> {
  return fetchSearchSuggestions({ q: parseSearchQuery(q) ?? "" });
}

export async function loadSearchPage(params: {
  q: string;
  page: number;
  pageSize?: number;
}): Promise<ApiProductListResponse> {
  const page = Number.isInteger(params.page) && params.page > 0 ? params.page : 1;
  const pageSize =
    Number.isInteger(params.pageSize) &&
    params.pageSize &&
    params.pageSize > 0 &&
    params.pageSize <= 100
      ? params.pageSize
      : PRODUCT_PAGE_SIZE;

  return fetchSearchResults({
    q: parseSearchQuery(params.q) ?? "",
    page,
    pageSize,
  });
}
