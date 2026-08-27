"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionBadge from "@/components/ui/SectionBadge";
import StarRating from "@/components/ui/StarRating";
import type { TestimonialItem } from "@/types/landing";

interface TestimonialsProps {
  badge: string;
  title: string;
  titleAccent: string;
  titleSuffix: string;
  backgroundImage: string;
  items: TestimonialItem[];
}

const VISIBLE_CARDS = 3;
const LONG_REVIEW_CHARS = 140;

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongReview = item.quote.trim().length > LONG_REVIEW_CHARS;

  return (
    <article
      className="group relative flex w-full max-w-90 flex-col overflow-hidden rounded-md bg-white shadow-lg"
      tabIndex={0}
    >
      <div className="relative aspect-3/2 bg-[#f0f0f0]">
        <Image
          src={item.productImage ?? "/images/placeholder-product.svg"}
          alt=""
          fill
          className="object-cover"
          sizes="280px"
        />
      </div>

      <div className="flex flex-1 flex-col bg-[#3d2a24] px-4 py-4">
        <StarRating rating={item.rating} />
        <p
          className={`mt-2.5 text-sm leading-relaxed text-white ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {item.quote}
        </p>
        {isLongReview ? (
          <button
            type="button"
            onClick={() => setIsExpanded((open) => !open)}
            className="mt-2 self-start text-xs tracking-wide text-white/80 underline underline-offset-2 md:hidden"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        ) : null}
        <p className="mt-3 font-serif text-base font-semibold text-white">
          {item.author}
        </p>
        <p className="text-sm text-white/80">{item.role}</p>
      </div>

      <div
        className="absolute inset-0 z-10 hidden flex-col px-4 py-4 opacity-0 transition-opacity duration-300 md:flex md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, #8f5a62 0%, #5b3b40 45%, #28191c 100%)",
        }}
      >
        <StarRating rating={item.rating} />
        <p
          className={`mt-2.5 min-h-0 flex-1 text-sm leading-relaxed text-white ${
            isLongReview ? "testimonial-quote-scroll overflow-y-auto" : ""
          }`}
        >
          {item.quote}
        </p>
        <p className="mt-3 font-serif text-base font-semibold text-white">
          {item.author}
        </p>
        <p className="text-sm text-white/80">{item.role}</p>
      </div>
    </article>
  );
}

export default function Testimonials({
  badge,
  title,
  titleAccent,
  titleSuffix,
  backgroundImage,
  items,
}: TestimonialsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const canCycle = items.length > VISIBLE_CARDS;

  const visibleItems = canCycle
    ? Array.from({ length: VISIBLE_CARDS }, (_, offset) => {
        const index = (startIndex + offset) % items.length;
        return items[index];
      })
    : items;

  function goToPrevious() {
    setStartIndex((current) => (current - 1 + items.length) % items.length);
  }

  function goToNext() {
    setStartIndex((current) => (current + 1) % items.length);
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-15">
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <SectionBadge label={badge} variant="dark" />
          <h2 className="mt-6 font-serif text-3xl leading-tight text-white md:text-4xl lg:text-[42px]">
            {title}{" "}
            <span className="text-[#c9a68a]">
              {titleAccent} {titleSuffix}
            </span>{" "}
          </h2>
        </div>

        <div className="mt-12 md:mt-14">
          {items.length === 0 ? (
            <p className="text-center text-white/80">
              No testimonials available at the moment.
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2 md:gap-5">
              {canCycle && (
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous testimonials"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-light/80 text-foreground shadow-md transition-transform hover:scale-105 md:h-10 md:w-10"
                >
                  <FiChevronLeft className="h-5 w-5 text-white" />
                </button>
              )}

              <div className="grid min-w-0 grid-cols-1 justify-items-center gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item, index) => (
                  <TestimonialCard
                    key={`${item.id}-${startIndex}-${index}`}
                    item={item}
                  />
                ))}
              </div>

              {canCycle && (
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next testimonials"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-light/80 text-foreground shadow-md transition-transform hover:scale-105 md:h-10 md:w-10"
                >
                  <FiChevronRight className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
