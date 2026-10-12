"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { getProductHref } from "@/lib/catalog";
import type { ProductPreview } from "@/types/api";

const SIMILAR_PAGE_SIZE = 3;

interface ProductGalleryProps {
  name: string;
  images: string[];
  similarProducts?: ProductPreview[];
}

export default function ProductGallery({
  name,
  images,
  similarProducts = [],
}: ProductGalleryProps) {
  const galleryImages = images.filter(Boolean);
  const resolvedImages =
    galleryImages.length > 0
      ? galleryImages
      : ["/images/placeholder-product.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [similarStart, setSimilarStart] = useState(0);
  const activeIndex = Math.min(selectedIndex, resolvedImages.length - 1);
  const activeImage = resolvedImages[activeIndex];
  const showSimilarNav = similarProducts.length > SIMILAR_PAGE_SIZE;
  const visibleSimilar = showSimilarNav
    ? Array.from({ length: SIMILAR_PAGE_SIZE }, (_, offset) => {
        return similarProducts[
          (similarStart + offset) % similarProducts.length
        ];
      })
    : similarProducts.slice(0, SIMILAR_PAGE_SIZE);

  function showNextSimilar() {
    setSimilarStart(
      (current) => (current + SIMILAR_PAGE_SIZE) % similarProducts.length,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3.5">
        <div className="order-2 min-w-0 sm:order-1 sm:w-[8.25rem] sm:shrink-0 lg:w-[8.75rem]">
          <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-col sm:gap-3 sm:overflow-x-hidden sm:overflow-y-auto lg:gap-3.5">
            {resolvedImages.map((src, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  aria-label={`View image ${index + 1} of ${name}`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden bg-[#f3f3f3] sm:w-full ${
                    isActive
                      ? "ring-1 ring-foreground"
                      : "ring-1 ring-transparent hover:ring-gray-300"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative order-1 aspect-square w-full min-w-0 bg-[#f3f3f3] sm:order-2 sm:flex-1">
          <Image
            key={activeImage}
            src={activeImage}
            alt={name}
            fill
            priority={activeIndex === 0}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 448px"
          />
        </div>
      </div>

      {visibleSimilar.length > 0 ? (
        <div>
          <p className="text-sm text-foreground">Similar Products</p>
          <div className="relative mt-3 w-fit max-w-full">
            <div className="flex gap-3">
              {visibleSimilar.map((product, offset) => {
                const imageSrc =
                  product.images[0] ?? "/images/placeholder-product.svg";

                return (
                  <Link
                    key={`${product.id}-${similarStart}-${offset}`}
                    href={getProductHref(product.id)}
                    aria-label={product.name}
                    className="relative aspect-square w-19 shrink-0 overflow-hidden bg-[#f3f3f3] sm:w-32 lg:w-36"
                  >
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </Link>
                );
              })}
            </div>
            {showSimilarNav ? (
              <button
                type="button"
                aria-label="Next similar products"
                onClick={showNextSimilar}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-rose-light/80 text-white shadow-md"
              >
                <FiChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
