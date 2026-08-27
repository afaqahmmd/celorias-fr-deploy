"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { formatProductPrice, getProductHref } from "@/lib/catalog";
import type { ApiProduct } from "@/types/api";

interface QuickViewModalProps {
  product: ApiProduct;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  onClose,
}: QuickViewModalProps) {
  const imageSrc = product.images[0] ?? "/images/placeholder-product.svg";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white p-5 shadow-xl md:flex md:gap-6 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 text-text-muted transition-colors hover:text-foreground"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="relative mx-auto aspect-square w-full max-w-72 bg-[#f3f3f3] md:mx-0 md:w-72 md:shrink-0">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="288px"
          />
        </div>

        <div className="mt-4 min-w-0 md:mt-0 md:flex md:flex-col md:justify-center">
          <h2
            id="quick-view-title"
            className="font-serif text-xl text-foreground md:text-2xl"
          >
            {product.name}
          </h2>
          <p className="mt-2 text-sm font-medium">
            {formatProductPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {product.description}
            </p>
          )}
          <p className="mt-3 text-xs text-text-muted">
            {product.category.name}
            {product.stock > 0 ? ` · ${product.stock} in stock` : " · Out of stock"}
          </p>
          <Link
            href={getProductHref(product.id)}
            className="mt-5 inline-block rounded-sm bg-rose px-5 py-2.5 font-serif text-sm text-white transition-colors hover:bg-dark-green"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
