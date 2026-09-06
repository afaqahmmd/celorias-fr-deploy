"use server";

import {
  isProductSortBy,
  parseSearchQuery,
  PRODUCT_PAGE_SIZE,
} from "@/lib/catalog";
import { fetchProducts } from "@/services/products";
import type { ApiProductListResponse, ProductSortBy } from "@/types/api";

export async function loadProductsPage(params: {
  page: number;
  pageSize?: number;
  sortBy: ProductSortBy;
  categorySlug?: string;
  q?: string;
  stoneType?: string[];
  color?: string[];
}): Promise<ApiProductListResponse> {
  const page = Number.isInteger(params.page) && params.page > 0 ? params.page : 1;
  const pageSize =
    Number.isInteger(params.pageSize) &&
    params.pageSize &&
    params.pageSize > 0 &&
    params.pageSize <= 100
      ? params.pageSize
      : PRODUCT_PAGE_SIZE;
  const sortBy = isProductSortBy(params.sortBy)
    ? params.sortBy
    : "best_sellers";

  return fetchProducts({
    page,
    pageSize,
    sortBy,
    categorySlug: params.categorySlug,
    q: parseSearchQuery(params.q),
    stoneType: params.stoneType,
    color: params.color,
  });
}
