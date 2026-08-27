"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const { productIds } = get();
        set({
          productIds: productIds.includes(productId)
            ? productIds.filter((id) => id !== productId)
            : [...productIds, productId],
        });
      },
    }),
    { name: "celoria-wishlist" },
  ),
);
