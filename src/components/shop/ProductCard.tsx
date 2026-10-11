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

type CartStatus = "idle" | "loading" | "added" | "error";

interface ProductCardProps {
  product: ApiProduct;
}

const actionButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-[#8E5C63] text-white shadow-md transition-colors hover:bg-dark-green cursor-pointer";

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images[0] ?? "/images/placeholder-product.svg";
  const productHref = getProductHref(product.id);
  const starRating = getProductStarRating(
    product.averageRating,
    product.reviewCount,
  );
  const [cartStatus, setCartStatus] = useState<CartStatus>("idle");
  const productIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = productIds.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  async function handleAddToCart() {
    if (cartStatus === "loading" || isOutOfStock) {
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

        <div className="pointer-events-none absolute inset-0 z-10 hidden bg-foreground/25 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 md:block">
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
            <ProductActions
              productName={product.name}
              productHref={productHref}
              isWishlisted={isWishlisted}
              cartStatus={cartStatus}
              isOutOfStock={isOutOfStock}
              onToggleWishlist={() => toggleWishlist(product.id)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 md:hidden">
          <ProductActions
            productName={product.name}
            isWishlisted={isWishlisted}
            cartStatus={cartStatus}
            isOutOfStock={isOutOfStock}
            onToggleWishlist={() => toggleWishlist(product.id)}
            onAddToCart={handleAddToCart}
          />
        </div>

        {product.isFeatured && (
          <span className="absolute top-3 right-3 z-20 bg-foreground px-2 py-1 text-[10px] font-medium tracking-wide text-white uppercase">
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

interface ProductActionsProps {
  productName: string;
  productHref?: string;
  isWishlisted: boolean;
  cartStatus: CartStatus;
  isOutOfStock: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

function ProductActions({
  productName,
  productHref,
  isWishlisted,
  cartStatus,
  isOutOfStock,
  onToggleWishlist,
  onAddToCart,
}: ProductActionsProps) {
  return (
    <>
      {productHref ? (
        <Link
          href={productHref}
          aria-label={`View ${productName}`}
          className={actionButtonClass}
        >
          <FiEye className="h-4 w-4" />
        </Link>
      ) : null}

      <button
        type="button"
        aria-label={
          isWishlisted
            ? `Remove ${productName} from wishlist`
            : `Add ${productName} to wishlist`
        }
        aria-pressed={isWishlisted}
        onClick={onToggleWishlist}
        className={`${actionButtonClass} ${
          isWishlisted ? "bg-dark-green hover:bg-dark-green" : ""
        }`}
      >
        <IoIosHeart className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label={`Add ${productName} to cart`}
        disabled={cartStatus === "loading" || isOutOfStock}
        onClick={onAddToCart}
        className={`${actionButtonClass} ${
          cartStatus === "added"
            ? "bg-dark-green hover:bg-dark-green"
            : cartStatus === "error"
              ? "bg-rose-dark hover:bg-rose-dark"
              : ""
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <IoMdCart className="h-4 w-4" />
      </button>
    </>
  );
}
