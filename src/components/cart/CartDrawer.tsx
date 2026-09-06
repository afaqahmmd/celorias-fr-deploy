"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import CartLineItem from "@/components/cart/CartLineItem";
import type { ApiCart, ApiCartItem } from "@/types/api";

interface CartDrawerProps {
  cart: ApiCart | null;
  status: "loading" | "idle" | "error";
  pendingProductId: string | null;
  onClose: () => void;
  onCheckout: () => void;
  onIncrease: (item: ApiCartItem) => void;
  onDecrease: (item: ApiCartItem) => void;
  onRemove: (item: ApiCartItem) => void;
}

function formatCheckoutTotal(price: string): string {
  const value = parseFloat(price);
  if (Number.isNaN(value)) {
    return "Rs 0.00";
  }

  return `Rs ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CartDrawer({
  cart,
  status,
  pendingProductId,
  onClose,
  onCheckout,
  onIncrease,
  onDecrease,
  onRemove,
}: CartDrawerProps) {
  const items = cart?.items ?? [];
  const isEmpty = status === "idle" && items.length === 0;
  const subtotal = cart?.subtotal ?? "0";

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
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2
            id="cart-drawer-title"
            className="font-serif text-2xl text-foreground"
          >
            Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-foreground transition-colors hover:text-rose"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {status === "loading" && !cart && (
            <p className="py-10 text-sm text-text-muted">Loading cart...</p>
          )}

          {status === "error" && !cart && (
            <p className="py-10 text-sm text-rose-dark">Could not load cart.</p>
          )}

          {isEmpty && (
            <p className="py-10 text-sm text-text-muted">Your cart is empty.</p>
          )}

          {items.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.productId}>
                  <CartLineItem
                    item={item}
                    isPending={pendingProductId === item.productId}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <p className="text-sm text-text-muted">Add order note.</p>
          <p className="mt-2 text-xs text-text-muted">
            Taxes and shipping calculated at checkout.
          </p>
          <button
            type="button"
            disabled={isEmpty || status === "loading"}
            onClick={onCheckout}
            className="mt-4 w-full bg-[#8E5C63] py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-70"
          >
            Checkout {formatCheckoutTotal(subtotal)}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full border border-[#8E5C63] bg-white py-3.5 font-serif text-sm tracking-wide text-[#8E5C63] transition-colors hover:bg-[#8E5C63]/5"
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
