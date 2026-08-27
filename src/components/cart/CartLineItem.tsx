"use client";

import Image from "next/image";
import type { ApiCartItem } from "@/types/api";

interface CartLineItemProps {
  item: ApiCartItem;
  isPending: boolean;
  onIncrease: (item: ApiCartItem) => void;
  onDecrease: (item: ApiCartItem) => void;
  onRemove: (item: ApiCartItem) => void;
}

function formatLinePrice(price: string): string {
  const value = parseFloat(price);
  if (Number.isNaN(value)) {
    return "Rs.0.00";
  }

  return `Rs.${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CartLineItem({
  item,
  isPending,
  onIncrease,
  onDecrease,
  onRemove,
}: CartLineItemProps) {
  const imageSrc = item.productImage || "/images/placeholder-product.svg";
  const canDecrease = item.quantity > 1;
  const canIncrease = item.quantity < item.availableStock;

  return (
    <article className="flex gap-4 py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#f3f3f3]">
        <Image
          src={imageSrc}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base font-semibold text-foreground">
          {item.productName}
        </h3>
        <p className="mt-1 text-sm text-foreground">
          {formatLinePrice(item.unitPrice)}
        </p>

        <div className="mt-3 flex items-center gap-4">
          <div className="inline-flex items-center border border-gray-300">
            <button
              type="button"
              aria-label={`Decrease quantity of ${item.productName}`}
              onClick={() => onDecrease(item)}
              disabled={isPending || !canDecrease}
              className="flex h-10 w-10 items-center justify-center text-sm text-foreground disabled:text-text-muted"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${item.productName}`}
              onClick={() => onIncrease(item)}
              disabled={isPending || !canIncrease}
              className="flex h-10 w-10 items-center justify-center text-sm text-foreground disabled:text-text-muted"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item)}
            disabled={isPending}
            className="text-sm text-text-muted underline-offset-2 hover:text-foreground hover:underline disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
