"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdCart } from "react-icons/io";
import {
  addCartItem,
  getCart,
  removeCartItem,
} from "@/actions/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import { getCartAuth } from "@/lib/auth";
import { notifyError, notifyFromResult } from "@/lib/notify";
import { useCartStore } from "@/stores/cart";
import type { ApiCart, ApiCartItem } from "@/types/api";

export default function HeaderCart() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount);
  const setFromCart = useCartStore((state) => state.setFromCart);
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const applyCart = useCallback(
    (nextCart: ApiCart) => {
      setCart(nextCart);
      setFromCart(nextCart);
    },
    [setFromCart],
  );

  const loadCart = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await getCart(getCartAuth());
      if (result.success) {
        applyCart(result.cart);
        setStatus("idle");
        return;
      }

      notifyError(result.message);
      setStatus("error");
    } catch {
      notifyError("Could not load cart.");
      setStatus("error");
    }
  }, [applyCart]);

  useEffect(() => {
    async function hydrateCount() {
      try {
        const result = await getCart(getCartAuth());
        if (result.success) {
          setFromCart(result.cart);
        }
      } catch {
        // Badge stays at 0 until the next successful cart fetch.
      }
    }

    void hydrateCount();
  }, [setFromCart]);

  function handleOpen() {
    setIsOpen(true);
    void loadCart();
  }

  function handleClose() {
    setIsOpen(false);
    setPendingProductId(null);
  }

  function handleCheckout() {
    handleClose();
    router.push("/orders");
  }

  async function handleIncrease(item: ApiCartItem) {
    if (pendingProductId || item.quantity >= item.availableStock) {
      return;
    }

    setPendingProductId(item.productId);
    try {
      const result = await addCartItem(getCartAuth(), item.productId, 1);
      if (result.success) {
        applyCart(result.cart);
      }
      notifyFromResult(result);
    } catch {
      notifyError("Could not update cart.");
    } finally {
      setPendingProductId(null);
    }
  }

  async function handleDecrease(item: ApiCartItem) {
    if (pendingProductId || item.quantity <= 1) {
      return;
    }

    setPendingProductId(item.productId);
    try {
      const auth = getCartAuth();
      const removed = await removeCartItem(auth, item.productId);
      if (!removed.success) {
        notifyFromResult(removed);
        return;
      }

      const added = await addCartItem(auth, item.productId, item.quantity - 1);
      if (added.success) {
        applyCart(added.cart);
        notifyFromResult(added);
      } else {
        applyCart(removed.cart);
        notifyFromResult(added);
      }
    } catch {
      notifyError("Could not update cart.");
    } finally {
      setPendingProductId(null);
    }
  }

  async function handleRemove(item: ApiCartItem) {
    if (pendingProductId) {
      return;
    }

    setPendingProductId(item.productId);
    try {
      const result = await removeCartItem(getCartAuth(), item.productId);
      if (result.success) {
        applyCart(result.cart);
      }
      notifyFromResult(result, { successMessage: "Item removed from cart" });
    } catch {
      notifyError("Could not remove item.");
    } finally {
      setPendingProductId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={itemCount > 0 ? `Cart (${itemCount})` : "Cart"}
        aria-expanded={isOpen}
        onClick={handleOpen}
        className="flex min-h-11 min-w-11 items-center justify-center gap-1 text-foreground transition-colors hover:text-rose md:min-h-0 md:min-w-0"
      >
        <IoMdCart className="h-6 w-6" />
        {itemCount > 0 ? (
          <span className="text-sm font-medium">({itemCount})</span>
        ) : null}
      </button>

      {isOpen && (
        <CartDrawer
          cart={cart}
          status={status}
          pendingProductId={pendingProductId}
          onClose={handleClose}
          onCheckout={handleCheckout}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      )}
    </>
  );
}
