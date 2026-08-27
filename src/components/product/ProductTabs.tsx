"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import type { ApiProductDetail } from "@/types/api";

type TabId = "description" | "additional" | "reviews";

interface ProductTabsProps {
  product: ApiProductDetail;
}

function formatInfoKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatReviewDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatInfoValue(value: unknown): string {
  if (value == null) {
    return "—";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function AdditionalInfoContent({ product }: { product: ApiProductDetail }) {
  const info = product.additionalInfo;
  const specRows: { label: string; value: string }[] = [
    { label: "Category", value: product.category.name },
    { label: "Stock", value: String(product.stock) },
  ];

  if (info && typeof info === "object" && !Array.isArray(info)) {
    for (const [key, value] of Object.entries(info as Record<string, unknown>)) {
      specRows.push({ label: formatInfoKey(key), value: formatInfoValue(value) });
    }
  }

  return (
    <div className="space-y-6 text-sm leading-7 text-text-muted">
      {typeof info === "string" && info.trim() ? <p>{info}</p> : null}

      {Array.isArray(info) && info.length > 0 ? (
        <ul className="list-disc space-y-2 pl-5">
          {info.map((item, index) => (
            <li key={index}>{formatInfoValue(item)}</li>
          ))}
        </ul>
      ) : null}

      <dl className="space-y-3">
        {specRows.map((row) => (
          <div key={row.label} className="flex flex-wrap gap-x-3">
            <dt className="font-medium text-foreground">{row.label}:</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const reviewCount = product.reviews?.count ?? 0;
  const reviews = product.reviews?.items ?? [];
  const descriptionParagraphs = (product.description ?? "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Product Description" },
    { id: "additional", label: "Additional Information" },
    { id: "reviews", label: `Reviews(${reviewCount})` },
  ];

  return (
    <section className="mt-16 md:mt-20">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-x-10 gap-y-3 border-b border-gray-200"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                isActive
                  ? "border-foreground font-semibold text-foreground"
                  : "border-transparent text-text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 max-w-4xl" role="tabpanel">
        {activeTab === "description" && (
          <div className="space-y-4 text-sm leading-7 text-text-muted">
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            ) : (
              <p>No description is available for this product.</p>
            )}
          </div>
        )}

        {activeTab === "additional" && (
          <AdditionalInfoContent product={product} />
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-sm text-text-muted">
                There are no reviews yet for this product.
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-serif text-lg text-foreground">
                    {review.customerName}
                  </h3>
                  <div className="mt-2">
                    <StarRating rating={review.stars} variant="onLight" />
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    {formatReviewDate(review.createdAt)}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    {review.description}
                  </p>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
