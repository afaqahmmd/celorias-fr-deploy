"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductPreview } from "@/types/api";

interface RecentlyViewedState {
  items: ProductPreview[];
  add: (product: ProductPreview) => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const rest = get().items.filter((item) => item.id !== product.id);
        set({ items: [product, ...rest].slice(0, MAX_ITEMS) });
      },
    }),
    { name: "celoria-recently-viewed" },
  ),
);
