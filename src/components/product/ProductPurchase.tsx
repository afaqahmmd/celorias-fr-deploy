"use client";

import { useState } from "react";
import { addCartItem } from "@/actions/cart";
import { getCartAuth } from "@/lib/auth";
import { formatProductPrice } from "@/lib/catalog";
import { notifyError, notifyFromResult } from "@/lib/notify";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";

interface ProductPurchaseProps {
  productId: string;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export default function ProductPurchase({
  productId,
  name,
  description,
  price,
  stock,
}: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState<
    "idle" | "loading" | "added" | "error"
  >("idle");
  const productIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = productIds.includes(productId);
  const isOutOfStock = stock <= 0;
  const maxQuantity = Math.max(stock, 1);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(maxQuantity, current + 1));
  }

  async function handleAddToCart() {
    if (cartStatus === "loading" || isOutOfStock) {
      return;
    }

    setCartStatus("loading");
    try {
      const result = await addCartItem(getCartAuth(), productId, quantity);
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
    <div className="flex flex-col">
      <h1 className="font-serif text-[32px] leading-[1.15] text-foreground md:text-[38px] lg:text-[42px]">
        {name}
      </h1>

      {description ? (
        <p className="mt-5 line-clamp-4 text-sm leading-7 text-text-muted">
          {description}
        </p>
      ) : null}

      <p className="mt-6 text-lg font-semibold text-foreground">
        {formatProductPrice(price)}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex h-[58px] items-center justify-between border border-black bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-foreground disabled:text-text-muted"
          >
            −
          </button>
          <span className="min-w-9 text-center text-sm tracking-wide">
            {String(quantity).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={increaseQuantity}
            disabled={isOutOfStock || quantity >= maxQuantity}
            className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-foreground disabled:text-text-muted"
          >
            +
          </button>
        </div>

        <button
          type="button"
          aria-label={`Add ${name} to cart`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || cartStatus === "loading"}
          className="h-[58px] w-full bg-[#8E5C63] font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isOutOfStock
            ? "Out Of Stock"
            : cartStatus === "loading"
              ? "Adding..."
              : "Add To Cart"}
        </button>
      </div>

      <button
        type="button"
        aria-pressed={isWishlisted}
        onClick={() => toggleWishlist(productId)}
        className={`mt-4 h-[58px] w-full border bg-white font-serif text-sm tracking-wide transition-colors ${
          isWishlisted
            ? "border-rose text-rose"
            : "border-[#2c2c2c] text-foreground hover:border-rose hover:text-rose"
        }`}
      >
        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}
