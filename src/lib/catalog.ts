import type { ProductSortBy } from "@/types/api";

export const PRODUCT_PAGE_SIZE = 12;

export const PRODUCT_SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "best_sellers", label: "Best Sellers" },
  { value: "price_desc", label: "High To Low" },
  { value: "price_asc", label: "Low To High" },
  { value: "most_reviews", label: "Most Reviewed" },
];

export const STONE_TYPE_OPTIONS = [
  { value: "diamond", label: "Diamond" },
  { value: "kundan", label: "Kundan" },
  { value: "pearl", label: "Pearl" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "sapphire", label: "Sapphire" },
] as const;

export const STONE_COLOR_OPTIONS = [
  { value: "white", label: "White" },
  { value: "yellow", label: "Yellow" },
  { value: "rose", label: "Rose" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
] as const;

export type GridColumns = 3 | 4 | 5;

export function parseGridColumns(
  value: string | string[] | undefined,
): GridColumns {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "3" || raw === "4" || raw === "5") {
    return Number(raw) as GridColumns;
  }
  return 3;
}

export function isProductSortBy(value: string): value is ProductSortBy {
  return PRODUCT_SORT_OPTIONS.some((option) => option.value === value);
}

export function parseProductSortBy(
  value: string | string[] | undefined,
): ProductSortBy {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && isProductSortBy(raw)) {
    return raw;
  }
  return "best_sellers";
}

export function parseQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw || undefined;
}

export const MIN_SEARCH_QUERY_LENGTH = 2;
const MAX_SEARCH_QUERY_LENGTH = 100;

export function parseSearchQuery(
  value: string | string[] | undefined,
): string | undefined {
  const trimmed = parseQueryValue(value)?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.slice(0, MAX_SEARCH_QUERY_LENGTH);
}

export function isSearchableQuery(value: string | undefined): value is string {
  return Boolean(value && value.length >= MIN_SEARCH_QUERY_LENGTH);
}

export function parseQueryList(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value;
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatProductPrice(price: string | number): string {
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value)) {
    return "Rs 0";
  }

  return `Rs ${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function getProductHref(productId: string): string {
  return `/product/${productId}`;
}

export function getProductStarRating(
  rating?: number | null,
  reviewCount?: number | null,
): number | null {
  if (!reviewCount || reviewCount <= 0 || rating == null || rating <= 0) {
    return null;
  }

  return Math.min(5, Math.max(1, Math.round(rating)));
}
