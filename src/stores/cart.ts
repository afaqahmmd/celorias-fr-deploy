"use client";

import { create } from "zustand";
import type { ApiCart } from "@/types/api";

interface CartState {
  itemCount: number;
  setFromCart: (cart: Pick<ApiCart, "itemCount">) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setFromCart: (cart) => set({ itemCount: cart.itemCount }),
  clear: () => set({ itemCount: 0 }),
}));
