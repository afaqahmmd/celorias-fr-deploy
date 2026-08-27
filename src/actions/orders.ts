"use server";

import type { CartAuth } from "@/lib/auth";
import {
  isRecord,
  readApiMessage,
  readOptionalApiMessage,
} from "@/lib/api-message";
import type { ApiOrder, PlaceOrderPayload } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type PlaceOrderResult =
  | { success: true; order: ApiOrder; message?: string }
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

function parseOrder(value: unknown): ApiOrder | null {
  if (!isRecord(value) || typeof value.orderNumber !== "string") {
    return null;
  }

  return {
    id: typeof value.id === "string" ? value.id : "",
    orderNumber: value.orderNumber,
    status: typeof value.status === "string" ? value.status : "",
    paymentMethod:
      typeof value.paymentMethod === "string" ? value.paymentMethod : "",
    subtotal: typeof value.subtotal === "string" ? value.subtotal : "0",
    total: typeof value.total === "string" ? value.total : "0",
  };
}

export async function placeOrder(
  auth: CartAuth,
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResult> {
  if (!hasCartAuth(auth)) {
    return { success: false, message: "Missing session or authentication." };
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: cartHeaders(auth),
      body: JSON.stringify(payload),
    });

    const raw: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: readApiMessage(
          raw,
          `Could not place order (${response.status}).`,
        ),
      };
    }

    const order = parseOrder(raw);
    if (!order) {
      return {
        success: false,
        message: readApiMessage(raw, "Could not place order."),
      };
    }

    return {
      success: true,
      order,
      message: readOptionalApiMessage(raw),
    };
  } catch {
    return { success: false, message: "Could not place order." };
  }
}
