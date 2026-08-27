import type { PaymentMethod } from "@/types/api";

export const CHECKOUT_STORAGE_KEY = "celoria-checkout-info";
export const SHIPPING_AMOUNT = 200;
export const DEFAULT_COUNTRY = "Pakistan";
export const DEFAULT_REGION = "Punjab";

export interface SavedCheckout {
  contactEmail: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  phone: string;
  saveInfo: boolean;
  newsOffers: boolean;
}

export const DEFAULT_CHECKOUT: SavedCheckout = {
  contactEmail: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "Islamabad",
  postalCode: "44000",
  phone: "",
  saveInfo: true,
  newsOffers: true,
};

let cachedCheckoutRaw: string | null = "__unset__";
let cachedCheckout: SavedCheckout = DEFAULT_CHECKOUT;

export function readSavedCheckout(): SavedCheckout {
  if (typeof window === "undefined") {
    return DEFAULT_CHECKOUT;
  }

  const raw = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);
  if (raw === cachedCheckoutRaw) {
    return cachedCheckout;
  }

  cachedCheckoutRaw = raw;
  cachedCheckout = parseSavedCheckout(raw);
  return cachedCheckout;
}

function parseSavedCheckout(raw: string | null): SavedCheckout {
  if (!raw) {
    return DEFAULT_CHECKOUT;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_CHECKOUT;
    }

    const saved = parsed as Partial<SavedCheckout>;
    const city = saved.city || DEFAULT_CHECKOUT.city;

    return {
      ...DEFAULT_CHECKOUT,
      ...saved,
      city,
      postalCode: saved.postalCode || postalFromCity(city),
    };
  } catch {
    return DEFAULT_CHECKOUT;
  }
}

export function subscribeCheckoutStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export const CHECKOUT_CITIES: {
  city: string;
  region: string;
  postalCode: string;
}[] = [
  {
    city: "Islamabad",
    region: "Islamabad Capital Territory",
    postalCode: "44000",
  },
  { city: "Lahore", region: "Punjab", postalCode: "54000" },
  { city: "Karachi", region: "Sindh", postalCode: "74000" },
  { city: "Rawalpindi", region: "Punjab", postalCode: "46000" },
  { city: "Faisalabad", region: "Punjab", postalCode: "38000" },
  { city: "Peshawar", region: "Khyber Pakhtunkhwa", postalCode: "25000" },
  { city: "Quetta", region: "Balochistan", postalCode: "87300" },
  { city: "Multan", region: "Punjab", postalCode: "60000" },
];

export const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  details?: string[];
}[] = [
  {
    value: "CASH_ON_DELIVERY",
    label: "Cash on Delivery (COD)",
    description: "Pay when order arrives at your doorstep.",
  },
  {
    value: "BANK_DEPOSIT",
    label: "Bank Deposit",
    description:
      "Deposit Payment directly to our bank account & verify it on WhatsApp or on email:",
    details: [
      "Bank Al Habib",
      "IBAN: PK34BAHL1005007204356701",
      "Account: 10050072043567012",
      "Title : Celoria",
    ],
  },
  {
    value: "JAZZCASH",
    label: "Jazz Cash",
    description: "Pay us directly via JAZZCASH account :",
    details: ["Account :", "0334-3205874", "Title : GOUTAM"],
  },
];

export function regionFromCity(city: string): string {
  const match = CHECKOUT_CITIES.find(
    (option) => option.city.toLowerCase() === city.trim().toLowerCase(),
  );
  return match?.region ?? DEFAULT_REGION;
}

export function postalFromCity(city: string): string {
  const match = CHECKOUT_CITIES.find(
    (option) => option.city.toLowerCase() === city.trim().toLowerCase(),
  );
  return match?.postalCode ?? "";
}

export function formatCheckoutMoney(price: string | number): string {
  const value = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(value)) {
    return "Rs.0.00";
  }

  return `Rs.${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function parsePrice(price: string | number): number {
  const value = typeof price === "string" ? parseFloat(price) : price;
  return Number.isNaN(value) ? 0 : value;
}
