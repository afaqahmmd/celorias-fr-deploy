"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const galleryImages = images.filter(Boolean);
  const resolvedImages =
    galleryImages.length > 0
      ? galleryImages
      : ["/images/placeholder-product.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, resolvedImages.length - 1);
  const activeImage = resolvedImages[activeIndex];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3.5">
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:w-[8.25rem] sm:shrink-0 sm:flex-col sm:gap-3 sm:self-stretch sm:overflow-x-hidden sm:overflow-y-auto lg:w-[8.75rem] lg:gap-3.5">
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
  );
}
