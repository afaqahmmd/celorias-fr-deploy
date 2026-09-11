"use client";

/**
 * Backend is currently unavailable, so placing an order is handled entirely
 * on the client: it reads the local cart (see actions/cart.ts), builds a
 * local order record, and clears the local cart — instead of calling
 * `${API_URL}/orders`. Function name/signature is unchanged so call sites
 * (CheckoutView) don't need to change. Restore the commented-out
 * server-action implementation below once the API is back.
 */

import { clearCart, getCart } from "@/actions/cart";
import type { CartAuth } from "@/lib/auth";
import type { ApiOrder, PaymentMethod, PlaceOrderPayload } from "@/types/api";

const ORDERS_STORAGE_KEY = "celoria-local-orders";

export type PlaceOrderResult =
  | { success: true; order: ApiOrder; message?: string }
  | { success: false; message: string };

function generateOrderNumber(): string {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `CEL-${random}`;
}

function paymentLabel(method: PaymentMethod): string {
  switch (method) {
    case "BANK_DEPOSIT":
      return "Bank Deposit";
    case "JAZZCASH":
      return "JazzCash";
    case "CASH_ON_DELIVERY":
    default:
      return "Cash On Delivery";
  }
}

function saveLocalOrder(order: ApiOrder, payload: PlaceOrderPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    const existing: unknown[] = raw ? JSON.parse(raw) : [];
    const record = Array.isArray(existing) ? existing : [];
    record.push({ ...order, placedAt: new Date().toISOString(), payload });
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Non-critical: order history is best-effort while the backend is down.
  }
}

export async function placeOrder(
  auth: CartAuth,
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResult> {
  if (!auth.accessToken && !auth.sessionId) {
    return { success: false, message: "Missing session or authentication." };
  }

  const cartResult = await getCart(auth);
  if (!cartResult.success) {
    return { success: false, message: cartResult.message };
  }

  if (cartResult.cart.items.length === 0) {
    return { success: false, message: "Your cart is empty." };
  }

  const orderNumber = generateOrderNumber();
  const order: ApiOrder = {
    id: orderNumber,
    orderNumber,
    status: "PENDING",
    paymentMethod: paymentLabel(payload.paymentMethod),
    subtotal: cartResult.cart.subtotal,
    total: cartResult.cart.subtotal,
  };

  saveLocalOrder(order, payload);
  clearCart(auth);

  return {
    success: true,
    order,
    message: "Order placed successfully",
  };
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
// import type { ApiOrder, PlaceOrderPayload } from "@/types/api";
//
// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
//
// export type PlaceOrderResult =
//   | { success: true; order: ApiOrder; message?: string }
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
// function parseOrder(value: unknown): ApiOrder | null {
//   if (!isRecord(value) || typeof value.orderNumber !== "string") {
//     return null;
//   }
//
//   return {
//     id: typeof value.id === "string" ? value.id : "",
//     orderNumber: value.orderNumber,
//     status: typeof value.status === "string" ? value.status : "",
//     paymentMethod:
//       typeof value.paymentMethod === "string" ? value.paymentMethod : "",
//     subtotal: typeof value.subtotal === "string" ? value.subtotal : "0",
//     total: typeof value.total === "string" ? value.total : "0",
//   };
// }
//
// export async function placeOrder(
//   auth: CartAuth,
//   payload: PlaceOrderPayload,
// ): Promise<PlaceOrderResult> {
//   if (!hasCartAuth(auth)) {
//     return { success: false, message: "Missing session or authentication." };
//   }
//
//   try {
//     const response = await fetch(`${API_URL}/orders`, {
//       method: "POST",
//       headers: cartHeaders(auth),
//       body: JSON.stringify(payload),
//     });
//
//     const raw: unknown = await response.json().catch(() => null);
//
//     if (!response.ok) {
//       return {
//         success: false,
//         message: readApiMessage(
//           raw,
//           `Could not place order (${response.status}).`,
//         ),
//       };
//     }
//
//     const order = parseOrder(raw);
//     if (!order) {
//       return {
//         success: false,
//         message: readApiMessage(raw, "Could not place order."),
//       };
//     }
//
//     return {
//       success: true,
//       order,
//       message: readOptionalApiMessage(raw),
//     };
//   } catch {
//     return { success: false, message: "Could not place order." };
//   }
// }
