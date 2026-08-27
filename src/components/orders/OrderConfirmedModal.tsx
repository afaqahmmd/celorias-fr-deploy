"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

interface OrderConfirmedModalProps {
  orderNumber: string;
  onClose: () => void;
}

export default function OrderConfirmedModal({
  orderNumber,
  onClose,
}: OrderConfirmedModalProps) {
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
      aria-labelledby="order-confirmed-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white px-8 py-10 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
          className="absolute top-4 right-4 text-text-muted transition-colors hover:text-foreground"
        >
          <FiX className="h-5 w-5" />
        </button>

        <h2
          id="order-confirmed-title"
          className="font-serif text-2xl text-foreground"
        >
          Order confirmed
        </h2>
        <p className="mt-4 text-sm leading-6 text-text-muted">
          Thank you for your order. Your order number is
        </p>
        <p className="mt-2 font-serif text-lg text-foreground">{orderNumber}</p>
        <Link
          href="/products"
          className="mt-8 inline-block w-full bg-rose-dark py-3.5 font-serif text-sm tracking-wide text-white transition-colors hover:bg-dark-green"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
