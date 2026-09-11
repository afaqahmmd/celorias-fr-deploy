"use client";

/**
 * Backend is currently unavailable, so cart mutations are handled entirely
 * on the client and persisted to localStorage instead of calling the
 * `${API_URL}/cart*` endpoints. Function names/signatures are unchanged so
 * call sites (HeaderCart, ProductCard, ProductPurchase, CheckoutView) don't
 * need to change. Restore the commented-out server-action implementation
 * below once the API is back.
 */

import { mockProducts } from "@/data/mock/products";
import type { CartAuth } from "@/lib/auth";
import type { ApiCart, ApiCartItem } from "@/types/api";

const CART_STORAGE_PREFIX = "celoria-local-cart:";

export type CartActionResult =
  | { success: true; cart: ApiCart; message?: string }
  | { success: false; message: string };

function hasCartAuth(auth: CartAuth): boolean {
  return Boolean(auth.accessToken || auth.sessionId);
}

function cartOwnerKey(auth: CartAuth): string {
  return auth.accessToken ? `token:${auth.accessToken}` : `session:${auth.sessionId}`;
}

interface StoredCartLine {
  productId: string;
  quantity: number;
}

function storageKey(auth: CartAuth): string {
  return `${CART_STORAGE_PREFIX}${cartOwnerKey(auth)}`;
}

function readStoredLines(auth: CartAuth): StoredCartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey(auth));
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (line): line is StoredCartLine =>
        Boolean(line) &&
        typeof line === "object" &&
        typeof (line as StoredCartLine).productId === "string" &&
        typeof (line as StoredCartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

function writeStoredLines(auth: CartAuth, lines: StoredCartLine[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(auth), JSON.stringify(lines));
}

function buildCart(lines: StoredCartLine[]): ApiCart {
  const items: ApiCartItem[] = lines
    .map((line) => {
      const product = mockProducts.find((item) => item.id === line.productId);
      if (!product) {
        return null;
      }

      const quantity = Math.min(line.quantity, Math.max(product.stock, 0));
      const unitPrice = parseFloat(product.price) || 0;

      const item: ApiCartItem = {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images[0] ?? "",
        unitPrice: product.price,
        quantity,
        lineTotal: (unitPrice * quantity).toString(),
        availableStock: product.stock,
      };
      return item;
    })
    .filter((item): item is ApiCartItem => item !== null && item.quantity > 0);

  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.lineTotal),
    0,
  );

  return {
    id: null,
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: subtotal.toString(),
  };
}

export async function getCart(auth: CartAuth): Promise<CartActionResult> {
  if (!hasCartAuth(auth)) {
    return { success: false, message: "Missing session or authentication." };
  }

  const lines = readStoredLines(auth);
  return { success: true, cart: buildCart(lines) };
}

export async function addCartItem(
  auth: CartAuth,
  productId: string,
  quantity = 1,
): Promise<CartActionResult> {
  if (!productId || !hasCartAuth(auth)) {
    return { success: false, message: "Missing product or session." };
  }

  const product = mockProducts.find((item) => item.id === productId);
  if (!product) {
    return { success: false, message: "This product is no longer available." };
  }

  const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
  const lines = readStoredLines(auth);
  const existing = lines.find((line) => line.productId === productId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, product.stock);
  } else {
    lines.push({ productId, quantity: Math.min(qty, product.stock) });
  }

  writeStoredLines(auth, lines);
  return { success: true, cart: buildCart(lines) };
}

export async function removeCartItem(
  auth: CartAuth,
  productId: string,
): Promise<CartActionResult> {
  if (!productId || !hasCartAuth(auth)) {
    return { success: false, message: "Missing product or session." };
  }

  const lines = readStoredLines(auth).filter(
    (line) => line.productId !== productId,
  );

  writeStoredLines(auth, lines);
  return { success: true, cart: buildCart(lines) };
}

export function clearCart(auth: CartAuth): void {
  if (!hasCartAuth(auth)) {
    return;
  }

  writeStoredLines(auth, []);
}

// --- Original server-action implementation (talks to the live backend) ---
// "use server";
//
// import type { CartAuth } from "@/lib/auth";
// import {
//   isRecord,
//   readApiMessage,
//   readOptionalApiMessage,
// } from "@/lib/api-message";
// import type { ApiCart, ApiCartItem } from "@/types/api";
//
// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
//
// export type CartActionResult =
//   | { success: true; cart: ApiCart; message?: string }
//   | { success: false; message: string };
//
// function hasCartAuth(auth: CartAuth): boolean {
//   return Boolean(auth.accessToken || auth.sessionId);
// }
//
// function cartHeaders(auth: CartAuth): HeadersInit {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };
//
//   if (auth.accessToken) {
//     headers.Authorization = `Bearer ${auth.accessToken}`;
//   } else if (auth.sessionId) {
//     headers["X-Session-Id"] = auth.sessionId;
//   }
//
//   return headers;
// }
//
// function parseCartItem(value: unknown): ApiCartItem | null {
//   if (!isRecord(value)) {
//     return null;
//   }
//
//   if (
//     typeof value.productId !== "string" ||
//     typeof value.productName !== "string" ||
//     typeof value.quantity !== "number"
//   ) {
//     return null;
//   }
//
//   return {
//     productId: value.productId,
//     productName: value.productName,
//     productSlug: typeof value.productSlug === "string" ? value.productSlug : "",
//     productImage:
//       typeof value.productImage === "string" ? value.productImage : "",
//     unitPrice: typeof value.unitPrice === "string" ? value.unitPrice : "0",
//     quantity: value.quantity,
//     lineTotal: typeof value.lineTotal === "string" ? value.lineTotal : "0",
//     availableStock:
//       typeof value.availableStock === "number" ? value.availableStock : 0,
//   };
// }
//
// function readItemCount(
//   value: Record<string, unknown>,
//   items: ApiCartItem[],
// ): number {
//   if (typeof value.itemCount === "number" && Number.isFinite(value.itemCount)) {
//     return value.itemCount;
//   }
//
//   if (typeof value.itemCount === "string") {
//     const parsed = Number(value.itemCount);
//     if (Number.isFinite(parsed)) {
//       return parsed;
//     }
//   }
//
//   return items.reduce((total, item) => total + item.quantity, 0);
// }
//
// function parseCart(value: unknown): ApiCart | null {
//   if (!isRecord(value)) {
//     return null;
//   }
//
//   const payload =
//     Array.isArray(value.items)
//       ? value
//       : isRecord(value.data) && Array.isArray(value.data.items)
//         ? value.data
//         : null;
//
//   if (!payload) {
//     return null;
//   }
//
//   const rawItems: unknown[] = Array.isArray(payload.items) ? payload.items : [];
//   const items = rawItems
//     .map(parseCartItem)
//     .filter((item): item is ApiCartItem => item !== null);
//
//   return {
//     id: typeof payload.id === "string" ? payload.id : null,
//     items,
//     itemCount: readItemCount(payload, items),
//     subtotal: typeof payload.subtotal === "string" ? payload.subtotal : "0",
//   };
// }
//
// async function readJsonBody(response: Response): Promise<unknown> {
//   try {
//     return await response.json();
//   } catch {
//     return null;
//   }
// }
//
// export async function getCart(auth: CartAuth): Promise<CartActionResult> {
//   if (!hasCartAuth(auth)) {
//     return { success: false, message: "Missing session or authentication." };
//   }
//
//   try {
//     const response = await fetch(`${API_URL}/cart`, {
//       method: "GET",
//       headers: cartHeaders(auth),
//       cache: "no-store",
//     });
//
//     const raw = await readJsonBody(response);
//     if (!response.ok) {
//       return {
//         success: false,
//         message: readApiMessage(
//           raw,
//           `Could not load cart (${response.status}).`,
//         ),
//       };
//     }
//
//     const cart = parseCart(raw);
//     if (!cart) {
//       return {
//         success: false,
//         message: readApiMessage(raw, "Could not load cart."),
//       };
//     }
//
//     return {
//       success: true,
//       cart,
//       message: readOptionalApiMessage(raw),
//     };
//   } catch {
//     return { success: false, message: "Could not load cart." };
//   }
// }
//
// export async function addCartItem(
//   auth: CartAuth,
//   productId: string,
//   quantity = 1,
// ): Promise<CartActionResult> {
//   if (!productId || !hasCartAuth(auth)) {
//     return { success: false, message: "Missing product or session." };
//   }
//
//   const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
//
//   try {
//     const response = await fetch(`${API_URL}/cart/items`, {
//       method: "POST",
//       headers: cartHeaders(auth),
//       body: JSON.stringify({
//         productId,
//         quantity: qty,
//       }),
//     });
//
//     const raw = await readJsonBody(response);
//     if (!response.ok) {
//       return {
//         success: false,
//         message: readApiMessage(
//           raw,
//           `Could not add to cart (${response.status}).`,
//         ),
//       };
//     }
//
//     const cart = parseCart(raw);
//     if (!cart) {
//       return {
//         success: false,
//         message: readApiMessage(raw, "Could not add to cart."),
//       };
//     }
//
//     return {
//       success: true,
//       cart,
//       message: readOptionalApiMessage(raw),
//     };
//   } catch {
//     return { success: false, message: "Could not add to cart." };
//   }
// }
//
// export async function removeCartItem(
//   auth: CartAuth,
//   productId: string,
// ): Promise<CartActionResult> {
//   if (!productId || !hasCartAuth(auth)) {
//     return { success: false, message: "Missing product or session." };
//   }
//
//   try {
//     const response = await fetch(
//       `${API_URL}/cart/items/${encodeURIComponent(productId)}`,
//       {
//         method: "DELETE",
//         headers: cartHeaders(auth),
//       },
//     );
//
//     const raw = await readJsonBody(response);
//     if (!response.ok) {
//       return {
//         success: false,
//         message: readApiMessage(
//           raw,
//           `Could not remove item (${response.status}).`,
//         ),
//       };
//     }
//
//     const cart = parseCart(raw);
//     if (!cart) {
//       return {
//         success: false,
//         message: readApiMessage(raw, "Could not remove item."),
//       };
//     }
//
//     return {
//       success: true,
//       cart,
//       message: readOptionalApiMessage(raw),
//     };
//   } catch {
//     return { success: false, message: "Could not remove item." };
//   }
// }
