"use server";

import type { CartAuth } from "@/lib/auth";
import {
  isRecord,
  readApiMessage,
  readOptionalApiMessage,
} from "@/lib/api-message";
import type { ApiCart, ApiCartItem } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type CartActionResult =
  | { success: true; cart: ApiCart; message?: string }
  | { success: false; message: string };

function hasCartAuth(auth: CartAuth): boolean {
  return Boolean(auth.accessToken || auth.sessionId);
}

function cartHeaders(auth: CartAuth): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth.accessToken) {
    headers.Authorization = `Bearer ${auth.accessToken}`;
  } else if (auth.sessionId) {
    headers["X-Session-Id"] = auth.sessionId;
  }

  return headers;
}

function parseCartItem(value: unknown): ApiCartItem | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.productId !== "string" ||
    typeof value.productName !== "string" ||
    typeof value.quantity !== "number"
  ) {
    return null;
  }

  return {
    productId: value.productId,
    productName: value.productName,
    productSlug: typeof value.productSlug === "string" ? value.productSlug : "",
    productImage:
      typeof value.productImage === "string" ? value.productImage : "",
    unitPrice: typeof value.unitPrice === "string" ? value.unitPrice : "0",
    quantity: value.quantity,
    lineTotal: typeof value.lineTotal === "string" ? value.lineTotal : "0",
    availableStock:
      typeof value.availableStock === "number" ? value.availableStock : 0,
  };
}

function readItemCount(
  value: Record<string, unknown>,
  items: ApiCartItem[],
): number {
  if (typeof value.itemCount === "number" && Number.isFinite(value.itemCount)) {
    return value.itemCount;
  }

  if (typeof value.itemCount === "string") {
    const parsed = Number(value.itemCount);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return items.reduce((total, item) => total + item.quantity, 0);
}

function parseCart(value: unknown): ApiCart | null {
  if (!isRecord(value)) {
    return null;
  }

  const payload =
    Array.isArray(value.items)
      ? value
      : isRecord(value.data) && Array.isArray(value.data.items)
        ? value.data
        : null;

  if (!payload) {
    return null;
  }

  const rawItems: unknown[] = Array.isArray(payload.items) ? payload.items : [];
  const items = rawItems
    .map(parseCartItem)
    .filter((item): item is ApiCartItem => item !== null);

  return {
    id: typeof payload.id === "string" ? payload.id : null,
    items,
    itemCount: readItemCount(payload, items),
    subtotal: typeof payload.subtotal === "string" ? payload.subtotal : "0",
  };
}

async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getCart(auth: CartAuth): Promise<CartActionResult> {
  if (!hasCartAuth(auth)) {
    return { success: false, message: "Missing session or authentication." };
  }

  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: cartHeaders(auth),
      cache: "no-store",
    });

    const raw = await readJsonBody(response);
    if (!response.ok) {
      return {
        success: false,
        message: readApiMessage(
          raw,
          `Could not load cart (${response.status}).`,
        ),
      };
    }

    const cart = parseCart(raw);
    if (!cart) {
      return {
        success: false,
        message: readApiMessage(raw, "Could not load cart."),
      };
    }

    return {
      success: true,
      cart,
      message: readOptionalApiMessage(raw),
    };
  } catch {
    return { success: false, message: "Could not load cart." };
  }
}

export async function addCartItem(
  auth: CartAuth,
  productId: string,
  quantity = 1,
): Promise<CartActionResult> {
  if (!productId || !hasCartAuth(auth)) {
    return { success: false, message: "Missing product or session." };
  }

  const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

  try {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: cartHeaders(auth),
      body: JSON.stringify({
        productId,
        quantity: qty,
      }),
    });

    const raw = await readJsonBody(response);
    if (!response.ok) {
      return {
        success: false,
        message: readApiMessage(
          raw,
          `Could not add to cart (${response.status}).`,
        ),
      };
    }

    const cart = parseCart(raw);
    if (!cart) {
      return {
        success: false,
        message: readApiMessage(raw, "Could not add to cart."),
      };
    }

    return {
      success: true,
      cart,
      message: readOptionalApiMessage(raw),
    };
  } catch {
    return { success: false, message: "Could not add to cart." };
  }
}

export async function removeCartItem(
  auth: CartAuth,
  productId: string,
): Promise<CartActionResult> {
  if (!productId || !hasCartAuth(auth)) {
    return { success: false, message: "Missing product or session." };
  }

  try {
    const response = await fetch(
      `${API_URL}/cart/items/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        headers: cartHeaders(auth),
      },
    );

    const raw = await readJsonBody(response);
    if (!response.ok) {
      return {
        success: false,
        message: readApiMessage(
          raw,
          `Could not remove item (${response.status}).`,
        ),
      };
    }

    const cart = parseCart(raw);
    if (!cart) {
      return {
        success: false,
        message: readApiMessage(raw, "Could not remove item."),
      };
    }

    return {
      success: true,
      cart,
      message: readOptionalApiMessage(raw),
    };
  } catch {
    return { success: false, message: "Could not remove item." };
  }
}
