"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsGrid, BsGrid3X3Gap, BsList } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { loadProductsPage } from "@/actions/products";
import { loadSearchPage } from "@/actions/search";
import {
  PRODUCT_SORT_OPTIONS,
  type GridColumns,
} from "@/lib/catalog";
import { notifyCaughtError } from "@/lib/notify";
import type { ApiCategory, ApiProduct, ProductSortBy } from "@/types/api";

const VIEW_OPTIONS: {
  cols: GridColumns;
  label: string;
  icon: typeof BsGrid;
}[] = [
  { cols: 3, label: "3 column grid", icon: BsGrid },
  { cols: 4, label: "4 column grid", icon: BsGrid3X3Gap },
  { cols: 5, label: "5 column grid", icon: BsList },
];

const GRID_CLASS: Record<GridColumns, string> = {
  3: "grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3",
  4: "grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4",
  5: "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
};

interface ShopListingProps {
  initialItems: ApiProduct[];
  page: number;
  totalPages: number;
  total: number;
  sortBy: ProductSortBy;
  gridColumns: GridColumns;
  categorySlug?: string;
  categories: Pick<ApiCategory, "name" | "slug">[];
  stoneTypes: string[];
  stoneColors: string[];
  pageSize: number;
  searchQuery?: string;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function ShopListing({
  initialItems,
  page: initialPage,
  totalPages: initialTotalPages,
  total,
  sortBy,
  gridColumns,
  categorySlug,
  categories,
  stoneTypes,
  stoneColors,
  pageSize,
  searchQuery,
}: ShopListingProps) {
  const router = useRouter();
  const sortDetailsRef = useRef<HTMLDetailsElement>(null);
  const listingKey = `${categorySlug ?? "all"}|${sortBy}|${searchQuery ?? ""}|${stoneTypes.join(",")}|${stoneColors.join(",")}`;
  const [activeListingKey, setActiveListingKey] = useState(listingKey);
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (activeListingKey !== listingKey) {
    setActiveListingKey(listingKey);
    setItems(initialItems);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!sortDetailsRef.current?.contains(event.target as Node)) {
        sortDetailsRef.current?.removeAttribute("open");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const hasMore = page < totalPages && total > 0;
  const activeFilterCount =
    (categorySlug ? 1 : 0) + stoneTypes.length + stoneColors.length;
  const currentSortLabel =
    PRODUCT_SORT_OPTIONS.find((option) => option.value === sortBy)?.label ??
    "Best Sellers";

  function buildListingHref({
    nextSortBy = sortBy,
    nextGrid = gridColumns,
    nextCategorySlug = categorySlug,
    nextStoneTypes = stoneTypes,
    nextStoneColors = stoneColors,
    nextSearchQuery = searchQuery,
  }: {
    nextSortBy?: ProductSortBy;
    nextGrid?: GridColumns;
    nextCategorySlug?: string;
    nextStoneTypes?: string[];
    nextStoneColors?: string[];
    nextSearchQuery?: string;
  } = {}): string {
    const params = new URLSearchParams();
    params.set("sortBy", nextSortBy);
    if (nextGrid !== 3) {
      params.set("grid", String(nextGrid));
    }
    if (nextStoneTypes.length > 0) {
      params.set("stoneType", nextStoneTypes.join(","));
    }
    if (nextStoneColors.length > 0) {
      params.set("stoneColor", nextStoneColors.join(","));
    }
    if (nextSearchQuery) {
      params.set("q", nextSearchQuery);
    }

    const path = nextCategorySlug
      ? `/products/${nextCategorySlug}`
      : "/products";
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  }

  function pushListingUrl(
    next: Parameters<typeof buildListingHref>[0] = {},
  ) {
    router.push(buildListingHref(next), { scroll: false });
  }

  function closeSortMenu() {
    sortDetailsRef.current?.removeAttribute("open");
  }

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const response = searchQuery
        ? await loadSearchPage({
            q: searchQuery,
            page: page + 1,
            pageSize,
          })
        : await loadProductsPage({
            page: page + 1,
            pageSize,
            sortBy,
            categorySlug,
            stoneType: stoneTypes.length > 0 ? stoneTypes : undefined,
            color: stoneColors.length > 0 ? stoneColors : undefined,
          });
      setItems((current) => [...current, ...response.items]);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load more products:", error);
      notifyCaughtError(
        error,
        "Unable to load more products. Please try again.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <section className="bg-white py-10 md:py-7">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {searchQuery ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              Searching for &ldquo;{searchQuery}&rdquo;
            </p>
            <Link
              href="/products"
              className="text-sm text-rose transition-colors hover:text-dark-green"
            >
              Clear search
            </Link>
          </div>
        ) : null}

        <div className="relative z-40 mb-8 flex flex-col gap-4 overflow-visible sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className="inline-flex min-h-11 items-center gap-2 border border-gray-200 px-3 py-2 text-sm text-foreground lg:hidden"
            >
              Filters
              {activeFilterCount > 0 ? (
                <span className="text-text-muted">({activeFilterCount})</span>
              ) : null}
              <FiChevronDown
                className={`h-4 w-4 text-text-muted transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="hidden items-center gap-3 lg:flex">
              {VIEW_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = gridColumns === option.cols;

                return (
                  <Link
                    key={option.cols}
                    href={buildListingHref({ nextGrid: option.cols })}
                    scroll={false}
                    aria-label={option.label}
                    aria-current={isActive ? "true" : undefined}
                    className={`transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-text-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>

            <p className="text-sm text-text-muted">
              {`${total} ${total === 1 ? "Product" : "Products"}`}
            </p>
          </div>

          {searchQuery ? null : (
            <div className="relative z-50 flex w-full items-center gap-2 text-sm sm:w-auto">
              <span className="shrink-0 text-text-muted">Sort By</span>
              <details ref={sortDetailsRef} className="relative min-w-0 flex-1 sm:flex-none">
                <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-2 border border-gray-200 bg-white px-3 py-2 outline-none hover:border-rose sm:min-h-0 sm:w-auto [&::-webkit-details-marker]:hidden">
                  {currentSortLabel}
                  <FiChevronDown className="h-4 w-4 text-text-muted" />
                </summary>
                <ul
                  className="absolute right-0 left-0 z-50 mt-2 min-w-48 border border-gray-200 bg-white py-1 shadow-lg sm:left-auto"
                  role="listbox"
                  aria-label="Sort products"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  {PRODUCT_SORT_OPTIONS.map((option) => {
                    const isActive = option.value === sortBy;

                    return (
                      <li key={option.value} role="option" aria-selected={isActive}>
                        <Link
                          href={buildListingHref({ nextSortBy: option.value })}
                          scroll={false}
                          onClick={closeSortMenu}
                          className={`block px-4 py-2 text-sm transition-colors hover:bg-cream ${
                            isActive ? "text-rose" : "text-foreground"
                          }`}
                        >
                          {option.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </div>
          )}
        </div>

        <div className="relative z-0 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <div className={filtersOpen ? "block" : "hidden lg:block"}>
            <ShopFilters
              categories={categories}
              categorySlug={categorySlug}
              stoneTypes={stoneTypes}
              stoneColors={stoneColors}
              onCategoryChange={(slug) =>
                pushListingUrl({ nextCategorySlug: slug })
              }
              onToggleStoneType={(value) =>
                pushListingUrl({ nextStoneTypes: toggleValue(stoneTypes, value) })
              }
              onToggleStoneColor={(value) =>
                pushListingUrl({
                  nextStoneColors: toggleValue(stoneColors, value),
                })
              }
              onClearAll={() =>
                pushListingUrl({
                  nextCategorySlug: undefined,
                  nextStoneTypes: [],
                  nextStoneColors: [],
                })
              }
            />
          </div>

          <div className="min-w-0 flex-1">
            {items.length === 0 ? (
              <p className="py-16 text-center text-sm text-text-muted">
                {searchQuery
                  ? `No products found for “${searchQuery}”.`
                  : "No products found in this collection."}
              </p>
            ) : (
              <div className={GRID_CLASS[gridColumns]}>
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-block rounded-sm bg-rose px-7 py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
