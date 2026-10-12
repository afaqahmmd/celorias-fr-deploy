"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionBadge from "@/components/ui/SectionBadge";
import type { CategoryItem } from "@/types/landing";

interface ShopByCategoryProps {
  badge: string;
  title: string;
  titleAccent: string;
  items: CategoryItem[];
}

const SCROLL_EDGE_THRESHOLD = 8;

function SliderButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        direction === "previous" ? "Previous categories" : "Next categories"
      }
      className="mb-8 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-light/80 text-foreground shadow-md transition-transform hover:scale-105 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 md:mb-12 md:h-10 md:w-10"
    >
      <Icon className="h-5 w-5 text-white" />
    </button>
  );
}

export default function ShopByCategory({
  badge,
  title,
  titleAccent,
  items,
}: ShopByCategoryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateArrows = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollPrev(scroller.scrollLeft > SCROLL_EDGE_THRESHOLD);
    setCanScrollNext(
      maxScroll > SCROLL_EDGE_THRESHOLD &&
        scroller.scrollLeft < maxScroll - SCROLL_EDGE_THRESHOLD,
    );
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollLeft = 0;
    updateArrows();

    scroller.addEventListener("scroll", updateArrows, { passive: true });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [items, updateArrows]);

  const showArrows = canScrollPrev || canScrollNext;

  function scrollByCard(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const card = scroller.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const amount = (card?.offsetWidth ?? 0) + gap;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const next = Math.min(
      maxScroll,
      Math.max(0, scroller.scrollLeft + direction * amount),
    );

    scroller.scrollTo({ left: next, behavior: "smooth" });
  }

  return (
    <section className="overflow-x-hidden bg-cream py-16 md:py-11">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionBadge label={badge} />
          <h2 className="mt-5 font-serif text-[32px] leading-tight text-foreground md:mt-6 md:text-[42px] lg:text-[46px]">
            {title} <span className="text-rose">{titleAccent}</span>
          </h2>
        </div>

        <div className="mt-12 flex items-center gap-2 md:mt-9 md:gap-5">
          {showArrows ? (
            <SliderButton
              direction="previous"
              disabled={!canScrollPrev}
              onClick={() => scrollByCard(-1)}
            />
          ) : null}

          <div
            ref={scrollerRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-x-4 overflow-x-auto scroll-smooth overscroll-x-contain scrollbar-none sm:gap-x-5 md:gap-x-10 lg:gap-x-8 xl:gap-x-14"
            style={{ justifyContent: "safe center" }}
          >
            {items.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group flex w-[calc((100%-2rem)/2.5)] shrink-0 snap-start flex-col items-center sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-7.5rem)/4)] lg:w-[calc((100%-8rem)/5)] xl:w-[calc((100%-14rem)/5)]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 639px) 42vw, (max-width: 767px) 30vw, (max-width: 1023px) 22vw, 200px"
                  />
                  <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
                    <span className="flex h-[50%] w-[50%] items-center justify-center rounded-full bg-dark-green/85 px-2 text-center font-serif text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View
                    </span>
                  </div>
                </div>
                <span className="mt-3 w-full text-center font-serif text-[13px] wrap-break-word text-rose md:mt-5 md:text-lg">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {showArrows ? (
            <SliderButton
              direction="next"
              disabled={!canScrollNext}
              onClick={() => scrollByCard(1)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
