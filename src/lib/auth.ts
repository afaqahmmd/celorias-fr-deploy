import { getSessionId } from "@/lib/session";

const ACCESS_TOKEN_KEY = "celoria-access-token";

export interface CartAuth {
  accessToken?: string;
  sessionId?: string;
}

export function getAccessToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
}

export function getCartAuth(): CartAuth {
  const accessToken = getAccessToken();
  if (accessToken) {
    return { accessToken };
  }

  return { sessionId: getSessionId() };
}
