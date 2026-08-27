const SESSION_KEY = "celoria-session-id";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredSession {
  id: string;
  expiresAt: number;
}

function createSessionId(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

function persistSession(id: string): void {
  const stored: StoredSession = {
    id,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}

function parseStoredSession(raw: string): StoredSession | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "id" in parsed &&
      "expiresAt" in parsed
    ) {
      const session = parsed as StoredSession;
      if (typeof session.id === "string" && typeof session.expiresAt === "number") {
        return session;
      }
    }
  } catch {
    if (raw) {
      return { id: raw, expiresAt: Date.now() + SESSION_TTL_MS };
    }
  }

  return null;
}

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    const stored = parseStoredSession(existing);
    if (stored?.id && stored.expiresAt > Date.now()) {
      persistSession(stored.id);
      return stored.id;
    }
  }

  const sessionId = createSessionId();
  persistSession(sessionId);
  return sessionId;
}
