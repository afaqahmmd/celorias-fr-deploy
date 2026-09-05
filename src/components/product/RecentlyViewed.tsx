"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StarRating from "@/components/ui/StarRating";
import {
  formatProductPrice,
  getProductHref,
  getProductStarRating,
} from "@/lib/catalog";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed";
import type { ProductPreview } from "@/types/api";

const MAX_DISPLAY = 12;
const VISIBLE_COUNT = 3;

interface RecentlyViewedProps {
  current: ProductPreview;
  fallback: ProductPreview[];
}

export default function RecentlyViewed({
  current,
  fallback,
}: RecentlyViewedProps) {
  const items = useRecentlyViewedStore((state) => state.items);
  const add = useRecentlyViewedStore((state) => state.add);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    add(current);
  }, [add, current]);

  const seen = new Set<string>([current.id]);
  const display: ProductPreview[] = [];

  for (const product of [...items, ...fallback]) {
    if (seen.has(product.id)) {
      continue;
    }
    seen.add(product.id);
    display.push(product);
    if (display.length === MAX_DISPLAY) {
      break;
    }
  }

  if (display.length === 0) {
    return null;
  }

  const showNav = display.length > VISIBLE_COUNT;

  function scrollByCard(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const card = scroller.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const amount = (card?.offsetWidth ?? scroller.clientWidth / 3) + gap;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    let next = scroller.scrollLeft + direction * amount;

    if (next > maxScroll + 4) {
      next = 0;
    } else if (next < -4) {
      next = maxScroll;
    }

    scroller.scrollTo({ left: next, behavior: "smooth" });
  }

  return (
    <section className="mt-16 pb-8 md:mt-24 md:pb-12">
      <h2 className="font-serif text-2xl font-semibold text-foreground md:text-[28px]">
        Recently Viewed
      </h2>

      <div
        ref={scrollerRef}
        className="mt-8 flex gap-6 overflow-x-auto scroll-smooth md:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {display.map((product) => {
          const imageSrc =
            product.images[0] ?? "/images/placeholder-product.svg";
          const starRating = getProductStarRating(
            product.rating,
            product.reviewCount,
          );

          return (
            <Link
              key={product.id}
              href={getProductHref(product.id)}
              className="group w-[80%] shrink-0 sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-4rem)/3)]"
            >
              <article className="flex min-w-0 flex-col">
                <div className="relative aspect-square overflow-hidden bg-[#f3f3f3]">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <h3 className="mt-4 truncate font-serif text-sm text-foreground md:text-[15px]">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-foreground">
                  {formatProductPrice(product.price)}
                </p>
                {starRating ? (
                  <div className="mt-2">
                    <StarRating rating={starRating} variant="onLight" />
                  </div>
                ) : null}
              </article>
            </Link>
          );
        })}
      </div>

      {showNav ? (
        <div className="mt-10 flex justify-center gap-3 md:mt-12">
          <button
            type="button"
            aria-label="Previous recently viewed products"
            onClick={() => scrollByCard(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-light/80 text-foreground shadow-md transition-transform hover:scale-105 md:h-10 md:w-10"
          >
            <FiChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            type="button"
            aria-label="Next recently viewed products"
            onClick={() => scrollByCard(1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-light/80 text-foreground shadow-md transition-transform hover:scale-105 md:h-10 md:w-10"
          >
            <FiChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
