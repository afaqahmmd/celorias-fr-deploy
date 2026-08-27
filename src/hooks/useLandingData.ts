import { landingMock } from "@/data/mock/landing";
import type { LandingData } from "@/types/landing";

interface UseLandingDataResult {
  data: LandingData;
  isLoading: boolean;
}

/** Client-side hook — returns static mock. Prefer getLandingData() in Server Components. */
export function useLandingData(): UseLandingDataResult {
  return { data: landingMock, isLoading: false };
}
