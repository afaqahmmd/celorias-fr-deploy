"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";
import {
  formatCheckoutMoney,
  parsePrice,
  SHIPPING_AMOUNT,
} from "@/lib/checkout";
import type { ApiCart } from "@/types/api";

interface OrderSummaryProps {
  cart: ApiCart | null;
  collapsible?: boolean;
}

function OrderSummaryBody({ cart }: { cart: ApiCart | null }) {
  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const subtotal = parsePrice(cart?.subtotal ?? "0");
  const shipping = items.length === 0 ? 0 : SHIPPING_AMOUNT;
  const total = subtotal + shipping;

  return (
    <>
      {items.length === 0 ? (
        <p className="text-sm text-text-muted">Your cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => {
            const imageSrc =
              item.productImage || "/images/placeholder-product.svg";

            return (
              <li key={item.productId} className="flex gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 bg-white">
                  <Image
                    src={imageSrc}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm font-semibold text-foreground">
                    {item.productName}
                  </h3>
                  <p className="mt-1 text-sm text-foreground">
                    {formatCheckoutMoney(item.unitPrice)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 space-y-3 border-t border-gray-300 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span>Subtotal — {itemCount} items</span>
          <span>{formatCheckoutMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{formatCheckoutMoney(shipping)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatCheckoutMoney(total)}</span>
        </div>
      </div>
    </>
  );
}

export default function OrderSummary({
  cart,
  collapsible = false,
}: OrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const items = cart?.items ?? [];
  const subtotal = parsePrice(cart?.subtotal ?? "0");
  const shipping = items.length === 0 ? 0 : SHIPPING_AMOUNT;
  const total = subtotal + shipping;

  if (collapsible) {
    return (
      <div className="bg-[#f3f3f3]">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm text-foreground">
            Order summary
            <FiChevronDown
              className={`h-4 w-4 text-text-muted transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatCheckoutMoney(total)}
          </span>
        </button>
        {isOpen ? (
          <div className="px-4 pb-6">
            <OrderSummaryBody cart={cart} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside className="bg-[#f3f3f3] px-6 py-10 lg:px-10">
      <OrderSummaryBody cart={cart} />
    </aside>
  );
}
