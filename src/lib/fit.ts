import type { ConfidenceLevel } from "@node42/ui-kit";

// A diffusil↔unit intersection carries a qualitative `fit` (direct / adjacent /
// stretch). We render it as a confidence-style % band so the strength of the
// match reads at a glance — but it is DERIVED from the fit category, not a
// measured probability. Callers must label it "derived from fit".

export const FIT_LEVEL: Record<string, ConfidenceLevel> = {
  direct: "high",
  adjacent: "medium",
  stretch: "low",
};

export const FIT_PCT: Record<string, number> = {
  direct: 90,
  adjacent: 65,
  stretch: 40,
};

export interface FitBand {
  pct: number;
  level: ConfidenceLevel;
}

// Map a raw `fit` string to its % + confidence level. Unknown values fall back
// to the "adjacent" middle band rather than throwing.
export function fitBand(fit: string): FitBand {
  const key = (fit || "").toLowerCase().trim();
  return {
    pct: FIT_PCT[key] ?? 65,
    level: FIT_LEVEL[key] ?? "medium",
  };
}
