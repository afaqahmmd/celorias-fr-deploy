"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { IoIosHeart, IoMdCart } from "react-icons/io";
import StarRating from "@/components/ui/StarRating";
import { addCartItem } from "@/actions/cart";
import { getCartAuth } from "@/lib/auth";
import {
  formatProductPrice,
  getProductHref,
  getProductStarRating,
} from "@/lib/catalog";
import { notifyError, notifyFromResult } from "@/lib/notify";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import type { ApiProduct } from "@/types/api";

interface ProductCardProps {
  product: ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images[0] ?? "/images/placeholder-product.svg";
  const productHref = getProductHref(product.id);
  const starRating = getProductStarRating(
    product.averageRating,
    product.reviewCount,
  );
  const [cartStatus, setCartStatus] = useState<
    "idle" | "loading" | "added" | "error"
  >("idle");
  const productIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = productIds.includes(product.id);

  async function handleAddToCart() {
    if (cartStatus === "loading") {
      return;
    }

    setCartStatus("loading");
    try {
      const result = await addCartItem(getCartAuth(), product.id);
      if (result.success) {
        useCartStore.getState().setFromCart(result.cart);
      }
      notifyFromResult(result, { successMessage: "Added to cart" });
      setCartStatus(result.success ? "added" : "error");
    } catch {
      notifyError("Could not add to cart.");
      setCartStatus("error");
    }
  }

  return (
    <article className="group relative z-0 flex min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#f3f3f3]">
        <Link href={productHref} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>

        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 md:pointer-events-none md:inset-0 md:bottom-auto md:bg-black/25 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:pointer-events-auto md:group-hover:opacity-100">
          <div className="flex items-center justify-center gap-3 md:absolute md:inset-x-0 md:bottom-4">
            <Link
              href={productHref}
              aria-label={`View ${product.name}`}
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-colors hover:bg-rose hover:text-white md:flex"
            >
              <FiEye className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={isWishlisted}
              onClick={() => toggleWishlist(product.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors ${
                isWishlisted
                  ? "bg-rose text-white"
                  : "bg-white text-foreground hover:bg-rose hover:text-white"
              }`}
            >
              <IoIosHeart className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              disabled={cartStatus === "loading"}
              onClick={handleAddToCart}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors ${
                cartStatus === "added"
                  ? "bg-dark-green text-white"
                  : cartStatus === "error"
                    ? "bg-rose-dark text-white"
                    : "bg-white text-foreground hover:bg-rose hover:text-white"
              }`}
            >
              <IoMdCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {product.isFeatured && (
          <span className="absolute top-3 right-3 z-10 bg-black px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
            Best Selling
          </span>
        )}
      </div>

      <Link href={productHref} className="min-w-0">
        <h3 className="mt-4 truncate font-serif text-sm text-foreground md:text-[15px]">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          {formatProductPrice(product.price)}
        </p>
        {starRating ? (
          <div className="mt-2">
            <StarRating rating={starRating} variant="onLight" />
          </div>
        ) : null}
      </Link>
    </article>
  );
}
